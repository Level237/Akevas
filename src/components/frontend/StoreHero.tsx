import { motion } from "framer-motion";
import delivery from "../../assets/livraisond.webp"
import dress from "../../assets/dress.jpg"
import sellerImage from "../../assets/seller.png"
import deliveryImage from "../../assets/delivery.png"

export default function StoreHero() {
  return (
    <section className="flex max-sm:flex-col items-start max-sm:mx-2 max-sm:mt-6 gap-4 mx-16 h-[30rem]">
      <motion.section 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        style={{ backgroundImage: `url(${sellerImage})`, backgroundPosition: "right", backgroundSize: "contain", backgroundRepeat: "no-repeat", }}
        className="w-[75%] max-sm:w-full rounded-3xl relative h-96 bg-orange-800 overflow-hidden"
      >
        <div className="flex h-full">
          <div className="w-3/5 p-10 flex flex-col justify-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Devenez Vendeur
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-gray-200 mb-6"
            >
              Lancez votre boutique en ligne et développez votre business avec nous
            </motion.p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#ed7e0f] text-white px-6 py-3 rounded-full font-semibold w-fit hover:bg-gray-100 transition-colors"
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