

import AsyncLink from '../ui/AsyncLink';
const GenderNavigationMobile = () => {
  return         <div className="hidden w-full z-50 justify-center max-sm:flex items-center gap-6 py-6 bg-white/80 backdrop-blur-sm shadow-lg">
  <AsyncLink to="/home?g=homme" className="relative group px-4 py-2 rounded-full hover:bg-orange-50 transition-all duration-300">
    <span className="text-md font-semibold text-gray-800 group-hover:text-[#ed7e0f] transition-colors flex items-center">
      
      HOMME
    </span>
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[#ed7e0f] opacity-0 transition-all duration-300 group-hover:w-3/4 group-hover:opacity-100"></span>
  </AsyncLink>

  <AsyncLink to="/home?g=femme" className="relative group px-4 py-2 rounded-full hover:bg-orange-50 transition-all duration-300">
    <span className="text-md font-semibold text-gray-800 group-hover:text-[#ed7e0f] transition-colors flex items-center">
      
      FEMME
    </span>
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[#ed7e0f] opacity-0 transition-all duration-300 group-hover:w-3/4 group-hover:opacity-100"></span>
  </AsyncLink>

  <AsyncLink to="/home?g=enfant" className="relative group px-4 py-2 rounded-full hover:bg-orange-50 transition-all duration-300">
    <span className="text-md font-semibold text-gray-800 group-hover:text-[#ed7e0f] transition-colors flex items-center">
      
      ENFANT
    </span>
    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-[#ed7e0f] opacity-0 transition-all duration-300 group-hover:w-3/4 group-hover:opacity-100"></span>
  </AsyncLink>
</div>
};

export default GenderNavigationMobile;