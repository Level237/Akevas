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

      <div className="flex flex-col space-y-6 md:px-16">
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
            <label htmlFor="email">Numéro de Téléphone</label>
            <Input
              id="phone"
              placeholder="Enter your phone"
              required
              type="phone"
              autoComplete='billing home email webauthn'
              className="py-6 rounded-xl bg-white"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
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
