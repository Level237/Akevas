import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, ShoppingCart, User, ChevronDown, X } from 'lucide-react'
import logo from "../../assets/logo.png"

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
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
                  className="w-full pl-32 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                />
                <button className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700">
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Categories Dropdown */}
              {showCategories && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border">
                  {searchCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowCategories(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/seller/register"
              className="text-gray-700 hover:text-[#ed7e0f]"
            >
              Vendre
            </Link>
            <Link to="/account" className="text-gray-700 hover:text-[#ed7e0f]">
              <User className="w-6 h-6" />
            </Link>
            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-[#ed7e0f]"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-[#ed7e0f] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden py-3">
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
              className="w-full pl-32 pr-12 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
            />
            <button className="absolute right-0 top-0 h-full px-3 text-gray-500 hover:text-gray-700">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Categories Dropdown - Mobile */}
          {showCategories && (
            <div className="absolute left-4 right-4 mt-1 bg-white rounded-lg shadow-lg border z-50">
              {searchCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category)
                    setShowCategories(false)
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-4">
              <Link
                to="/seller/register"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Vendre
              </Link>
              <Link
                to="/account"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Mon compte
              </Link>
              <Link
                to="/cart"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Panier (0)
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
