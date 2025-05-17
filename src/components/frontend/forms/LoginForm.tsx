import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/services/auth";
import { useState } from "react";
import Cookies from "universal-cookie";
import logo from "@/assets/favicon.png"
export default function LoginForm() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('productId');
  const quantity = params.get('quantity');
  const price = params.get('price');
  const name = params.get('name');
  const residence = params.get('residence');

  const redirectUrl = params.get('redirect');
  const s = params.get('s');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [login, { isLoading, isError, error }] = useLoginMutation()
  if (error) {
    console.log(error)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const userObject = { phone_number: phone, password: password, role_id: 3 }
      const userData = await login(userObject)

      const cookies = new Cookies();
      cookies.set('accessToken', userData.data.access_token, { path: '/', secure: true });
      cookies.set('refreshToken', userData.data.refresh_token, { path: '/', secure: true });


      if (redirectUrl) {
        if (s === '1') {
          window.location.href = redirectUrl + `?s=${s}`
        } else {
          window.location.href = redirectUrl + `?s=${s}&productId=${productId}&quantity=${quantity}&price=${price}&name=${name}&residence=${residence}`
        }
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
        <div className="space-y-2 flex justify-center items-center ">
          <img
            src={logo}
            alt="Logo"
            className="h-24 max-sm:h-16"
          />
          <h1 className="text-3xl max-sm:text-2xl text-center font-semibold tracking-tight">Connexion</h1>
          
        </div>





        <form onSubmit={handleSubmit} className="space-y-4">
          {isError && <div className='rounded-sm text-red-500 text-center w-[100%]'>
            {isError && <div className='rounded-sm text-red-500 text-center w-[100%]'>
              {errorMessage}
            </div>}
          </div>}

          <div className="space-y-2 mt-3">
            <label className="max-sm:text-sm" htmlFor="email">Numéro de Téléphone</label>
            <Input
              id="phone"
              placeholder="Enter your phone"
              required
              type="phone"
              autoComplete='billing home email webauthn'
              className="py-6 max-sm:placeholder:text-sm rounded-xl bg-white"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="max-sm:text-sm" htmlFor="password">Password</label>
            <Input
              id="password"
              placeholder="Enter your password"
              required
              type="password"
              className="py-6 max-sm:placeholder:text-sm rounded-xl bg-white"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-12 max-sm:space-y-5">


            <Button disabled={isLoading} type="submit" className="w-full max-sm:mt-4 mt-12 py-6 bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90">
              {isLoading ? <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                <span className="sr-only">Loading...</span>
              </div> : "Connexion"}
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
    </div>
  )
}
