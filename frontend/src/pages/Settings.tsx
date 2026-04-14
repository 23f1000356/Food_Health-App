import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, LogOut, Info, ChevronRight, Shield, Database, Layout, ShieldCheck, CreditCard } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-300 shadow-inner"
      style={{ background: enabled ? '#0FB9B1' : '#E2E8F0' }}
    >
      <motion.span
        animate={{ x: enabled ? 44 : 6 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="inline-block w-8 h-8 rounded-full bg-white shadow-xl shadow-black/10"
      />
    </button>
  );
}

export default function Settings() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [name, setName] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.display_name || '');
      setNotifications(profile.notifications_enabled || false);
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile({
      display_name: name,
      notifications_enabled: notifications,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-health-text-primary tracking-tighter">System Configuration</h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">Manage infrastructure and user experience.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Navigation / Account Overview */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-[3.5rem] shadow-soft border border-slate-50 flex flex-col items-center text-center space-y-6"
          >
            <div className="relative group">
              <div className="w-32 h-32 rounded-[3rem] bg-teal-gradient flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-teal-500/20 group-hover:rotate-6 transition-transform">
                {name ? name[0].toUpperCase() : 'U'}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center text-teal-500 border-4 border-white">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-black text-health-text-primary tracking-tight">{name || 'Your Profile'}</h2>
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest mt-2">{user?.email}</p>
            </div>
            
            <button
              onClick={signOut}
              className="w-full bg-red-50 text-red-500 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              Terminate Session
            </button>
          </motion.div>

          <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white space-y-6 relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-teal-500/20 rounded-full blur-[60px]" />
            <div className="space-y-1">
              <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Active Plan</p>
              <h3 className="text-xl font-black">Professional Neural</h3>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-teal-400 rounded-full" />
            </div>
            <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-transform">
              Upgrade Capacity
            </button>
          </div>
        </div>

        {/* Right: Detailed Settings */}
        <div className="lg:col-span-8 space-y-10">
          <section className="bg-white p-12 rounded-[3.5rem] shadow-soft border border-slate-50 space-y-12">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                  <User className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-health-text-primary tracking-tight">Identity Metadata</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Dr. John Doe"
                    className="w-full bg-slate-50 border-2 border-transparent px-8 py-5 rounded-3xl text-sm font-bold outline-none focus:bg-white focus:border-teal-500/20 focus:ring-8 ring-teal-500/5 transition-all"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account ID</label>
                  <div className="w-full bg-slate-50 px-8 py-5 rounded-3xl text-sm font-bold text-slate-400">
                    {user?.id?.slice(0, 12)}...
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center border border-orange-100">
                  <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-health-text-primary tracking-tight">Notification Logic</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-8 rounded-3xl bg-slate-50 border border-slate-100 group transition-colors hover:border-teal-200">
                   <div className="space-y-1">
                      <p className="font-black text-health-text-primary text-lg">Push Reminders</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alerts for meal tracking & AI insights.</p>
                   </div>
                   <Toggle enabled={notifications} onChange={setNotifications} />
                </div>
              </div>
            </div>

            <div className="pt-4">
               <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSave}
                className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${
                  saved 
                    ? 'bg-green-500 text-white shadow-green-500/20' 
                    : 'bg-teal-gradient text-white shadow-teal-500/30'
                }`}
              >
                {saved ? 'Parameters Saved' : 'Apply Configurations'}
              </motion.button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-slate-50 flex items-start gap-6 group cursor-pointer hover:bg-slate-50 transition-colors">
               <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-7 h-7" />
               </div>
               <div>
                  <h4 className="text-lg font-black text-health-text-primary">Medical Privacy</h4>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide leading-relaxed">View all data storage policies and encryption methods.</p>
               </div>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-soft border border-slate-50 flex items-start gap-6 group cursor-pointer hover:bg-slate-50 transition-colors">
               <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                  <CreditCard className="w-7 h-7" />
               </div>
               <div>
                  <h4 className="text-lg font-black text-health-text-primary">Billing Portal</h4>
                  <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide leading-relaxed">Manage your premium subscription and cloud quota.</p>
               </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 text-slate-300 font-black uppercase tracking-[0.4em] text-[9px] pt-4">
            <div className="flex items-center gap-3">
              <Database className="w-3 h-3" />
              <span>Data stored locally</span>
              <span className="opacity-20">•</span>
              <Layout className="w-3 h-3" />
              <span>Version 2.4.0 Engine</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
