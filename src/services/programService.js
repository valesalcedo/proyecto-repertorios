import { supabase } from "../lib/supabaseClient";
import { EMPTY_PROGRAM } from "../data/slots";

export async function getProgramByDate(fecha) {
  const { data, error } = await supabase
    .from("programas_diarios")
    .select("*")
    .eq("fecha", fecha);

  if (error) throw error;

  const programa = { ...EMPTY_PROGRAM };

  for (const item of data || []) {
    programa[item.slot] = String(item.cancion_id);
  }

  return programa;
}

export async function saveProgram(fecha, programa) {
  const rows = Object.entries(programa)
    .filter(([, cancionId]) => cancionId)
    .map(([slot, cancionId]) => ({
      fecha,
      slot,
      cancion_id: cancionId,
    }));

  const { error } = await supabase
    .from("programas_diarios")
    .upsert(rows, {
      onConflict: "fecha,slot",
    });

  if (error) throw error;
}