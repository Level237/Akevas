import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
export default function CategorySlider() {
    const settings = {
       dots:true,
        speed: 1500,
        slidesToShow: 7,
        slidesToScroll: 1,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 1000,
        useCSS:true,
      };
  return (
    <Slider {...settings} className='mb-12 flex flex-col justify-center items-center'>
    <div >
        <div className='flex flex-col items-center justify-center gap-4'>
        <div className='w-36 h-36 rounded-full' style={{ background:"url('/sac.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
              
              </div>
              <div>
                <h2 className='text-center text-lg'>Bag</h2>
              </div>
        </div>
            
        </div>
        <div >
            <div className='flex flex-col items-center justify-center gap-4'>
            <div className='w-36 h-36 rounded-full' style={{ background:"url('/man.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
              
              </div>
              <div>
                <h2  className='text-center'>Man</h2>
              </div>
            </div>
           
        </div>
        <div>
        <div className='flex flex-col justify-center items-center gap-4'>
            
            <div className='w-36 h-36 rounded-full' style={{ background:"url('/woman.jpeg')",backgroundPosition:"top",backgroundSize:"cover" }}>
              
            </div>
            <div>
              <h2 className='text-center text-lg'>Woman</h2>
            </div>
        </div>
        </div>
       <div>
       <div className='flex flex-col justify-center items-center gap-4'>
            <div className='w-36 h-36 rounded-full' style={{ background:"url('/shoes1.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
              
            </div>
            <div>
              <h2 className='text-center text-lg'>Shoes</h2>
            </div>
        </div>
       </div>
      
      <div>
        <div className='flex flex-col items-center gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/kids.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
                
                </div>
                <div>
                <h2 className='text-center text-lg'>Bag</h2>
                </div>
            </div>
      </div>
        
        <div>
            <div className='flex flex-col items-center gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/traditional.jpeg')",backgroundPosition:"top",backgroundSize:"cover" }}>
                
                </div>
                <div>
                <h2 className='text-center text-lg'>Traditional</h2>
                </div>
            </div>
        </div>
        
        <div>
            <div className='flex flex-col items-center gap-4'>
                <div className='w-36 h-36 rounded-full' style={{ background:"url('/kids.webp')",backgroundPosition:"top",backgroundSize:"cover" }}>
                
                </div>
                <div>
                <h2 className='text-center text-lg'>Cosmetiques</h2>
                </div>
            </div>
        </div>
      
    </Slider>
  )
}
