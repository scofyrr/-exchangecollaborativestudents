import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, Crown, Medal } from "lucide-react";

export const Route = createFileRoute("/ranking")({
  head: () => ({ meta: [{ title: "Ranking — ECE" }] }),
  component: RankingPage,
});

type Row = { dni: string; full_name: string; grade: string; points: number; level: number };

function RankingPage() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("dni, full_name, grade, points, level")
      .order("points", { ascending: false }).limit(50)
      .then(({ data }) => setRows((data ?? []) as Row[]));
  }, []);

  const trophy = (i: number) => {
    if (i === 0) return <Crown className="h-5 w-5 text-lemon" />;
    if (i === 1) return <Medal className="h-5 w-5" />;
    if (i === 2) return <Medal className="h-5 w-5 text-coral" />;
    return <span className="text-sm font-extrabold text-muted-foreground">#{i + 1}</span>;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="font-display text-4xl font-extrabold">Ranking</h1>
        <p className="text-muted-foreground">Los estudiantes que más están enseñando esta temporada.</p>

        <div className="neo-card mt-6 divide-y-2 divide-ink overflow-hidden">
          {rows.length === 0 && <div className="p-6 text-center text-muted-foreground">Aún sin actividad.</div>}
          {rows.map((r, i) => (
            <Link
              key={r.dni}
              to="/profile/$dni"
              params={{ dni: r.dni }}
              className={`flex items-center gap-4 px-4 py-3 hover:bg-muted ${i < 3 ? "bg-card" : ""}`}
            >
              <div className="flex w-10 justify-center">{trophy(i)}</div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-coral font-extrabold text-white">
                {r.full_name.charAt(0)}
              </span>
              <div className="flex-1">
                <div className="font-bold">{r.full_name}</div>
                <div className="text-xs text-muted-foreground">{r.grade}</div>
              </div>
              <span className="chip bg-lemon"><Trophy className="h-3 w-3" /> Lv {r.level}</span>
              <span className="font-display text-lg font-extrabold">{r.points}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
