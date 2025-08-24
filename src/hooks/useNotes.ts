import { useState, useEffect } from 'react';
import { Note, CreateNoteData } from '@/types/note';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchNotes();
    } else {

      setNotes([
        {
          id: "1",
          user_id: "mock-user",
          title: "Welcome to CLeep",
          tag: "tutorial",
          content: "This is your first note! Try creating more with the 'cr' command.",
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "2", 
          user_id: "mock-user",
          title: "Archive test",
          tag: "test",
          content: "This note is archived.",
          status: 'archived',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "3",
          user_id: "mock-user", 
          title: "Deleted note",
          tag: "cleanup",
          content: "This note is in the deleted directory.",
          status: 'deleted',
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString()
        }
      ]);
      setLoading(false);
    }
  }, [user]);

  const fetchNotes = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes:', error);
    } else {
      setNotes(data || []);
    }
    setLoading(false);
  };

  const createNote = async (data: CreateNoteData) => {
    if (!user) {

      const newNote: Note = {
        id: Date.now().toString(),
        user_id: "mock-user",
        title: data.title,
        tag: data.tag || '',
        content: data.content || '',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setNotes(prev => [newNote, ...prev]);
      return;
    }

    const { data: newNote, error } = await supabase
      .from('notes')
      .insert({
        user_id: user.id,
        title: data.title,
        tag: data.tag || '',
        content: data.content || '',
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating note:', error);
    } else if (newNote) {
      setNotes(prev => [newNote, ...prev]);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    if (!user) {

      setNotes(prev => prev.map(note => 
        note.id === id 
          ? { ...note, ...updates, updated_at: new Date().toISOString() }
          : note
      ));
      return;
    }

    const { error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating note:', error);
    } else {
      setNotes(prev => prev.map(note => 
        note.id === id 
          ? { ...note, ...updates, updated_at: new Date().toISOString() }
          : note
      ));
    }
  };

  const deleteNote = async (id: string, permanent: boolean = false) => {
    if (permanent) {
      if (!user) {

        setNotes(prev => prev.filter(note => note.id !== id));
        return;
      }

      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error permanently deleting note:', error);
      } else {
        setNotes(prev => prev.filter(note => note.id !== id));
      }
    } else {
      updateNote(id, { status: 'deleted' });
    }
  };

  return {
    notes,
    loading,
    createNote,
    updateNote,
    deleteNote,
    fetchNotes
  };
};