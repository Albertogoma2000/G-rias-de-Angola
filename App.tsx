import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Book, Sparkles, User, Heart, Moon, Sun, 
  Volume2, Share2, Info, ArrowRight, Lock, Crown, Mic
} from 'lucide-react';
import { INITIAL_SLANG_DATA, CATEGORIES, SUBSCRIPTION_PRICE } from './constants';
import { SlangItem, Category, ViewState, UserProfile } from './types';
import { translateToAngolanSlang, getCulturalContext } from './services/geminiService';

// --- Utility Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const baseStyle = "px-4 py-3 rounded-xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-angola-red text-white shadow-lg shadow-red-200 dark:shadow-red-900/20 hover:bg-red-700",
    secondary: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700",
    outline: "border-2 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-angola-red hover:text-angola-red",
    premium: "bg-gradient-to-r from-angola-yellow to-yellow-500 text-black shadow-lg shadow-yellow-200"
  };
  // @ts-ignore
  return <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>{children}</button>;
};

// --- Sub Components ---

interface SlangCardProps {
  item: SlangItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isPremium: boolean;
}

const SlangCard: React.FC<SlangCardProps> = ({ item, isFavorite, onToggleFavorite, isPremium }) => {
  const [context, setContext] = useState<string | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-PT'; // Closest to PT-AO available in most browsers
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const handleDeepDive = async () => {
    if (!isPremium) return; // Logic handled by parent usually, but safeguarding here
    if (context) return;
    setLoadingContext(true);
    const result = await getCulturalContext(item.term);
    setContext(result);
    setLoadingContext(false);
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
        <button onClick={onToggleFavorite} className={`p-2 rounded-full ${isFavorite ? 'text-angola-red bg-red-50 dark:bg-red-900/20' : 'text-gray-400'}`}>
          <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-3 text-lg leading-relaxed">{item.definition}</p>
      
      <div className="bg-angola-warm dark:bg-gray-900/50 p-3 rounded-lg border-l-4 border-angola-yellow mb-4">
        <p className="text-gray-700 dark:text-gray-400 italic text-sm">"{item.example}"</p>
      </div>

      {context && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mb-4 text-sm text-blue-800 dark:text-blue-200 animate-fadeIn">
          <div className="flex gap-2 items-center font-bold mb-1"><Sparkles size={14} /> IA Contexto Cultural:</div>
          {context}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button onClick={() => speak(item.term)} className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-angola-red transition-colors">
          <Volume2 size={16} /> Ouvir
        </button>
        {item.origin && (
           <span className="flex items-center gap-1 text-sm font-medium text-gray-500">
             • {item.origin}
           </span>
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
            {loadingContext ? 'Carregando...' : isPremium ? <><Sparkles size={12}/> Contexto IA</> : <><Lock size={12}/> Contexto IA</>}
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

const TranslatorView = ({ isPremium }: { isPremium: boolean }) => {
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
        <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-full mb-4">
          <Lock size={40} className="text-angola-yellow" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Tradutor IA Bloqueado</h2>
        <p className="text-gray-500 mb-6">Traduza frases inteiras para gírias angolanas ou entenda o que o seu kamba disse com nossa IA.</p>
        <Button variant="premium">Desbloquear Premium</Button>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <Sparkles className="text-angola-yellow" /> Tradutor do Kamba
      </h2>
      
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
        <button 
          onClick={() => setMode('toSlang')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'toSlang' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
        >
          Português → Gíria
        </button>
        <button 
          onClick={() => setMode('toStandard')}
          className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${mode === 'toStandard' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500'}`}
        >
          Gíria → Português
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'toSlang' ? "Escreva algo formal aqui..." : "Cola aqui a dica do teu kamba..."}
            className="w-full p-4 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-angola-red outline-none resize-none h-32"
          />
        </div>
        
        <Button onClick={handleTranslate} disabled={loading} className="w-full">
          {loading ? 'A processar...' : 'Traduzir Agora'}
        </Button>

        {output && (
          <div className="bg-angola-warm dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl mt-4 relative">
             <p className="text-lg font-medium">{output}</p>
             <button 
               onClick={() => {navigator.clipboard.writeText(output)}}
               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
             >
               <Share2 size={16} />
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

const PaywallModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
      
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-tr from-angola-yellow to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-200 dark:shadow-none">
          <Crown size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Gírias Pro</h2>
        <p className="text-gray-500 dark:text-gray-400">Desbloqueie todo o potencial da cultura angolana.</p>
      </div>

      <div className="space-y-3 mb-8">
        {[
          'Tradutor de frases com IA ilimitado',
          'Contexto cultural profundo para cada gíria',
          'Sem anúncios',
          'Acesso vitalício às atualizações'
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-3 text-left">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 p-1 rounded-full"><ArrowRight size={12}/></div>
            <span className="text-sm font-medium">{feat}</span>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6 flex justify-between items-center border border-gray-100 dark:border-gray-700">
        <span className="font-semibold">Mensal</span>
        <span className="text-xl font-bold text-angola-red">{SUBSCRIPTION_PRICE}</span>
      </div>

      <Button variant="primary" className="w-full" onClick={onClose}>
        Começar 7 dias grátis
      </Button>
      <p className="text-center text-xs text-gray-400 mt-4">Cancelamento fácil a qualquer momento.</p>
    </div>
  </div>
);

// --- Main Component ---

const App = () => {
  // State
  const [darkMode, setDarkMode] = useState(false);
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [slangList, setSlangList] = useState<SlangItem[]>(INITIAL_SLANG_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todas');
  const [userProfile, setUserProfile] = useState<UserProfile>({
    isPremium: false,
    trialStartDate: new Date().toISOString(),
    favorites: []
  });
  const [showPaywall, setShowPaywall] = useState(false);

  // Derived State
  const dailySlang = useMemo(() => {
    // Determine slang of the day based on day of year to stay consistent for 24h
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return slangList[dayOfYear % slangList.length];
  }, [slangList]);

  const filteredSlangs = useMemo(() => {
    return slangList.filter(item => {
      const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [slangList, searchQuery, selectedCategory]);

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

  const openPaywall = () => setShowPaywall(true);
  const closePaywall = () => {
    setShowPaywall(false);
    // Simulate upgrading for demo purposes if clicked "Start"
    if (!userProfile.isPremium) {
       // In a real app, this would be a callback from payment provider
       setUserProfile(prev => ({ ...prev, isPremium: true }));
    }
  };

  // Render Views
  const renderContent = () => {
    switch(view) {
      case ViewState.HOME:
        return (
          <div className="p-5 pb-24">
            {/* Hero / Daily Slang */}
            <div className="mb-8">
              <h2 className="text-sm font-bold text-angola-red uppercase tracking-wider mb-2 flex items-center gap-2">
                <Sun size={16} /> Gíria do dia
              </h2>
              <div className="transform scale-100 hover:scale-[1.01] transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-angola-red to-orange-500 rounded-3xl blur-md opacity-20"></div>
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 shadow-xl">
                  <div className="flex justify-between items-start">
                    <h1 className="text-4xl font-extrabold mb-1 text-angola-yellow">{dailySlang.term}</h1>
                    <span className="bg-white/10 px-2 py-1 rounded text-xs backdrop-blur-sm">{dailySlang.category}</span>
                  </div>
                  <p className="text-gray-300 text-lg mb-4 font-light">{dailySlang.definition}</p>
                  <p className="text-gray-400 italic text-sm mb-4">"{dailySlang.example}"</p>
                  <div className="flex gap-3">
                     <button onClick={() => toggleFavorite(dailySlang.id)} className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                       <Heart size={16} fill={userProfile.favorites.includes(dailySlang.id) ? "currentColor" : "none"} className={userProfile.favorites.includes(dailySlang.id) ? "text-red-500" : ""} /> Favoritar
                     </button>
                     <button className="flex-1 bg-angola-red hover:bg-red-600 text-white py-2 rounded-xl text-sm font-semibold transition-colors">
                       Partilhar
                     </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Categories */}
            <h2 className="font-bold text-xl mb-4 text-gray-800 dark:text-white">Explorar</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Rua', 'Juventude', 'Música', 'Humor'].map(cat => (
                <div 
                  key={cat} 
                  onClick={() => { setSelectedCategory(cat as Category); setView(ViewState.DICTIONARY); }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-angola-red transition-colors cursor-pointer"
                >
                  <h3 className="font-bold text-lg">{cat}</h3>
                  <p className="text-xs text-gray-500">Ver gírias</p>
                </div>
              ))}
            </div>

            {/* Premium Banner */}
            {!userProfile.isPremium && (
              <div onClick={openPaywall} className="mt-8 bg-gradient-to-r from-angola-yellow to-orange-400 rounded-2xl p-5 flex items-center justify-between cursor-pointer shadow-lg shadow-orange-200 dark:shadow-none">
                <div className="text-black">
                   <h3 className="font-bold text-lg">Seja Premium</h3>
                   <p className="text-xs opacity-80">IA ilimitada, sem anúncios.</p>
                </div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                   <ArrowRight className="text-black" />
                </div>
              </div>
            )}
          </div>
        );
      
      case ViewState.DICTIONARY:
        return (
          <div className="p-5 pb-24 h-full flex flex-col">
            {/* Search Header */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar gíria..." 
                className="w-full bg-white dark:bg-gray-800 border-none py-3 pl-12 pr-4 rounded-2xl shadow-sm focus:ring-2 focus:ring-angola-red text-gray-800 dark:text-white placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                    ${selectedCategory === cat 
                      ? 'bg-black dark:bg-white text-white dark:text-black' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-4">
               {filteredSlangs.length > 0 ? (
                 filteredSlangs.map(item => (
                   <SlangCard 
                    key={item.id} 
                    item={item} 
                    isFavorite={userProfile.favorites.includes(item.id)}
                    onToggleFavorite={() => toggleFavorite(item.id)}
                    isPremium={userProfile.isPremium}
                   />
                 ))
               ) : (
                 <div className="text-center py-10 text-gray-400">
                   <Info size={40} className="mx-auto mb-3 opacity-50" />
                   <p>Nenhuma gíria encontrada.</p>
                 </div>
               )}
            </div>
          </div>
        );

      case ViewState.TRANSLATOR:
        return <TranslatorView isPremium={userProfile.isPremium} />;

      case ViewState.PROFILE:
        return (
          <div className="p-5 pb-24">
             <div className="flex items-center gap-4 mb-8">
               <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                 <User size={32} className="text-gray-400" />
               </div>
               <div>
                 <h2 className="text-xl font-bold">Utilizador</h2>
                 <p className="text-sm text-gray-500">{userProfile.isPremium ? 'Membro Premium' : 'Membro Gratuito'}</p>
               </div>
             </div>

             <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Heart size={18} className="text-angola-red" fill="currentColor"/> Favoritos
                  </h3>
                  <span className="text-sm text-gray-400">{favoriteSlangs.length} gírias</span>
                </div>
                {favoriteSlangs.length > 0 ? (
                  <div className="space-y-3">
                    {favoriteSlangs.slice(0, 3).map(item => (
                      <div key={item.id} className="text-sm border-b dark:border-gray-700 pb-2 last:border-0">
                        <span className="font-bold">{item.term}</span> - <span className="text-gray-500">{item.definition.substring(0, 30)}...</span>
                      </div>
                    ))}
                    {favoriteSlangs.length > 3 && <div className="text-center text-xs text-gray-400 mt-2">Ver todos...</div>}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 italic">Ainda não favoritaste nada.</p>
                )}
             </div>

             {!userProfile.isPremium && (
               <Button onClick={openPaywall} variant="premium" className="w-full mb-4">
                 Assinar Premium ({SUBSCRIPTION_PRICE}/mês)
               </Button>
             )}

             <div className="space-y-2">
               <button className="w-full text-left p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 flex justify-between">
                 <span>Configurações</span>
                 <ArrowRight size={16} className="text-gray-400"/>
               </button>
               <button className="w-full text-left p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 flex justify-between">
                 <span>Sobre o App</span>
                 <ArrowRight size={16} className="text-gray-400"/>
               </button>
             </div>
          </div>
        );
    }
  };

  // Nav Item Helper
  const NavItem = ({ icon: Icon, label, active, onClick }: any) => (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 w-full h-full transition-colors ${active ? 'text-angola-red' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
    >
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-angola-warm dark:bg-angola-dark text-gray-900 dark:text-white font-sans transition-colors duration-200">
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <main className="max-w-md mx-auto min-h-screen relative bg-white/50 dark:bg-black/20 md:border-x md:border-gray-200 md:dark:border-gray-800">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-angola-dark/95 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 h-20 px-6 pb-2 z-40 max-w-md mx-auto md:border-x">
        <div className="flex justify-between items-center h-full">
          <NavItem 
            icon={Search} 
            label="Início" 
            active={view === ViewState.HOME} 
            onClick={() => setView(ViewState.HOME)} 
          />
          <NavItem 
            icon={Book} 
            label="Dicionário" 
            active={view === ViewState.DICTIONARY} 
            onClick={() => setView(ViewState.DICTIONARY)} 
          />
          <div className="relative -top-5">
             <button 
               onClick={() => setView(ViewState.TRANSLATOR)}
               className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 border-4 border-angola-warm dark:border-angola-dark ${view === ViewState.TRANSLATOR ? 'bg-angola-red text-white' : 'bg-gray-900 dark:bg-white text-white dark:text-black'}`}
             >
               <Sparkles size={24} />
             </button>
          </div>
          <NavItem 
            icon={Heart} 
            label="Favoritos" 
            active={view === ViewState.PROFILE && false} // Just linking Profile for simplicity in nav 4 items
            onClick={() => {
              setView(ViewState.PROFILE);
            }} 
          />
          <NavItem 
            icon={User} 
            label="Perfil" 
            active={view === ViewState.PROFILE} 
            onClick={() => setView(ViewState.PROFILE)} 
          />
        </div>
      </nav>

      {showPaywall && <PaywallModal onClose={closePaywall} />}
    </div>
  );
};

export default App;