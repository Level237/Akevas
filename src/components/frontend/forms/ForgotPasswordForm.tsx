import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/services/auth";
import { useState } from "react";
import logo from "@/assets/favicon.png"
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      console.log(res);
      if(res.status === 200){
        toast.success("Code OTP envoyé avec succès", {
          position: "bottom-center",
        });
        // Navigate to OTP verification page, passing the email
        navigate('/verify-otp', { state: { email } });
      }
      else{
        toast.error("Code OTP non envoyé", {
          position: "bottom-center",
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Une erreur est survenue", {
        position: "bottom-center",
      });
    }
  }

  return (
    <div className="flex flex-col px-2 py-6 max-w-[1440px] mx-auto mb-44">
      <a href="/login" className="inline-flex items-center gap-2 mx-2 text-orange-600 hover:underline font-medium">
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
          <h1 className="text-3xl max-sm:text-2xl text-center font-semibold tracking-tight">Mot de passe oublié</h1>
        </div>
        
        <p className="text-center text-gray-500 text-sm">
          Entrez votre adresse email pour recevoir un code de réinitialisation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <div className="space-y-2">
            <label className="text-sm" htmlFor="email">Email</label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                placeholder="exemple@email.com"
                required
                type="email"
                autoComplete="email"
                className="h-12 rounded-xl bg-white"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button disabled={isLoading} type="submit" className="w-full py-6 bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90">
            {isLoading ? (
              <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
              </div>
            ) : "Envoyer le code"}
          </Button>
        </form>
      </div>
    </div>
  )
}
