import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/services/auth";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AppDispatch } from "@/store";
import { useDispatch } from "react-redux";
import { authTokenChange } from "@/store/authSlice";

const formSchema = z.object({
  
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [register, {isLoading}] = useRegisterMutation()
   const dispatch=useDispatch<AppDispatch>();
  const onSubmit=async(values: z.infer<typeof formSchema>) =>{
    // Gérer la soumission du formulaire ici
    console.log(values);
    try{
      const formData={
        userName:values.username,
        email:values.email,
        phone_number:values.phone,
        password:values.password,
      }
      const response=await register(formData)
      console.log(response)
      const userState={
                'refreshToken':response.data.refresh_token,
                'accessToken':response.data.access_token
            }
            
            dispatch(authTokenChange(userState))
            
           window.location.href=`/authenticate?token=${encodeURIComponent(response.data.access_token)}
              //&refresh_token=${encodeURIComponent(response.data.refresh_token)}`
    }catch(error){
      console.log(error)
    }
  }

  return (
   
      
        <Form {...form}>
          <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input className="h-12 px-4 rounded-xl bg-white" placeholder="Nom d'utilisateur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-4">
                                                <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="h-12 px-4 rounded-xl bg-white" placeholder="Email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input className="h-12 px-4 rounded-xl bg-white" placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                </div>


            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input className="h-12 px-4 rounded-xl bg-white" placeholder="Entrez votre mot de passe" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input className="h-12 px-4 rounded-xl bg-white" placeholder="Confirmez votre mot de passe" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} className="w-full h-12 rounded-xl bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white" type="submit">
              {isLoading ? <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-white/90 rounded-full" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                </div>: "S'inscrire"}
            </Button>
          </form>
        </Form>



  );
} 