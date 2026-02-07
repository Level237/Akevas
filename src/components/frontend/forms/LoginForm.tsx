import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/services/auth";
import { useState } from "react";
import logo from "@/assets/favicon.png"
import { toast } from "sonner";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('productId');
  const quantity = params.get('quantity');
  const price = params.get('price');
  const name = params.get('name');
  const residence = params.get('residence');
  const navigate = useNavigate();
  const code = params.get("code");
  const redirectUrl = params.get('redirect');
  const s = params.get('s');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [login, { isLoading, isError, error }] = useLoginMutation()
  if (error) {
    toast.error("Vous n'avez pas accès à cette application", {
      position: "bottom-center",
      duration: 6000,
    })
  }





  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const userObject = { phone_number: phone, password: password, role_id: 3 }
      const res = await login(userObject)
      console.log(res)

      if (redirectUrl) {
        if (s === '1') {
          window.location.href = redirectUrl + `?s=${s}`
        } else {
          window.location.href = redirectUrl + `?s=${s}&productId=${productId}&quantity=${quantity}&price=${price}&name=${name}&residence=${residence}`
        }
      } else if (res.error) {
        setErrorMessage("Vous n'avez pas accès à cette application")
      }

      else {
        setPhone('')
        setPassword('')
        navigate('/authenticate', { replace: true });
      }
    } catch (error) {


    }
  }
  const handleGoogleSignIn = () => {
    try {
      setGoogleLoading(true);

      // 1. Définir l'URL de base de l'API
      const API_BASE_URL = "https://api.akevas.com";

      // 2. Construire l'URL exacte de la route d'initialisation (GET /api/v1/auth/google)
      // Assurez-vous que le préfixe de votre groupe de route est bien 'api/v1' ou adaptez-le
      const oauthUrl = new URL(API_BASE_URL + "/api/auth/google");

      // 3. Définir l'URL d'origine du frontend (d'où vient la requête)
      // C'est ce que votre contrôleur Laravel utilise pour rediriger l'utilisateur à la fin.
      const originUrl = window.location.origin; // Ex: https://akevas.com

      // 4. Ajouter le paramètre 'origin_url' requis par la fonction redirectToGoogle
      oauthUrl.searchParams.set("origin_url", originUrl);

      // OPTIONNEL : Si vous devez passer un paramètre de redirection spécifique à votre frontend,
      // vous pouvez utiliser un second paramètre 'frontend_redirect_path'
      // if (redirectUrl) {
      //   oauthUrl.searchParams.set("frontend_redirect_path", redirectUrl); 
      // }

      // 5. Rediriger le navigateur vers l'API Laravel
      window.location.href = oauthUrl.toString();

    } catch (err) {
      setGoogleLoading(false);
      toast.error("Échec de la redirection vers Google", {
        position: "bottom-center",
      });
    }
  }
  return (
    <div className="flex  flex-col px-2 py-6 ">
      <a href="/" className="inline-flex  items-center gap-2 mx-2 text-orange-600 hover:underline font-medium">
        <ArrowLeft className="w-5 h-5" />

      </a>


      <div className="flex  flex-col space-y-1 md:px-28">
        <div className="space-y-2  flex justify-center items-center ">
          <img
            src={logo}
            alt="Logo"
            className="h-24 max-sm:h-16"
          />
          <h1 className="text-3xl max-sm:text-2xl text-center font-semibold tracking-tight">Connexion</h1>
        </div>
        {code == "500" && <div className='rounded-sm text-red-500 text-center w-[100%]'>
          <div className='rounded-sm text-red-500 text-center w-[100%]'>
            Cette adresse email n'est pas autorisée dans l'espace client

          </div>
        </div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isError && <div className='rounded-sm text-red-500 text-center w-[100%]'>
            {isError && <div className='rounded-sm text-red-500 text-center w-[100%]'>
              {errorMessage}

            </div>}
          </div>}
          {code == "401" && <div className='rounded-sm text-red-500 text-center w-[100%]'>
            <div className='rounded-sm text-red-500 text-center w-[100%]'>
              Cette adresse email  n'existe pas dans notre base de données. Veuillez vous enregistrer d'abord.

            </div>
          </div>}
          <div className="space-y-2">
            <label className="text-sm" htmlFor="phone">Numéro de Téléphone</label>
            <div className="flex items-center bg-white/80 rounded-xl shadow-sm border border-gray-200 focus-within:border-blue-500 transition-all">
              <button
                type="button"
                className="flex items-center justify-center w-10 h-10 rounded-l-xl border-none focus:outline-none cursor-default"
                tabIndex={-1}
                disabled
              >
                <span role="img" aria-label="Cameroun" className="text-white text-sm">🇨🇲</span>
              </button>
              <span className="px-3 text-gray-700 font-semibold select-none text-sm bg-gray-50">+237</span>
              <Input
                id="phone"
                name="phone"
                placeholder="6XX XXX XXX"
                required
                type="tel"
                autoComplete="tel"
                className="flex-1 h-12 border-none bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400 rounded-r-xl"
                value={phone}
                onChange={e => {
                  // Empêche d'entrer le préfixe
                  const value = e.target.value.replace(/^\+?237\s?/, '');
                  setPhone(value);
                }}
                style={{ boxShadow: 'none' }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm" htmlFor="password">Password</label>
              <a href="/forgot-password" className="text-sm font-medium text-[#ed7e0f] hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                placeholder="Enter your password"
                required
                type={showPassword ? "text" : "password"}
                className="py-6 max-sm:placeholder:text-sm rounded-xl bg-white pr-12"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                tabIndex={-1}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-4 max-sm:space-y-5">
            <Button disabled={isLoading} type="submit" className="w-full max-sm:mt-4 mt-2 py-6 bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90">
              {isLoading ? <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
              </div> : "Connexion"}
            </Button>
            <div className="flex items-center gap-3 my-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-500">ou</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              variant="outline"
              className="w-full py-6 bg-white hover:bg-gray-50 border-gray-200 rounded-xl flex items-center justify-center gap-3"
            >
              {/* Google "G" mark as inline SVG */}
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.9 29.4 36 24 36 16.8 36 11 30.2 11 23s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.7 4.7 29.6 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 19.3-7.6 21-17.5.1-.8.1-1.6.1-2.4 0-1.4-.1-2.3-.5-4.6z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.7 18.9 12 24 12c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.7 4.7 29.6 3 24 3 16 3 9.1 7.5 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 45c5.3 0 10.1-2 13.6-5.3l-6.3-5.2C29.2 35.6 26.8 36 24 36c-5.3 0-9.8-3.1-11.8-7.5l-6.6 5.1C8.4 40.3 15.7 45 24 45z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.1-4 5.6-7.3 6.5l6.3 5.2C36.6 37.5 39 32.2 39 26c0-1.6-.1-2.7-.4-3.9z" />
              </svg>
              {googleLoading ? (
                <div className="animate-spin inline-block size-5 border-[2px] border-current border-t-transparent text-gray-700 rounded-full" role="status" aria-label="loading">
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <span className="text-gray-800 font-medium">Continuer avec Google</span>
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/register" className="text-primary hover:underline">
            Register
          </a>
        </p>
      </div>
    </div >
  )
}
