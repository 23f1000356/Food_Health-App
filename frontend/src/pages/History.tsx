import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Coffee, Sun, Moon, Utensils, Search, Calendar, Filter, ChevronDown } from 'lucide-react';
import { FoodEntry, MealType } from '../types';

interface HistoryProps {
  entries: FoodEntry[];
  onDelete: (id: string) => void;
}

type FilterType = 'all' | MealType;

const mealTimeIcon = (time: string) => {
  switch (time) {
    case 'breakfast': return <Coffee className="w-5 h-5" />;
    case 'lunch': return <Sun className="w-5 h-5" />;
    case 'dinner': return <Moon className="w-5 h-5" />;
    default: return <Utensils className="w-5 h-5" />;
  }
};

export default function History({ entries, onDelete }: HistoryProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return entries.filter(e => {
      const matchFilter = filter === 'all' || e.meal_type === filter;
      const matchSearch = e.food_name.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [entries, filter, search]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await new Promise(r => setTimeout(r, 300));
    onDelete(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-health-text-primary tracking-tighter">Meal History</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Examine your previous dietary records.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search logs..."
              className="bg-white border-2 border-slate-50 rounded-2xl pl-12 pr-6 py-3.5 text-sm font-bold w-full md:w-64 focus:border-teal-500/20 transition-all outline-none"
            />
          </div>
          <button className="bg-white p-3.5 rounded-2xl border-2 border-slate-50 text-slate-400 hover:text-teal-500 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Logs', value: entries.length, color: 'text-slate-600' },
          { label: 'Healthy Choices', value: entries.filter(e => e.meal_type === 'healthy').length, color: 'text-teal-600' },
          { label: 'Unhealthy Adjustments', value: entries.filter(e => e.meal_type === 'unhealthy').length, color: 'text-red-500' }
        ].map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] shadow-soft flex flex-col items-center justify-center text-center border border-slate-50">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</span>
            <span className={`text-4xl font-black ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Main Table List */}
      <div className="bg-white rounded-[3rem] shadow-soft overflow-hidden border border-slate-100">
        <div className="grid grid-cols-12 gap-4 px-10 py-6 bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <div className="col-span-5">Meal Information</div>
          <div className="col-span-2">Time of Day</div>
          <div className="col-span-2 text-center">Dietary Status</div>
          <div className="col-span-2">Date Recorded</div>
          <div className="col-span-1 text-right pr-2">Actions</div>
        </div>

        <div className="divide-y divide-slate-50">
          <AnimatePresence mode='popLayout'>
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="py-40 text-center space-y-4"
              >
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                  <Calendar className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-lg font-black text-slate-400">No matching logs found</p>
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">Adjust your search or filters</p>
                </div>
              </motion.div>
            ) : (
              filtered.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className={`grid grid-cols-12 gap-4 px-10 py-8 items-center group transition-colors ${deletingId === entry.id ? 'bg-red-50/50' : 'hover:bg-teal-50/20'}`}
                >
                  <div className="col-span-5 flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                      entry.meal_type === 'healthy' ? 'bg-teal-gradient shadow-teal-500/20' : 'bg-red-400 shadow-red-500/20'
                    }`}>
                      {mealTimeIcon(entry.meal_time)}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-health-text-primary capitalize">{entry.food_name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] mt-1">{entry.notes || 'No extra notes provided'}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="text-xs font-black text-health-text-secondary uppercase tracking-wider bg-slate-100 px-3 py-1.5 rounded-xl">
                      {entry.meal_time}
                    </span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full ${
                      entry.meal_type === 'healthy' ? 'bg-teal-500 text-white' : 'bg-red-500 text-white'
                    } shadow-md`}>
                      {entry.meal_type}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="text-sm font-bold text-health-text-primary">
                      {new Date(entry.logged_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {new Date(entry.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <div className="col-span-1 text-right">
                    <motion.button
                      whileHover={{ scale: 1.1, color: '#EF4444' }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(entry.id)}
                      className="p-3 text-slate-300 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
