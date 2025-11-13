import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
} from 'framer-motion';
import {
  ArrowLeft,
  Copy,
  Moon,
  Palette,
  PartyPopper,
  Search,
  Sparkles,
  Sun,
  X,
} from 'lucide-react';
import ColorGrid from './components/ColorGrid';
import {
  buildColorUniverse,
  mainColors,
  shiftHexColor,
} from './utils/colorUtils';
import uiPacks from './utils/uiPacks';

const TOAST_DURATION = 2000;

const getFamilyGradient = (hex) => {
  const highlight = shiftHexColor(hex, { l: 12, s: -8 });
  const depth = shiftHexColor(hex, { l: -16, s: 6 });
  return `linear-gradient(135deg, ${highlight}, ${depth})`;
};

const normalize = (value) => value.trim().toLowerCase();

const getReadableTextColor = (hex) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.65 ? '#0F172A' : '#FFFFFF';
};

function App() {
  const familiesPerBatch = 12;
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedPack, setSelectedPack] = useState(null);
  const [showUIPacks, setShowUIPacks] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);
  const [surprise, setSurprise] = useState(null);
  const [familyLimit, setFamilyLimit] = useState(familiesPerBatch);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('color-universe-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toastTimeoutRef = useRef(null);
  const sentinelRef = useRef(null);
  const topRef = useRef(null);

  const colorUniverse = useMemo(() => buildColorUniverse(280), []);
  const allShades = useMemo(
    () =>
      mainColors.flatMap((family) =>
        colorUniverse[family.name].map((shade) => ({
          ...shade,
          family: family.name,
        })),
      ),
    [colorUniverse],
  );

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('color-universe-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(
    () => () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    },
    [],
  );

  const getCurrentView = useCallback(() => {
    if (selectedPack) return 'pack-detail';
    if (selectedFamily) return 'family-detail';
    if (showUIPacks) return 'packs-list';
    return 'main';
  }, [selectedPack, selectedFamily, showUIPacks]);

  const handleSelectFamily = useCallback((familyName) => {
    const currentView = getCurrentView();
    setNavigationHistory((prev) => [...prev, currentView]);
    window.history.pushState({ page: 'family', name: familyName }, '', window.location.pathname);
    setSelectedFamily(familyName);
    setSelectedPack(null);
    setShowUIPacks(false);
    setSearchTerm('');
  }, [getCurrentView]);

  const handleBack = useCallback(() => {
    if (navigationHistory.length > 0) {
      const previousView = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory((prev) => prev.slice(0, -1));
      
      // Update browser history
      if (previousView === 'main') {
        window.history.pushState({ page: 'main' }, '', window.location.pathname);
      } else if (previousView === 'packs-list') {
        window.history.pushState({ page: 'packs' }, '', window.location.pathname);
      }
      
      if (previousView === 'pack-detail') {
        setSelectedPack(null);
        setShowUIPacks(true);
        setSelectedFamily(null);
      } else if (previousView === 'family-detail') {
        setSelectedFamily(null);
        setSelectedPack(null);
        setShowUIPacks(false);
      } else if (previousView === 'packs-list') {
        setShowUIPacks(true);
        setSelectedPack(null);
        setSelectedFamily(null);
      } else {
        setSelectedFamily(null);
        setSelectedPack(null);
        setShowUIPacks(false);
      }
      setSearchTerm('');
    } else {
      // Fallback to main if no history
      window.history.pushState({ page: 'main' }, '', window.location.pathname);
      setSelectedFamily(null);
      setSelectedPack(null);
      setShowUIPacks(false);
      setSearchTerm('');
    }
  }, [navigationHistory]);

  const handleSelectPack = useCallback((packName) => {
    const currentView = getCurrentView();
    setNavigationHistory((prev) => [...prev, currentView]);
    window.history.pushState({ page: 'pack', name: packName }, '', window.location.pathname);
    setSelectedPack(packName);
    setShowUIPacks(false);
    setSelectedFamily(null);
    setSearchTerm('');
  }, [getCurrentView]);

  const handleOpenUIPacks = useCallback(() => {
    const currentView = getCurrentView();
    if (currentView !== 'main') {
      setNavigationHistory((prev) => [...prev, currentView]);
    }
    window.history.pushState({ page: 'packs' }, '', window.location.pathname);
    setShowUIPacks(true);
    setSelectedFamily(null);
    setSelectedPack(null);
    setSearchTerm('');
  }, [getCurrentView]);

  const handleGoToMain = useCallback(() => {
    setNavigationHistory([]);
    window.history.pushState({ page: 'main' }, '', window.location.pathname);
    setShowUIPacks(false);
    setSelectedFamily(null);
    setSelectedPack(null);
    setSearchTerm('');
  }, []);

  const showToast = useCallback((hex) => {
    setToast(hex);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, TOAST_DURATION);
  }, []);

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      return successful;
    }
  }, []);

  const handleShadeCopy = useCallback(
    async (shade) => {
      const hex = shade.hex.toUpperCase();
      const success = await copyToClipboard(hex);
      if (success) {
        showToast(hex);
      }
    },
    [copyToClipboard, showToast],
  );

  const handleCopyAllColors = useCallback(
    async (pack) => {
      const colorList = [
        `Primary: ${pack.primary.toUpperCase()}`,
        `Secondary: ${pack.secondary.toUpperCase()}`,
        `Accent: ${pack.accent.toUpperCase()}`,
        `Neutral: ${pack.neutral.toUpperCase()}`,
        `Success: ${pack.success.toUpperCase()}`,
        `Warning: ${pack.warning.toUpperCase()}`,
        `Error: ${pack.error.toUpperCase()}`,
        `Info: ${pack.info.toUpperCase()}`,
      ].join('\n');
      const success = await copyToClipboard(colorList);
      if (success) {
        showToast('All Colors');
      }
    },
    [copyToClipboard, showToast],
  );

  const handleSurprise = useCallback(() => {
    if (showUIPacks || selectedPack) {
      // Surprise from UI packs - show a random UI pack
      if (uiPacks.length === 0) return;
      const randomPack = uiPacks[Math.floor(Math.random() * uiPacks.length)];
      setSurprise({
        type: 'ui-pack',
        pack: randomPack,
        name: randomPack.name,
        description: randomPack.description,
        primary: randomPack.primary,
        secondary: randomPack.secondary,
        accent: randomPack.accent,
      });
    } else {
      // Surprise from color families - show a random color
      if (!allShades.length) return;
      const randomShade = allShades[Math.floor(Math.random() * allShades.length)];
      setSurprise({
        ...randomShade,
        type: 'color',
      });
    }
  }, [allShades, showUIPacks, selectedPack]);

  const closeSurprise = useCallback(() => {
    setSurprise(null);
  }, []);

  const normalizedQuery = normalize(searchTerm);

  // Close Surprise on ESC
  useEffect(() => {
    if (!surprise) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setSurprise(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [surprise]);

  useEffect(() => {
    if (!topRef.current) return;
    topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [selectedFamily, selectedPack, showUIPacks]);

  // Handle browser back/forward navigation (mobile swipe back)
  useEffect(() => {
    const handlePopState = (event) => {
      // Prevent default browser back behavior
      event.preventDefault?.();
      
      // Use our navigation history to properly handle back navigation
      if (navigationHistory.length > 0) {
        handleBack();
      } else if (selectedFamily || selectedPack || showUIPacks) {
        // If we're in a sub-view but no history, go to main
        handleGoToMain();
      }
    };

    // Set up initial state
    if (typeof window !== 'undefined') {
      window.history.replaceState({ page: 'main', timestamp: Date.now() }, '', window.location.pathname);
    }

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigationHistory, selectedFamily, selectedPack, showUIPacks, handleBack, handleGoToMain]);

  useEffect(() => {
    if (selectedFamily) {
      return;
    }
    setFamilyLimit(familiesPerBatch);
  }, [normalizedQuery, selectedFamily, familiesPerBatch]);


  const filteredFamilies = useMemo(() => {
    if (!normalizedQuery) {
      return mainColors;
    }
    return mainColors.filter(
      (family) =>
        family.name.toLowerCase().includes(normalizedQuery) ||
        family.shades.some((shade) =>
          shade.toLowerCase().includes(normalizedQuery),
        ),
    );
  }, [normalizedQuery]);

  const filteredPacks = useMemo(() => {
    if (!normalizedQuery) {
      return uiPacks;
    }
    return uiPacks.filter(
      (pack) =>
        pack.name.toLowerCase().includes(normalizedQuery) ||
        pack.description.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery]);

  // Pre-calculate text colors for all packs for instant rendering
  const packsWithTextColors = useMemo(() => {
    return filteredPacks.map((pack) => {
      const primaryLuminance = (() => {
        const hex = pack.primary.replace('#', '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      })();
      const secondaryLuminance = (() => {
        const hex = pack.secondary.replace('#', '');
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      })();
      const avgLuminance = (primaryLuminance + secondaryLuminance) / 2;
      const isLightPack = avgLuminance > 0.6;
      return {
        ...pack,
        textColor: isLightPack ? '#1F2937' : '#FFFFFF',
        secondaryTextColor: isLightPack ? 'text-slate-700 dark:text-slate-800' : 'text-white/80',
      };
    });
  }, [filteredPacks]);

  const totalFamilyCount = filteredFamilies.length;

  const handleLoadMoreFamilies = useCallback(() => {
    if (selectedFamily) return;
    setFamilyLimit((prev) =>
      Math.min(prev + familiesPerBatch, totalFamilyCount),
    );
  }, [familiesPerBatch, selectedFamily, totalFamilyCount]);


  useEffect(() => {
    if (selectedFamily) {
      return undefined;
    }
    if (familyLimit >= totalFamilyCount) {
      return undefined;
    }

    const sentinel = sentinelRef.current;
    if (!sentinel) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleLoadMoreFamilies();
          }
        });
      },
      { rootMargin: '400px 0px 400px 0px', threshold: 0 },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [familyLimit, handleLoadMoreFamilies, selectedFamily, totalFamilyCount]);


  const activeShades = selectedFamily
    ? colorUniverse[selectedFamily] ?? []
    : [];

  const filteredShades = useMemo(() => {
    if (!normalizedQuery || !selectedFamily) {
      return activeShades;
    }
    return activeShades.filter((shade) =>
      shade.name.toLowerCase().includes(normalizedQuery),
    );
  }, [activeShades, normalizedQuery, selectedFamily]);

  const displayedFamilies = useMemo(
    () =>
      filteredFamilies.slice(0, Math.min(familyLimit, filteredFamilies.length)),
    [filteredFamilies, familyLimit],
  );

  const displayedPacks = useMemo(
    () => packsWithTextColors,
    [packsWithTextColors],
  );

  const currentPack = selectedPack ? uiPacks.find((p) => p.name === selectedPack) : null;

  return (
    <div className="min-h-screen bg-[#f4f4f4] px-4 pb-12 pt-8 text-slate-900 transition-all duration-500 ease-out sm:px-6 sm:pt-10 lg:px-12 lg:pt-12 dark:bg-slate-950 dark:text-slate-100">
      <main ref={topRef} className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 transition-all duration-500 ease-out">
        <header className="space-y-3 text-left">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 transition-all duration-300 sm:text-5xl dark:text-slate-50">
            Color Universe 🌈
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-slate-600 transition-colors duration-300 dark:text-slate-400">
            Glide through immersive color families and discover thousands of meticulously crafted shades. Tap any hue to copy its HEX instantly.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-center gap-2">
              <motion.button
                type="button"
                onClick={handleSurprise}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-slate-900 to-slate-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-slate-800 hover:to-slate-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f4] dark:from-sky-500 dark:to-cyan-400 dark:text-slate-900 dark:hover:from-sky-400 dark:hover:to-cyan-300 dark:focus-visible:ring-sky-200 dark:focus-visible:ring-offset-slate-950"
              >
                <PartyPopper size={18} />
                <span>🎲 Surprise Me!</span>
              </motion.button>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-soft transition-all duration-200 hover:border-slate-300 hover:text-slate-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f4] dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-50 dark:focus-visible:ring-slate-500 dark:focus-visible:ring-offset-slate-950"
              >
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
                <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
              </button>
            </div>
            <div className="flex w-full items-center gap-2">
              {showUIPacks || selectedPack ? (
                <motion.button
                  type="button"
                  onClick={handleGoToMain}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-green-600 to-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-green-500 hover:to-emerald-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f4] dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-400 dark:hover:to-emerald-400 dark:focus-visible:ring-green-200 dark:focus-visible:ring-offset-slate-950"
                >
                  <Palette size={18} />
                  <span>Color Family</span>
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleOpenUIPacks}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-purple-500 hover:to-pink-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f4] dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-400 dark:hover:to-pink-400 dark:focus-visible:ring-purple-200 dark:focus-visible:ring-offset-slate-950"
                >
                  <Palette size={18} />
                  <span>UI Packs</span>
                </motion.button>
              )}
              {(selectedFamily || selectedPack) && (
                <motion.button
                  type="button"
                  onClick={handleBack}
                  whileHover={{ x: -4 }}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-soft transition-all duration-200 hover:text-slate-900 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f4] dark:border dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:text-slate-50 dark:focus-visible:ring-slate-500 dark:focus-visible:ring-offset-slate-950"
                >
                  <ArrowLeft size={18} />
                  <span className="hidden sm:inline">Back</span>
                </motion.button>
              )}
            </div>
            <div className="relative w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={
                  selectedPack
                    ? 'Search color combinations...'
                    : selectedFamily
                      ? 'Search shades by name...'
                      : showUIPacks
                        ? 'Search UI packs...'
                        : 'Search color families...'
                }
                className="w-full rounded-full border border-transparent bg-white px-12 py-3 text-sm font-medium text-slate-600 shadow-soft outline-none transition-all duration-200 focus:border-slate-300 focus:bg-white focus:text-slate-800 focus:shadow-glow dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-slate-500 dark:focus:bg-slate-900 dark:focus:text-slate-100 dark:focus:shadow-glow"
              />
            </div>
          </div>
        </div>

        <LayoutGroup>
          <AnimatePresence mode="wait">
            {selectedPack && currentPack ? (
              <motion.div
                key="pack-detail-view"
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-6"
              >
                <motion.section
                  layout
                  className="w-full rounded-3xl bg-white/80 p-8 shadow-lg backdrop-blur-lg transition-all duration-300 dark:bg-slate-900/80"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-6 space-y-2">
                    <p className="text-sm font-medium uppercase tracking-[0.3rem] text-slate-500 dark:text-slate-400">
                      UI Color Pack
                    </p>
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">{currentPack.name}</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{currentPack.description}</p>
                  </div>

                  <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
                    {[
                      { name: 'Primary', color: currentPack.primary },
                      { name: 'Secondary', color: currentPack.secondary },
                      { name: 'Accent', color: currentPack.accent },
                      { name: 'Neutral', color: currentPack.neutral },
                      { name: 'Success', color: currentPack.success },
                      { name: 'Warning', color: currentPack.warning },
                      { name: 'Error', color: currentPack.error },
                      { name: 'Info', color: currentPack.info },
                    ].map((item) => (
                      <motion.button
                        key={item.name}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleShadeCopy({ hex: item.color, name: item.name })}
                        className="group flex flex-col items-center gap-2 rounded-2xl p-4 shadow-md transition-all duration-200 hover:shadow-lg"
                        style={{ backgroundColor: item.color }}
                      >
                        <div
                          className="h-16 w-full rounded-xl"
                          style={{ backgroundColor: item.color }}
                        />
                        <span
                          className="text-xs font-semibold"
                          style={{ color: getReadableTextColor(item.color) }}
                        >
                          {item.name}
                        </span>
                        <span
                          className="text-xs font-mono opacity-80"
                          style={{ color: getReadableTextColor(item.color) }}
                        >
                          {item.color}
                        </span>
                      </motion.button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">All Color Combinations</h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      <AnimatePresence initial={false}>
                        {currentPack.combinations
                          .filter((combo) =>
                            !normalizedQuery || combo.name.toLowerCase().includes(normalizedQuery) || combo.category.toLowerCase().includes(normalizedQuery),
                          )
                          .map((combo) => (
                            <motion.button
                              key={combo.hex}
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.2 }}
                              onClick={() => handleShadeCopy(combo)}
                              className="group relative flex h-28 flex-col items-center justify-center rounded-2xl text-center font-medium shadow-md transition-all duration-200 hover:shadow-lg"
                              style={{
                                backgroundColor: combo.hex,
                                color: getReadableTextColor(combo.hex),
                              }}
                              title={`Copy ${combo.name} (${combo.hex})`}
                            >
                              <span className="text-sm font-semibold drop-shadow-md">{combo.name}</span>
                              <span className="mt-1 text-xs font-mono opacity-80">{combo.hex}</span>
                              <span className="absolute bottom-1 right-2 text-[10px] font-medium opacity-60">{combo.category}</span>
                            </motion.button>
                          ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.section>
              </motion.div>
            ) : showUIPacks ? (
              <motion.div
                key="packs-view"
                layout
                initial={false}
                className="space-y-6"
              >
                <motion.section
                  layout
                  className="w-full rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 dark:bg-slate-900/80 md:p-8"
                  initial={false}
                >
                  <div className="mb-6 space-y-2">
                    <p className="text-sm font-medium uppercase tracking-[0.3rem] text-slate-500 dark:text-slate-400">
                      UI Packs
                    </p>
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">UI Pack</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Explore curated color palettes designed for modern web development. Each pack includes primary, secondary, accent, and semantic colors ready to use.
                    </p>
                  </div>
                </motion.section>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredPacks.length === 0 ? (
                  <motion.div
                    layout
                    className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white/60 p-10 text-center text-slate-500 shadow-soft dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400"
                  >
                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      No UI packs match your search.
                    </p>
                  </motion.div>
                ) : (
                  displayedPacks.map((pack) => (
                    <motion.button
                      key={pack.name}
                      layout
                      initial={false}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                      onClick={() => handleSelectPack(pack.name)}
                      className="color-button group relative overflow-hidden text-left shadow-soft transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f4] dark:focus-visible:ring-slate-600 dark:focus-visible:ring-offset-slate-950"
                      style={{
                        background: `linear-gradient(135deg, ${pack.primary}, ${pack.secondary})`,
                      }}
                    >
                      <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.8), transparent 60%)' }} />
                      <div className="relative flex h-full flex-col justify-between p-6">
                        <div className="mb-4 flex gap-2">
                          <div className="h-8 w-8 rounded-lg shadow-md" style={{ backgroundColor: pack.primary }} />
                          <div className="h-8 w-8 rounded-lg shadow-md" style={{ backgroundColor: pack.secondary }} />
                          <div className="h-8 w-8 rounded-lg shadow-md" style={{ backgroundColor: pack.accent }} />
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold drop-shadow-lg" style={{ color: pack.textColor }}>{pack.name}</p>
                          <p className={`text-xs ${pack.secondaryTextColor}`}>{pack.description}</p>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
                </div>
              </motion.div>
            ) : selectedFamily ? (
              <motion.div
                key="shades-view"
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-6"
              >
                <ColorGrid
                  familyName={selectedFamily}
                  shades={filteredShades}
                  onCopy={handleShadeCopy}
                />
              </motion.div>
            ) : (
              <motion.div
                key="families-view"
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-6"
              >
                <motion.section
                  layout
                  className="w-full rounded-3xl bg-white/80 p-6 shadow-lg backdrop-blur-lg transition-all duration-300 dark:bg-slate-900/80 md:p-8"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-6 space-y-2">
                    <p className="text-sm font-medium uppercase tracking-[0.3rem] text-slate-500 dark:text-slate-400">
                      Color Families
                    </p>
                    <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-slate-100">Color Family</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Discover thousands of meticulously crafted color shades organized by family. Each family contains hundreds of unique variations.
                    </p>
                  </div>
                </motion.section>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFamilies.length === 0 ? (
                  <motion.div
                    layout
                    className="col-span-full rounded-3xl border border-dashed border-slate-200 bg-white/60 p-10 text-center text-slate-500 shadow-soft dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400"
                  >
                    <p className="text-lg font-semibold text-slate-600 dark:text-slate-300">
                      No color families match your search.
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Try a broader keyword or explore shades directly once you select a family.
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {displayedFamilies.map((family) => {
                      const lightFamilies = new Set([
                        'White',
                        'Frost',
                        'Celadon',
                        'Sandstone',
                        'Blush Pink',
                        'Lilac',
                        'Pearl',
                        'Arctic',
                        'Opal',
                        'Yellow',
                        'Cream',
                        'Beige',
                        'Ivory',
                        'Champagne',
                        'Bisque',
                        'Misty Rose',
                        'Navajo White',
                        'Papaya Whip',
                        'Peach Puff',
                        'Seashell',
                        'White Smoke',
                        'Pale Green',
                        'Pale Turquoise',
                        'Pale Violet Red',
                        'Powder Blue',
                        'Peach',
                        'Lavender',
                        'Mauve',
                        'Periwinkle',
                        'Thistle',
                        'Wisteria',
                        'Honey',
                        'Saffron',
                        'Lime',
                        'Mint',
                        'Apricot',
                        'Sandy Brown',
                        'Tan',
                        'Wheat',
                        'Silver',
                        'Gold',
                        'Champagne',
                        'Bisque',
                        'Apricot',
                        'Papaya Whip',
                        'Peach Puff',
                        'Seashell',
                        'Misty Rose',
                        'Navajo White',
                        'Powder Blue',
                        'Pale Green',
                        'Pale Turquoise',
                        'Pale Violet Red',
                        'Periwinkle',
                        'Thistle',
                        'Wisteria',
                        'Orchid',
                        'Lavender',
                        'Mauve',
                      ]);
                      const isLightFamily = lightFamilies.has(family.name);
                      const accentColor = isLightFamily ? '#1F2937' : '#FFFFFF';
                      const secondaryColor = isLightFamily
                        ? 'text-slate-500 dark:text-slate-400'
                        : 'text-white/70';
                      const buttonTextClass = isLightFamily
                        ? 'text-slate-800 dark:text-slate-900'
                        : 'text-white';

                      return (
                        <motion.button
                          key={family.name}
                          type="button"
                          layout
                          whileHover={{ scale: 1.03, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          onClick={() => handleSelectFamily(family.name)}
                          className={`color-button relative overflow-hidden text-left shadow-soft transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f4f4f4] dark:focus-visible:ring-slate-600 dark:focus-visible:ring-offset-slate-950 ${buttonTextClass}`}
                          style={{
                            background: getFamilyGradient(family.baseHex),
                          }}
                        >
                          <div className="absolute inset-0 opacity-30 mix-blend-overlay" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.8), transparent 60%)' }} />
                          <div className="relative flex h-full flex-col justify-between">
                            <span className={`text-sm font-medium uppercase tracking-[0.4rem] ${secondaryColor}`}>
                              {family.name}
                            </span>
                            <div className="space-y-1">
                              <p className="text-3xl font-semibold" style={{ color: accentColor }}>
                                {family.name}
                              </p>
                              <p className={`text-xs uppercase tracking-widest ${secondaryColor}`}>
                                {family.shades.slice(0, 4).join(' · ')}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </AnimatePresence>
                )}
                </div>
                {!selectedFamily && filteredFamilies.length > 0 && familyLimit < filteredFamilies.length && (
                  <div
                    ref={sentinelRef}
                    className="col-span-full flex items-center justify-center py-8 text-sm text-slate-500 dark:text-slate-400"
                  >
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="flex items-center gap-2 rounded-full bg-white/80 px-5 py-3 shadow-soft backdrop-blur transition-all duration-300 dark:bg-slate-800/80"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      >
                        <Sparkles size={16} />
                      </motion.div>
                      <span className="font-medium">Loading more color families...</span>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </main>

      <footer className="mx-auto mt-16 w-full max-w-6xl rounded-3xl bg-white/75 p-8 shadow-soft backdrop-blur-lg transition-colors duration-300 dark:bg-slate-900/80">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl dark:text-slate-100">Stay in the Spectrum</h2>
            <p className="max-w-xl text-sm text-slate-500 dark:text-slate-400">
              Curated palettes, precise HEX copies, and inspiration that keeps unfolding every time you explore.
            </p>
          </div>
          <div className="flex flex-col items-start text-sm font-medium text-slate-600 sm:items-end dark:text-slate-300">
            <span className="uppercase tracking-[0.35rem] text-slate-400 dark:text-slate-500">Creator</span>
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">RAJ ARYAN</span>
          </div>
      </div>
      </footer>

      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            className="toast fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-slate-100 shadow-glow dark:bg-slate-100 dark:text-slate-900"
          >
            <Copy size={16} />
            <span>
              Copied
              {' '}
              <span className="font-semibold">{toast}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {surprise && (
          <motion.div
            key="surprise"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm"
            onClick={closeSurprise}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 24 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-glow dark:bg-slate-900 dark:text-slate-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeSurprise}
                className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500 transition hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-slate-100 dark:focus-visible:ring-slate-600"
                aria-label="Close"
              >
                <X size={16} />
        </button>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.4rem] text-slate-400 dark:text-slate-500">
                  <Sparkles size={16} />
                  Random Discovery
                </div>
                {surprise.type === 'ui-pack' ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex h-24 w-full items-center justify-center rounded-2xl shadow-soft" style={{ background: `linear-gradient(135deg, ${surprise.primary}, ${surprise.secondary})` }}>
                        <span className="text-2xl font-semibold drop-shadow-md" style={{ color: '#1F2937' }}>
                          {surprise.name}
                        </span>
                      </div>
                      <p className="text-sm text-slate-800 dark:text-slate-200">{surprise.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          type="button"
                          onClick={() => handleShadeCopy({ hex: surprise.primary, name: 'Primary' })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1 rounded-xl p-3 shadow-md transition-all duration-200 hover:shadow-lg" 
                          style={{ backgroundColor: surprise.primary }}
                        >
                          <span className="text-xs font-semibold" style={{ color: '#1F2937' }}>Primary</span>
                          <span className="text-[10px] font-mono" style={{ color: '#1F2937' }}>{surprise.primary}</span>
                          <Copy size={12} style={{ color: '#1F2937', opacity: 0.8 }} />
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleShadeCopy({ hex: surprise.secondary, name: 'Secondary' })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1 rounded-xl p-3 shadow-md transition-all duration-200 hover:shadow-lg" 
                          style={{ backgroundColor: surprise.secondary }}
                        >
                          <span className="text-xs font-semibold" style={{ color: '#1F2937' }}>Secondary</span>
                          <span className="text-[10px] font-mono" style={{ color: '#1F2937' }}>{surprise.secondary}</span>
                          <Copy size={12} style={{ color: '#1F2937', opacity: 0.8 }} />
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleShadeCopy({ hex: surprise.accent, name: 'Accent' })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1 rounded-xl p-3 shadow-md transition-all duration-200 hover:shadow-lg" 
                          style={{ backgroundColor: surprise.accent }}
                        >
                          <span className="text-xs font-semibold" style={{ color: '#1F2937' }}>Accent</span>
                          <span className="text-[10px] font-mono" style={{ color: '#1F2937' }}>{surprise.accent}</span>
                          <Copy size={12} style={{ color: '#1F2937', opacity: 0.8 }} />
                        </motion.button>
                        <div className="flex gap-2">
                          <motion.button
                            type="button"
                            onClick={() => handleShadeCopy({ hex: surprise.pack.info, name: 'Info' })}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 flex flex-col items-center gap-1 rounded-xl p-3 shadow-md transition-all duration-200 hover:shadow-lg" 
                            style={{ backgroundColor: surprise.pack.info }}
                          >
                            <span className="text-xs font-semibold" style={{ color: '#1F2937' }}>Info</span>
                            <span className="text-[10px] font-mono" style={{ color: '#1F2937' }}>{surprise.pack.info}</span>
                            <Copy size={12} style={{ color: '#1F2937', opacity: 0.8 }} />
                          </motion.button>
                          <motion.button
                            type="button"
                            onClick={() => {
                              closeSurprise();
                              handleSelectPack(surprise.pack.name);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex-1 flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-900 p-3 text-white shadow-md transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                          >
                            <span className="text-xs font-semibold">View</span>
                          </motion.button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <motion.button
                          type="button"
                          onClick={() => handleShadeCopy({ hex: surprise.pack.neutral, name: 'Neutral' })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1 rounded-xl p-3 shadow-md transition-all duration-200 hover:shadow-lg" 
                          style={{ backgroundColor: surprise.pack.neutral }}
                        >
                          <span className="text-xs font-semibold" style={{ color: '#1F2937' }}>Neutral</span>
                          <span className="text-[10px] font-mono" style={{ color: '#1F2937' }}>{surprise.pack.neutral}</span>
                          <Copy size={12} style={{ color: '#1F2937', opacity: 0.8 }} />
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleShadeCopy({ hex: surprise.pack.success, name: 'Success' })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1 rounded-xl p-3 shadow-md transition-all duration-200 hover:shadow-lg" 
                          style={{ backgroundColor: surprise.pack.success }}
                        >
                          <span className="text-xs font-semibold" style={{ color: '#1F2937' }}>Success</span>
                          <span className="text-[10px] font-mono" style={{ color: '#1F2937' }}>{surprise.pack.success}</span>
                          <Copy size={12} style={{ color: '#1F2937', opacity: 0.8 }} />
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleShadeCopy({ hex: surprise.pack.warning, name: 'Warning' })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1 rounded-xl p-3 shadow-md transition-all duration-200 hover:shadow-lg" 
                          style={{ backgroundColor: surprise.pack.warning }}
                        >
                          <span className="text-xs font-semibold" style={{ color: '#1F2937' }}>Warning</span>
                          <span className="text-[10px] font-mono" style={{ color: '#1F2937' }}>{surprise.pack.warning}</span>
                          <Copy size={12} style={{ color: '#1F2937', opacity: 0.8 }} />
                        </motion.button>
                        <motion.button
                          type="button"
                          onClick={() => handleShadeCopy({ hex: surprise.pack.error, name: 'Error' })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center gap-1 rounded-xl p-3 shadow-md transition-all duration-200 hover:shadow-lg" 
                          style={{ backgroundColor: surprise.pack.error }}
                        >
                          <span className="text-xs font-semibold" style={{ color: '#1F2937' }}>Error</span>
                          <span className="text-[10px] font-mono" style={{ color: '#1F2937' }}>{surprise.pack.error}</span>
                          <Copy size={12} style={{ color: '#1F2937', opacity: 0.8 }} />
                        </motion.button>
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => handleCopyAllColors(surprise.pack)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 p-3 text-white shadow-md transition-all duration-200 hover:from-purple-500 hover:to-pink-500 hover:shadow-lg w-full"
                      >
                        <Copy size={16} />
                        <span className="text-sm font-semibold">Copy All Colors</span>
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="flex h-36 w-full items-center justify-center rounded-2xl shadow-soft"
                      style={{
                        background: surprise.hex,
                        color: getReadableTextColor(surprise.hex),
                      }}
                    >
                      <span className="text-2xl font-semibold drop-shadow-md">
                        {surprise.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.35rem] text-slate-400 dark:text-slate-500">
                          Hex Code
                        </p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {surprise.hex}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          From the
                          {' '}
                          <span className="font-semibold">{surprise.family}</span>
                          {' '}
                          family
        </p>
      </div>
                      <motion.button
                        type="button"
                        onClick={() => handleShadeCopy(surprise)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-900"
                      >
                        <Copy size={16} />
                        Copy HEX
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
