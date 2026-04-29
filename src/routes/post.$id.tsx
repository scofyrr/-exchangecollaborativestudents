import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Heart, MessageCircle, Trash2, Send } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/post/$id")({
  component: PostDetail,
});

type Post = {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  created_at: string;
  author_id: string;
  author: { dni: string; full_name: string; level: number; grade: string } | null;
  category: { name: string; emoji: string } | null;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  author: { dni: string; full_name: string; level: number } | null;
};

const commentSchema = z.string().trim().min(1).max(2000);

function PostDetail() {
  const { id } = Route.useParams();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data: p } = await supabase
      .from("posts")
      .select(`id, title, content, cover_image_url, created_at, author_id,
        author:profiles!posts_author_profile_fkey(dni, full_name, level, grade),
        category:categories(name, emoji)`)
      .eq("id", id)
      .maybeSingle();
    setPost(p as any);

    const [{ data: cs }, { count }, { data: liked }] = await Promise.all([
      supabase.from("comments").select(`id, content, created_at, author_id,
        author:profiles!comments_author_profile_fkey(dni, full_name, level)`)
        .eq("post_id", id).order("created_at", { ascending: true }),
      supabase.from("likes").select("*", { count: "exact", head: true }).eq("post_id", id),
      user
        ? supabase.from("likes").select("id").eq("post_id", id).eq("user_id", user.id).maybeSingle()
        : Promise.resolve({ data: null } as any),
    ]);
    setComments((cs ?? []) as Comment[]);
    setLikesCount(count ?? 0);
    setLiked(!!liked);
    setLoading(false);
  };

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id, user?.id]);

  const toggleLike = async () => {
    if (!user) { navigate({ to: "/login" }); return; }
    if (liked) {
      await supabase.from("likes").delete().eq("post_id", id).eq("user_id", user.id);
      setLiked(false); setLikesCount((n) => n - 1);
    } else {
      const { error } = await supabase.from("likes").insert({ post_id: id, user_id: user.id });
      if (!error) { setLiked(true); setLikesCount((n) => n + 1); }
    }
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { navigate({ to: "/login" }); return; }
    const parsed = commentSchema.safeParse(newComment);
    if (!parsed.success) return;
    const { error } = await supabase.from("comments").insert({
      post_id: id, author_id: user.id, content: parsed.data,
    });
    if (error) { toast.error(error.message); return; }
    setNewComment("");
    toast.success("Comentario publicado · +2 pts");
    load();
  };

  const deletePost = async () => {
    if (!confirm("¿Eliminar esta publicación?")) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Eliminada");
    navigate({ to: "/feed" });
  };

  const deleteComment = async (cid: string) => {
    const { error } = await supabase.from("comments").delete().eq("id", cid);
    if (error) { toast.error(error.message); return; }
    setComments((cs) => cs.filter((c) => c.id !== cid));
  };

  if (loading) return (<div><Navbar /><div className="mx-auto max-w-3xl p-8"><div className="neo-card h-96 animate-pulse" /></div></div>);
  if (!post) return (<div><Navbar /><div className="mx-auto max-w-3xl p-8"><p>No encontrado.</p></div></div>);

  const canDeletePost = user && (user.id === post.author_id || isAdmin);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <article className="neo-card overflow-hidden">
          {post.cover_image_url && (
            <img src={post.cover_image_url} alt={post.title} className="aspect-[16/9] w-full border-b-2 border-ink object-cover" />
          )}
          <div className="p-6 md:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {post.category && <span className="chip bg-lemon">{post.category.emoji} {post.category.name}</span>}
              <span className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleDateString("es", { dateStyle: "medium" })}</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight md:text-5xl">{post.title}</h1>

            {post.author && (
              <Link to="/profile/$dni" params={{ dni: post.author.dni }} className="mt-4 inline-flex items-center gap-3 rounded-lg border-2 border-ink bg-card px-3 py-2 hover:bg-muted">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-coral font-extrabold text-white">{post.author.full_name.charAt(0)}</span>
                <span>
                  <div className="font-bold">{post.author.full_name}</div>
                  <div className="text-xs text-muted-foreground">{post.author.grade} · Nivel {post.author.level}</div>
                </span>
              </Link>
            )}

            <div className="prose prose-lg mt-6 max-w-none whitespace-pre-wrap leading-relaxed">{post.content}</div>

            <div className="mt-8 flex items-center gap-3 border-t-2 border-ink pt-5">
              <button onClick={toggleLike} className={`neo-btn inline-flex items-center gap-2 rounded-lg px-4 py-2 font-bold ${liked ? "bg-coral text-white" : "bg-card"}`}>
                <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} /> {likesCount}
              </button>
              <span className="inline-flex items-center gap-2 text-sm font-bold"><MessageCircle className="h-4 w-4" /> {comments.length}</span>
              {canDeletePost && (
                <button onClick={deletePost} className="ml-auto inline-flex items-center gap-1 rounded-lg border-2 border-ink bg-destructive px-3 py-2 text-sm font-bold text-destructive-foreground">
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              )}
            </div>
          </div>
        </article>

        <section className="mt-8">
          <h2 className="font-display text-2xl font-extrabold">Comentarios</h2>
          <form onSubmit={submitComment} className="neo-card mt-3 flex items-start gap-2 p-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              maxLength={2000}
              rows={2}
              placeholder={user ? "Aporta algo a esta publicación..." : "Inicia sesión para comentar"}
              disabled={!user}
              className="flex-1 resize-none rounded-md border-2 border-ink bg-card px-3 py-2 outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <button disabled={!user || !newComment.trim()} className="neo-btn rounded-lg bg-primary p-3 text-primary-foreground disabled:opacity-50">
              <Send className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-4 space-y-3">
            {comments.length === 0 && <p className="text-sm text-muted-foreground">Aún sin comentarios. ¡Sé el primero!</p>}
            {comments.map((c) => (
              <div key={c.id} className="neo-card p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint font-extrabold text-ink">
                    {c.author?.full_name?.charAt(0) ?? "?"}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {c.author && (
                        <Link to="/profile/$dni" params={{ dni: c.author.dni }} className="font-bold hover:underline">
                          {c.author.full_name}
                        </Link>
                      )}
                      <span className="chip bg-lemon">Lv {c.author?.level ?? 1}</span>
                      <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString("es")}</span>
                      {(user?.id === c.author_id || isAdmin) && (
                        <button onClick={() => deleteComment(c.id)} className="ml-auto text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="mt-1 whitespace-pre-wrap">{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
