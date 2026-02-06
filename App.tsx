import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Book, Sparkles, User, Heart, Moon, Sun, 
  Volume2, Share2, Info, ArrowRight, Lock, Crown, LogOut,
  Facebook, Mail, Chrome, Filter, Languages, Globe
} from 'lucide-react';
import { INITIAL_SLANG_DATA, CATEGORIES, SUBSCRIPTION_PRICE } from './constants';
import { SlangItem, Category, ViewState, UserProfile } from './types';
import { translateToAngolanSlang, getCulturalContext, translateSlangToInternational } from './services/geminiService';

// --- Utility Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-angola-red text-white shadow-lg shadow-red-200 dark:shadow-red-900/20 hover:bg-red-700",
    secondary: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700",
    outline: "border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-angola-red hover:text-angola-red",
    premium: "bg-gradient-to-r from-angola-yellow to-yellow-500 text-black shadow-lg shadow-yellow-200",
    google: "bg-white text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50",
    facebook: "bg-[#1877F2] text-white hover:bg-[#166fe5]"
  };
  // @ts-ignore
  return <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>{children}</button>;
};

// --- Shared Utilities ---

const speakSlang = (item: SlangItem) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  
  const textToSpeak = `${item.term}. Significa: ${item.definition}`;
  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find(v => v.lang.startsWith('pt-PT')) || voices.find(v => v.lang.startsWith('pt'));
  if (ptVoice) utterance.voice = ptVoice;
  
  utterance.lang = 'pt-PT';
  utterance.rate = 0.85; 
  utterance.pitch = 1.0;
  
  window.speechSynthesis.speak(utterance);
};

// --- Sub Components ---

interface SlangCardProps {
  item: SlangItem;
  index: number; // Added for staggering
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isPremium: boolean;
  onOpenPaywall: () => void;
  globalLanguage?: 'English' | 'French' | 'pt';
}

