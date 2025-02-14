

export default function IsLoadingComponents({isLoading}:{isLoading:boolean}) {
  return (
    <>
     {isLoading &&
     <div className="flex items-center w-[100%] justify-center">

        <div className="flex mt-6 w-full justify-center items-center">
              <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-[#ed7e0f] rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>
          </div>
     </div>
          }
    </>
  )
}
