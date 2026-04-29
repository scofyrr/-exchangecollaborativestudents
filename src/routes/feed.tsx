import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import PostCard, { type PostCardData } from "@/components/PostCard";
import { supabase } from "@/integrations/supabase/client";
import { Filter } from "lucide-react";

export const Route = createFileRoute("/feed")({
  head: () => ({ meta: [{ title: "Feed — ECE" }, { name: "description", content: "Descubre publicaciones de estudiantes." }] }),
  component: FeedPage,
});

type Category = { id: string; name: string; slug: string; emoji: string };

function FeedPage() {
  const [posts, setPosts] = useState<PostCardData[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("categories").select("id,name,slug,emoji").order("name").then(({ data }) => {
      setCategories((data ?? []) as Category[]);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let q = supabase
      .from("posts")
      .select(`id, title, content, cover_image_url, created_at,
        author:profiles!posts_author_profile_fkey(dni, full_name, level),
        category:categories(name, emoji, slug),
        likes(count), comments(count)`)
      .order("created_at", { ascending: false })
      .limit(50);
    if (activeCat) q = q.eq("category_id", activeCat);

    q.then(({ data }) => {
      const mapped: PostCardData[] = (data ?? []).map((p: any) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        cover_image_url: p.cover_image_url,
        created_at: p.created_at,
        author: p.author,
        category: p.category,
        likes_count: p.likes?.[0]?.count ?? 0,
        comments_count: p.comments?.[0]?.count ?? 0,
      }));
      setPosts(mapped);
      setLoading(false);
    });
  }, [activeCat]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="font-display text-4xl font-extrabold">Feed</h1>
            <p className="text-muted-foreground">Lo último que la comunidad está enseñando.</p>
          </div>
          <Link to="/new" className="neo-btn rounded-lg bg-lemon px-4 py-2 font-bold text-ink">
            + Publicar algo
          </Link>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-sm font-bold"><Filter className="h-4 w-4" /> Filtrar:</span>
          <button
            onClick={() => setActiveCat(null)}
            className={`chip ${!activeCat ? "bg-primary text-primary-foreground" : "bg-card"}`}
          >Todas</button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={`chip ${activeCat === c.id ? "bg-primary text-primary-foreground" : "bg-card"}`}
            >{c.emoji} {c.name}</button>
          ))}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => <div key={i} className="neo-card h-64 animate-pulse" />)}
          </div>
        ) : posts.length === 0 ? (
          <div className="neo-card p-10 text-center">
            <p className="font-display text-2xl font-bold">Aún no hay publicaciones aquí.</p>
            <p className="mt-1 text-muted-foreground">¡Sé el primero en compartir algo!</p>
            <Link to="/new" className="neo-btn mt-4 inline-block rounded-lg bg-primary px-4 py-2 font-bold text-primary-foreground">Publicar</Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}
