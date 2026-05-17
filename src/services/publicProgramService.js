import { supabase } from "../lib/supabaseClient";
import { SLOTS } from "../data/slots";

export async function getProgramForDate(fecha) {
  const targetDate = fecha ?? new Date().toISOString().split("T")[0];

  const { data: programa, error: e1 } = await supabase
    .from("programas_diarios")
    .select("*")
    .eq("fecha", targetDate)
    .maybeSingle();

  if (e1) throw e1;
  if (!programa) return [];

  const slotMap = {
    entrada:    programa.entrada_id,
    penitencial: programa.penitencial_id,
    aclamacion: programa.aclamacion_id,
    ofertorio:  programa.ofertorio_id,
    santo:      programa.santo_id,
    cordero:    programa.cordero_id,
    comunion:   programa.comunion_id,
    salida:     programa.salida_id,
  };

  const ids = Object.values(slotMap).filter(Boolean);
  if (!ids.length) return [];

  const { data: canciones, error: e2 } = await supabase
    .from("canciones")
    .select("id, titulo, letra")
    .in("id", ids);

  if (e2) throw e2;

  const cancionMap = Object.fromEntries(canciones.map(c => [c.id, c]));

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