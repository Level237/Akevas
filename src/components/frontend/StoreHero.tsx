"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function StoreHero() {
  return (
    <section className="flex items-start gap-4 mx-12 h-[30rem] mb-20">
     <section style={{ background:"url('bg.webp')",backgroundPosition:"cover",backgroundSize:"center" }} className="w-[60%] rounded-md  relative h-[30rem] bg-red-300">
          <div className="absolute rounded-md w-full bg-zinc-950 top-0 bottom-0 inset-0 opacity-60 z-10">

          </div>
          <div className="absolute top-4 p-1 z-10 bg-orange-500 text-white">
<span className="text-sm">Ultra vip</span>
          </div>
          <div className="absolute bottom-6 z-20 flex justify-between w-full px-7">
            <div className="flex flex-col">
              <h2 className="text-white text-xl font-bold">Le Paradis du vetement</h2>
              <span className="text-gray-300 text-xs">La texture du coton reste un atout</span>
            </div>
              
              <Button className="text-xs bg-black">Voir la boutique</Button>
          </div>
     </section>
     <section className="flex flex-col w-[40%] h-full gap-4">
        <section style={{ background:"url('shoes.webp')",backgroundPosition:"top",backgroundSize:"cover",backgroundRepeat:"no-repeat" }} className="w-full h-64 relative">
        <div className="absolute rounded-md w-full bg-zinc-950 top-0 bottom-0 inset-0 opacity-60 z-10">

</div>
<div className="absolute top-4 p-1 z-10 bg-orange-500 text-white">
<span className="text-sm">Ultra vip</span>
          </div>
<div className="absolute bottom-6 z-20 flex justify-between w-full px-7">
            <div className="flex flex-col">
              <h2 className="text-white text-xl font-bold">Meilleur adventise</h2>
              <span className="text-gray-300 text-xs">La maille du quai</span>
            </div>
              
              <Button className="text-xs bg-black">Voir la boutique</Button>
          </div>
        </section>
        <section style={{ background:"url('sac-bg.webp')",backgroundPosition:"top",backgroundSize:"cover" }} className="w-full h-64 relative">
        <div className="absolute rounded-md w-full bg-zinc-950 top-0 bottom-0 inset-0 opacity-60 z-10">

</div>
<div className="absolute top-4 p-1 z-10 bg-orange-500 text-white">
<span className="text-sm">Ultra vip</span>
          </div>
<div className="absolute bottom-6 z-20 flex justify-between w-full px-7">
            <div className="flex flex-col">
              <h2 className="text-white text-xl font-bold">L'univers des sac</h2>
              <span className="text-gray-300 text-xs">La maille du quai</span>
            </div>
              
              <Button className="text-xs bg-black">Voir la boutique</Button>
          </div>
        </section>

     </section>
    </section>
  )
}