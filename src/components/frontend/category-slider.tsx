'use client'

import * as React from "react"

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Link } from "react-router-dom"
import Slider from "react-slick"

interface Category {
  title: string
  image: string
  href: string
  items: number
}

const categories: Category[] = [
  {
    title: "Woman",
    image: "/shoes1.webp",
    href: "/category/woman",
    items: 245
  },
  {
    title: "Man",
    image: "/shoes1.webp",
    href: "/category/man",
    items: 325
  },
  {
    title: "Watch",
    image: "/shoes1.webp",
    href: "/category/watch",
    items: 55
  },
  {
    title: "Kids",
    image: "/shoes1.webp",
    href: "/category/kids",
    items: 105
  },
  {
    title: "Sports",
    image: "/shoes1.webp",
    href: "/category/sports",
    items: 45
  },
  {
    title: "Sunglass",
    image: "/shoes1.webp",
    href: "/category/sunglass",
    items: 65
  }
]

function NextArrow(props: any) {
  const { onClick } = props
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 -translate-x-4"
      aria-label="Next slides"
    >
      <ChevronRight className="h-6 w-6" />
    </button>
  )
}

function PrevArrow(props: any) {
  const { onClick } = props
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 translate-x-4"
      aria-label="Previous slides"
    >
      <ChevronLeft className="h-6 w-6" />
    </button>
  )
}

export function CategorySlider() {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    autoplay:true,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  }

  return (
    <div className="w-full max-w-7xl mt-2 mb-16 mx-auto px-4">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">Shop By Category</h2>
          <p className="text-muted-foreground">Select from our best categories</p>
        </div>
      </div>
      
      <div className="relative px-4">
        <Slider {...settings} className="category-slider">
          {categories.map((category, index) => (
            <div key={index} className="px-3">
              <Link 
                to={category.href}
                className="block group relative overflow-hidden"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-white/80">{category.items} Items</p>
                  </div>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl" />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}


