import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProposalList from './components/ProposalList';
import NewsSection from './components/NewsSection';
import ChatBot from './components/ChatBot';
import Forum from './components/Forum';
import { Proposal, ViewState } from './types';
import { INITIAL_PROPOSALS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);

  const handleAddProposal = (newProposal: Proposal) => {
    setProposals([newProposal, ...proposals]);
  };

  const handleVote = (id: string) => {
    setProposals(proposals.map(p => 
      p.id === id ? { ...p, votes: p.votes + 1 } : p
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            <Hero onCtaClick={() => setCurrentView('proposals')} />
            <NewsSection />
            <div className="bg-slate-100 border-t border-slate-200">
               <ProposalList 
                  proposals={proposals.slice(0, 3)} // Show only top 3 on home
                  onAddProposal={handleAddProposal}
                  onVote={handleVote}
               />
               <div className="flex justify-center pb-16">
                 <button 
                   onClick={() => setCurrentView('proposals')}
                   className="px-6 py-2 bg-white border border-slate-300 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition"
                 >
                   Voir toutes les propositions
                 </button>
               </div>
            </div>
          </>
        )}

        {currentView === 'proposals' && (
          <ProposalList 
            proposals={proposals}
            onAddProposal={handleAddProposal}
            onVote={handleVote}
          />
        )}

        {currentView === 'forum' && (
          <Forum />
        )}

        {currentView === 'events' && (
          <div className="pt-8">
             <NewsSection />
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="text-white font-serif font-bold text-lg mb-4">Alby-sur-Chéran</h3>
            <p>Mairie d'Alby-sur-Chéran<br/>Place du Trophée<br/>74540 Haute-Savoie</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Horaires</h4>
            <p>Lundi - Vendredi<br/>08:30 - 12:00<br/>13:30 - 17:00</p>
            <p className="mt-2 text-xs opacity-70">Samedi (Permanence)<br/>09:00 - 12:00</p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Liens Utiles</h4>
            <ul className="space-y-2">
              <li className="hover:text-amber-400 cursor-pointer">Mentions Légales</li>
              <li className="hover:text-amber-400 cursor-pointer">Protection des données</li>
              <li className="hover:text-amber-400 cursor-pointer">Accessibilité</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Urgence</h4>
            <p>Police Municipale : 04.50.00.00.00</p>
            <p>Pompiers : 18</p>
            <p>SAMU : 15</p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          &copy; 2024 Commune d'Alby-sur-Chéran. Tous droits réservés.
        </div>
      </footer>

      {/* Floating Chat Assistant */}
      <ChatBot />
    </div>
  );
};

export default App;