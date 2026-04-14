import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Lightbulb, TrendingUp, Flame, Salad, Cookie, ChevronRight } from 'lucide-react';
import { FoodEntry, Page } from '../types';
import { useAuth } from '../hooks/useAuth';

interface DashboardProps {
  entries: FoodEntry[];
  onNavigate: (page: Page) => void;
}

function WeeklyChart({ entries }: { entries: FoodEntry[] }) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date();

  const weekData = days.map((day, i) => {
    const date = new Date(today);
    const dayOfWeek = today.getDay() || 7;
    const diff = i + 1 - dayOfWeek;
    date.setDate(today.getDate() + diff);
    const dateStr = date.toISOString().slice(0, 10);
    const dayEntries = entries.filter(e => e.logged_at.slice(0, 10) === dateStr);
    return {
      day: day.slice(0,3),
      healthy: dayEntries.filter(e => e.meal_type === 'healthy').length,
      unhealthy: dayEntries.filter(e => e.meal_type === 'unhealthy').length,
    };
  });

  const maxVal = Math.max(...weekData.map(d => d.healthy + d.unhealthy), 5);

  return (
    <div className="flex items-end gap-4 h-64 mt-8">
      {weekData.map((d, i) => {
        const total = d.healthy + d.unhealthy;
        const healthyH = (d.healthy / maxVal) * 100;
        const unhealthyH = (d.unhealthy / maxVal) * 100;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
            <div className="w-full relative flex flex-col-reverse gap-1 justify-end h-full">
              {d.unhealthy > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${unhealthyH}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="w-full rounded-xl bg-red-100/50 group-hover:bg-red-200 transition-colors"
                />
              )}
              {d.healthy > 0 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${healthyH}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className="w-full rounded-xl bg-teal-gradient shadow-lg shadow-teal-500/10 group-hover:shadow-teal-500/30 transition-shadow"
                />
              )}
              {total === 0 && (
                <div className="w-full rounded-full bg-slate-50 h-2" />
              )}
            </div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{d.day}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard({ entries, onNavigate }: DashboardProps) {
  const { user } = useAuth();

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    const weekEntries = entries.filter(e => new Date(e.logged_at) >= weekAgo);
    const healthy = weekEntries.filter(e => e.meal_type === 'healthy').length;
    const unhealthy = weekEntries.filter(e => e.meal_type === 'unhealthy').length;
    const score = (healthy + unhealthy) > 0 ? Math.round((healthy / (healthy + unhealthy)) * 100) : 0;
    
    // Simple streak logic
    let streak = 0;
    const today = new Date().toISOString().slice(0, 10);
    const hasToday = entries.some(e => e.logged_at.slice(0, 10) === today && e.meal_type === 'healthy');
    if (hasToday) streak = 1; // Simplified for demo

    const consecutive = entries.slice(0, 5).filter(e => e.meal_type === 'unhealthy').length;

    return { healthy, unhealthy, score, streak, consecutive };
  }, [entries]);

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col gap-1">
        <h1 className="text-4xl font-black text-health-text-primary tracking-tighter">Welcome back, {user?.display_name || 'User'}</h1>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Everything is looking good on your dashboard today.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Hero Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="xl:col-span-2 rounded-[3rem] bg-teal-gradient p-12 text-white shadow-2xl shadow-teal-900/20 relative overflow-hidden"
        >
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 bg-teal-300/20 rounded-full blur-[80px]" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="space-y-2">
              <span className="text-sm font-black uppercase tracking-[0.3em] opacity-80">Weekly Score</span>
              <div className="flex items-baseline gap-2">
                <span className="text-9xl font-black tracking-tighter">{stats.score}</span>
                <span className="text-4xl font-black opacity-50">%</span>
              </div>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                <p className="font-black text-lg">On Track</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Focus</p>
                <p className="font-black text-lg">Vegetables</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Side Stats Column */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[2.5rem] shadow-soft flex-1 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Streak</h3>
              <Flame className="w-8 h-8 text-amber-500 fill-amber-100" />
            </div>
            <div>
              <p className="text-6xl font-black text-health-text-primary tracking-tighter">{stats.streak} Days</p>
              <p className="text-xs font-bold text-teal-600 mt-2">Personal Best: 12 Days</p>
            </div>
          </motion.div>

          {stats.consecutive >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 p-8 rounded-[2.5rem] border border-red-100 flex items-start gap-4"
            >
              <div className="bg-red-500 p-3 rounded-2xl text-white shadow-lg shadow-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-red-900">Health Alert</h4>
                <p className="text-xs font-bold text-red-700/60 mt-1 uppercase leading-relaxed tracking-wider">High unhealthy intake recently.</p>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-teal-50 p-8 rounded-[2.5rem] border border-teal-100 flex flex-col justify-between"
          >
            <Lightbulb className="w-8 h-8 text-teal-500" />
            <p className="text-sm font-bold text-teal-900 leading-relaxed mt-4">
              "Your metabolism is 15% higher in the mornings. Focus on protein-rich breakfasts."
            </p>
          </motion.div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white p-10 rounded-[3rem] shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-black text-health-text-primary tracking-tight">Performance Chart</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Healthy vs Unhealthy distribution</p>
            </div>
            <TrendingUp className="text-teal-500" />
          </div>
          <WeeklyChart entries={entries} />
        </section>

        <section className="bg-white p-10 rounded-[3rem] shadow-soft flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-health-text-primary tracking-tight">Recent Activity</h2>
            <button onClick={() => onNavigate('history')} className="text-teal-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              All Activity <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            {entries.slice(0, 4).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-[1.5rem] bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${entry.meal_type === 'healthy' ? 'bg-teal-100 text-teal-600' : 'bg-red-100 text-red-600'}`}>
                    {entry.meal_type === 'healthy' ? <Salad /> : <Cookie />}
                  </div>
                  <div>
                    <h5 className="font-black text-health-text-primary capitalize">{entry.food_name}</h5>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.meal_time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${entry.meal_type === 'healthy' ? 'bg-teal-500 text-white' : 'bg-red-500 text-white'}`}>
                    {entry.meal_type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
