import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Salad, Cookie, Sun, Moon, Coffee, Utensils, CheckCircle2, ChevronRight, Info, Plus } from 'lucide-react';
import { MealType, MealTime } from '../types';

interface AddEntryProps {
  onAdd: (entry: { food_name: string; meal_type: MealType; meal_time: MealTime; notes: string; logged_at: string }) => Promise<{ error: any }>;
  onComplete: () => void;
}

export default function AddEntry({ onAdd, onComplete }: AddEntryProps) {
  const [food, setFood] = useState('');
  const [type, setType] = useState<MealType>('healthy');
  const [time, setTime] = useState<MealTime>('lunch');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await onAdd({
      food_name: food,
      meal_type: type,
      meal_time: time,
      notes,
      logged_at: new Date().toISOString(),
    });
    
    if (!error) {
      setSuccess(true);
      setTimeout(onComplete, 1500);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-health-text-primary tracking-tighter">Record Entry</h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Document your latest dietary interaction.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Form Section */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
          <section className="bg-white p-12 rounded-[3.5rem] shadow-soft space-y-10 border border-slate-50">
            {/* Input Row */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">What did you eat?</label>
              <input
                autoFocus
                type="text"
                value={food}
                onChange={e => setFood(e.target.value)}
                placeholder="Type meal name, e.g. Quinoa Salad"
                className="w-full bg-slate-50 rounded-[2rem] px-8 py-6 text-xl font-black text-health-text-primary outline-none focus:bg-white focus:ring-8 ring-teal-500/5 border-2 border-transparent focus:border-teal-500/20 transition-all placeholder:text-slate-200"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Type Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Quality Indicator</label>
                <div className="flex gap-4">
                  {[
                    { val: 'healthy', icon: Salad, label: 'Healthy', color: 'teal' },
                    { val: 'unhealthy', icon: Cookie, label: 'Harmful', color: 'red' }
                  ].map(t => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setType(t.val as MealType)}
                      className={`flex-1 p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-3 ${
                        type === t.val 
                          ? `bg-${t.color}-50 border-${t.color}-500 shadow-xl shadow-${t.color}-500/10` 
                          : 'bg-slate-50 border-transparent text-slate-400 grayscale'
                      }`}
                    >
                      <t.icon className={`w-8 h-8 ${type === t.val ? `text-${t.color}-500` : ''}`} />
                      <span className={`text-xs font-black uppercase tracking-widest ${type === t.val ? `text-${t.color}-600` : ''}`}>
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Meal Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: 'breakfast', icon: Coffee },
                    { val: 'lunch', icon: Sun },
                    { val: 'dinner', icon: Moon },
                    { val: 'snack', icon: Utensils }
                  ].map(t => (
                    <button
                      key={t.val}
                      type="button"
                      onClick={() => setTime(t.val as MealTime)}
                      className={`p-4 rounded-2xl flex items-center gap-3 transition-all border-2 ${
                        time === t.val 
                          ? 'bg-health-text-primary text-white border-transparent' 
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <t.icon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-wider capitalize">{t.val}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2">Contextual Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Added extra olive oil, shared with family..."
                className="w-full bg-slate-50 rounded-[2rem] px-8 py-6 text-sm font-bold text-health-text-primary min-h-[140px] resize-none outline-none focus:bg-white border-2 border-transparent focus:border-teal-500/20 transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading || success}
              type="submit"
              className={`w-full py-8 rounded-[2rem] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-4 ${
                success 
                  ? 'bg-green-500 text-white shadow-green-500/20' 
                  : 'bg-teal-gradient text-white shadow-teal-500/30'
              }`}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : success ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Successfully Logged
                </>
              ) : (
                <>
                  <Plus className="w-6 h-6" />
                  Finalize Entry
                </>
              )}
            </motion.button>
          </section>
        </form>

        {/* Sidebar Help Section */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[3rem] shadow-soft border border-slate-50"
          >
            <div className="w-16 h-16 rounded-[1.5rem] bg-amber-50 text-amber-500 flex items-center justify-center mb-6">
              <Info className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-health-text-primary tracking-tight">Why log?</h3>
            <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-wider mt-4">
              Logging every meal, including "cheat meals," helps our AI builds a metabolic map unique to your body. Consistency leads to 45% better dietary outcomes over 3 months.
            </p>
          </motion.div>

          <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-500/40 transition-colors" />
            <h4 className="text-lg font-black tracking-tight relative z-10">Advanced Tracking</h4>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 relative z-10">Pro Version Required</p>
            <button className="w-full mt-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
              Unlock Photo Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
