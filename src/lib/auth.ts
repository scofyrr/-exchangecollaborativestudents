import { supabase } from "@/integrations/supabase/client";

const DOMAIN = "ece.local";
export const dniToEmail = (dni: string) => `${dni}@${DOMAIN}`;

export const signUpWithDni = async (params: {
  dni: string;
  password: string;
  full_name: string;
  grade: string;
}) => {
  const { dni, password, full_name, grade } = params;
  return supabase.auth.signUp({
    email: dniToEmail(dni),
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: { dni, full_name, grade },
    },
  });
};

export const signInWithDni = async (dni: string, password: string) =>
  supabase.auth.signInWithPassword({ email: dniToEmail(dni), password });

export const signOut = async () => supabase.auth.signOut();
