import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import Footer from '@/components/ui/footer';
import MobileNav from '@/components/ui/mobile-nav';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      <TopBar />
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <h1 className="text-9xl font-bold text-primary-600">404</h1>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary-100 rounded-full opacity-50 animate-pulse"></div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <h2 className="text-3xl font-bold text-gray-800">
              Oups ! Page non trouvée
            </h2>
            <p className="text-gray-600 mt-4 mb-8 text-lg">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-4"
          >
            <Link
              to="/"
              className="inline-flex bg-[#ed7e0f] items-center px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Retour à l'accueil
            </Link>
            
          
          </motion.div>
        </div>
      </main>

      <MobileNav />
      <Footer />
    </div>
  );
};

export default NotFoundPage; 