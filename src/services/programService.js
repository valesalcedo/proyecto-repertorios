import { supabase } from "../lib/supabaseClient";
import { EMPTY_PROGRAM } from "../data/slots";

export async function getProgramByDate(fecha) {
  const { data, error } = await supabase
    .from("programas_diarios")
    .select("*")
    .eq("fecha", fecha)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { ...EMPTY_PROGRAM };

  return {
    entrada:    data.entrada_id    ?? "",
    penitencial: data.penitencial_id ?? "",
    aclamacion: data.aclamacion_id  ?? "",
    ofertorio:  data.ofertorio_id   ?? "",
    santo:      data.santo_id       ?? "",
    cordero:    data.cordero_id     ?? "",
    comunion:   data.comunion_id    ?? "",
    salida:     data.salida_id      ?? "",
  };
}

export async function saveProgram(fecha, programa) {
  const payload = {
    entrada_id:     programa.entrada    || null,
    penitencial_id: programa.penitencial || null,
    aclamacion_id:  programa.aclamacion  || null,
    ofertorio_id:   programa.ofertorio   || null,
    santo_id:       programa.santo       || null,
    cordero_id:     programa.cordero     || null,
    comunion_id:    programa.comunion    || null,
    salida_id:      programa.salida      || null,
  };

  // Busca si ya existe fila para esa fecha
  const { data: existing } = await supabase
    .from("programas_diarios")
    .select("id")
    .eq("fecha", fecha)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("programas_diarios")
      .update(payload)
      .eq("fecha", fecha);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("programas_diarios")
      .insert({ fecha, ...payload });
    if (error) throw error;
  }
}