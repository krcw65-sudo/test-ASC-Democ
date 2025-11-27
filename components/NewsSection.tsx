import React from 'react';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';

const NewsSection: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-serif font-bold text-slate-900">Actualités & Agenda</h2>
        <button className="text-emerald-700 font-medium flex items-center gap-1 hover:gap-2 transition-all">
          Tout voir <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Featured Item */}
        <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
           <img 
            src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=1000&auto=format&fit=crop" 
            alt="Réunion publique" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent flex flex-col justify-end p-8">
            <span className="text-amber-400 font-bold tracking-wider text-sm mb-2">À LA UNE</span>
            <h3 className="text-2xl font-bold text-white mb-2">Réunion d'information sur le programme de la liste démocratique</h3>
            <p className="text-slate-300 line-clamp-2">Venez échanger sur notre projet de gouvernance partagée et découvrir les axes forts pour Alby 2026. Salle Plaimpalais, ce vendredi à 19h.</p>
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-4">
          {MOCK_EVENTS.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer">
              <div className="flex gap-4 items-start">
                <div className="flex flex-col items-center bg-slate-100 rounded-lg p-3 min-w-[70px] text-slate-800">
                  <span className="text-xs font-bold uppercase">{event.date.split(' ')[1]}</span>
                  <span className="text-2xl font-bold font-serif">{event.date.split(' ')[0]}</span>
                </div>
                <div className="flex-grow">
                   <h4 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">{event.title}</h4>
                   <div className="flex items-center gap-2 text-sm text-slate-500 mb-2 mt-1">
                      <MapPin size={14} />
                      {event.location}
                   </div>
                   <p className="text-slate-600 text-sm">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-emerald-900">Recevez la newsletter</h4>
              <p className="text-sm text-emerald-700">Restez informé des alertes météo et événements.</p>
            </div>
            <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 transition">
              M'inscrire
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;