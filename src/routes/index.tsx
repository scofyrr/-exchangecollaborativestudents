import { createFileRoute, Link } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import { Sparkles, Trophy, Users, BookOpen, Zap, Heart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ECE — Aprende y enseña entre estudiantes" },
      { name: "description", content: "Comparte lo que sabes, aprende de otros y sube de nivel mientras te diviertes. Únete a ECE." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="chip bg-lemon">
              <Sparkles className="h-3.5 w-3.5" /> Nueva forma de aprender
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] md:text-7xl">
              Enseña lo que sabes.<br />
              <span className="bg-coral px-2 text-white">Aprende</span> de todos.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-muted-foreground">
              ECE es la comunidad de estudiantes donde compartir un truco de mate o un consejo de inglés
              te hace ganar puntos, subir de nivel y ayudar a alguien más.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="neo-btn rounded-xl bg-primary px-6 py-3 font-bold text-primary-foreground">
                Crear mi cuenta
              </Link>
              <Link to="/feed" className="neo-btn rounded-xl bg-card px-6 py-3 font-bold">
                Ver publicaciones
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4 text-sm">
              <div className="flex -space-x-2">
                {["bg-coral","bg-mint","bg-sky","bg-lemon"].map((c, i) => (
                  <div key={i} className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-ink ${c} font-extrabold text-ink`}>
                    {["A","M","J","S"][i]}
                  </div>
                ))}
              </div>
              <span className="font-semibold">+ estudiantes ya están enseñando</span>
            </div>
          </div>

          {/* Decorative card stack */}
          <div className="relative mx-auto h-[420px] w-full max-w-md">
            <div className="absolute left-4 top-8 w-72 rotate-[-6deg] rounded-2xl border-2 border-ink bg-mint p-5 shadow-[8px_8px_0_0_var(--ink)]">
              <span className="chip bg-card">🧮 Matemática</span>
              <h3 className="mt-3 font-display text-xl font-extrabold">Truco para factorizar rápido</h3>
              <p className="mt-1 text-sm">Descompón en primos y agrupa…</p>
              <div className="mt-3 flex items-center gap-3 text-xs font-bold">
                <Heart className="h-4 w-4 fill-coral stroke-ink" /> 32
                <Trophy className="h-4 w-4" /> +10 pts
              </div>
            </div>
            <div className="absolute right-0 top-32 w-72 rotate-[5deg] rounded-2xl border-2 border-ink bg-lemon p-5 shadow-[8px_8px_0_0_var(--ink)]">
              <span className="chip bg-card">🌍 Inglés</span>
              <h3 className="mt-3 font-display text-xl font-extrabold">5 phrasal verbs útiles</h3>
              <p className="mt-1 text-sm">Get up, look forward to, give up…</p>
              <div className="mt-3 flex items-center gap-3 text-xs font-bold">
                <Heart className="h-4 w-4 fill-coral stroke-ink" /> 47
                <Zap className="h-4 w-4" /> Lv 4
              </div>
            </div>
            <div className="absolute bottom-0 left-12 w-72 rotate-[-2deg] rounded-2xl border-2 border-ink bg-coral p-5 text-white shadow-[8px_8px_0_0_var(--ink)]">
              <span className="chip bg-card text-ink">🎨 Arte</span>
              <h3 className="mt-3 font-display text-xl font-extrabold">Cómo dibujar manos</h3>
              <p className="mt-1 text-sm">Empieza con bloques simples…</p>
              <div className="mt-3 flex items-center gap-3 text-xs font-bold">
                <Heart className="h-4 w-4 fill-lemon stroke-ink" /> 21
                <Trophy className="h-4 w-4" /> Lv 2
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-y-2 border-ink bg-card stripe-bg">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
          {[
            { i: BookOpen, t: "Publica lo que sabes", d: "Desde un truco de mate hasta cómo dibujar. Todo aporta.", c: "bg-mint" },
            { i: Users, t: "Aprende de otros", d: "Descubre publicaciones por materia y comenta para profundizar.", c: "bg-sky" },
            { i: Trophy, t: "Sube de nivel", d: "Gana puntos por publicar, comentar y recibir likes. Como un juego.", c: "bg-lemon" },
          ].map(({ i: Icon, t, d, c }) => (
            <div key={t} className="neo-card p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 border-ink ${c}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-extrabold">{t}</h3>
              <p className="mt-1 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="font-display text-4xl font-extrabold md:text-6xl">
          Tu conocimiento <span className="bg-lemon px-2">vale puntos</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Regístrate con tu DNI, publica tu primer aporte y empieza a subir de nivel hoy mismo.
        </p>
        <Link to="/register" className="neo-btn mt-8 inline-block rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground">
          Comenzar gratis
        </Link>
      </section>

      <footer className="border-t-2 border-ink bg-ink py-8 text-center text-sm font-semibold text-paper">
        © {new Date().getFullYear()} ECE — Exchange Collaborative Students
      </footer>
    </div>
  );
}
