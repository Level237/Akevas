import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Store, Truck, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      title: 'Devenir vendeur',
      icon: <Store className="w-5 h-5" />,
      link: '/become-seller',
      description: 'Créez votre boutique en ligne',
    },
    {
      title: 'Devenir livreur',
      icon: <Truck className="w-5 h-5" />,
      link: '/become-deliverer',
      description: 'Rejoignez notre équipe de livraison',
    },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4"
          >
            <div className="bg-white rounded-lg shadow-lg overflow-hidden w-64">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.link}
                  className="flex items-start gap-3 p-4 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-none"
                >
                  <div className="p-2 rounded-full bg-orange-100 text-[#ed7e0f]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`bg-white p-4 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 group ${
          isOpen ? 'bg-[#ed7e0f]' : ''
        }`}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-white" />
        ) : (
          <div className="relative">
            <HelpCircle className="w-6 h-6 text-[#ed7e0f] group-hover:text-[#ed7e0f]/80" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ed7e0f] rounded-full border-2 border-white" />
          </div>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingHelpButton; 