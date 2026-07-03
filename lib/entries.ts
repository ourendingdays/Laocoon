import { supabase } from './supabase';

export type Entry = {
  entry_id: string;
  user_id: string;
  title: string | null;
  content: string;
  created_at: string;
  updated_at: string;
  emotion: string | null;
};

export type NewEntry = {
  content: string;
  title?: string | null;
  emotion?: string | null;
};

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  if (!data.user) throw new Error('Not signed in');
  return data.user.id;
}

export async function listEntries(): Promise<Entry[]> {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createEntry(entry: NewEntry): Promise<Entry> {
  const user_id = await requireUserId();
  const { data, error } = await supabase
    .from('entries')
    .insert({
      user_id,
      content: entry.content,
      title: entry.title ?? null,
      emotion: entry.emotion ?? null,
    })
    .select()
    .single();
  if (error) throw error;
  return data as Entry;
}

export async function updateEntry(
  entry_id: string,
  patch: Partial<NewEntry>,
): Promise<Entry> {
  const { data, error } = await supabase
    .from('entries')
    .update(patch)
    .eq('entry_id', entry_id)
    .select()
    .single();
  if (error) throw error;
  return data as Entry;
}

export async function deleteEntry(entry_id: string): Promise<void> {
  const { error } = await supabase.from('entries').delete().eq('entry_id', entry_id);
  if (error) throw error;
}
