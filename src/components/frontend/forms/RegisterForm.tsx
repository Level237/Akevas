import { Button } from "@/components/ui/button";
import { useLoginMutation, useRegisterMutation } from "@/services/auth";
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

import { Eye, EyeOff, Check } from "lucide-react";


const formSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Le numéro de téléphone doit contenir au moins 8 caractères"),
  town: z.string().min(1, "Veuillez sélectionner une ville"),
  quarter: z.string().min(1, "Veuillez sélectionner un quartier"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, "Vous devez accepter les conditions générales")
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
      acceptTerms: false,
    },
  });
  const [login] = useLoginMutation()
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
      await register(formData)

      const userObject = { phone_number: values.phone, password: values.password, role_id: 3 }
      await login(userObject)
      window.location.href = `/authenticate`
    } catch (error) {
      console.log(error)
    }
  }

  const [townId, setTownId] = useState<string>('');

  const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');
  console.log(towns)
  const { data: { data: quarters } = {}, isLoading: quartersLoading } = useGetQuartersQuery('guard');
  console.log(quarters)

  const filteredQuarters = quarters?.filter((quarter: { town_id: number }) => quarter.town_id === parseInt(townId));

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section Informations personnelles */}
        <div
          className="space-y-8"
        >
          {/* Informations de base */}
          <div className="space-y-6">


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                        placeholder="John Doe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        className="h-12 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                        placeholder="john@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Téléphone et localisation */}
          <div className="space-y-2">


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Téléphone</FormLabel>
                    <FormControl>
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
                          className="flex-1 h-12 border-none bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400 rounded-r-xl"
                          placeholder="6XX XXX XXX"
                          {...field}
                          onChange={e => {
                            const value = e.target.value.replace(/^\+?237\s?/, '');
                            field.onChange(value);
                          }}
                          style={{ boxShadow: 'none' }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="town"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Ville</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setTownId(value);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                          <SelectValue placeholder="Sélectionnez une ville" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-gray-200">
                        {townsLoading ? (
                          <SelectItem value="loading">
                            <div className="flex items-center gap-2">
                              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                              Chargement...
                            </div>
                          </SelectItem>
                        ) : (
                          towns.map((town: { id: string, town_name: string }) => (
                            <SelectItem key={town.id} value={String(town.id)}>
                              {town.town_name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="quarter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-medium">Quartier</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-12 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all">
                        <SelectValue placeholder="Sélectionnez un quartier" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-gray-200">
                      {quartersLoading ? (
                        <SelectItem value="loading">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                            Chargement...
                          </div>
                        </SelectItem>
                      ) : (
                        filteredQuarters?.map((quarter: { id: string, quarter_name: string }) => (
                          <SelectItem key={quarter.id} value={String(quarter.id)}>
                            {quarter.quarter_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>

          {/* Sécurité */}
          <div className="space-y-6">


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Mot de passe</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="h-12 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all pr-10"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Confirmer le mot de passe</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          className="h-12 px-4 rounded-xl bg-white/80 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all pr-10"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Conditions générales */}
          <div className="space-y-6">


            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <FormField
                control={form.control}
                name="acceptTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-4 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1 w-5 h-5 text-blue-600 bg-white border-2 border-gray-300 rounded-md focus:ring-blue-500 focus:ring-2 cursor-pointer hover:border-blue-400 transition-colors"
                      />
                    </FormControl>
                    <div className="space-y-2 leading-none">
                      <FormLabel className="text-sm  text-gray-700 cursor-pointer font-medium">
                        J'accepte les{" "}
                        <a href="/terms" className="text-blue-600 hover:text-blue-700 underline font-semibold">
                          conditions générales
                        </a>{" "}
                        et la{" "}
                        <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline font-semibold">
                          politique de confidentialité
                        </a>
                      </FormLabel>
                      <p className="text-xs text-gray-500">
                        En cochant cette case, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                      </p>
                      <FormMessage className="text-red-500" />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div

        >
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <Button
              disabled={isLoading}
              className="w-full h-14 rounded-2xl bg-[#ed7e0f] text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl"
              type="submit"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" />
                  <span>Inscription en cours...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Check className="w-6 h-6" />
                  <span>Créer mon compte</span>
                </div>
              )}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
              En créant votre compte, vous acceptez nos conditions d'utilisation
            </p>
          </div>
        </div>
      </form>
    </Form>
  );
} 