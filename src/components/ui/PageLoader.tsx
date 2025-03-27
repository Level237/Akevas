import logo from '../../assets/favicon.png'
const PageLoader = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-12">
        <div className="relative">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-24 h-24"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-[#ed7e0f] animate-loading" />
            </div>
          </div>
        </div>
        <p className="text-[#ed7e0f] absolute bottom-12 text-lg font-medium">
          Made with Akevas
        </p>
      </div>
    </div>
  );
};

export default PageLoader; 