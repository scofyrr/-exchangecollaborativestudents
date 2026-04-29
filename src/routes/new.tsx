import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/new")({
  head: () => ({ meta: [{ title: "Publicar — ECE" }] }),
  component: NewPostPage,
});

const schema = z.object({
  title: z.string().trim().min(3, "Título muy corto").max(200),
  content: z.string().trim().min(10, "Cuéntanos un poco más (mín. 10 caracteres)").max(20000),
  category_id: z.string().uuid("Elige una categoría"),
  cover_image_url: z.string().url().or(z.literal("")).optional(),
});

type Category = { id: string; name: string; emoji: string };

function NewPostPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/login" });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    supabase.from("categories").select("id,name,emoji").order("name").then(({ data }) => {
      setCategories((data ?? []) as Category[]);
      if (data && data.length) setCategoryId(data[0].id);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = schema.safeParse({ title, content, category_id: categoryId, cover_image_url: coverUrl });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setSubmitting(true);
    const { data, error } = await supabase.from("posts").insert({
      author_id: user.id,
      title: parsed.data.title,
      content: parsed.data.content,
      category_id: parsed.data.category_id,
      cover_image_url: parsed.data.cover_image_url || null,
    }).select("id").single();
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("¡Publicado! +10 puntos 🎉");
    navigate({ to: "/post/$id", params: { id: data.id } });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-4xl font-extrabold">Comparte lo que sabes</h1>
        <p className="text-muted-foreground">Cualquier aporte cuenta — un truco, un consejo o una explicación.</p>

        <form onSubmit={submit} className="neo-card mt-6 space-y-5 p-6">
          <div>
            <label className="mb-1 block text-sm font-bold">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="Ej. Cómo memorizar fórmulas trigonométricas"
              className="w-full rounded-lg border-2 border-ink bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">Categoría</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border-2 border-ink bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">Imagen de portada <span className="text-muted-foreground">(URL opcional)</span></label>
            <input
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border-2 border-ink bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">Contenido</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              maxLength={20000}
              placeholder="Explica con tus palabras…"
              className="w-full rounded-lg border-2 border-ink bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">{content.length}/20000</p>
          </div>
          <button disabled={submitting} className="neo-btn rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground disabled:opacity-50">
            {submitting ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </main>
    </div>
  );
}
