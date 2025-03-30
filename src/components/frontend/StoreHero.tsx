import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import delivery from "../../assets/delivery-slider.png"
import sellerImage from "../../assets/seller.png"

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
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex max-sm:flex-col items-start max-sm:mx-2 max-sm:mt-6 gap-4 mx-16 h-[30rem]">
      <motion.section className="w-[75%] max-sm:hidden rounded-3xl relative h-96 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className={`w-full h-full ${slides[currentSlide].bgColor}`}
            style={{
              backgroundImage: `url(${slides[currentSlide].image})`,
              backgroundPosition: "right",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="flex h-full">
              <div className="w-3/5 p-10 flex flex-col justify-center">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold text-white mb-4"
                >
                  {slides[currentSlide].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-gray-200 mb-6"
                >
                  {slides[currentSlide].description}
                </motion.p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-[#ed7e0f] px-6 py-3 rounded-full font-semibold w-fit hover:bg-gray-100 transition-colors"
                >
                  {slides[currentSlide].buttonText}
                </motion.button>
              </div>
            </div>
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
        <section style={{ backgroundImage:`url(${delivery})`,backgroundPosition:"top",backgroundSize:"cover",backgroundRepeat:"no-repeat" }} className="w-full rounded-3xl  h-full relative">
       
<div className="absolute bottom-0 h-48 pt-3 rounded-b-3xl  flex flex-col items-center w-full p-1 z-10 bg-[#ed7e0f] text-white">
<div className="p-6 text-center">
         <motion.h2 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="text-2xl font-bold text-white mb-2"
         >
           Devenir Livreur
         </motion.h2>
         <motion.p 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
           className="text-gray-200 text-sm mb-4"
         >
           Rejoignez notre équipe de livraison et gagnez en flexibilité
         </motion.p>
         <motion.button 
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           className="bg-white text-[#ed7e0f] px-4 py-2 rounded-full font-semibold w-full hover:bg-orange-600 transition-colors"
         >
           Devenir livreur
         </motion.button>
       </div>
<div>

</div>

          </div>

        </section>
     

     </section>

     {/* Section Livreur */}
    
    </section>
  )
}