import AsyncLink from './AsyncLink';

const MenuNavigation = () => {
    return (
        <nav className="flex justify-center w-full">
                        <ul className="flex justify-center items-center gap-8">
                          <li className="py-4">
                            <AsyncLink to="/" className="flex text-sm items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
                              
                              <span  className="text-md">Accueil</span>
                            </AsyncLink>
                          </li>
                          
                          <li className="py-4">
                            <AsyncLink to="/seller/guide" className="flex text-sm items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
                              
                              <span className="text-md">Guide du vendeur</span>
                            </AsyncLink>
                          </li>
                          
                          <li className="py-4">
                            <AsyncLink to="/seller/dashboard" className="flex text-sm items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
                             
                              <span className="text-md">Espace Vendeur</span>
                            </AsyncLink>
                          </li>
                          
                          <li className="py-4">
                            <a href='https://akevas.com/shops' target="_blank" className="flex text-sm items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
              
                              <span className="text-md">Marketplace</span>
                            </a>
                          </li>
                          
                          <li className="py-4">
                            <AsyncLink to="/contact" className="flex text-sm items-center gap-2 text-gray-700 hover:text-orange-500 transition-colors">
                              
                              <span className="text-md">Contact</span>
                            </AsyncLink>
                          </li>
                        </ul>
                      </nav>    
    )
     
}   

export default MenuNavigation