import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";

export type PostCardData = {
  id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  created_at: string;
  author: { dni: string; full_name: string; level: number } | null;
  category: { name: string; emoji: string; slug: string } | null;
  likes_count: number;
  comments_count: number;
};

export default function PostCard({ post }: { post: PostCardData }) {
  const excerpt = post.content.length > 180 ? post.content.slice(0, 180) + "…" : post.content;
  return (
    <Link to="/post/$id" params={{ id: post.id }} className="neo-card block overflow-hidden">
      {post.cover_image_url && (
        <div className="aspect-[16/9] w-full overflow-hidden border-b-2 border-ink">
          <img src={post.cover_image_url} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
        </div>
      )}
      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {post.category && (
            <span className="chip bg-lemon">{post.category.emoji} {post.category.name}</span>
          )}
          {post.author && (
            <span className="chip bg-mint">Lv {post.author.level} · {post.author.full_name.split(" ")[0]}</span>
          )}
        </div>
        <h3 className="font-display text-2xl font-extrabold leading-tight">{post.title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{excerpt}</p>
        <div className="mt-4 flex items-center gap-4 text-sm font-bold">
          <span className="inline-flex items-center gap-1"><Heart className="h-4 w-4" /> {post.likes_count}</span>
          <span className="inline-flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {post.comments_count}</span>
        </div>
      </div>
    </Link>
  );
}
