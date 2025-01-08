'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, Search, Tag, Shirt, FootprintsIcon as Shoe, ShoppingBagIcon as HandbagSimple, Heart, Dumbbell, Sparkle, ShoppingBag } from 'lucide-react'
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
import React from "react"
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

export default function Header() {
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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="cherchez un produit..."
                className="w-full py-6 pl-10"
              />
            </div>
            <Button className="bg-orange-500 py-6 hover:bg-orange-600">
              Cherchez
            </Button>
          </div>

          <div className="flex items-center justify-between gap-8">

                
                    <DropdownAccount>
                    <div className="flex items-center gap-2 hover:text-orange-600 cursor-pointer">
                      <User className="h-7 w-7" />
                      <p className="text-sm">Connexion</p>
                      </div>
                    </DropdownAccount>
                
              

                
            <div className="relative py-2 flex items-center justify-center gap-2 ">
          
         <ShoppingCart className="h-7 w-7" />
         <div className="">
            <p className="flex h-2 w-2 items-center justify-center rounded-full bg-red-500 p-3 text-xs text-white">0</p>
            <p className="text-sm">Panier</p>
          </div>
        </div>

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

