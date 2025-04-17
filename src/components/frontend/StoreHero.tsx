import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useMemo, memo } from "react";
import delivery from "../../assets/delivery-slider.png"
import sellerImage from "../../assets/seller.png"
import marketplace from "../../assets/marketplace.jpg"
import { useGetProfileShopQuery } from "@/services/guardService";
// Ajoutez ces images ou utilisez vos propres images de produits

// Créer des composants séparés pour une meilleure réutilisabilité
const SlideControls = memo(({ slides, currentSlide, setCurrentSlide }:{slides:any,currentSlide:any,setCurrentSlide:any}) => (
  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
    {slides.map((_:any, index:any) => (
      <button
        key={index}
        onClick={() => setCurrentSlide(index)}
        className={`w-2 h-2 rounded-full transition-all ${
          currentSlide === index ? "bg-white w-6" : "bg-white/50"
        }`}
      />
    ))}
  </div>
));

const ProductGrid = memo(({ productImages }:{productImages:any}) => (
  
  <motion.div 
    className="grid grid-cols-3 gap-4 p-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0.4 }}
  >
    {productImages?.map((img:any, index:any) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="relative overflow-hidden rounded-lg aspect-square shadow-lg"
      >
        <img
          src={img}
          alt={`Product ${index + 1}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent hover:opacity-0 transition-opacity duration-300" />
      </motion.div>
    ))}
  </motion.div>
));

export default function StoreHero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const {data,isLoading}=useGetProfileShopQuery('guard')
  let productImages;
  if(!isLoading){
    productImages = [
      data[0].shop_profile,
      data[1].shop_profile,
      data[2].shop_profile,
      data[3].shop_profile,
      data[4].shop_profile,
      data[5].shop_profile,
    ];
  }
  
  // Memoize slides data
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
      setCurrentSlide((prev) => (prev >= 2 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>

     {/* Mobile Version */}
     <motion.section 
  className="w-full md:hidden relative h-[480px] overflow-hidden"
>
  <AnimatePresence mode="wait">
    <motion.div
     
      className={`w-full h-full ${slides[currentSlide].bgColor}`}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 z-0" />

      {/* Content Container */}
      <div className="relative h-full z-10 p-6 flex flex-col">
        {/* Badge */}
        <motion.span 
          
          className="self-start px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white/90 text-xs mb-4"
        >
          {currentSlide === 0 ? "Vendeur" : currentSlide === 1 ? "Livreur" : "Marketplace"}
        </motion.span>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <motion.h2 
            
              className="text-2xl font-bold text-white mb-3"
            >
              {slides[currentSlide].title}
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-sm leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </div>

          {/* Image or Product Grid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="my-6 h-48 relative"
          >
            {slides[2].isMarketplace && (
              <div className="grid grid-cols-2 gap-3 h-full">
                {productImages?.slice(0, 4).map((img, index) => (
                  <div key={index} className="relative rounded-xl overflow-hidden">
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) }
          </motion.div>

          {/* Bottom Actions */}
          <div className="space-y-4">
            <motion.a
              href={slides[2].href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex z-[999999999999999999999999999] items-center justify-center w-full bg-white text-[#ed7e0f] 
                       px-6 py-3.5 rounded-xl font-medium shadow-lg 
                       active:scale-95 transition-all duration-200"
              whileTap={{ scale: 0.98 }}
            >
              {slides[currentSlide].buttonText}
            </motion.a>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <SlideControls 
          slides={slides} 
          currentSlide={currentSlide} 
          setCurrentSlide={setCurrentSlide} 
        />
      </div>
    </motion.div>
  </AnimatePresence>

  {/* Swipe Handlers */}
  <div 
    className="absolute inset-0 z-30"
    
  />
</motion.section>
    <section className="flex max-sm:flex-col max-sm:hidden items-start max-sm:mx-2 max-sm:mt-6 gap-4 mx-16 h-[30rem]">
      <motion.section className="w-[75%] max-sm:hidden rounded-3xl relative h-96 overflow-hidden">
        <motion.div
          className={`absolute inset-0 ${slides[currentSlide].bgColor}`}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full relative"
          >
            {slides[currentSlide].isMarketplace ? (
              <div className="flex h-full">
                <div className="w-1/2 p-10 flex flex-col justify-center">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl font-bold text-white mb-4"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-gray-200 mb-6"
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                  <motion.a
                  href={slides[currentSlide].href}
                   
                    
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
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
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl font-bold text-white mb-4"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-gray-200 mb-6"
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                  <motion.a
                  href={slides[currentSlide].href}
                  target="_blank"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="bg-white text-[#ed7e0f] px-6 py-3 rounded-full font-semibold w-fit hover:bg-gray-100 transition-colors"
                  >
                   
                    {slides[currentSlide].buttonText}
                  
                  </motion.a>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Slider Controls */}
        <SlideControls slides={slides} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
      </motion.section>
 
      <motion.section 
      
        className="w-full max-sm:hidden  hidden max-sm:block rounded-3xl relative h-96 bg-orange-800 overflow-hidden"
      >
        <div className="flex   w-full h-full">
          <div className="w-full p-10 flex flex-col items-center justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl max-sm:text-xl flex-1 font-bold text-white mb-4"
            >
              Devenez Vendeur
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-200 w-full mb-6"
            >
              Lancez votre boutique en ligne et développez votre business avec nous
            </motion.p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#ed7e0f] text-white  text-sm py-3 rounded-full font-semibold w-full hover:bg-gray-100 transition-colors"
            >
              Créer mon compte vendeur
            </motion.button>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-2/5 relative h-full"
          >
           
          </motion.div>
        </div>
      </motion.section>
     <section className="flex max-sm:hidden flex-col w-[25%] max-sm:w-full h-96 gap-4">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full bg-black  rounded-3xl h-full relative group overflow-hidden"
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ed7e0f]/30 to-[#ed7e0f] z-0"/>
          
          {/* Background with parallax effect */}
          <motion.div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: `url(${marketplace})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.8 }}
          />


          {/* Content container */}
          <div className="absolute -bottom-3 w-full p-6 z-20 backdrop-blur-lg  rounded-b-3xl">
            <div className="text-center">
             
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 text-sm mb-4 leading-relaxed"
              >
                Découvrez notre marketplace de boutiques
              </motion.p>
              <motion.button 
                className=" bg-white text-black px-6 py-3 rounded-full font-semibold w-full 
                           shadow-lg hover:shadow-xl text-sm transition-all duration-300"
              >
                En savoir plus
              </motion.button>
            </div>
          </div>
        </motion.section>
      </section>

     {/* Section Livreur */}
    
    </section>

   
    </>
  )
}