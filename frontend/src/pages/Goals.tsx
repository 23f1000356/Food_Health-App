import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Plus, X, Target, Lightbulb, Trash2, Trophy, ArrowRight } from 'lucide-react';
import { Goal } from '../types';
import { useGoals } from '../hooks/useGoals';
import { useFoodEntries } from '../hooks/useFoodEntries';

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: () => void }) {
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-10 rounded-[3.5rem] shadow-soft space-y-8 relative group overflow-hidden border border-slate-50 flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all">
            <Target className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-health-text-primary leading-tight tracking-tight">{goal.title}</h3>
          <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
            Target: {goal.target} {goal.unit} · {goal.goal_type}
          </p>
        </div>
        <button 
          onClick={onDelete}
          className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-5xl font-black text-health-text-primary tracking-tighter">{pct}%</span>
          <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{goal.current} / {goal.target} {goal.unit}</span>
        </div>
        <div className="h-6 bg-slate-50 rounded-full overflow-hidden p-1.5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className={`h-full rounded-full shadow-lg ${pct >= 100 ? 'bg-teal-gradient' : 'bg-slate-300'}`}
          />
        </div>
      </div>

      {pct >= 100 && (
        <div className="absolute top-6 right-6 rotate-12 opacity-10 scale-150 pointer-events-none">
          <Trophy className="w-32 h-32 text-teal-500" />
        </div>
      )}
    </motion.div>
  );
}

export default function Goals() {
  const { goals, addGoal, deleteGoal } = useGoals();
  const { entries } = useFoodEntries();
  const [showModal, setShowModal] = useState(false);

  const streak = (() => {
    let count = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const dayEntries = entries.filter(e => e.logged_at.slice(0, 10) === dateStr);
      if (dayEntries.length > 0 && dayEntries.every(e => e.meal_type === 'healthy')) count++;
      else if (dayEntries.length > 0) break;
    }
    return count;
  })();

  return (
    <div className="space-y-10">
      <header className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-health-text-primary tracking-tighter decoration-teal-500/30">Target Milestones</h1>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Defined objectives for metabolic optimization.</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="bg-teal-gradient px-8 py-5 rounded-[2rem] shadow-2xl shadow-teal-500/30 text-white font-black text-sm uppercase tracking-widest flex items-center gap-4"
        >
          <Plus className="w-6 h-6 border-2 border-white/20 rounded-full p-0.5" />
          Add New Target
        </motion.button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Streak Visualizer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="xl:col-span-5 bg-white p-12 rounded-[3.5rem] shadow-soft flex flex-col items-center justify-center text-center relative overflow-hidden group border border-slate-50 min-h-[400px]"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-amber-gradient" />
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-32 rounded-[2.5rem] bg-amber-50 flex items-center justify-center text-amber-500 mb-8 shadow-xl shadow-amber-500/5"
          >
            <Flame className="w-16 h-16 fill-amber-500/10" />
          </motion.div>
          <div className="space-y-2 relative z-10">
            <span className="text-9xl font-black text-health-text-primary tracking-tighter">{streak}</span>
            <p className="text-sm font-black text-amber-600 uppercase tracking-[0.3em]">Day Healthy Streak</p>
          </div>
          
          <div className="mt-12 p-6 rounded-3xl bg-slate-50 border border-slate-100 flex items-center gap-4 max-w-sm">
            <Lightbulb className="w-6 h-6 text-teal-500" />
            <p className="text-[10px] font-bold text-slate-400 text-left uppercase tracking-wider leading-relaxed">
              Log one more healthy snack tomorrow before 10 AM to reach a 3-star streak badge.
            </p>
          </div>
        </motion.div>

        {/* Info Grid */}
        <div className="xl:col-span-7 space-y-8">
           <div className="p-10 rounded-[3rem] bg-teal-50 border border-teal-100 flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white shadow-xl shadow-teal-500/5 flex items-center justify-center text-teal-500">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-teal-900 tracking-tight">Level 4: Nutrition Specialist</h4>
                  <p className="text-[10px] font-black text-teal-700/60 uppercase tracking-widest mt-1">240 XP realized this month</p>
                </div>
              </div>
              <ArrowRight className="text-teal-400 group-hover:translate-x-2 transition-transform" />
           </div>

           <div className="grid grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-50">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Current Pace</h5>
                <p className="text-4xl font-black text-health-text-primary tracking-tighter">Steady</p>
                <div className="w-full bg-slate-100 h-1 rounded-full mt-4 overflow-hidden">
                  <div className="w-2/3 h-full bg-teal-500 rounded-full" />
                </div>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-soft border border-slate-50">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Targets</h5>
                <p className="text-4xl font-black text-health-text-primary tracking-tighter">{goals.length}</p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="text-[10px] font-black text-teal-600 uppercase tracking-tighter mt-4 flex items-center gap-2"
                >
                  Create New <ArrowRight className="w-3 h-3" />
                </button>
              </div>
           </div>
        </div>
      </div>

      {/* Goal List */}
      <div className="pt-8">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] px-4 mb-8">Detailed Missions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          <AnimatePresence>
            {goals.length === 0 ? (
              <div className="col-span-full py-32 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center gap-4">
                <Target className="w-16 h-16 text-slate-200" />
                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No active dietary missions</p>
                <button 
                  onClick={() => setShowModal(true)}
                  className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-[10px] font-black text-teal-600 shadow-sm hover:shadow-md transition-shadow"
                >
                  Initiate First Mission
                </button>
              </div>
            ) : (
              goals.map(goal => (
                <GoalCard key={goal.id} goal={goal} onDelete={() => deleteGoal(goal.id)} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal - Large Format */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[3.5rem] p-16 shadow-2xl relative overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowModal(false)} 
                className="absolute top-10 right-10 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="mb-12">
                <h2 className="text-4xl font-black text-health-text-primary tracking-tighter">Initiate Mission</h2>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-2">Specify your target metabolic parameters.</p>
              </div>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Mission Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Weekly Antioxidant Intake"
                    className="w-full bg-slate-50 border-2 border-transparent px-8 py-6 rounded-[2rem] text-lg font-black outline-none focus:bg-white focus:border-teal-500/20 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Quantitative Target</label>
                    <input type="number" defaultValue="7" className="w-full bg-slate-50 border-2 border-transparent px-8 py-6 rounded-[2rem] text-lg font-black outline-none focus:bg-white focus:border-teal-500/20 transition-all"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Unit Descriptor</label>
                    <input type="text" defaultValue="meals" className="w-full bg-slate-50 border-2 border-transparent px-8 py-6 rounded-[2rem] text-lg font-black outline-none focus:bg-white focus:border-teal-500/20 transition-all"/>
                  </div>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="w-full bg-teal-gradient py-8 rounded-[2rem] text-white font-black text-lg shadow-2xl shadow-teal-500/30 mt-4 hover:scale-[1.01] transition-transform"
                >
                  Commit to Mission
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
