import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginMutation } from "@/services/auth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store";
import { useState } from "react";
import { authTokenChange } from "@/store/authSlice";
export default function LoginForm() {

   const [phone,setPhone]=useState('');
    const [password,setPassword]=useState('');
   const [login,{isLoading,isError,error}]=useLoginMutation()
    const dispatch=useDispatch<AppDispatch>();
    const navigate=useNavigate()

    const handleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
            const userObject={phone_number:phone,password:password}
            const userData=await login(userObject)
            console.log(userObject)
            const userState={
                'refreshToken':userData.data.refresh_token,
                'accessToken':userData.data.access_token
            }
            
            dispatch(authTokenChange(userState))
            
            setPhone('')
            setPassword('')
            navigate(`/authenticate?token=${encodeURIComponent(userData.data.access_token)}
              &refresh_token=${encodeURIComponent(userData.data.refresh_token)}`)
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
          {'data' in error ? JSON.stringify(error.data) : 'Une erreur est survenue'}
        </div>}
        
        <div className="space-y-2">
          <label htmlFor="email">Numéro de Téléphone</label>
          <Input
            id="phone"
            placeholder="Enter your phone"
            required
            type="phone"
            className="py-6"
            name="phone"
            value={phone}
            onChange={(e)=>setPhone(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password">Password</label>
          <Input
            id="password"
            placeholder="Enter your password"
            required
            type="password"
            className="py-6"
            name="password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="h-4 w-4 rounded border-gray-300"
              required
            />
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to all Term, Privacy Policy and Fees
            </label>
          </div>

          <Button disabled={isLoading} type="submit" className="w-full py-6 bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/90">
            {isLoading ? "Connexion..." : "Connexion"}
          </Button>
        </div>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Log in
        </a>
      </p>
    </div>
  </div>
  )
}
