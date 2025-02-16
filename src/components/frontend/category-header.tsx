
import { Button } from '../ui/button'
import { AlignJustify } from 'lucide-react'


export default function CategoryHeader() {
  return (
    <div className='flex items-center flex-row justify-between mt-4 gap-6'>
        <div className='flex items-center gap-3 justify-center'>
        <AlignJustify /><h2 className='text-sm'>Naviguez par catégorie</h2>
        </div>
        <div className=' flex gap-8 items-center justify-center'>
        <div>
                <h2 className='text-sm'>Vetements</h2>
            </div>
            <div>
                <h2 className='text-sm'>Chaussures</h2>
            </div>
            <div>
                <h2 className='text-sm'>Accessoires</h2>
            </div>
            <div>
                <h2 className='text-sm'>Bijoux</h2>
            </div>
            <div>
                <h2 className='text-sm'>Sport</h2>
            </div>
            <div>
                <h2 className='text-sm'>Cosmétiques & Beauté</h2>
            </div>
            <div>
                <h2 className='text-sm'>Traditionnels</h2>
            </div>
        </div>
            <div className=''>
                <Button>Créer ma boutique</Button>
            </div>
          </div>
  )
}
