import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPasswordMutation } from "@/services/auth";
import { useState } from "react";
import logo from "@/assets/favicon.png"
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas", {
        position: "bottom-center",
      });
      return;
    }

    try {
      await resetPassword({ email, password, password_confirmation: confirmPassword }).unwrap();
      toast.success("Mot de passe réinitialisé avec succès", {
        position: "bottom-center",
      });
      navigate('/login');
    } catch (error: any) {
      toast.error(error?.data?.message || "Une erreur est survenue", {
        position: "bottom-center",
      });
    }
  }

  return (
    <div className="flex flex-col px-2 py-6">
      <div className="flex flex-col xl:mx-64 xl:justify-center xl:mt-44 space-y-2 md:px-16 mx-16 max-sm:mx-1">
        <div className="space-y-2 flex justify-center items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-24 max-sm:h-16"
          />
          <h1 className="text-3xl max-sm:text-2xl text-center font-semibold tracking-tight">Nouveau mot de passe</h1>
        </div>
        
        <p className="text-center text-gray-500 text-sm">
          Entrez votre nouveau mot de passe pour le compte {email}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 mt-8">
          <div className="space-y-2">
            <label className="text-sm" htmlFor="password">Nouveau mot de passe</label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Entrez votre nouveau mot de passe"
                required
                type={showPassword ? "text" : "password"}
                className="py-6 max-sm:placeholder:text-sm rounded-xl bg-white pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm" htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <div className="relative">
              <Input
                id="confirmPassword"
                placeholder="Confirmez votre nouveau mot de passe"
                required
                type={showConfirmPassword ? "text" : "password"}
                className="py-6 max-sm:placeholder:text-sm rounded-xl bg-white pr-12"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button disabled={isLoading} type="submit" className="w-full py-6 bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90">
            {isLoading ? (
              <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
              </div>
            ) : "Réinitialiser le mot de passe"}
          </Button>
        </form>
      </div>
    </div>
  )
}
