import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Goal } from '../types';

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const data = await api.get('/goals');
      setGoals(data);
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const addGoal = async (goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const newGoal = await api.post('/goals', goal);
      setGoals([...goals, newGoal]);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      await api.delete(`/goals/${id}`);
      setGoals(goals.filter(g => g.id !== id));
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return { goals, loading, addGoal, deleteGoal, refresh: fetchGoals };
}
