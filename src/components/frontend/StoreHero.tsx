import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, memo, useCallback } from "react";
import delivery from "../../assets/delivery-slider.png"
import sellerImage from "../../assets/seller.png"
import marketplace from "../../assets/marketplace.jpg"
import { useGetProfileShopQuery } from "@/services/guardService";
import OptimizedImage from "@/components/OptimizedImage";
import { Link } from "react-router-dom";
import AsyncLink from "../ui/AsyncLink";

// Optimized slide controls with useCallback
const SlideControls = memo(({ slides, currentSlide, setCurrentSlide }:{slides:any,currentSlide:any,setCurrentSlide:any}) => {
  const handleClick = useCallback((index: number) => {
    setCurrentSlide(index);
  }, [setCurrentSlide]);

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
      {Array.isArray(slides) && slides.map((_:any, index:any) => (
        <button
          key={index}
          onClick={() => handleClick(index)}
          className={`w-2 h-2 rounded-full transition-all ${
            currentSlide === index ? "bg-white w-6" : "bg-white/50"
          }`}
        />
      ))}
    </div>
  );
});

// Optimized product grid with memoized image rendering
const ProductGrid = memo(({ productImages }:{productImages:any}) => {
  const renderImage = useCallback((img:any, index:number) => (
    <Link rel="preload" key={img.url} to={`/shop/${img.url}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="relative overflow-hidden rounded-lg aspect-square shadow-lg"
      >
        <OptimizedImage
          src={img.profile}
          alt={`Product ${index + 1}`}
          className="w-full cursor-pointer h-full object-cover transition-transform duration-300 hover:scale-110"
         
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent hover:opacity-0 transition-opacity duration-300" />
      </motion.div>
    </Link>
  ), []);

  return (
    <motion.div 
      className="grid grid-cols-3 gap-4 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {Array.isArray(productImages) && productImages?.map((img:any, index:any) => renderImage(img, index))}
    </motion.div>
  );
});

export default function StoreHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {data: shopData, isLoading} = useGetProfileShopQuery('guard');

  const productImages = useMemo(() => {
    if(!isLoading && shopData) {
      return Array.isArray(shopData) && shopData.slice(0,6).map((shop:any) => ({
        profile: shop.shop_profile,
        url: shop.id
      }));
    }
    return [];
  }, [shopData, isLoading]);

  const slides = useMemo(() => [
    {
      title: "Devenez Vendeur",
      description: "Lancez votre boutique en ligne et développez votre business avec nous",
      buttonText: "Créer mon compte vendeur", 
      image: sellerImage,
      href:"https://seller.akevas.com/seller/guide",
      bgColor: "bg-orange-800"
    },
    {
      title: "Devenir Livreur",
      description: "Rejoignez notre équipe de livraison et gagnez en flexibilité",
      buttonText: "Devenir livreur",
      image: delivery,
      href:"https://delivery.akevas.com/delivery/guide", 
      bgColor: "bg-[#ed7e0f]"
    },
    {
      title: "Découvrez Notre Marketplace",
      description: "Des milliers de produits de qualité à portée de clic",
      buttonText: "Explorer les boutiques",
      isMarketplace: true,
      href:"/shops",
      bgColor: "bg-gradient-to-r from-orange-800 to-[#ed7e0f]"
    }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev >= 2 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  const renderMobileSlide = useCallback(() => (
    <motion.div className={`w-full h-full ${slides[currentSlide].bgColor}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 z-0" />
      <div className="relative h-full z-10 p-6 flex flex-col">
        <motion.span className="self-start px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs mb-4">
          {currentSlide === 0 ? "Vendeur" : currentSlide === 1 ? "Livreur" : "Marketplace"}
        </motion.span>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <motion.h2 className="text-2xl font-bold text-white mb-3">
              {slides[currentSlide].title}
            </motion.h2>
            <motion.p className="text-white/80 text-sm leading-relaxed">
              {slides[currentSlide].description}
            </motion.p>
          </div>

          <motion.div className="my-6 h-48 relative">
            {slides[2].isMarketplace && (
              <div className="grid grid-cols-2 gap-3 h-full">
                {Array.isArray(productImages) && !isLoading && productImages?.slice(0, 4).map((img:any, index:number) => (
                  <Link key={index} to={`/shop/${img.url}`} className="relative rounded-xl overflow-hidden">
                    <OptimizedImage
                      src={img.profile}
                      alt={`Shop ${index + 1}`}
                      className="w-full md:w-24  cursor-pointer h-full object-cover"
                     
                    />
                  </Link>
                ))}
              </div>
            )}
          </motion.div>

          <motion.a
            href={slides[currentSlide].href}
            className="inline-flex items-center justify-center w-full bg-white text-[#ed7e0f] 
                     px-6 max-sm:text-sm max-sm:py-3 py-3.5 rounded-xl font-medium shadow-lg 
                     active:scale-95 transition-all duration-200"
          >
            {slides[currentSlide].buttonText}
          </motion.a>
        </div>
      </div>

      <div className="absolute bottom-6 max-sm:bottom-[-10px] left-1/2 transform -translate-x-1/2 z-20">
        <SlideControls 
          slides={slides} 
          currentSlide={currentSlide} 
          setCurrentSlide={setCurrentSlide} 
        />
      </div>
    </motion.div>
  ), [currentSlide, slides, productImages]);

  return (
    <>
      <motion.section className="w-full md:hidden relative h-[480px]  overflow-hidden">
        <AnimatePresence mode="wait">
          {renderMobileSlide()}
        </AnimatePresence>
      </motion.section>

      <section className="flex max-sm:flex-col max-sm:hidden items-start max-sm:mx-2 max-sm:mt-6 gap-4 mx-16 md:mx-0 h-[30rem]">
        <motion.section className="w-[75%] md:w-[100%] max-sm:hidden md:rounded-none rounded-3xl relative h-96 overflow-hidden">
          <motion.div
            className={`absolute inset-0 ${slides[currentSlide].bgColor}`}
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full relative"
            >
              {slides[currentSlide].isMarketplace ? (
                <div className="flex h-full">
                  <div className="w-1/2 p-10 flex flex-col justify-center">
                    <motion.h1 className="text-4xl font-bold text-white mb-4">
                      {slides[currentSlide].title}
                    </motion.h1>
                    <motion.p className="text-gray-200 mb-6">
                      {slides[currentSlide].description}
                    </motion.p>
                    <motion.a
                      href={slides[currentSlide].href}
                      className="bg-white text-[#ed7e0f] px-6 py-3 rounded-full font-semibold w-fit hover:bg-gray-100 transition-colors"
                    >
                      {slides[currentSlide].buttonText}
                    </motion.a>
                  </div>
                  <div className="w-1/2 relative h-full flex items-center justify-center pr-6">
                    <ProductGrid productImages={productImages} />
                  </div>
                </div>
              ) : (
                <div className="flex h-full" style={{
                  backgroundImage: `url(${slides[currentSlide].image})`,
                  backgroundPosition: "right",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                }}>
                  <div className="w-3/5 p-10 flex flex-col justify-center">
                    <motion.h1 className="text-4xl font-bold text-white mb-4">
                      {slides[currentSlide].title}
                    </motion.h1>
                    <motion.p className="text-gray-200 mb-6">
                      {slides[currentSlide].description}
                    </motion.p>
                    <motion.a
                      href={slides[currentSlide].href}
                      target="_blank"
                      className="bg-white text-[#ed7e0f] px-6 py-3 rounded-full font-semibold w-fit hover:bg-gray-100 transition-colors"
                    >
                      {slides[currentSlide].buttonText}
                    </motion.a>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <SlideControls slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
        </motion.section>

        <motion.section className="w-full max-sm:hidden hidden max-sm:block rounded-3xl relative h-96 bg-orange-800 overflow-hidden">
          <div className="flex w-full h-full">
            <div className="w-full p-10 flex flex-col items-center justify-center">
              <motion.h1 className="text-4xl max-sm:text-xl flex-1 font-bold text-white mb-4">
                Devenez Vendeur
              </motion.h1>
              <motion.p className="text-gray-200 w-full mb-6">
                Lancez votre boutique en ligne et développez votre business avec nous
              </motion.p>
              <motion.button className="bg-[#ed7e0f] text-white text-sm py-3 rounded-full font-semibold w-full hover:bg-gray-100 transition-colors">
                Créer mon compte vendeur
              </motion.button>
            </div>
          </div>
        </motion.section>

        <section className="flex max-sm:hidden md:hidden flex-col w-[25%] max-sm:w-full h-96 gap-4">
          <motion.section className="w-full bg-black rounded-3xl h-full relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ed7e0f]/30 to-[#ed7e0f] z-0"/>
            
            <motion.div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: `url(${marketplace})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                willChange: 'transform',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
            />

            <div className="absolute -bottom-1 w-full p-6 z-20 backdrop-blur-lg rounded-b-3xl">
              <div className="text-center">
                <motion.p className="text-white/90 text-sm mb-4 leading-relaxed">
                  Découvrez notre marketplace de boutiques
                </motion.p>
                <AsyncLink to="/shops" className="bg-white text-black px-12 py-3 rounded-full font-semibold w-full 
                                       shadow-lg hover:shadow-xl text-sm transition-all duration-300">
                  En savoir plus
                </AsyncLink>
              </div>
            </div>
          </motion.section>
        </section>
      </section>
    </>
  );
}