import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/services/auth";
import { useState } from "react";
import Cookies from "universal-cookie";
import logo from "@/assets/favicon.png"
import { Link } from "react-router-dom";
import { toast } from 'sonner';
export default function LoginForm() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('productId');
  const quantity = params.get('quantity');
  const price = params.get('price');
  const name = params.get('name');
  const residence = params.get('residence');
  const plan = params.get('plan');

  const redirectUrl = params.get('redirect');
  const s = params.get('s');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [, setErrorMessage] = useState('');
  const [login, { isLoading,error }] = useLoginMutation()
  if (error) {
    toast.error('Votre numero de telephone ou votre mot de passe est incorrect', {
      description: "Veuillez verifier vos informations",
      duration: 4000, // ms
    });
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const userObject = { phone_number: phone, password: password, role_id: 2 }
      const userData = await login(userObject)

      const cookies = new Cookies();
      cookies.set('tokenSeller', userData.data.access_token, { path: '/', secure: true });
      cookies.set('refreshTokenSeller', userData.data.refresh_token, { path: '/', secure: true });

      if (redirectUrl) {
        const redirectParams = new URLSearchParams();
        
        if (s) redirectParams.append('s', s);
        if (productId) redirectParams.append('productId', productId);
        if (quantity) redirectParams.append('quantity', quantity);
        if (price) redirectParams.append('price', price);
        if (name) redirectParams.append('name', name);
        if (residence) redirectParams.append('residence', residence);
        if (plan) redirectParams.append('plan', plan);

        const finalRedirectUrl = `${redirectUrl}${redirectParams.toString() ? '?' + redirectParams.toString() : ''}`;
        
        window.location.href = finalRedirectUrl;
      } else {
        setPhone('')
        setPassword('')
        window.location.href = `/authenticate`
      }
    } catch (error) {
      setErrorMessage("Vous n'avez pas accès à cette application")
    }
  }
  return (
    <div className="flex flex-col px-8 py-6 ">
      <div className="mb-2 md:px-2">

      </div>

      <div className="flex flex-col space-y-6 md:px-28">
        <Link to="/">
          <div className="space-y-2 flex justify-center items-center ">

            <img
              src={logo}
              alt="Logo"
              className="h-24"
            />

            <h1 className="text-3xl text-center font-semibold tracking-tight">Connexion</h1>

          </div>
        </Link>




        <form onSubmit={handleSubmit} className="space-y-4">
         

        <div className="space-y-2 mt-3">
            <label className="max-sm:text-sm" htmlFor="phone">Numéro de Téléphone</label>
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
            <label htmlFor="password">Password</label>
            <div className="relative">
              <Input
                id="password"
                placeholder="Enter your password"
                required
                type={showPassword ? 'text' : 'password'}
                className="py-6 rounded-xl bg-white pr-12"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Cacher le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? (
                  // Oeil barré (mot de passe visible)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-7 0-1.07.37-2.09 1.02-2.97m2.13-2.13A9.97 9.97 0 0112 5c5 0 9 4.03 9 7 0 1.07-.37 2.09-1.02 2.97m-2.13 2.13A9.97 9.97 0 0112 19c-1.07 0-2.09-.37-2.97-1.02m-2.13-2.13L3 3m18 18l-1.41-1.41" />
                  </svg>
                ) : (
                  // Oeil ouvert (mot de passe caché)
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-12 ">


            <Button disabled={isLoading} type="submit" className="w-full mt-12 py-6 bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90">
              {isLoading ? <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
              </div> : "Connexion"}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/seller/guide" className="text-primary hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
