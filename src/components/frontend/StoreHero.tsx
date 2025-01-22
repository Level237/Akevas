import delivery from "../../assets/livraisond.webp"
import dress from "../../assets/dress.jpg"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function StoreHero() {
  return (
    <section className="flex max-sm:flex-col items-start max-sm:mx-2 max-sm:mt-6 gap-4 mx-16 h-[30rem]">
     <section style={{ backgroundImage:`url(${dress})`,backgroundPosition:"cover",backgroundSize:"cover" }} className="w-[75%] max-sm:w-full rounded-3xl  relative h-96 bg-red-300">
     </section>
     <section className="flex flex-col w-[25%] max-sm:w-full h-96 gap-4">
        <section style={{ backgroundImage:`url(${delivery})`,backgroundPosition:"top",backgroundSize:"cover",backgroundRepeat:"no-repeat" }} className="w-full rounded-3xl  h-full relative">
       
<div className="absolute bottom-0 h-32 pt-3 rounded-b-3xl  flex flex-col items-center w-full p-1 z-10 bg-orange-500 text-white">
<span className="text-lg">LIVRAISON GRATUITE</span>
<div>
<h2 className="text-2xl text-black font-extrabold text-center">Tout Les jours <br /> 24H/24</h2>
</div>
          </div>

        </section>
     

     </section>
    </section>
  )
}