const SlangCard: React.FC<SlangCardProps> = ({ item, index, isFavorite, onToggleFavorite, isPremium, onOpenPaywall, globalLanguage = 'pt' }) => {
  const [context, setContext] = useState<string | null>(null);
  const [translation, setTranslation] = useState<string | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);
  const [loadingTranslation, setLoadingTranslation] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (globalLanguage !== 'pt' && isPremium) {
      // Stagger requests: 600ms * index. This prevents hitting the 429 quota instantly.
      setLoadingTranslation(true);
      timeout = setTimeout(() => {
        handleTranslate(globalLanguage as any);
      }, index * 600); 
    } else {
      setTranslation(null);
      setLoadingTranslation(false);
    }

    return () => clearTimeout(timeout);
  }, [globalLanguage, isPremium]); // Run when lang changes

  const handleDeepDive = async () => {
    if (!isPremium) {
      onOpenPaywall();
      return;
    }
    if (context) return;
    setLoadingContext(true);
    const result = await getCulturalContext(item.term);
    setContext(result);
    setLoadingContext(false);
  };

  const handleTranslate = async (lang: 'English' | 'French') => {
    // If called manually via button, no need to check premium again here as button is guarded
    // But if called via effect, we need to be careful
    setLoadingTranslation(true);
    const result = await translateSlangToInternational(item.term, item.definition, lang);
    setTranslation(result);
    setLoadingTranslation(false);
  };

  const handleSpeak = () => {
    if (isPremium) {
      speakSlang(item);
    } else {
      onOpenPaywall();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 mb-4 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 rounded-md mb-2">
            {item.category}
          </span>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{item.term}</h3>
        </div>
        <button 
          onClick={onToggleFavorite} 
          className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-angola-red bg-red-50 dark:bg-red-900/20' : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
        >
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-3 text-lg leading-relaxed">{item.definition}</p>
      
      <div className="bg-angola-warm dark:bg-gray-900/50 p-3 rounded-lg border-l-4 border-angola-yellow mb-4">
        <p className="text-gray-700 dark:text-gray-400 italic text-sm">"{item.example}"</p>
      </div>

      {loadingTranslation && globalLanguage !== 'pt' && !translation && (
        <div className="text-xs text-gray-400 italic mb-4 animate-pulse">
          Traduzindo para {globalLanguage}...
        </div>
      )}

      {translation && (
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4 text-sm text-green-800 dark:text-green-200 animate-fadeIn border border-green-100 dark:border-green-800/30">
          <div className="flex gap-2 items-center font-bold mb-1 uppercase text-[10px] tracking-widest"><Globe size={12} /> Tradução ({globalLanguage}):</div>
          {translation}
        </div>
      )}

      {context && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 text-sm text-blue-800 dark:text-blue-200 animate-fadeIn">
          <div className="flex gap-2 items-center font-bold mb-1"><Sparkles size={14} /> IA Contexto Cultural:</div>
          {context}
        </div>
      )}

      <div className="flex gap-4 mt-4 items-center flex-wrap">
        <button 
          onClick={handleSpeak} 
          className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full transition-all active:scale-90 
            ${isPremium ? 'text-angola-red hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-400 border border-gray-100 dark:border-gray-700'}`}
          title={isPremium ? "Ouvir pronúncia" : "Funcionalidade Premium"}
        >
          {isPremium ? <Volume2 size={18} /> : <Lock size={14} />} 
          Ouvir
        </button>
        
        {isPremium && !translation && globalLanguage === 'pt' && (
           <div className="flex gap-1">
             {['English', 'French'].map((lang) => (
               <button 
                 key={lang}
                 onClick={() => handleTranslate(lang as any)}
                 className="text-[10px] font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-md hover:bg-angola-red hover:text-white transition-colors"
               >
                 {lang === 'English' ? 'EN' : 'FR'}
               </button>
             ))}
           </div>
        )}

        <div className="flex-1"></div>
        
        {!context && (
          <button 
            onClick={handleDeepDive}
            className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors
              ${isPremium 
                ? 'border-blue-200 text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
                : 'border-gray-200 text-gray-400 cursor-not-allowed'}`
            }
          >
            {loadingContext ? '...' : isPremium ? <><Sparkles size={12}/> Contexto</> : <><Lock size={12}/> Contexto</>}
          </button>
        )}
      </div>
    </div>
  );
};

const Header = ({ darkMode, toggleTheme }: { darkMode: boolean, toggleTheme: () => void }) => (
  <header className="sticky top-0 z-30 bg-white/90 dark:bg-angola-dark/90 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-gray-100 dark:border-gray-800">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-angola-red via-black to-angola-yellow flex items-center justify-center text-white font-bold text-lg">
        G
      </div>
      <h1 className="text-xl font-bold tracking-tight">Gírias<span className="text-angola-red">AO</span></h1>
    </div>
    <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  </header>
);

