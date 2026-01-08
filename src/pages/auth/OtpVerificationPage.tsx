import OtpVerificationForm from "@/components/frontend/forms/OtpVerificationForm";;

import TopBar from "@/components/ui/topBar";
import Header from "@/components/ui/header";
import FloatingHelpButton from "@/components/ui/FloatingHelpButton";
import InstallButton from "@/components/InstallButton";
import Footer from "@/components/ui/footer";
import MobileNav from '@/components/ui/mobile-nav'
export default function OtpVerificationPage() {
  return (
    <div className="relative min-h-screen bg-[#F8F9FC]">
   
          <div className=" max-sm:ml-0">
                 <TopBar />
                 <Header />
                 
                 <main className="relative">
                 <OtpVerificationForm />
                 </main>
         
                 <MobileNav/>
                 <FloatingHelpButton />
                 <InstallButton/>
                 <Footer />
               </div>
       
       </div>
  );
}
