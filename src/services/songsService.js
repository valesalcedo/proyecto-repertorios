import { supabase } from "../lib/supabaseClient";

export async function getSongs() {
  const { data, error } = await supabase
    .from("canciones")
    .select("*")
    .order("titulo", { ascending: true });

  if (error) throw error;

  return data || [];
}

export async function createSong(song) {
  const { data, error } = await supabase
    .from("canciones")
    .insert({
      titulo: song.titulo.trim(),
      categoria: song.categoria,
      letra: song.letra.trim(),
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateSong(song) {
  const { data, error } = await supabase
    .from("canciones")
    .update({
      titulo: song.titulo.trim(),
      categoria: song.categoria,
      letra: song.letra.trim(),
    })
    .eq("id", song.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteSong(id) {
  const { error } = await supabase
    .from("canciones")
    .delete()
    .eq("id", id);

  if (error) throw error;
}