const LandingPage = ({ onLogin }: { onLogin: (provider: 'google' | 'facebook') => void }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = (provider: 'google' | 'facebook') => {
    setLoading(provider);
    setTimeout(() => onLogin(provider), 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-angola-dark flex flex-col p-8 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-angola-red via-black to-angola-yellow flex items-center justify-center text-white font-bold text-4xl shadow-2xl mb-8 animate-bounce-slow">
          G
        </div>
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Gírias de <span className="text-angola-red">Angola</span></h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-12 max-w-xs leading-relaxed">
          O dicionário digital mais completo da nossa banda, na palma da tua mão.
        </p>

        <div className="w-full max-w-sm space-y-4">
          <Button 
            variant="google" 
            className="w-full py-4 text-gray-900 border-gray-300 shadow-md"
            onClick={() => handleLogin('google')}
            disabled={!!loading}
          >
            {loading === 'google' ? 'A conectar...' : <><Chrome size={20} className="text-[#4285F4]" /> Entrar com Google</>}
          </Button>
          <Button 
            variant="facebook" 
            className="w-full py-4 shadow-md"
            onClick={() => handleLogin('facebook')}
            disabled={!!loading}
          >
            {loading === 'facebook' ? 'A conectar...' : <><Facebook size={20} fill="currentColor" /> Entrar com Facebook</>}
          </Button>
          
          <div className="pt-4 text-xs text-gray-400 font-medium">
            Ao entrar, aceitas os nossos <span className="underline">Termos de Uso</span> e <span className="underline">Privacidade</span>.
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-400 pb-4">
        Produzido com ❤️ em Luanda
      </div>
    </div>
  );
};

// --- Main Component ---

const App = () => {
  // Authentication State
  const [user, setUser] = useState<{name: string, email: string, avatar?: string} | null>(null);
  
  // App State
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [slangList, setSlangList] = useState<SlangItem[]>(INITIAL_SLANG_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(['Todas']);
  const [targetLanguage, setTargetLanguage] = useState<'pt' | 'English' | 'French'>('pt');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    isPremium: false,
    trialStartDate: new Date().toISOString(),
    favorites: []
  });
  const [showPaywall, setShowPaywall] = useState(false);

  // Derived State
  const dailySlang = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return slangList[dayOfYear % slangList.length];
  }, [slangList]);

  const filteredSlangs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return slangList.filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(query) || 
                            item.definition.toLowerCase().includes(query);
      
      const matchesCategory = selectedCategories.includes('Todas') || 
                             selectedCategories.includes(item.category);
                             
      return matchesSearch && matchesCategory;
    });
  }, [slangList, searchQuery, selectedCategories]);

  const favoriteSlangs = useMemo(() => {
    return slangList.filter(item => userProfile.favorites.includes(item.id));
  }, [slangList, userProfile.favorites]);

  // Effects
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handlers
  const handleLogin = (provider: 'google' | 'facebook') => {
    setUser({
      name: provider === 'google' ? 'Kamba do Google' : 'Amigo do Facebook',
      email: `${provider}@exemplo.ao`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setView(ViewState.HOME);
  };

  const toggleTheme = () => setDarkMode(!darkMode);
  
  const toggleFavorite = (id: string) => {
    setUserProfile(prev => {
      const isFav = prev.favorites.includes(id);
      return {
        ...prev,
        favorites: isFav 
          ? prev.favorites.filter(fid => fid !== id)
          : [...prev.favorites, id]
      };
    });
  };

  const handleCategoryToggle = (cat: Category) => {
    setSelectedCategories(prev => {
      if (cat === 'Todas') return ['Todas'];
      let next = prev.filter(c => c !== 'Todas');
      if (next.includes(cat)) {
        next = next.filter(c => c !== cat);
      } else {
        next = [...next, cat];
      }
      return next.length === 0 ? ['Todas'] : next;
    });
  };

  const openPaywall = () => setShowPaywall(true);
  const closePaywall = () => {
    setShowPaywall(false);
    if (!userProfile.isPremium) {
       setUserProfile(prev => ({ ...prev, isPremium: true }));
    }
  };

  // Auth Guard
  if (!user) {
    return <LandingPage onLogin={handleLogin} />;
  }

  // Render Views
  const renderContent = () => {
    switch(view) {
      case ViewState.HOME:
        return (
          <div className="p-5 pb-24 animate-in slide-in-from-bottom-2 duration-500">
            <div className="mb-8">
              <h2 className="text-sm font-bold text-angola-red uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sun size={16} /> Gíria do dia
              </h2>
              <div className="transform scale-100 hover:scale-[1.01] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-angola-red to-orange-500 rounded-3xl blur-md opacity-20"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 shadow-xl">
                  <div className="flex justify-between items-start">
                    <h1 className="text-4xl font-extrabold mb-1 text-angola-yellow">{dailySlang.term}</h1>
                    <button 
                      onClick={() => userProfile.isPremium ? speakSlang(dailySlang) : openPaywall()}
                      className={`p-2.5 rounded-full transition-colors active:scale-90 ${userProfile.isPremium ? 'bg-white/20 hover:bg-white/30' : 'bg-black/40'}`}
                    >
                      {userProfile.isPremium ? <Volume2 size={24} /> : <Lock size={20} className="text-gray-400" />}
                    </button>
                  </div>
                  <p className="text-gray-300 text-lg mb-4 font-light leading-relaxed">{dailySlang.definition}</p>
                  <p className="text-gray-400 italic text-sm mb-6 bg-black/20 p-3 rounded-xl border-l-2 border-angola-yellow">
                    "{dailySlang.example}"
                  </p>
                  <div className="flex gap-3">
                     <button onClick={() => toggleFavorite(dailySlang.id)} className="flex-1 bg-white/10 hover:bg-white/20 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                       <Heart size={18} fill={userProfile.favorites.includes(dailySlang.id) ? "currentColor" : "none"} className={userProfile.favorites.includes(dailySlang.id) ? "text-red-500" : ""} /> Favoritar
                     </button>
                     <button className="flex-1 bg-angola-red hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                       <Share2 size={18} /> Partilhar
                     </button>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">Explorar por categoria</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Saudações', 'Rua', 'Juventude', 'Humor'].map(cat => (
                <div 
                  key={cat} 
                  onClick={() => { setSelectedCategories([cat as Category]); setView(ViewState.DICTIONARY); }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer shadow-sm active:scale-95 ${selectedCategories.includes(cat as Category) ? 'bg-angola-red border-angola-red text-white' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-angola-red'}`}
                >
                  <h3 className={`font-bold text-lg ${selectedCategories.includes(cat as Category) ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{cat}</h3>
                  <p className={`text-xs ${selectedCategories.includes(cat as Category) ? 'text-red-100' : 'text-gray-500'}`}>Ver gírias</p>
                </div>
              ))}
            </div>

            {!userProfile.isPremium && (
              <div onClick={openPaywall} className="mt-8 bg-gradient-to-r from-angola-yellow to-orange-400 rounded-2xl p-5 flex items-center justify-between cursor-pointer shadow-lg shadow-orange-200 dark:shadow-none transition-transform hover:scale-[1.02]">
                <div className="text-black">
                   <h3 className="font-bold text-lg">Seja Gírias Pro</h3>
                   <p className="text-xs font-medium opacity-80">Tradução com IA e áudio exclusivo.</p>
                </div>
                <div className="bg-white/40 p-2 rounded-full backdrop-blur-sm">
                   <ArrowRight className="text-black" />
                </div>
              </div>
            )}
          </div>
        );
      
      case ViewState.DICTIONARY:
        return (
          <div className="p-5 pb-24 h-full flex flex-col animate-in slide-in-from-right-2 duration-300">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar gíria ou significado..." 
                className="w-full bg-white dark:bg-gray-800 border-none py-3 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-angola-red text-gray-800 dark:text-white placeholder-gray-400 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Filtros</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
                <Languages size={14} className="text-angola-red" />
                <select 
                  className="bg-transparent text-[10px] font-bold uppercase outline-none"
                  value={targetLanguage}
                  onChange={(e) => {
                    if (!userProfile.isPremium && e.target.value !== 'pt') {
                      openPaywall();
                      return;
                    }
                    setTargetLanguage(e.target.value as any);
                  }}
                >
                  <option value="pt">Português</option>
                  <option value="English">English</option>
                  <option value="French">Français</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
              {CATEGORIES.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => handleCategoryToggle(cat)} 
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategories.includes(cat) ? 'bg-angola-red text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4">
               {filteredSlangs.length > 0 ? (
                 filteredSlangs.map((item, index) => (
                    <SlangCard 
                      key={item.id}
                      index={index} 
                      item={item} 
                      isFavorite={userProfile.favorites.includes(item.id)} 
                      onToggleFavorite={() => toggleFavorite(item.id)} 
                      isPremium={userProfile.isPremium} 
                      onOpenPaywall={openPaywall} 
                      globalLanguage={targetLanguage}
                    />
                 ))
               ) : (
                 <div className="text-center py-20">
                   <p className="text-gray-400 text-lg">Nenhuma gíria encontrada.</p>
                   <button onClick={() => { setSearchQuery(''); setSelectedCategories(['Todas']); }} className="text-angola-red font-bold mt-2">Limpar filtros</button>
                 </div>
               )}
            </div>
          </div>
        );

      case ViewState.TRANSLATOR:
        return (
          <div className="animate-in zoom-in-95 duration-300">
            <TranslatorView isPremium={userProfile.isPremium} onOpenPaywall={openPaywall} />
          </div>
        );

      case ViewState.PROFILE:
        return (
          <div className="p-5 pb-24 animate-in slide-in-from-left-2 duration-300">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-angola-red to-orange-500 flex items-center justify-center border-4 border-white dark:border-gray-800 shadow-xl text-white font-bold text-2xl">
                 {user.name.charAt(0)}
               </div>
               <div>
                 <h2 className="text-2xl font-bold">{user.name}</h2>
                 <p className="text-sm text-gray-500 font-medium">{user.email}</p>
                 <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold rounded uppercase">
                   {userProfile.isPremium ? 'Membro Premium' : 'Membro Básico'}
                 </span>
               </div>
             </div>

             <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg flex items-center gap-2"><Heart size={20} className="text-angola-red" fill="currentColor"/> Gírias Favoritas</h3>
                  <span className="text-xs font-bold bg-red-50 dark:bg-red-900/30 text-angola-red px-2.5 py-1 rounded-full">{favoriteSlangs.length}</span>
                </div>
                {favoriteSlangs.length > 0 ? (
                  <div className="space-y-4">
                    {favoriteSlangs.map(item => (
                      <div key={item.id} className="group flex items-center justify-between">
                        <div onClick={() => {setSelectedCategories(['Todas']); setSearchQuery(item.term); setView(ViewState.DICTIONARY);}} className="flex flex-col flex-1 cursor-pointer">
                          <span className="font-bold text-gray-900 dark:text-white group-hover:text-angola-red transition-colors">{item.term}</span>
                          <span className="text-xs text-gray-500 truncate max-w-[180px]">{item.definition}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <button onClick={() => userProfile.isPremium ? speakSlang(item) : openPaywall()} className={`p-2 rounded-full transition-all active:scale-90 ${userProfile.isPremium ? 'text-angola-red hover:bg-red-50' : 'text-gray-300'}`}>
                             {userProfile.isPremium ? <Volume2 size={16} /> : <Lock size={14} />}
                           </button>
                           <ArrowRight size={14} className="text-gray-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-400 italic mb-4">Nenhum mambo guardado ainda.</p>
                    <Button variant="outline" onClick={() => setView(ViewState.DICTIONARY)}>Explorar Dicionário</Button>
                  </div>
                )}
             </div>

             <div className="space-y-3">
               <button className="w-full text-left p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between items-center transition-colors">
                 <span className="font-medium">Configurações da Conta</span>
                 <ArrowRight size={18} className="text-gray-400"/>
               </button>
               <button onClick={handleLogout} className="w-full text-left p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 flex justify-between items-center transition-colors">
                 <span className="font-bold">Terminar Sessão</span>
                 <LogOut size={18} />
               </button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300 ${active ? 'text-angola-red scale-110' : 'text-gray-400 dark:text-gray-500'}`}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-angola-warm dark:bg-angola-dark text-gray-900 dark:text-white font-sans transition-colors duration-200">
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />
      <main className="max-w-md mx-auto min-h-screen relative bg-white/50 dark:bg-black/20 md:border-x md:border-gray-200 md:dark:border-gray-800">
        {renderContent()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-angola-dark/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 h-22 px-6 pb-6 pt-2 z-40 max-w-md mx-auto md:border-x">
        <div className="flex justify-between items-center h-full">
          <NavItem icon={Search} label="Home" active={view === ViewState.HOME} onClick={() => setView(ViewState.HOME)} />
          <NavItem icon={Book} label="Gírias" active={view === ViewState.DICTIONARY} onClick={() => setView(ViewState.DICTIONARY)} />
          <div className="relative -top-6">
             <button onClick={() => setView(ViewState.TRANSLATOR)} className={`w-15 h-15 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-90 border-4 border-angola-warm dark:border-angola-dark ${view === ViewState.TRANSLATOR ? 'bg-angola-red text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-black'}`}><Sparkles size={28} /></button>
          </div>
          <NavItem icon={Heart} label="Favoritos" active={false} onClick={() => setView(ViewState.PROFILE)} />
          <NavItem icon={User} label="Conta" active={view === ViewState.PROFILE} onClick={() => setView(ViewState.PROFILE)} />
        </div>
      </nav>
      {showPaywall && <PaywallModal onClose={closePaywall} />}
    </div>
  );
};

// Re-using the TranslatorView from before with small adjust
const TranslatorView = ({ isPremium, onOpenPaywall }: { isPremium: boolean, onOpenPaywall: () => void }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'toSlang' | 'toStandard'>('toSlang');

  const handleTranslate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const result = await translateToAngolanSlang(input, mode);
    setOutput(result);
    setLoading(false);
  };

  if (!isPremium) {
    return (
      <div className="p-6 flex flex-col items-center text-center justify-center h-[60vh]">
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full mb-4"><Lock size={40} className="text-angola-yellow" /></div>
        <h2 className="text-2xl font-bold mb-2">Tradutor IA Bloqueado</h2>
        <p className="text-gray-500 mb-6">Traduza frases inteiras para gírias angolanas com nossa IA Premium.</p>
        <Button variant="premium" onClick={onOpenPaywall}>Desbloquear Premium</Button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><Sparkles className="text-angola-yellow" /> Tradutor do Kamba</h2>
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
        <button onClick={() => setMode('toSlang')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'toSlang' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>Português → Gíria</button>
        <button onClick={() => setMode('toStandard')} className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'toStandard' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}>Gíria → Português</button>
      </div>
      <div className="space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === 'toSlang' ? "Escreva algo formal..." : "Cola a dica do kamba..."} className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-angola-red outline-none resize-none h-32" />
        <Button onClick={handleTranslate} disabled={loading} className="w-full">{loading ? 'A processar...' : 'Traduzir Agora'}</Button>
        {output && <div className="bg-angola-warm dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl mt-4 relative"><p className="text-lg font-medium">{output}</p><button onClick={() => navigator.clipboard.writeText(output)} className="absolute top-3 right-3 text-gray-400"><Share2 size={16} /></button></div>}
      </div>
    </div>
  );
};

const PaywallModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400">✕</button>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-tr from-angola-yellow to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"><Crown size={32} className="text-white" /></div>
        <h2 className="text-2xl font-bold mb-2">Gírias Pro</h2>
        <p className="text-gray-500 dark:text-gray-400">Desbloqueie todo o potencial da cultura angolana.</p>
      </div>
      <div className="space-y-3 mb-8">
        {['Tradução ilimitada (EN, FR)', 'Tradutor de frases com IA', 'Contexto cultural profundo', 'Pronúncia por áudio', 'Sem anúncios'].map((feat, i) => (
          <div key={i} className="flex items-center gap-3 text-left">
            <div className="bg-green-100 text-green-600 p-1 rounded-full"><ArrowRight size={12}/></div>
            <span className="text-sm font-medium">{feat}</span>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6 flex justify-between items-center"><span className="font-semibold">Mensal</span><span className="text-xl font-bold text-angola-red">{SUBSCRIPTION_PRICE}</span></div>
      <Button variant="primary" className="w-full" onClick={onClose}>Começar 7 dias grátis</Button>
    </div>
  </div>
);

export default App;