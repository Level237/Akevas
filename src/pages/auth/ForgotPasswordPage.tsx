import ForgotPasswordForm from "@/components/frontend/forms/ForgotPasswordForm";
import TopBar from "@/components/ui/topBar";

import FloatingHelpButton from "@/components/ui/FloatingHelpButton";
import InstallButton from "@/components/InstallButton";
import Footer from "@/components/ui/footer";
import MobileNav from '@/components/ui/mobile-nav'
import Header from "@/components/ui/header";
export default function ForgotPasswordPage() {
  
  return (
    <div className="relative min-h-screen bg-[#F8F9FC]">

       <div className=" max-sm:ml-0">
              <TopBar />
              <Header />
              
              <main className="relative">
              <ForgotPasswordForm />
              </main>
      
              <MobileNav/>
              <FloatingHelpButton />
              <InstallButton/>
              <Footer />
            </div>
    
    </div>
  );
}
