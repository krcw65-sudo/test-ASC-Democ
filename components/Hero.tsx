import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Alby-sur-Ch%C3%A9ran_-_Place_du_Troph%C3%A9e_-_20130821.jpg/1920px-Alby-sur-Ch%C3%A9ran_-_Place_du_Troph%C3%A9e_-_20130821.jpg" 
          alt="Alby sur Chéran Place du Trophée" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 md:py-28 flex flex-col items-center text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-amber-600/90 text-white text-sm font-bold mb-8 border border-amber-500/50 backdrop-blur-sm shadow-lg shadow-amber-900/50">
          Alby-sur-Chéran 2026
        </span>
        
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8 leading-tight max-w-4xl drop-shadow-md">
          Une nouvelle façon de décider
        </h1>

        <div className="text-lg md:text-xl text-slate-200 mb-10 max-w-3xl leading-relaxed space-y-6 text-left md:text-center font-light">
          <p>
            Depuis 12 ans, Alby a manqué des opportunités essentielles : absence de concertations, projets structurants abandonnés, faible anticipation des dispositifs nationaux, manque de transparence sur les décisions.
          </p>
          <p className="font-medium text-white">
            Notre liste est née d’un constat simple : <br className="hidden md:block"/>
            une commune ne peut se développer durablement que si ceux qui y vivent participent à la décision.
          </p>
          <p>
            C’est pourquoi nous portons un projet clair : ouvrir entièrement la démocratie locale, construire les politiques publiques avec les habitants, et installer une gouvernance transparente, moderne et responsable.
          </p>
          <p className="text-amber-400 font-serif italic text-xl md:text-2xl pt-2">
            "Nous ne proposons pas seulement un programme :<br/>nous proposons une nouvelle façon de décider."
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={onCtaClick}
            className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-900/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            Je participe au projet
            <ArrowRight size={20} />
          </button>
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
            Voir les propositions
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-white/80 max-w-4xl w-full border-t border-white/10 pt-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">100%</span>
            <span className="text-sm">Transparence</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">124</span>
            <span className="text-sm">Propositions</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">3</span>
            <span className="text-sm">Grands Projets</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-white">2026</span>
            <span className="text-sm">L'Avenir</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;