import React from 'react';
import { Menu, Mountain, User, MessageSquareText } from 'lucide-react';
import { ViewState } from '../types';

interface HeaderProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const navItems: { label: string; value: ViewState; icon?: any }[] = [
    { label: 'Accueil', value: 'home' },
    { label: 'Propositions', value: 'proposals' },
    { label: 'Forum', value: 'forum' },
    { label: 'Actualités', value: 'events' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => setView('home')}
        >
          <div className="bg-amber-700 text-white p-2 rounded-lg group-hover:bg-amber-800 transition-colors">
            <Mountain size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-slate-900 text-lg leading-tight">Alby-sur-Chéran</span>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Mairie Participative</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setView(item.value)}
              className={`text-sm font-medium transition-colors flex items-center gap-1 ${
                currentView === item.value
                  ? 'text-amber-700 border-b-2 border-amber-700'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-amber-700 font-medium text-sm px-3 py-2 rounded-md hover:bg-slate-100 transition">
            <User size={18} />
            <span>Mon Compte</span>
          </button>
          <button className="md:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;