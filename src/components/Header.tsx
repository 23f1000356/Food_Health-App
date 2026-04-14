import { motion } from 'framer-motion';
import { User, Bell, Search, Menu } from 'lucide-react';
import { Page } from '../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
}

export default function Header({ onNavigate }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 px-6 py-5 flex items-center justify-between bg-health-bg/80 backdrop-blur-xl border-b border-slate-100 md:bg-white md:border-none md:shadow-sm md:mx-6 md:mt-4 md:rounded-[2rem]"
    >
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 bg-slate-100 rounded-xl">
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
        <div className="relative hidden sm:block max-w-md w-full ml-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Quick search meals..." 
            className="w-full bg-slate-50 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 ring-teal-500/10 font-bold transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:bg-slate-100 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full" />
        </button>
        <button 
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-3 pl-1 pr-4 py-1.5 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors border border-slate-100"
        >
          <div className="w-9 h-9 rounded-full bg-teal-gradient flex items-center justify-center text-white shadow-md shadow-teal-500/20 font-black text-xs">
            JD
          </div>
          <span className="hidden lg:block text-xs font-black tracking-tight text-health-text-primary">John Doe</span>
        </button>
      </div>
    </motion.header>
  );
}
