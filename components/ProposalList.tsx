import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Info, Sparkles, Plus, Loader2 } from 'lucide-react';
import { Proposal, ProposalCategory } from '../types';
import { analyzeProposalWithGemini } from '../services/geminiService';

interface ProposalListProps {
  proposals: Proposal[];
  onAddProposal: (p: Proposal) => void;
  onVote: (id: string) => void;
}

const ProposalList: React.FC<ProposalListProps> = ({ proposals, onAddProposal, onVote }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Proposal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    setIsAnalyzing(true);
    
    // Call Gemini to analyze
    const analysis = await analyzeProposalWithGemini(newTitle, newDesc);

    const newProposal: Proposal = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      author: 'Citoyen Connecté', // Simulated user
      date: new Date().toISOString().split('T')[0],
      votes: 0,
      category: analysis.category,
      aiAnalysis: analysis
    };

    onAddProposal(newProposal);
    setNewTitle('');
    setNewDesc('');
    setIsAnalyzing(false);
    setIsModalOpen(false);
  };

  const getCategoryColor = (cat: ProposalCategory) => {
    switch(cat) {
      case ProposalCategory.Environment: return 'bg-green-100 text-green-800 border-green-200';
      case ProposalCategory.Infrastructure: return 'bg-blue-100 text-blue-800 border-blue-200';
      case ProposalCategory.Culture: return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Propositions Citoyennes</h2>
          <p className="text-slate-600">Explorez et votez pour les idées qui amélioreront notre commune.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 shadow-md transition-all"
        >
          <Plus size={20} />
          Nouvelle Proposition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proposals.map((prop) => (
          <div key={prop.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
            <div className="p-6 flex-grow">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-2 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border ${getCategoryColor(prop.category)}`}>
                  {prop.category}
                </span>
                <span className="text-xs text-slate-400">{prop.date}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{prop.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-3">{prop.description}</p>
              
              {prop.aiAnalysis && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Sparkles size={14} />
                    <span className="text-xs font-bold uppercase">Analyse IA</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 block">Faisabilité</span>
                      <span className="font-semibold text-slate-800">{prop.aiAnalysis.feasibility}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Coût Est.</span>
                      <span className="font-semibold text-slate-800">{prop.aiAnalysis.estimatedCost}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-500 block">Impact</span>
                      <span className="text-slate-800 italic">{prop.aiAnalysis.impact}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <MessageSquare size={16} />
                  3 comm.
                </span>
                <span>Par {prop.author}</span>
              </div>
              <button 
                onClick={() => onVote(prop.id)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-colors shadow-sm group"
              >
                <ThumbsUp size={16} className="group-hover:scale-110 transition-transform" />
                <span className="font-bold">{prop.votes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Soumettre une idée</h3>
              <p className="text-sm text-slate-500 mt-1">L'IA analysera automatiquement votre proposition pour la catégoriser.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titre de votre projet</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Potager partagé..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description détaillée</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Expliquez les objectifs, les bénéfices et la localisation..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none"
                  required
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-sm text-blue-800">
                <Info size={20} className="flex-shrink-0 mt-0.5" />
                <p>Votre proposition sera visible par tous les habitants après une brève modération automatique.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
                  disabled={isAnalyzing}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={isAnalyzing}
                  className="flex-1 px-4 py-3 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition flex justify-center items-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyse...
                    </>
                  ) : (
                    "Soumettre"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalList;
