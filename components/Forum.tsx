import React, { useState } from 'react';
import { MessageSquare, Clock, User, ArrowLeft, Send, ShieldAlert, Loader2, Plus, Eye, Flag } from 'lucide-react';
import { ForumTopic, ForumReply } from '../types';
import { INITIAL_FORUM_TOPICS } from '../constants';
import { checkContentModeration } from '../services/geminiService';

const Forum: React.FC = () => {
  const [topics, setTopics] = useState<ForumTopic[]>(INITIAL_FORUM_TOPICS);
  const [currentTopic, setCurrentTopic] = useState<ForumTopic | null>(null);
  const [newTopicMode, setNewTopicMode] = useState(false);
  
  // New Topic State
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicContent, setNewTopicContent] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState('Général');

  // Reply State
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState<string | null>(null);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setModerationError(null);

    // Moderation Check
    const modResult = await checkContentModeration(newTopicTitle + " " + newTopicContent);
    if (!modResult.safe) {
        setModerationError(`Contenu refusé : ${modResult.reason}`);
        setIsSubmitting(false);
        return;
    }

    const newTopic: ForumTopic = {
      id: Date.now().toString(),
      title: newTopicTitle,
      author: 'Citoyen d\'Alby',
      date: 'À l\'instant',
      category: newTopicCategory,
      views: 0,
      replies: [
        {
            id: 'r_init',
            author: 'Citoyen d\'Alby',
            content: newTopicContent,
            date: 'À l\'instant'
        }
      ]
    };

    setTopics([newTopic, ...topics]);
    setNewTopicMode(false);
    setNewTopicTitle('');
    setNewTopicContent('');
    setIsSubmitting(false);
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTopic || !replyContent.trim()) return;
    
    setIsSubmitting(true);
    setModerationError(null);

    // Moderation Check
    const modResult = await checkContentModeration(replyContent);
    if (!modResult.safe) {
        setModerationError(`Message refusé : ${modResult.reason}`);
        setIsSubmitting(false);
        return;
    }

    const newReply: ForumReply = {
      id: Date.now().toString(),
      author: 'Citoyen d\'Alby',
      content: replyContent,
      date: 'À l\'instant'
    };

    const updatedTopic = {
      ...currentTopic,
      replies: [...currentTopic.replies, newReply]
    };

    setTopics(topics.map(t => t.id === currentTopic.id ? updatedTopic : t));
    setCurrentTopic(updatedTopic);
    setReplyContent('');
    setIsSubmitting(false);
  };

  const handleReport = (id: string) => {
      alert("Le message a été signalé aux modérateurs pour examen.");
  };

  const renderTopicList = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Forum Citoyen</h2>
           <p className="text-slate-600">Discutez de la vie à Alby-sur-Chéran, partagez vos avis et débattez.</p>
        </div>
        <button 
          onClick={() => setNewTopicMode(true)}
          className="bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-all"
        >
          <Plus size={20} />
          Nouveau Sujet
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {topics.map((topic) => (
          <div 
            key={topic.id}
            onClick={() => setCurrentTopic(topic)}
            className="p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-semibold">{topic.category}</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> {topic.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-1">{topic.title}</h3>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><User size={14}/> {topic.author}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-slate-400">
                <div className="flex flex-col items-center">
                   <span className="font-bold text-slate-700">{topic.replies.length}</span>
                   <span className="text-xs">réponses</span>
                </div>
                <div className="flex flex-col items-center hidden sm:flex">
                   <span className="font-bold text-slate-700">{topic.views}</span>
                   <span className="text-xs">vues</span>
                </div>
                <MessageSquare className="text-slate-300 group-hover:text-amber-500 transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNewTopic = () => (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button 
        onClick={() => setNewTopicMode(false)}
        className="mb-6 flex items-center gap-2 text-slate-600 hover:text-amber-700 transition"
      >
        <ArrowLeft size={18} /> Retour aux sujets
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Créer un nouveau sujet</h2>
        <form onSubmit={handleCreateTopic} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Titre du sujet</label>
                <input 
                    type="text"
                    value={newTopicTitle}
                    onChange={(e) => setNewTopicTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Ex: Problème d'éclairage rue de la Plaine"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Catégorie</label>
                <select 
                    value={newTopicCategory}
                    onChange={(e) => setNewTopicCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                >
                    <option>Général</option>
                    <option>Sécurité</option>
                    <option>Événements</option>
                    <option>Travaux</option>
                    <option>Vie Scolaire</option>
                    <option>Environnement</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Votre message</label>
                <textarea 
                    value={newTopicContent}
                    onChange={(e) => setNewTopicContent(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none"
                    placeholder="Développez votre sujet..."
                    required
                />
            </div>
            
            {moderationError && (
                <div className="p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                    <ShieldAlert size={18} />
                    {moderationError}
                </div>
            )}

            <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-3 bg-amber-700 text-white rounded-lg font-bold hover:bg-amber-800 transition disabled:opacity-50 flex justify-center items-center gap-2"
            >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publier le sujet'}
            </button>
        </form>
      </div>
    </div>
  );

  const renderTopicDetail = () => {
    if (!currentTopic) return null;

    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
         <button 
          onClick={() => setCurrentTopic(null)}
          className="mb-6 flex items-center gap-2 text-slate-600 hover:text-amber-700 transition"
        >
          <ArrowLeft size={18} /> Retour au forum
        </button>

        {/* Header */}
        <div className="mb-8">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3 inline-block">
                {currentTopic.category}
            </span>
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">{currentTopic.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1"><User size={16}/> {currentTopic.author}</span>
                <span className="flex items-center gap-1"><Clock size={16}/> {currentTopic.date}</span>
                <span className="flex items-center gap-1"><Eye size={16}/> {currentTopic.views} vues</span>
            </div>
        </div>

        {/* Thread */}
        <div className="space-y-6 mb-8">
            {currentTopic.replies.map((reply, idx) => (
                <div 
                    key={reply.id} 
                    className={`flex gap-4 ${idx === 0 ? 'bg-white p-6 rounded-xl shadow-sm border border-slate-200' : 'pl-4 md:pl-10'}`}
                >
                    <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${idx === 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'}`}>
                            {reply.author.charAt(0)}
                        </div>
                    </div>
                    <div className="flex-grow">
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="font-bold text-slate-900">{reply.author}</span>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-400">{reply.date}</span>
                                {idx !== 0 && (
                                    <button 
                                        onClick={() => handleReport(reply.id)}
                                        className="text-slate-300 hover:text-red-500 transition" 
                                        title="Signaler ce message"
                                    >
                                        <Flag size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Reply Box */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-4">Répondre à la discussion</h3>
            <form onSubmit={handleReply}>
                <textarea 
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full p-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 outline-none mb-4"
                    rows={4}
                    placeholder="Votre message..."
                    required
                />
                
                {moderationError && (
                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                        <ShieldAlert size={16} />
                        {moderationError}
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <ShieldAlert size={12} /> Modération active par IA
                    </p>
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-amber-700 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-800 transition disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={18} /> Envoyer</>}
                    </button>
                </div>
            </form>
        </div>
      </div>
    );
  };

  if (newTopicMode) return renderNewTopic();
  if (currentTopic) return renderTopicDetail();
  return renderTopicList();
};

export default Forum;