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
            <Input
              id="password"
              placeholder="Enter your password"
              required
              type="password"
              className="py-6 rounded-xl bg-white"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
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
