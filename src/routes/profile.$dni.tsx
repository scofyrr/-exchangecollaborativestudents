import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PostCard, { type PostCardData } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Sparkles, BookOpen } from "lucide-react";

export const Route = createFileRoute("/profile/$dni")({
  component: ProfilePage,
});

type Profile = {
  id: string; dni: string; full_name: string; grade: string;
  bio: string | null; points: number; level: number; created_at: string;
};

function ProfilePage() {
  const { dni } = Route.useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("dni", dni).maybeSingle();
      setProfile(p as Profile | null);
      if (p) {
        const { data: ps } = await supabase
          .from("posts")
          .select(`id, title, content, cover_image_url, created_at,
            author:profiles!posts_author_id_fkey(dni, full_name, level),
            category:categories(name, emoji, slug),
            likes(count), comments(count)`)
          .eq("author_id", (p as Profile).id)
          .order("created_at", { ascending: false });
        setPosts(((ps ?? []) as any[]).map((x) => ({
          id: x.id, title: x.title, content: x.content, cover_image_url: x.cover_image_url,
          created_at: x.created_at, author: x.author, category: x.category,
          likes_count: x.likes?.[0]?.count ?? 0, comments_count: x.comments?.[0]?.count ?? 0,
        })));
      }
      setLoading(false);
    })();
  }, [dni]);

  if (loading) return (<div><Navbar /><div className="mx-auto max-w-4xl p-8"><div className="neo-card h-48 animate-pulse" /></div></div>);
  if (!profile) return (<div><Navbar /><div className="mx-auto max-w-4xl p-8"><p>Usuario no encontrado.</p></div></div>);

  const nextLevelAt = profile.level * 100;
  const progress = Math.min(100, (profile.points % 100));

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="neo-card p-6 md:p-8">
          <div className="flex flex-col items-start gap-5 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-ink bg-coral text-4xl font-extrabold text-white shadow-[6px_6px_0_0_var(--ink)]">
              {profile.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-extrabold md:text-4xl">{profile.full_name}</h1>
              <p className="text-muted-foreground">{profile.grade} · DNI {profile.dni}</p>
              {profile.bio && <p className="mt-2">{profile.bio}</p>}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="chip bg-lemon"><Trophy className="h-3.5 w-3.5" /> Nivel {profile.level}</span>
                <span className="chip bg-mint"><Sparkles className="h-3.5 w-3.5" /> {profile.points} pts</span>
                <span className="chip bg-sky"><BookOpen className="h-3.5 w-3.5" /> {posts.length} publicaciones</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-1 flex justify-between text-xs font-bold">
              <span>Nivel {profile.level}</span>
              <span>{progress}/100 → Nivel {profile.level + 1}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full border-2 border-ink bg-card">
              <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <h2 className="mt-8 font-display text-2xl font-extrabold">Publicaciones</h2>
        {posts.length === 0 ? (
          <p className="mt-3 text-muted-foreground">Aún no ha publicado nada.</p>
        ) : (
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}
