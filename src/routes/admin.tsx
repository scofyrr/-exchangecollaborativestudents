import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, UserMinus, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — ECE" }] }),
  component: AdminPage,
});

type UserRow = {
  id: string; dni: string; full_name: string; grade: string;
  points: number; level: number; is_admin: boolean;
};

function AdminPage() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    if (!loading && !isAdmin) navigate({ to: "/" });
  }, [isAdmin, loading, navigate]);

  const load = async () => {
    const [{ data: profs }, { data: roles }] = await Promise.all([
      supabase.from("profiles").select("id, dni, full_name, grade, points, level").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    const adminSet = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
    setUsers(((profs ?? []) as any[]).map((p) => ({ ...p, is_admin: adminSet.has(p.id) })));
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const toggleAdmin = async (u: UserRow) => {
    if (u.is_admin) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", u.id).eq("role", "admin");
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: u.id, role: "admin" });
      if (error) return toast.error(error.message);
    }
    toast.success("Rol actualizado");
    load();
  };

  const deleteProfile = async (u: UserRow) => {
    if (!confirm(`¿Eliminar perfil de ${u.full_name}?`)) return;
    const { error } = await supabase.from("profiles").delete().eq("id", u.id);
    if (error) return toast.error(error.message);
    toast.success("Perfil eliminado");
    load();
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-8 w-8 text-primary" />
          <h1 className="font-display text-4xl font-extrabold">Panel admin</h1>
        </div>
        <p className="text-muted-foreground">Gestiona usuarios y roles de la comunidad.</p>

        <div className="neo-card mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b-2 border-ink bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Estudiante</th>
                  <th className="px-4 py-3 text-left font-bold">DNI</th>
                  <th className="px-4 py-3 text-left font-bold">Grado</th>
                  <th className="px-4 py-3 text-left font-bold">Pts</th>
                  <th className="px-4 py-3 text-left font-bold">Lv</th>
                  <th className="px-4 py-3 text-left font-bold">Rol</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-ink/20">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/40">
                    <td className="px-4 py-3 font-bold">{u.full_name}</td>
                    <td className="px-4 py-3 font-mono">{u.dni}</td>
                    <td className="px-4 py-3">{u.grade}</td>
                    <td className="px-4 py-3">{u.points}</td>
                    <td className="px-4 py-3">{u.level}</td>
                    <td className="px-4 py-3">
                      {u.is_admin
                        ? <span className="chip bg-primary text-primary-foreground">Admin</span>
                        : <span className="chip bg-card">User</span>}
                    </td>
                    <td className="flex justify-end gap-2 px-4 py-3">
                      <button onClick={() => toggleAdmin(u)} className="neo-btn rounded-md bg-lemon px-2 py-1 text-xs font-bold text-ink">
                        {u.is_admin ? <><UserMinus className="mr-1 inline h-3 w-3" />Quitar admin</> : <><UserPlus className="mr-1 inline h-3 w-3" />Hacer admin</>}
                      </button>
                      <button onClick={() => deleteProfile(u)} className="neo-btn rounded-md bg-destructive px-2 py-1 text-xs font-bold text-destructive-foreground">
                        <Trash2 className="inline h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Para crear el primer admin, regístrate y luego asígnate el rol manualmente desde la base de datos.
        </p>
      </main>
    </div>
  );
}
