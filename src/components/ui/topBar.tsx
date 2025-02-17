import { Button } from './button'
import AsyncLink from './AsyncLink'
import { useGetUserQuery } from '@/services/auth'


export default function TopBar() {
  const {data:userData,isLoading}=useGetUserQuery('Auth')
  let content:React.ReactNode;
  if (isLoading && !userData) {
    content=<><div className='bg-gray-300 animate-pulse py-3'>
        <div className='flex items-center gap-3 justify-center max-sm:mx-2 mx-16'>
          <div>
            <div className='h-6 w-48 bg-gray-300 animate-pulse rounded'></div>
          </div>
          <div>
            <div className='h-10 w-36 bg-gray-300 animate-pulse rounded'></div>
          </div>
        </div>
      </div></>
    
  }else if(!userData){
    content=<div className='bg-[#6E0A13] py-3'>
        <div className='flex items-center gap-3 justify-center max-sm:mx-2 mx-16'>
            <div>
              <h2 className='text-lg max-sm:text-xs font-bold text-white'>DEVENEZ VENDEUR SUR AKEVAS</h2>
            </div>
            <div>
              <AsyncLink to="/seller/guide">
                <Button className='bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-md max-sm:text-sm font-bold'>Créer votre boutique</Button>
              </AsyncLink>
            </div>
        </div>
    </div>
  }

  return content;
}
