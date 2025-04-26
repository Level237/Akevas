
import { ArrowRight} from "lucide-react"
import { Link } from "react-router-dom"

interface Category {
  id: string
  name: string
  description: string
  image: string
}

export default function CategoryGridList({categories, isLoading,title}: {categories: Category[], isLoading: boolean,title:string}) {
  // Ces données seraient normalement récupérées depuis une API ou une base de données
  const categoriesData: Category[] = [
    {
      id: "1",
      name: "Électronique",
      description: "Smartphones, ordinateurs et accessoires high-tech",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      id: "2",
      name: "Mode",
      description: "Vêtements, chaussures et accessoires tendance",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      id: "3",
      name: "Maison",
      description: "Meubles, décoration et articles pour la maison",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      id: "4",
      name: "Sport",
      description: "Équipements et vêtements pour tous les sports",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      id: "5",
      name: "Beauté",
      description: "Cosmétiques, parfums et soins personnels",
      image: "/placeholder.svg?height=600&width=800",
    },
    {
      id: "6",
      name: "Livres",
      description: "Romans, BD et livres spécialisés",
      image: "/placeholder.svg?height=600&width=800",
    },
  ]

  return (
    <section className="w-full py-12 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
          <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Explorez nos catégories</div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Découvrez notre sélection</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Parcourez nos catégories soigneusement sélectionnées pour trouver exactement ce que vous cherchez.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {!isLoading && categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group relative overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/50 to-black/0 transition-opacity group-hover:via-black/30" />
              <img
                src={category.category_profile || "/placeholder.svg"}
                alt={category.category_name}
                width={800}
                height={600}
                className="h-[300px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
                <h3 className="mb-2 text-xl font-bold text-white">{category.category_name}</h3>
                <p className="mb-4 text-sm text-white/90">{category.category_description}</p>
                <div className="flex items-center text-white">
                  <span className="text-sm font-medium">Explorer</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
