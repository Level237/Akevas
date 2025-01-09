'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Search, Tag, Shirt, FootprintsIcon as Shoe, ShoppingBagIcon as HandbagSimple, Heart, Dumbbell, Sparkle, ShoppingBag, ChevronDown } from 'lucide-react'
import logo from "../../assets/logo.png"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { DropdownAccount } from "./dropdown-account"

const categories = {
  mode: {
    icon: <Shirt className="h-4 w-4" />,
    title: "Mode",
    featured: ["Nouveautés", "Meilleures ventes", "Tendances"],
    sections: {
      "Vêtements femme": ["Robes", "Tops", "Pantalons", "Jeans", "Vestes", "Manteaux"],
      "Vêtements homme": ["T-shirts", "Chemises", "Pantalons", "Jeans", "Vestes", "Pulls"],
      "Collections": ["Été 2024", "Basiques", "Sport", "Soirée", "Business"]
    }
  },
  chaussures: {
    icon: <Shoe className="h-4 w-4" />,
    title: "Chaussures",
    featured: ["Nouveautés", "Marques populaires", "Outlet"],
    sections: {
      "Femme": ["Sneakers", "Talons", "Bottes", "Sandales", "Sport"],
      "Homme": ["Sneakers", "Chaussures de ville", "Bottes", "Sport"],
      "Par marque": ["Nike", "Adidas", "Puma", "New Balance"]
    }
  },
  accessoires: {
    icon: <HandbagSimple className="h-4 w-4" />,
    title: "Accessoires",
    featured: ["Nouveautés", "Tendances", "Cadeaux"],
    sections: {
      "Sacs": ["Sacs à main", "Sacs à dos", "Pochettes", "Bagages"],
      "Bijoux": ["Colliers", "Bagues", "Bracelets", "Boucles d'oreilles"],
      "Autres": ["Ceintures", "Écharpes", "Lunettes", "Montres"]
    }
  },
  // ... autres catégories
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

const searchCategories = [
  { id: 'all', label: 'Tous' },
  { id: 'products', label: 'Produits' },
  { id: 'stores', label: 'Boutiques' },
  { id: 'cities', label: 'Villes' },
]
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(searchCategories[0])
  const [showCategories, setShowCategories] = useState(false)
  return (
    <header className="w-full z-[99999] border-b bg-white">
      <div className=" mx-16 px-4 py-3">
        {/* Top bar avec logo, recherche et actions */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex-shrink-0">
            <img
              src={logo}
              alt="AKEVAS"
              className="h-28 w-auto"
            />
          </Link>

          <div className="flex flex-1 max-w-xl items-center gap-2">
          <div className="relative w-full">
          <div className="relative">
                <button
                  onClick={() => setShowCategories(!showCategories)}
                  className="absolute left-0 top-0 h-full px-3 flex items-center gap-1 text-gray-500 hover:text-gray-700 border-r"
                >
                  {selectedCategory.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-32 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                />
                <button className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Categories Dropdown */}
              {showCategories && (
                <div className="absolute top-full z-[999999] left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border">
                  {searchCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowCategories(false)
                      }}
                      className="w-full  px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
              </div>
          </div>

          <div className="flex items-center justify-between gap-8">

                
                    <DropdownAccount>
                    <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                      <User className="h-7 w-7" />
                      <p className="text-sm">Connexion</p>
                      </div>
                    </DropdownAccount>
                
              

                
                    <Link
              to="/cart"
              className="relative text-gray-700 hover:text-[#ed7e0f]"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-[#ed7e0f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

          </div>
        </div>

        {/* Navigation avec menus déroulants */}
        <NavigationMenu className="mt-4  w-full z-[99999]">
          <NavigationMenuList className="flex justify-center mx-12 w-full">
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center w-full gap-2">
                <Tag className="h-4 w-4" />
                Promotion
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 w-[400px]">
                  <ListItem title="Offres du moment" href="/promotions/offres">
                    Découvrez nos meilleures offres
                  </ListItem>
                  <ListItem title="Ventes Flash" href="/promotions/flash">
                    Promotions limitées dans le temps
                  </ListItem>
                  <ListItem title="Outlet" href="/promotions/outlet">
                    Jusqu'à -70% sur une sélection
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {Object.entries(categories).map(([key, category]) => (
              <NavigationMenuItem key={key}>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  {category.icon}
                  {category.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[800px] grid-cols-4 p-6">
                    <div className="col-span-1">
                      <h3 className="font-bold mb-4">À la une</h3>
                      <ul className="space-y-2">
                        {category.featured.map((item) => (
                          <li key={item}>
                            <Link 
                              to={`/${key}/${item.toLowerCase()}`}
                              className="text-sm hover:text-orange-500"
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="col-span-3 grid grid-cols-3 gap-6">
                      {Object.entries(category.sections).map(([section, items]) => (
                        <div key={section}>
                          <h3 className="font-bold mb-4">{section}</h3>
                          <ul className="space-y-2">
                            {items.map((item) => (
                              <li key={item}>
                                <Link 
                                  to={`/${key}/${item.toLowerCase()}`}
                                  className="text-sm hover:text-orange-500"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}

            {/* Autres catégories qui n'ont pas encore de sous-menus détaillés */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Lingerie
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem title="Nouveautés" href="/lingerie/nouveautes">
                    Découvrez les dernières collections
                  </ListItem>
                  <ListItem title="Collections" href="/lingerie/collections">
                    Explorez nos différentes gammes
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Sport
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem title="Vêtements de sport" href="/sport/vetements">
                    Pour tous vos entraînements
                  </ListItem>
                  <ListItem title="Équipement" href="/sport/equipement">
                    Tout le matériel nécessaire
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="flex items-center gap-2">
                <Sparkle className="h-4 w-4" />
                Beauté
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4">
                  <ListItem title="Maquillage" href="/beaute/maquillage">
                    Toutes nos marques de cosmétiques
                  </ListItem>
                  <ListItem title="Soins" href="/beaute/soins">
                    Produits de soin pour le visage et le corps
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  )
}