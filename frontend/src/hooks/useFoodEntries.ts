import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { FoodEntry, MealType, MealTime } from '../types';

export function useFoodEntries() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = async () => {
    try {
      const data = await api.get('/entries');
      setEntries(data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const addEntry = async (entry: Omit<FoodEntry, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const newEntry = await api.post('/entries', entry);
      setEntries([newEntry, ...entries]);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await api.delete(`/entries/${id}`);
      setEntries(entries.filter(e => e.id !== id));
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return { entries, loading, addEntry, deleteEntry, refresh: fetchEntries };
}
