import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import delivery from "../../assets/delivery-slider.png"
import sellerImage from "../../assets/seller.png"
import marketplace from "../../assets/marketplace.jpg"

// Ajoutez ces images ou utilisez vos propres images de produits
const productImages = [
  "/products/product1.jpg",
  "/products/product2.jpg",
  "/products/product3.jpg",
  "/products/product4.jpg",
  "/products/product5.jpg",
  "/products/product6.jpg",
];

export default function StoreHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Devenez Vendeur",
      description: "Lancez votre boutique en ligne et développez votre business avec nous",
      buttonText: "Créer mon compte vendeur",
      image: sellerImage,
      bgColor: "bg-orange-800"
    },
    {
      title: "Devenir Livreur",
      description: "Rejoignez notre équipe de livraison et gagnez en flexibilité",
      buttonText: "Devenir livreur",
      image: delivery,
      bgColor: "bg-[#ed7e0f]"
    },
    {
      title: "Découvrez Notre Marketplace",
      description: "Des milliers de produits de qualité à portée de clic",
      buttonText: "Explorer les boutiques",
      isMarketplace: true,
      bgColor: "bg-gradient-to-r from-orange-800 to-[#ed7e0f]"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= 2 ? 0 : prev + 1));
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex max-sm:flex-col items-start max-sm:mx-2 max-sm:mt-6 gap-4 mx-16 h-[30rem]">
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="bg-white text-[#ed7e0f] px-6 py-3 rounded-full font-semibold w-fit hover:bg-gray-100 transition-colors"
                  >
                    {slides[currentSlide].buttonText}
                  </motion.button>
                </div>
                <div className="w-1/2 relative h-full flex items-center justify-center pr-6">
                  <motion.div 
                    className="grid grid-cols-3 gap-4 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    {productImages.map((img, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="relative overflow-hidden rounded-lg aspect-square shadow-lg"
                      >
                        <motion.img
                          src={img}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                          whileHover={{ 
                            scale: 1.1,
                            transition: { duration: 0.3 }
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent hover:opacity-0 transition-opacity duration-300" />
                      </motion.div>
                    ))}
                  </motion.div>
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="bg-white text-[#ed7e0f] px-6 py-3 rounded-full font-semibold w-fit hover:bg-gray-100 transition-colors"
                  >
                    {slides[currentSlide].buttonText}
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Slider Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? "bg-white w-6" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </motion.section>
 
      <motion.section 
      
        className="w-full  hidden max-sm:block rounded-3xl relative h-96 bg-orange-800 overflow-hidden"
      >
        <div className="flex  w-full h-full">
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
     <section className="flex flex-col w-[25%] max-sm:w-full h-96 gap-4">
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
  )
}