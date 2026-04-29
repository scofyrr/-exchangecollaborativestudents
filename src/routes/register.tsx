import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { signUpWithDni } from "@/lib/auth";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Crear cuenta — ECE" }] }),
  component: RegisterPage,
});

const schema = z.object({
  dni: z.string().regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos"),
  full_name: z.string().trim().min(2, "Nombre muy corto").max(80),
  grade: z.string().trim().min(1, "Indica tu grado"),
  password: z.string().min(6, "Mínimo 6 caracteres").max(72),
});

const GRADES = [
  "Primaria", "1° Secundaria", "2° Secundaria", "3° Secundaria",
  "4° Secundaria", "5° Secundaria", "Universidad", "Otro",
];

function RegisterPage() {
  const [dni, setDni] = useState("");
  const [fullName, setFullName] = useState("");
  const [grade, setGrade] = useState(GRADES[3]);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ dni, full_name: fullName, grade, password });
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setLoading(true);
    const { error } = await signUpWithDni({ dni, password, full_name: fullName, grade });
    setLoading(false);
    if (error) {
      const msg = error.message.includes("already") ? "Este DNI ya está registrado" : error.message;
      toast.error(msg);
      return;
    }
    toast.success("¡Cuenta creada! Bienvenido a ECE 🎉");
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
        <h1 className="font-display text-3xl font-extrabold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-muted-foreground">Solo necesitas tu DNI.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold">DNI <span className="text-muted-foreground">(8 dígitos)</span></label>
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
            <label className="mb-1 block text-sm font-bold">Nombre completo</label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Ana Pérez"
              maxLength={80}
              className="w-full rounded-lg border-2 border-ink bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">Grado / nivel</label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full rounded-lg border-2 border-ink bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            >
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="w-full rounded-lg border-2 border-ink bg-card px-4 py-3 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button disabled={loading} className="neo-btn w-full rounded-lg bg-primary py-3 font-bold text-primary-foreground disabled:opacity-50">
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="font-bold text-primary underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
