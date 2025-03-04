import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/services/auth";
import { useState } from "react";
import Cookies from "universal-cookie";
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
  const [login, { isLoading, isError, error }] = useLoginMutation()
  if (error) {
    console.log(error)
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userObject = { phone_number: phone, password: password }
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
  }
  return (
    <div className="flex flex-col px-8 py-12 ">
      <div className="mb-2 md:px-2">

      </div>

      <div className="flex flex-col space-y-6 md:px-16">
        <div className="space-y-2">
          <h1 className="text-3xl text-center font-semibold tracking-tight">Connexion</h1>
          <p className="text-md text-center text-muted-foreground">
            Let's get started with your 30 days free trial
          </p>
        </div>

        <Button variant="outline" className="flex items-center justify-center py-6 space-x-2">
          <svg viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
          Login with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isError && <div className='rounded-sm text-red-500 text-center w-[100%]'>
            {'data' in error ? JSON.stringify(error.data) : 'le numero de telephone ou le mot de passe est incorrect'}
          </div>}

          <div className="space-y-2">
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
          <a href="/register" className="text-primary hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
