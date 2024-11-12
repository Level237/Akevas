"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function StoreHero() {
  return (
    <section className="relative min-h-screen mx-12 px-8 bg-[#d9d7d3] overflow-hidden">
      <div className="absolute inset-0 bg-[#d9d7d3]" />
      <div className="container relative mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 max-w-xl"
        >
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 leading-tight">
            We Picked Every Item
            <span className="block mt-2">
              With Care, <span className="text-orange-500">You Must Try</span>
            </span>
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Atleast Once.
          </p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8"
          >
            <Button
            size="lg"
            className="text-md"
            >
             Voir la boutique
              <svg
                className="ml-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex-1 relative"
        >
          <div className="relative w-full max-w-sm mx-auto">
            <img
              src="/banner.webp"
              alt="Two friends enjoying winter fashion"
              className=" "
            />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 bg-orange-500 rounded-full opacity-20 blur-2xl" />
            <div className="absolute -top-6 -right-6 h-24 w-24 bg-blue-500 rounded-full opacity-20 blur-2xl" />
          </div>
        </motion.div>
      </div>
      
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-2"
        >
          <span className="sr-only">Share</span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
            />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-2"
        >
          <span className="sr-only">Compare</span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 border-2"
        >
          <span className="sr-only">Support</span>
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </Button>
      </div>
    </section>
  )
}