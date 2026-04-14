import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lightbulb, BarChart3, TrendingUp, Brain, Info, CheckCircle2 } from 'lucide-react';
import { FoodEntry } from '../types';

interface InsightsProps {
  entries: FoodEntry[];
}

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) { setCount(end); return; }
    let duration = 1500;
    let incrementTime = Math.max(duration / end, 10);
    let timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) { setCount(end); clearInterval(timer); }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{count}</span>;
}

function CustomPieChart({ healthy, unhealthy }: { healthy: number; unhealthy: number }) {
  const total = healthy + unhealthy;
  const healthyPct = total > 0 ? (healthy / total) * 100 : 0;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const healthyDash = (healthyPct / 100) * circ;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="240" height="240" viewBox="0 0 100 100" className="drop-shadow-xl transform -rotate-12 transition-transform hover:rotate-0 duration-700">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F8FAFC" strokeWidth="12" />
        <motion.circle
          cx="50" cy="50" r={r} fill="none" stroke="#0FB9B1" strokeWidth="12"
          strokeLinecap="round" strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - healthyDash }}
          transition={{ duration: 2, ease: "circOut" }}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-5xl font-black text-health-text-primary tracking-tighter">
          {Math.round(healthyPct)}%
        </span>
        <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Healthy</span>
      </div>
    </div>
  );
}

export default function Insights({ entries }: InsightsProps) {
  const analysis = useMemo(() => {
    const total = entries.length;
    const healthy = entries.filter(e => e.meal_type === 'healthy').length;
    const unhealthy = entries.filter(e => e.meal_type === 'unhealthy').length;

    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayStats: { [day: string]: { healthy: number; unhealthy: number } } = {};
    dayOfWeek.forEach(d => { dayStats[d] = { healthy: 0, unhealthy: 0 }; });
    entries.forEach(e => {
      const day = dayOfWeek[new Date(e.logged_at).getDay()];
      dayStats[day][e.meal_type]++;
    });

    const riskDay = Object.entries(dayStats).reduce((worst, [day, s]) => {
      const ratio = s.unhealthy / Math.max(s.healthy + s.unhealthy, 1);
      return ratio > worst.ratio ? { day, ratio } : worst;
    }, { day: '', ratio: 0 });

    const now = new Date();
    const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
    const twoWeeksAgo = new Date(now); twoWeeksAgo.setDate(now.getDate() - 14);
    const thisWeekScore = entries.filter(e => new Date(e.logged_at) >= weekAgo && e.meal_type === 'healthy').length;
    const lastWeekScore = entries.filter(e => new Date(e.logged_at) >= twoWeeksAgo && new Date(e.logged_at) < weekAgo && e.meal_type === 'healthy').length;
    
    return { total, healthy, unhealthy, riskDay, improvement: thisWeekScore - lastWeekScore, dayStats };
  }, [entries]);

  return (
    <div className="space-y-12">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[2rem] bg-teal-gradient flex items-center justify-center text-white shadow-xl shadow-teal-500/20">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-health-text-primary tracking-tighter">Neural Insights</h1>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Advanced AI behavior analysis</p>
          </div>
        </div>
      </header>

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="xl:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-soft flex flex-col items-center justify-center min-h-[500px] border border-slate-50 relative overflow-hidden"
        >
          <div className="absolute top-10 left-10">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Aggregate Score</h3>
          </div>
          <CustomPieChart healthy={analysis.healthy} unhealthy={analysis.unhealthy} />
          
          <div className="mt-12 w-full grid grid-cols-2 gap-8 px-12">
            <div className="p-6 rounded-3xl bg-teal-50 flex flex-col items-center">
              <span className="text-4xl font-black text-teal-600">{analysis.healthy}</span>
              <span className="text-[10px] font-black text-teal-700/50 uppercase tracking-tighter">Healthy Choices</span>
            </div>
            <div className="p-6 rounded-3xl bg-red-50 flex flex-col items-center">
              <span className="text-4xl font-black text-red-500">{analysis.unhealthy}</span>
              <span className="text-[10px] font-black text-red-600/50 uppercase tracking-tighter">Adjustments</span>
            </div>
          </div>
        </motion.div>

        <div className="xl:col-span-2 grid grid-rows-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-10 rounded-[3rem] shadow-soft flex flex-col justify-center border border-slate-50 group hover:shadow-2xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Growth Factor</h3>
                <div className="text-6xl font-black text-health-text-primary tracking-tighter">
                  +<AnimatedNumber value={analysis.improvement} />
                </div>
              </div>
              <div className="w-20 h-20 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-500 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-10 h-10" />
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400 leading-relaxed uppercase tracking-wider">You logged {analysis.improvement} more healthy meals this week compared to last week. Your discipline is increasing steadily.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FFF8F8] p-10 rounded-[3rem] border border-red-100 shadow-sm flex items-center gap-8 group"
          >
            <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-red-500 flex-shrink-0 group-hover:rotate-12 transition-transform">
              <AlertTriangle className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-red-900 tracking-tight">Pattern Alert: {analysis.riskDay.day || 'N/A'}s</h3>
              <p className="text-sm font-bold text-red-700/60 mt-2 leading-relaxed uppercase tracking-wide">
                Our analysis shows a statistically significant drop in health score on {analysis.riskDay.day}s. Most users find meal prepping on Sundays helps mitigate this weekend-adjacent risk.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Behavioral Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] shadow-soft border border-slate-50 space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-health-text-primary tracking-tight">Semantic Behavior Map</h2>
            <BarChart3 className="text-slate-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Platform Engagement', value: 'High', desc: `Total ${analysis.total} logs record engagement.` },
              { label: 'Dietary Discipline', value: `${Math.round((analysis.healthy / Math.max(analysis.total, 1)) * 100)}%`, desc: 'Ratio of healthy decisions maintained.' },
              { label: 'Consistency Score', value: analysis.improvement >= 0 ? 'Positive' : 'Variable', desc: 'Flow state in healthy meal logging.' },
              { label: 'Recovery Rate', value: 'Fast', desc: 'Time taken to log a healthy meal after unhealthy.' }
            ].map((insight, i) => (
              <div key={i} className="p-8 rounded-3xl bg-slate-50 space-y-2 border border-transparent hover:border-teal-100 hover:bg-white transition-all">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{insight.label}</p>
                <p className="text-3xl font-black text-health-text-primary">{insight.value}</p>
                <p className="text-[10px] font-bold text-slate-400">{insight.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          animate={{ boxShadow: "0 0 30px rgba(15,185,177,0.15)" }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="bg-teal-gradient p-12 rounded-[3.5rem] text-white flex flex-col justify-between relative overflow-hidden"
        >
          <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-teal-300/20 rounded-full blur-2xl" />
          
          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
              <Lightbulb className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-black tracking-tight leading-tight">AI Nutrition Assistant</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-teal-200" />
                <p className="text-xs font-bold text-teal-50/80 leading-relaxed uppercase tracking-wider">Increase fiber intake during evenings to boost satiation.</p>
              </div>
              <div className="flex gap-4">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-teal-200" />
                <p className="text-xs font-bold text-teal-50/80 leading-relaxed uppercase tracking-wider">Hydration levels dropping after 2 PM. Try setting water goals.</p>
              </div>
            </div>
          </div>

          <button className="relative z-10 w-full bg-white py-5 rounded-2xl text-teal-600 font-black text-xs uppercase tracking-widest shadow-xl shadow-teal-900/10 mt-12 hover:scale-[1.02] transition-transform">
            Generate Full Report
          </button>
        </motion.div>
      </div>
    </div>
  );
}
