import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVerifyOtpMutation } from "@/services/auth";
import { useState } from "react";
import logo from "@/assets/favicon.png"
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OtpVerificationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState('');
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ email, otp_code: otp }).unwrap();

      if(res.temp_token){
        toast.success("Code vérifié avec succès", {
          position: "bottom-center",
        });
        // Redirect to reset password page
        navigate(`/reset-password/${res.temp_token}`, { state: { email } }); 
      }
      
    } catch (error: any) {
      toast.error(error?.data?.message || "Code incorrect", {
        position: "bottom-center",
      });
    }
  }

  return (
    <div className="flex flex-col px-2 py-6 max-w-[1440px] mx-auto mb-44">
      <a href="/forgot-password" className="inline-flex items-center gap-2 mx-2 text-orange-600 hover:underline font-medium">
        <ArrowLeft className="w-5 h-5" />
        Retour
      </a>

      <div className="flex flex-col xl:mx-64 xl:justify-center xl:mt-44 space-y-2 md:px-16 mx-16 max-sm:mx-1">
        <div className="space-y-2 flex justify-center items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-24 max-sm:h-16"
          />
          <h1 className="text-3xl max-sm:text-2xl text-center font-semibold tracking-tight">Vérification OTP</h1>
        </div>
        
        <p className="text-center text-gray-500 text-sm">
          Entrez le code envoyé à {email}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <div className="space-y-2">
            <label className="text-sm" htmlFor="otp">Code OTP</label>
            <Input
              id="otp"
              name="otp"
              placeholder="XXXXXX"
              required
              type="text"
              className="h-12 text-center text-lg tracking-widest rounded-xl bg-white"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>

          <Button disabled={isLoading} type="submit" className="w-full py-6 bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90">
            {isLoading ? (
              <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
              </div>
            ) : "Vérifier"}
          </Button>
        </form>
      </div>
    </div>
  )
}
