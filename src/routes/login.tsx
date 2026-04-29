import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { signInWithDni } from "@/lib/auth";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — ECE" }] }),
  component: LoginPage,
});

const schema = z.object({
  dni: z.string().regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

function LoginPage() {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ dni, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setLoading(true);
    const { error } = await signInWithDni(dni, password);
    setLoading(false);
    if (error) { toast.error("DNI o contraseña incorrectos"); return; }
    toast.success("¡Bienvenido de vuelta!");
    navigate({ to: "/feed" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="neo-card w-full max-w-md p-8">
        <Link to="/" className="mb-6 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-ink bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-display text-xl font-extrabold">ECE</span>
        </Link>
        <h1 className="font-display text-3xl font-extrabold">Entrar</h1>
        <p className="mt-1 text-sm text-muted-foreground">Usa tu DNI para acceder a tu cuenta.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold">DNI</label>
            <input
              inputMode="numeric"
              maxLength={8}
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
              placeholder="12345678"
              className="w-full rounded-lg border-2 border-ink bg-card px-4 py-3 font-mono text-lg outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-ink bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button disabled={loading} className="neo-btn w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground disabled:opacity-50">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿Aún no tienes cuenta?{" "}
          <Link to="/register" className="font-bold text-primary underline">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
