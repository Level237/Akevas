import { BellRing, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';
import orange from '@/assets/orange.jpeg'
import mtn from '@/assets/momo.jpeg'
import { Button } from './button';
import AsyncLink from './AsyncLink';


const Footer = () => {
  return (
    <footer className=" bg-black text-gray-200">
      {/* Back to top button */}
  

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Service Client */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Client</h3>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="hover:text-primary-500">Centre d'aide</Link></li>
              <li><Link to="/contact" className="hover:text-primary-500">Nous contacter</Link></li>
              <li><Link to="/shipping" className="hover:text-primary-500">Livraison & Retours</Link></li>
              <li><Link to="/payment" className="hover:text-primary-500">Options de paiement</Link></li>
              <li><Link to="/faq" className="hover:text-primary-500">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 2: À propos d'AKEVAS */}
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos d'AKEVAS</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-primary-500">Notre histoire</Link></li>
              <li><Link to="/careers" className="hover:text-primary-500">Carrières</Link></li>
              <li><Link to="/sustainability" className="hover:text-primary-500">Responsabilité sociale</Link></li>
              <li><Link to="/press" className="hover:text-primary-500">Espace presse</Link></li>
              <li><Link to="/affiliate" className="hover:text-primary-500">Programme d'affiliation</Link></li>
            </ul>
          </div>

          {/* Column 3: Avantages */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Avantages AKEVAS</h3>
            <ul className="space-y-2">
              <li><Link to="/loyalty" className="hover:text-primary-500">Programme de fidélité</Link></li>
              <li><Link to="/student-discount" className="hover:text-primary-500">Réduction étudiants</Link></li>
              <li><Link to="/invite" className="hover:text-primary-500">Parrainage</Link></li>
              <li><Link to="/app" className="hover:text-primary-500">Application mobile</Link></li>
              <li><Link to="/marketplace" className="hover:text-primary-500">Vendre sur AKEVAS</Link></li>
            </ul>
          </div>

          {/* Column 4: Support & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support & Communauté</h3>
            <ul className="space-y-2 mb-6">
              <li><Link to="/support" className="hover:text-primary-500">Support technique</Link></li>
              <li><Link to="/community" className="hover:text-primary-500">Forum communautaire</Link></li>
              <li><Link to="/blog" className="hover:text-primary-500">Blog & Actualités</Link></li>
              <li><Link to="/guides" className="hover:text-primary-500">Guides d'utilisation</Link></li>
            </ul>
            
            <div>
              <p className="mb-3">Rejoignez notre communauté</p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                   className="hover:text-primary-500 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                   className="hover:text-primary-500 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                   className="hover:text-primary-500 transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                   className="hover:text-primary-500 transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Download */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-4">
              <span className="text-sm">Paiement sécurisé via:</span>
              <img src={orange} alt="Orange Money" className="h-8" />
              <img src={mtn} alt="MTN Mobile Money" className="h-8" />
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <span className="text-sm mr-4">Notre application arrive bientôt!</span>
              <Button variant="outline" className="text-sm bg-white text-black">
                <BellRing className="w-4 h-4 mr-2" />
                Être notifié au lancement
              </Button>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4">
              <AsyncLink to="/legal-terms" className="hover:text-primary-500">Mentions légales</AsyncLink>
              <AsyncLink to="/privacy-policy" className="hover:text-primary-500">Confidentialité</AsyncLink>
              <AsyncLink to="/terms-of-use" className="hover:text-primary-500">CGV</AsyncLink>
            </div>
            <p className="mt-2 md:mt-0">© 2024 AKEVAS - La mode africaine réinventée</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;