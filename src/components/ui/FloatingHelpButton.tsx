import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Store, Truck, ChevronUp, ArrowRight } from 'lucide-react';

const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    {
      title: 'Devenir vendeur',
      icon: <Store className="w-5 max-sm:w-4 max-sm:h-4 h-5" />,
      link: 'https://seller.akevas.com/seller/guide',
      description: 'Créez votre boutique en ligne',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Devenir livreur',
      icon: <Truck className="w-5 max-sm:w-4 max-sm:h-4 h-5" />,
      link: 'https://delivery.akevas.com/delivery/guide',
      description: 'Rejoignez notre équipe de livraison',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="fixed bottom-10 max-sm:bottom-20 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-4 max-sm:mb-2"
          >
            <div className="bg-white/80 backdrop-blur-lg  rounded-2xl shadow-lg overflow-hidden w-72 border border-gray-100">
              <div className="p-4 bg-gradient-to-br from-[#ed7e0f] to-orange-600">
                <h2 className="text-white max-sm:text-sm font-semibold">Comment pouvons-nous vous aider ?</h2>
                <p className="text-orange-100 max-sm:text-xs text-sm mt-1">Sélectionnez une option ci-dessous</p>
              </div>
              <div className="divide-y divide-gray-100">
                {menuItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target='_blank'
                    className="group block transition-all hover:bg-gray-50"
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-sm`}>
                            {item.icon}
                          </div>
                          <h3 className="font-medium max-sm:text-sm text-gray-900">{item.title}</h3>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 transform transition-transform group-hover:translate-x-1 group-hover:text-[#ed7e0f]" />
                      </div>
                      <p className="text-sm max-sm:-mt-3 max-sm:text-xs text-gray-500 pl-12">{item.description}</p>
                    </div>
                  </a>
                ))}
              </div>
              <div className="p-4 bg-gray-50">
                <p className="text-xs text-center text-gray-500">
                  Rejoignez la communauté Akevas dès aujourd'hui
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative group ${
          isOpen 
            ? 'bg-[#ed7e0f] shadow-lg shadow-orange-500/30' 
            : 'bg-white shadow-lg hover:shadow-xl'
        } p-4 rounded-full max-sm:p-3 transition-all duration-300 hover:scale-105`}
        whileTap={{ scale: 0.95 }}
        animate={{ rotate: isOpen ? 180 : 0 }}
      >
        {isOpen ? (
          <ChevronUp className="w-6 h-6 text-white" />
        ) : (
          <>
            <HelpCircle className="w-6 h-6 max-sm:w-5 max-sm:h-5 text-[#ed7e0f] group-hover:text-[#ed7e0f]/80" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-[#ed7e0f] rounded-full border-2 border-white"
            />
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-2 bg-orange-500/20 rounded-full z-[-1]"
            />
          </>
        )}
      </motion.button>
    </div>
  );
};

export default FloatingHelpButton; 