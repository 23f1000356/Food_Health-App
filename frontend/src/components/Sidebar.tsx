import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, Clock, Brain, Target, Settings, LogOut, Heart } from 'lucide-react';
import { Page } from '../types';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  current: Page;
  onChange: (page: Page) => void;
  isMobile?: boolean;
}

const navItems: { page: Page; icon: React.ElementType; label: string }[] = [
  { page: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
  { page: 'history', icon: Clock, label: 'Meal History' },
  { page: 'add', icon: Plus, label: 'Log New Meal' },
  { page: 'insights', icon: Brain, label: 'Health AI' },
  { page: 'goals', icon: Target, label: 'Milestones' },
  { page: 'settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ current, onChange, isMobile }: SidebarProps) {
  const { signOut } = useAuth();

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        {navItems.filter(i => i.page !== 'settings').map((item) => {
          const isActive = current === item.page;
          const isCenter = item.page === 'add';

          if (isCenter) {
            return (
              <motion.button
                key={item.page}
                onClick={() => onChange(item.page)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 rounded-2xl bg-teal-gradient shadow-xl shadow-teal-500/40 flex items-center justify-center text-white -mt-10 transition-all"
              >
                <Plus className="w-7 h-7" />
              </motion.button>
            );
          }

          return (
            <button
              key={item.page}
              onClick={() => onChange(item.page)}
              className="flex flex-col items-center gap-1 outline-none"
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-teal-500' : 'text-slate-400'}`} />
              <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-teal-600' : 'text-slate-400'}`}>
                {item.label.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-8 bg-white">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-2xl bg-teal-gradient flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
          <Heart className="w-6 h-6 fill-white/20" />
        </div>
        <span className="text-xl font-black text-health-text-primary tracking-tighter">NutriTrack</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = current === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onChange(item.page)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group relative ${
                isActive 
                  ? 'bg-teal-50 text-teal-600' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarActive"
                  className="absolute left-0 w-1.5 h-8 bg-teal-500 rounded-r-full"
                />
              )}
              <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-teal-500' : 'group-hover:text-slate-600'}`} />
              <span className="text-sm font-black tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-slate-50">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all font-black text-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
}
