import { useAuth } from './useAuth';
import { api } from '../lib/api';

export function useProfile() {
  const { user, updateUser } = useAuth();

  const updateProfile = async (data: { display_name?: string; notifications_enabled?: boolean; weekly_goal?: number }) => {
    try {
      await api.put('/profile', data);
      updateUser(data);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return { profile: user, updateProfile };
}
