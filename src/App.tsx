import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useFoodEntries } from './hooks/useFoodEntries';
import { Page } from './types';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import AddEntry from './pages/AddEntry';
import Insights from './pages/Insights';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { entries, loading: entriesLoading, addEntry, deleteEntry } = useFoodEntries();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-health-bg">
        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard entries={entries} onNavigate={setCurrentPage} />;
      case 'history':
        return <History entries={entries} onDelete={deleteEntry} />;
      case 'add':
        return <AddEntry onAdd={addEntry} onComplete={() => setCurrentPage('dashboard')} />;
      case 'insights':
        return <Insights entries={entries} />;
      case 'goals':
        return <Goals />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard entries={entries} onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-health-bg flex">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block w-72 h-screen sticky top-0 border-r border-slate-100 bg-white">
        <Sidebar current={currentPage} onChange={setCurrentPage} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Header onNavigate={setCurrentPage} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {renderPage()}
        </main>

        {/* Mobile Bottom Nav - Only on Small Screens */}
        <div className="md:hidden">
          <Sidebar isMobile current={currentPage} onChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
