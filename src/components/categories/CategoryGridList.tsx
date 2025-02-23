
export default function CategoryGridList({categories,isLoading,title}:{categories:any,isLoading:boolean,title:string}) {
  return (
    <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {!isLoading && categories.map((category:any) => (
            <div key={category.name} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg aspect-square">
                <img 
                  src={category.category_profile} 
                  alt={category.category_name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-semibold">{category.category_name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}
