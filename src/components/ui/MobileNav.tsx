import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Search,
  Heart,
  ShoppingBag,
  User,
  ChevronRight,
  ChevronDown,
  Gem,
  Shirt,
  Shoe,
  Sparkles,
  Dumbbell,
  Watch
} from 'lucide-react';

const categories = [
  {
    id: 'mode',
    name: 'Mode',
    icon: Shirt,
    subcategories: [
      { name: 'Femmes', items: ['Robes', 'Tops', 'Pantalons', 'Jupes'] },
      { name: 'Hommes', items: ['T-shirts', 'Chemises', 'Pantalons', 'Vestes'] }
    ]
  },
  {
    id: 'chaussures',
    name: 'Chaussures',
    icon: Shoe,
    subcategories: [
      { name: 'Femmes', items: ['Sneakers', 'Talons', 'Bottes', 'Sandales'] },
      { name: 'Hommes', items: ['Sneakers', 'Ville', 'Bottes', 'Sport'] }
    ]
  },
  {
    id: 'bijoux',
    name: 'Bijoux',
    icon: Gem,
    subcategories: [
      { name: 'Catégories', items: ['Colliers', 'Bagues', 'Bracelets', 'Boucles d\'oreilles'] },
      { name: 'Collections', items: ['Or', 'Argent', 'Fantaisie', 'Pierres précieuses'] }
    ]
  },
  {
    id: 'beaute',
    name: 'Beauté',
    icon: Sparkles,
    subcategories: [
      { name: 'Maquillage', items: ['Teint', 'Yeux', 'Lèvres', 'Ongles'] },
      { name: 'Soins', items: ['Visage', 'Corps', 'Cheveux', 'Bio'] }
    ]
  }
];

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'tween',
        duration: 0.3
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-50">
        <div className="grid grid-cols-5 gap-1">
          <Link to="/" className="flex flex-col items-center py-2 text-gray-600 hover:text-[#ed7e0f]">
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1">Accueil</span>
          </Link>
          <button onClick={() => setShowSearch(true)} className="flex flex-col items-center py-2 text-gray-600 hover:text-[#ed7e0f]">
            <Search className="w-6 h-6" />
            <span className="text-xs mt-1">Recherche</span>
          </button>
          <button onClick={() => setIsOpen(true)} className="flex flex-col items-center py-2 text-gray-600 hover:text-[#ed7e0f]">
            <Menu className="w-6 h-6" />
            <span className="text-xs mt-1">Menu</span>
          </button>
          <Link to="/wishlist" className="flex flex-col items-center py-2 text-gray-600 hover:text-[#ed7e0f]">
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">Favoris</span>
          </Link>
          <Link to="/account" className="flex flex-col items-center py-2 text-gray-600 hover:text-[#ed7e0f]">
            <User className="w-6 h-6" />
            <span className="text-xs mt-1">Compte</span>
          </Link>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            className="fixed inset-0 bg-white z-50 lg:hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Rechercher</h2>
                <button onClick={() => setShowSearch(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Que recherchez-vous ?"
                  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Content */}
              <div className="h-full overflow-y-auto pb-20">
                {activeCategory === null ? (
                  // Main Categories
                  <div className="py-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className="flex items-center justify-between w-full p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <category.icon className="w-5 h-5 text-gray-600" />
                          <span>{category.name}</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </button>
                    ))}
                  </div>
                ) : activeSubcategory === null ? (
                  // Subcategories
                  <div>
                    <button
                      onClick={() => setActiveCategory(null)}
                      className="flex items-center gap-2 p-4 text-[#ed7e0f]"
                    >
                      <ChevronDown className="w-5 h-5 rotate-90" />
                      <span>Retour</span>
                    </button>
                    <div className="py-2">
                      {categories
                        .find(c => c.id === activeCategory)
                        ?.subcategories.map((subcategory, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveSubcategory(subcategory.name)}
                            className="flex items-center justify-between w-full p-4 hover:bg-gray-50"
                          >
                            <span>{subcategory.name}</span>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </button>
                        ))}
                    </div>
                  </div>
                ) : (
                  // Items
                  <div>
                    <button
                      onClick={() => setActiveSubcategory(null)}
                      className="flex items-center gap-2 p-4 text-[#ed7e0f]"
                    >
                      <ChevronDown className="w-5 h-5 rotate-90" />
                      <span>Retour</span>
                    </button>
                    <div className="py-2">
                      {categories
                        .find(c => c.id === activeCategory)
                        ?.subcategories
                        .find(s => s.name === activeSubcategory)
                        ?.items.map((item, index) => (
                          <Link
                            key={index}
                            to={`/category/${activeCategory}/${item.toLowerCase()}`}
                            className="flex items-center w-full p-4 hover:bg-gray-50"
                            onClick={() => setIsOpen(false)}
                          >
                            {item}
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
