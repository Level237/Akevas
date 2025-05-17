import logo from '../../assets/favicon.png'
const PageLoader = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-12">
        <div className="relative">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-24 max-sm:w-16 max-sm:h-16 h-24"
          />
          <div className="absolute -bottom-4 max-sm:-bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-full max-sm:w-12 h-full bg-[#ed7e0f] animate-loading" />
            </div>
          </div>
        </div>
        <p className="text-[#ed7e0f] max-sm:text-sm absolute bottom-12 text-lg font-medium">
          Made with Akevas
        </p>
      </div>
    </div>
  );
};

export default PageLoader; 