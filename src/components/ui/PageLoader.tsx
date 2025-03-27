import logo from '../../assets/favicon.png'
const PageLoader = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-16 h-16"
          />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary animate-loading" />
            </div>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          Made with Akevas
        </p>
      </div>
    </div>
  );
};

export default PageLoader; 