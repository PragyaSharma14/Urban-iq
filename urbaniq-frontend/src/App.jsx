import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ReportGenerator from './components/ReportGenerator';
import ReportHistory from './components/ReportHistory';
import { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="bg-background min-h-screen text-on-surface overflow-hidden flex flex-col">
      {/* TopAppBar Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-16 bg-surface-container-highest border-b border-surface-variant">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            className="md:hidden p-2 hover:bg-surface-variant rounded transition-colors"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          <span className="font-headline-md text-[20px] md:text-headline-md font-bold tracking-tight text-on-surface">UrbanIQ</span>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-error-container text-on-error-container rounded">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span className="font-label-caps text-label-caps">CLASSIFIED</span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex relative items-center bg-surface-container px-3 py-1.5 border-technical">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input className="bg-transparent border-none outline-none text-data-mono font-data-mono text-on-surface w-48 placeholder:text-on-surface-variant" placeholder="QUERY INFRASTRUCTURE..." type="text"/>
          </div>
          <div className="flex gap-1 md:gap-2">
            <button className="p-2 hover:bg-surface-variant transition-colors rounded hidden sm:block"><span className="material-symbols-outlined text-on-surface">notifications</span></button>
            <button className="p-2 hover:bg-surface-variant transition-colors rounded hidden sm:block"><span className="material-symbols-outlined text-on-surface">schedule</span></button>
            <button className="p-2 hover:bg-surface-variant transition-colors rounded"><span className="material-symbols-outlined text-on-surface">account_circle</span></button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 pt-16 h-screen overflow-hidden relative">
        {/* SideNavBar Shell */}
        <aside className={`fixed md:relative z-40 md:z-0 top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-full w-64 bg-surface-container-low border-r border-surface-variant pt-8 pb-8 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
          <div className="px-6 mb-8">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Level 4 Intelligence</h2>
            <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Restricted Access</p>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <Link to="/" className={`flex items-center gap-3 px-3 py-3 transition-all cursor-pointer ${location.pathname === '/' ? 'bg-secondary-container text-on-secondary-container border-l-4 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`} onClick={() => setSidebarOpen(false)}>
              <span className="material-symbols-outlined">dashboard</span>
              <span className="font-label-caps text-label-caps">Intelligence Overview</span>
            </Link>
            <Link to="/history" className={`flex items-center gap-3 px-3 py-3 transition-all cursor-pointer ${location.pathname === '/history' ? 'bg-secondary-container text-on-secondary-container border-l-4 border-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`} onClick={() => setSidebarOpen(false)}>
              <span className="material-symbols-outlined">inventory_2</span>
              <span className="font-label-caps text-label-caps">Archive</span>
            </Link>
          </nav>
        </aside>
        
        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden top-16" onClick={() => setSidebarOpen(false)}></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-surface-container-lowest">
          <Routes>
            <Route path="/" element={<ReportGenerator />} />
            <Route path="/history" element={<ReportHistory />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
