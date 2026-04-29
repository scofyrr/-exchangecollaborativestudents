import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { Sparkles, LogOut, PenSquare, Trophy, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink bg-primary text-primary-foreground shadow-[3px_3px_0_0_var(--ink)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="font-display text-xl font-extrabold leading-none">
            ECE<span className="text-primary">.</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/feed" className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-muted">Feed</Link>
          <Link to="/ranking" className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-muted">Ranking</Link>
          {isAdmin && (
            <Link to="/admin" className="rounded-md px-3 py-1.5 text-sm font-semibold hover:bg-muted">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {user && profile ? (
            <>
              <Link to="/new" className="neo-btn hidden items-center gap-1.5 rounded-lg bg-lemon px-3 py-1.5 text-sm font-bold text-ink sm:inline-flex">
                <PenSquare className="h-4 w-4" /> Publicar
              </Link>
              <Link to="/profile/$dni" params={{ dni: profile.dni }} className="flex items-center gap-2 rounded-lg border-2 border-ink bg-card px-2 py-1 text-sm font-bold shadow-[3px_3px_0_0_var(--ink)] hover:bg-muted">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral text-xs font-extrabold text-white">
                  {profile.full_name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{profile.full_name.split(" ")[0]}</span>
                <span className="chip ml-1 bg-lemon"><Trophy className="h-3 w-3" /> Lv {profile.level}</span>
                {isAdmin && <ShieldCheck className="h-4 w-4 text-primary" />}
              </Link>
              <button onClick={handleLogout} className="rounded-md p-2 hover:bg-muted" aria-label="Salir">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-md px-3 py-1.5 text-sm font-bold hover:bg-muted">Entrar</Link>
              <Link to="/register" className="neo-btn rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
