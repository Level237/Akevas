import { Button } from "@/components/ui/button";
import { useVerifyOtpMutation, useForgotPasswordMutation } from "@/services/auth";
import { useState, useRef } from "react";
import logo from "@/assets/favicon.png"
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function OtpVerificationForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: isResending }] = useForgotPasswordMutation();

  // Mask email function
  const maskEmail = (email: string) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;
    const maskedName = name.length > 4 
      ? name.substring(0, 4) + '*'.repeat(name.length - 4) 
      : name.substring(0, 1) + '*'.repeat(name.length - 1);
    return `${maskedName}@${domain}`;
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "") {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.every(char => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedData.forEach((val, i) => {
        if (i < 6) newOtp[i] = val;
      });
      setOtp(newOtp);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      await forgotPassword({ email }).unwrap();
      toast.success("Code renvoyé avec succès", {
        position: "bottom-center",
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Erreur lors du renvoi", {
        position: "bottom-center",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Veuillez entrer le code complet", {
        position: "bottom-center",
      });
      return;
    }

    try {
      const res = await verifyOtp({ email:email, otp: otpCode }).unwrap();
      console.log(res)
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
          Entrez le code envoyé à <span className="font-medium text-gray-900">{maskEmail(email)}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8 mt-8">
          <div className="flex justify-center gap-2 sm:gap-4">
            {otp.map((data, index) => (
              <input
                className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:border-[#ed7e0f] focus:ring-1 focus:ring-[#ed7e0f] outline-none transition-all"
                type="text"
                name="otp"
                maxLength={1}
                key={index}
                value={data}
                ref={(el) => { inputRefs.current[index] = el }}
                onChange={e => handleChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                onPaste={handlePaste}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>

          <div className="space-y-4">
            <Button disabled={isLoading} type="submit" className="w-full py-6 bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90">
              {isLoading ? (
                <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : "Vérifier"}
            </Button>

            <div className="text-center text-sm">
              <p className="text-gray-500">
                Vous n'avez pas reçu le code ?{" "}
                <button 
                  type="button" 
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-[#ed7e0f] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? "Envoi..." : "Renvoyer le code"}
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
