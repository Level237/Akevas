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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCheckIfEmailExistsMutation, useGetQuartersQuery, useGetTownsQuery } from "@/services/guardService";
import { useState } from "react";
import Cookies from "universal-cookie";


const formSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  town: z.string().min(1, "Veuillez sélectionner une ville"),
  quarter: z.string().min(1, "Veuillez sélectionner un quartier"),
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
      town: "",
      quarter: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [register, { isLoading }] = useRegisterMutation()
  const [checkIfEmailExists] = useCheckIfEmailExistsMutation()
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {

      const form = new FormData()
      form.append("email", values.email)
      form.append("phone", values.phone)
      form.append("userName", values.username)
      const check = await checkIfEmailExists(form)
      console.log(check)
      if (check.error) {
        alert("ce mail ou ce numéro de téléphone ou ce nom d'utilisateur existe déjà");

        return;
      }
      const formData = {
        userName: values.username,
        email: values.email,
        phone_number: values.phone,
        password: values.password,
        residence: values.quarter
      }
      const response = await register(formData)

      const cookies = new Cookies();
      cookies.set('accessToken', response.data.access_token, { path: '/', secure: true });
      cookies.set('refreshToken', response.data.refresh_token, { path: '/', secure: true });

      window.location.href = `/authenticate`
    } catch (error) {
      console.log(error)
    }
  }

  const [townId, setTownId] = useState<string>('');

  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');

  const { data: quarters, isLoading: quartersLoading } = useGetQuartersQuery('guard');

  const filteredQuarters = quarters?.quarters.filter((quarter: { town_id: number }) => quarter.town_id === parseInt(townId));
  return (


    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <div className="grid max-sm:grid-cols-1 w-[100%] grid-cols-2 gap-4">
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="h-12 px-4 w-full rounded-xl bg-white" placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid max-sm:grid-cols-1 w-[100%] grid-cols-2 gap-4">

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
          <FormField
            control={form.control}
            name="town"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ville</FormLabel>
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  setTownId(value);

                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 px-4 rounded-xl bg-white">
                      <SelectValue placeholder="Sélectionnez une ville" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {townsLoading ? (
                      <SelectItem value="loading">Chargement des villes...</SelectItem>
                    ) : (
                      towns?.towns.map((town: { id: string, town_name: string }) => (
                        <SelectItem key={town.id} value={String(town.id)}>
                          {town.town_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


          <FormField
            control={form.control}
            name="quarter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quartier</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 px-4 rounded-xl bg-white">
                      <SelectValue placeholder="Sélectionnez un quartier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {quartersLoading ? (
                      <SelectItem value="loading">Chargement des quartiers...</SelectItem>
                    ) : (
                      filteredQuarters?.map((quarter: { id: string, quarter_name: string }) => (
                        <SelectItem key={quarter.id} value={String(quarter.id)}>
                          {quarter.quarter_name}
                        </SelectItem>
                      ))
                    )}
                    {filteredQuarters?.length === 0 && (
                      <SelectItem value="no-quarters">Aucun quartier trouvé,veuillez verifier votre ville</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>



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
          </div> : "S'inscrire"}
        </Button>
      </form>
    </Form>



  );
} 