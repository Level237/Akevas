import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu as MenuIcon } from 'lucide-react';
import AsyncLink from './AsyncLink';

const menuSections = [
  {
    title: 'Toutes les catégories',
    links: [
      { label: 'Vêtements', to: '/categories/vetements' },
      { label: 'Chaussures', to: '/categories/chaussures' },
      { label: 'Accessoires', to: '/categories/accessoires' },
    ],
  },
  {
    title: 'Boutiques',
    links: [
      { label: 'Toutes les boutiques', to: '/shops' },
      { label: 'Boutiques populaires', to: '/shops?filter=popular' },
    ],
  },
  {
    title: 'Produits',
    links: [
      { label: 'Nouveautés', to: '/products?sort=new' },
      { label: 'Meilleures ventes', to: '/products?sort=best' },
      { label: 'Promotions', to: '/products?filter=promo' },
    ],
  },
];

const dropdownVariants = {
  hidden: { opacity: 0, y: -10, pointerEvents: 'none' as const },
  visible: { opacity: 1, y: 0, pointerEvents: 'auto' as const, transition: { duration: 0.18 } },
};

const MegaMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fermer le menu si on clique en dehors
  React.useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className={
          `flex items-center gap-2 px-3 py-2 rounded-full bg-white  hover:bg-[#f7f7f7] hover:shadow-lg transition-all duration-150 focus:outline-none active:scale-95`
        }
        aria-haspopup="true"
        aria-expanded={open}
        type="button"
        style={{ boxShadow: open ? '0 4px 16px rgba(0,0,0,0.10)' : undefined }}
      >
        
        <MenuIcon className="w-6 h-6 text-[#ed7e0f]" />
       
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={dropdownVariants}
            className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-0 flex flex-col divide-y divide-gray-100 overflow-hidden"
          >
            {menuSections.map((section, idx) => (
              <div key={idx} className="py-4 px-6 bg-white hover:bg-gray-50 transition-colors">
                <div className="font-semibold text-gray-900 mb-2 text-sm">{section.title}</div>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.to}>
                      <AsyncLink
                        to={link.to}
                        className="block text-gray-600 hover:text-[#ed7e0f] text-sm transition-colors"
                      >
                        {link.label}
                      </AsyncLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MegaMenu; 