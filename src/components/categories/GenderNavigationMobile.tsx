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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`hidden max-sm:flex sticky top-[0px] top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-md    shadow-md' 
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="w-full flex items-center justify-between px-4 py-3 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <AsyncLink
            key={tab.id}
            to={`/home?g=${tab.id}`}
            className={`relative flex-shrink-0 px-6 py-2 rounded-full transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-[#ed7e0f]/10' 
                : 'hover:bg-orange-50'
            }`}
            
          >
            <motion.span
              layout
              className={`text-sm font-semibold transition-colors ${
                activeTab === tab.id 
                  ? 'text-[#ed7e0f]' 
                  : 'text-gray-700'
              }`}
            >
              {tab.label}
            </motion.span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ed7e0f]"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </AsyncLink>
        ))}
      </div>
      
      {/* Indicateur de défilement subtil */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: isScrolled ? 1 : 0,
          opacity: isScrolled ? 1 : 0
        }}
        className="h-[1px] bg-gradient-to-r from-transparent via-[#ed7e0f]/30 to-transparent"
      />
    </motion.div>
  );
};

export default GenderNavigationMobile;