export type MealType = 'healthy' | 'unhealthy';
export type MealTime = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Page = 'dashboard' | 'add' | 'history' | 'insights' | 'goals' | 'settings';

export interface FoodEntry {
  id: string;
  user_id: string;
  food_name: string;
  meal_type: MealType;
  meal_time: MealTime;
  notes: string;
  logged_at: string;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  goal_type: 'daily' | 'weekly';
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  notifications_enabled: boolean;
  dark_mode: boolean;
  weekly_goal: number;
  created_at: string;
  updated_at: string;
}
