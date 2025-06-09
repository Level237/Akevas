import { useState, useEffect } from 'react';
import AsyncLink from '../ui/AsyncLink';
import { motion } from 'framer-motion';

const GenderNavigationMobile = () => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);

  // Détecter le scroll et la position actuelle
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Déterminer l'onglet actif basé sur l'URL
    const params = new URLSearchParams(window.location.search);
    const gender = params.get('g');
    setActiveTab(gender || '');

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const tabs = [
    { id: 'homme', label: 'HOMME' },
    { id: 'femme', label: 'FEMME' },
    { id: 'enfant', label: 'ENFANT' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`hidden max-sm:h-12 max-sm:flex sticky top-20 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 shadow-lg backdrop-blur-xl' 
          : 'bg-white/60 backdrop-blur-xl'
      }`}
    >
      <div className={`w-full flex items-center justify-center gap-2 px-4 transition-all duration-500 ${
        isScrolled ? 'py-3' : 'py-4'
      } overflow-x-auto no-scrollbar`}>
        {tabs.map((tab) => (
          <AsyncLink
            key={tab.id}
            to={`/home?g=${tab.id}`}
            className={`relative flex items-center justify-center transition-all duration-300 ${
              isScrolled ? 'w-[105px] h-[36px]' : 'w-[110px] h-[40px]'
            } ${
              activeTab === tab.id 
                ? `${isScrolled 
                    ? 'bg-gradient-to-br from-[#ed7e0f] via-[#ff9f40] to-[#ed7e0f] text-white shadow-lg shadow-orange-200/30' 
                    : 'bg-black/5 border border-orange-200'
                  }` 
                : 'hover:bg-black/5 border border-transparent'
            } rounded-xl`}
          >
            <motion.div
              layout
              className="relative flex items-center justify-center w-full h-full"
            >
              <motion.span
                layout
                className={`font-bold tracking-wide transition-all duration-300 ${
                  isScrolled ? 'text-xs' : 'text-sm'
                } ${
                  activeTab === tab.id 
                    ? isScrolled ? 'text-white' : 'text-[#ed7e0f]'
                    : 'text-gray-700'
                }`}
              >
                {tab.label}
              </motion.span>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeGlow"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ed7e0f]/20 to-transparent blur-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.div>
          </AsyncLink>
        ))}
      </div>
      
      {/* Séparateur élégant */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: isScrolled ? 1 : 0,
          opacity: isScrolled ? 1 : 0
        }}
        transition={{ duration: 0.6 }}
        className="h-[1px] bg-gradient-to-r from-transparent via-[#ed7e0f]/20 to-transparent"
      />
    </motion.div>
  );
};

export default GenderNavigationMobile;