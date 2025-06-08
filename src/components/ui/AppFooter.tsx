import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Mail, 
  Shield, 
  Truck, 
  CreditCard,
  Heart,
  HelpCircle,
  Settings,
  FileText,
  Store
} from 'lucide-react';

const AppFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      {/* Section principale */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Avantages */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Truck className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Livraison rapide</p>
                <p className="text-gray-500">24-48h après commande</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
              <div className="p-2 bg-orange-50 rounded-xl">
                <Shield className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Paiement sécurisé</p>
                <p className="text-gray-500">Transactions cryptées</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-600 hover:text-gray-900 transition-colors">
              <div className="p-2 bg-orange-50 rounded-xl">
                <CreditCard className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-sm">
                <p className="font-medium">Moyens de paiement</p>
                <p className="text-gray-500">Mobile Money, Carte bancaire</p>
              </div>
            </div>
          </div>

          {/* Navigation rapide */}
          <div className="md:col-span-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-sm text-gray-900 mb-4">Navigation</h3>
                <ul className="space-y-3">
                  {[
                    { icon: Store, label: 'Boutiques', path: '/shops' },
                    { icon: Heart, label: 'Favoris', path: '/wishlist' },
                    { icon: HelpCircle, label: 'Aide', path: '/help' },
                    { icon: Settings, label: 'Paramètres', path: '/settings' },
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 5 }}
                      className="text-sm"
                    >
                      <Link 
                        to={item.path}
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-900 mb-4">Légal</h3>
                <ul className="space-y-3">
                  {[
                    { icon: FileText, label: 'Conditions', path: '/terms' },
                    { icon: Shield, label: 'Confidentialité', path: '/privacy' },
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 5 }}
                      className="text-sm"
                    >
                      <Link 
                        to={item.path}
                        className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                      >
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter et réseaux sociaux */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-4">Newsletter</h3>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <button className="px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-sm text-gray-900 mb-4">Suivez-nous</h3>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, color: 'hover:bg-pink-500' },
                  { icon: Facebook, color: 'hover:bg-blue-600' },
                  { icon: Twitter, color: 'hover:bg-blue-400' },
                ].map((social, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ y: -2 }}
                    className={`p-2 rounded-xl bg-gray-100 hover:text-white transition-colors ${social.color}`}
                  >
                    <social.icon className="w-5 h-5" />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {currentYear} Akevas. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <Link to="/terms" className="hover:text-orange-500 transition-colors">
                Conditions
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-orange-500 transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter; 