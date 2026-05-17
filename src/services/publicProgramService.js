import { supabase } from "../lib/supabaseClient";
import { SLOTS } from "../data/slots";

export async function getProgramForDate(fecha) {
  const targetDate = fecha ?? new Date().toISOString().split("T")[0];

  // 1. Traer el programa del día
  const { data: programa, error: e1 } = await supabase
    .from("programas_diarios")
    .select("slot, cancion_id")
    .eq("fecha", targetDate);

  if (e1) throw e1;
  if (!programa?.length) return [];

  // 2. Traer las canciones que aparecen en el programa
  const ids = programa.map(r => r.cancion_id);
  const { data: canciones, error: e2 } = await supabase
    .from("canciones")
    .select("id, titulo, letra")
    .in("id", ids);

  if (e2) throw e2;

  // 3. Unir y ordenar según SLOTS
  const cancionMap = Object.fromEntries(canciones.map(c => [c.id, c]));
  const slotMap = Object.fromEntries(programa.map(r => [r.slot, r.cancion_id]));

  return SLOTS
    .filter(slot => slotMap[slot.id])
    .map(slot => ({
      slot:    slot.id,
      label:   slot.label,
      icon:    slot.icon,
      cancion: cancionMap[slotMap[slot.id]] ?? null,
    }))
    .filter(item => item.cancion !== null);
}