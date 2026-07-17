import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import delivery from "../../assets/delivery-slider.png";
import sellerImage from "../../assets/seller.png";
import marketplace from "../../assets/marketplace.jpg";
import { useGetProfileShopQuery } from "@/services/guardService";
import OptimizedImage from "@/components/OptimizedImage";
import { Link } from "react-router-dom";
import AsyncLink from "../ui/AsyncLink";

// ✅ 1. Données statiques sorties du composant (0 coût de rendu)
const SLIDES = [
  {
    title: "Devenez Vendeur",
    description: "Lancez votre boutique en ligne et développez votre business avec nous",
    buttonText: "Créer mon compte vendeur",
    image: sellerImage,
    href: "https://seller.akevas.com/seller/guide",
    bgColor: "bg-orange-800",
    type: "seller"
  },
  {
    title: "Devenir Livreur",
    description: "Rejoignez notre équipe de livraison et gagnez en flexibilité",
    buttonText: "Devenir livreur",
    image: delivery,
    href: "https://delivery.akevas.com/delivery/guide",
    bgColor: "bg-[#ed7e0f]",
    type: "delivery"
  },
  {
    title: "Découvrez Notre Marketplace",
    description: "Des milliers de produits de qualité à portée de clic",
    buttonText: "Explorer les boutiques",
    href: "/shops",
    bgColor: "bg-gradient-to-r from-orange-800 to-[#ed7e0f]",
    type: "marketplace"
  }
];

// ✅ 2. Composant de contrôle mémoïsé
const SlideControls = memo(({ currentSlide, onManualChange }: any) => {
  const handleClick = useCallback((index: number) => {
    onManualChange(index); // ✅ Notifie le parent pour réinitialiser le timer
  }, [onManualChange]);

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
      {SLIDES.map((_, index) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
            }`}
          aria-label={`Aller à la slide ${index + 1}`}
        />
      ))}
    </div>
  );
});
SlideControls.displayName = "SlideControls";

// ✅ 3. Grille de produits mémoïsée (Isolée pour éviter les re-rendus inutiles)
const ProductGrid = memo(({ productImages }: { productImages: any[] }) => {
  if (!productImages || productImages.length === 0) return null;

  return (
    <motion.div
      className="grid grid-cols-3 gap-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {productImages.map((img, index) => (
        <Link key={img.url} to={`/shop/${img.url}`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative overflow-hidden rounded-lg aspect-square shadow-lg"
          >
            <OptimizedImage
              src={img.profile}
              alt={`Boutique ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"

            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </Link>
      ))}
    </motion.div>
  );
});
ProductGrid.displayName = "ProductGrid";

