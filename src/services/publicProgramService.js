import { supabase } from "../lib/supabaseClient";
import { SLOTS } from "../data/slots";

/**
 * Trae el programa del día con las letras incluidas en una sola query.
 * Usa la foreign key join de Supabase: programas_diarios → canciones
 *
 * @param {string} fecha  "YYYY-MM-DD" — por defecto hoy
 * @returns {Array}  [{ slot, label, icon, cancion: { id, titulo, letra } }]
 *                  Solo incluye los slots que tienen canción asignada,
 *                  en el orden definido en SLOTS.
 */
export async function getProgramForDate(fecha) {
  const targetDate = fecha ?? new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("programas_diarios")
    .select(`
      slot,
      canciones (
        id,
        titulo,
        letra
      )
    `)
    .eq("fecha", targetDate);

  if (error) throw error;

  // Indexar por slot para acceso O(1)
  const bySlot = {};
  for (const row of data ?? []) {
    bySlot[row.slot] = row.canciones;
  }

  // Devolver en el orden canónico de SLOTS, filtrando los vacíos
  return SLOTS
    .map(slot => ({
      slot:    slot.id,
      label:   slot.label,
      icon:    slot.icon,
      cancion: bySlot[slot.id] ?? null,
    }))
    .filter(item => item.cancion !== null);
}