// ✅ 4. Composant Mobile isolé
const MobileSlide = memo(({ slide, productImages, isLoading }: any) => {
  return (
    <motion.div
      className={`w-full h-full ${slide.bgColor}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 z-0" />
      <div className="relative h-full z-10 p-6 flex flex-col">
        <span className="self-start px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs mb-4">
          {slide.type === 'seller' ? "Vendeur" : slide.type === 'delivery' ? "Livreur" : "Marketplace"}
        </span>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">{slide.title}</h2>
            <p className="text-white/80 text-sm leading-relaxed">{slide.description}</p>
          </div>

          <div className="my-6 h-48 relative">
            {!isLoading && productImages?.length > 0 && (
              <div className="grid grid-cols-2 gap-3 h-full">
                {productImages.slice(0, 4).map((img: any, index: number) => (
                  <Link key={img.url} to={`/shop/${img.url}`} className="relative rounded-xl overflow-hidden">
                    <OptimizedImage
                      src={img.profile}
                      alt={`Shop ${index + 1}`}
                      className="w-full h-full object-cover"

                    />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <a
            href={slide.href}
            className="inline-flex items-center justify-center w-full bg-white text-[#ed7e0f] 
                     px-6 py-3.5 rounded-xl font-medium shadow-lg active:scale-95 transition-all duration-200"
          >
            {slide.buttonText}
          </a>
        </div>
      </div>
    </motion.div>
  );
});
MobileSlide.displayName = "MobileSlide";

// ✅ 5. Composant Principal
export default function StoreHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // ✅ Pour mettre en pause au survol

  // ✅ Appel API sécurisé : ne refetchera pas si les données sont en cache
  const { data: shopData, isLoading } = useGetProfileShopQuery('guard', {
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
  });

  // ✅ Mémoïsation stable des images
  const productImages = useMemo(() => {
    if (isLoading || !shopData || !Array.isArray(shopData)) return [];
    return shopData.slice(0, 6).map((shop: any) => ({
      profile: shop.shop_profile,
      url: shop.id,
    }));
  }, [shopData, isLoading]);

  // ✅ Gestion intelligente du Timer
  useEffect(() => {
    if (isPaused) return; // Ne pas avancer si l'utilisateur interagit

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= SLIDES.length - 1 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(timer);
  }, [isPaused]);

  // ✅ Fonction pour réinitialiser le timer lors d'un clic manuel
  const handleManualSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    // Reprendre le défilement automatique après 10 secondes d'inactivité
    setTimeout(() => setIsPaused(false), 10000);
  }, []);

  const currentSlideData = SLIDES[currentSlide];

  return (
    <>
      {/* --- VERSION MOBILE --- */}
      <section className="w-full md:hidden relative h-[480px] overflow-hidden">
        <AnimatePresence mode="wait">
          <MobileSlide
            key={currentSlide} // ✅ La clé force Framer Motion à animer la transition
            slide={currentSlideData}
            productImages={productImages}
            isLoading={isLoading}
          />
        </AnimatePresence>
        <SlideControls
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          onManualChange={handleManualSlideChange}
        />
      </section>

      {/* --- VERSION DESKTOP --- */}
      <section className="flex max-sm:hidden max-w-[1440px] mx-auto justify-center items-start gap-4 h-[30rem] px-4 md:px-0">

        {/* Slider Principal Desktop */}
        <motion.section
          className="w-full lg:w-[75%] rounded-3xl relative h-96 overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}   // ✅ Pause au survol
          onMouseLeave={() => setIsPaused(false)}  // ✅ Reprise au départ
        >
          <motion.div
            className={`absolute inset-0 ${currentSlideData.bgColor}`}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide} // ✅ Clé pour l'animation de sortie/entrée
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full relative"
            >
              {currentSlideData.type === 'marketplace' ? (
                <div className="flex h-full">
                  <div className="w-1/2 p-10 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-white mb-4">{currentSlideData.title}</h1>
                    <p className="text-gray-200 mb-6">{currentSlideData.description}</p>
                    <a href={currentSlideData.href} className="bg-white text-[#ed7e0f] px-6 py-3 rounded-full font-semibold w-fit hover:bg-gray-100 transition-colors">
                      {currentSlideData.buttonText}
                    </a>
                  </div>
                  <div className="w-1/2 relative h-full flex items-center justify-center pr-6">
                    <ProductGrid productImages={productImages} />
                  </div>
                </div>
              ) : (
                <div
                  className="flex h-full"
                  style={{
                    backgroundImage: `url(${currentSlideData.image})`,
                    backgroundPosition: "right",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <div className="w-3/5 p-10 flex flex-col justify-center">
                    <h1 className="text-4xl font-bold text-white mb-4">{currentSlideData.title}</h1>
                    <p className="text-gray-200 mb-6">{currentSlideData.description}</p>
                    <a href={currentSlideData.href} target="_blank" rel="noopener noreferrer" className="bg-white text-[#ed7e0f] px-6 py-3 rounded-full font-semibold w-fit hover:bg-gray-100 transition-colors">
                      {currentSlideData.buttonText}
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <SlideControls
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            onManualChange={handleManualSlideChange}
          />
        </motion.section>

        {/* --- Sidebar Promotionnelle (Statique, ne se re-rend jamais) --- */}
        <section className="hidden lg:block w-[25%] h-96">
          <motion.div
            className="w-full h-full bg-black rounded-3xl relative group overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ed7e0f]/30 to-[#ed7e0f] z-0" />
            <div
              className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105"
              style={{
                backgroundImage: `url(${marketplace})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            />
            <div className="absolute bottom-0 w-full p-6 z-20 backdrop-blur-md rounded-b-3xl">
              <div className="text-center">
                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                  Découvrez notre marketplace de boutiques
                </p>
                <AsyncLink
                  to="/shops"
                  className="bg-white text-black px-8 py-3 rounded-full font-semibold w-full shadow-lg hover:shadow-xl text-sm transition-all duration-300 block"
                >
                  En savoir plus
                </AsyncLink>
              </div>
            </div>
          </motion.div>
        </section>
      </section>
    </>
  );
}