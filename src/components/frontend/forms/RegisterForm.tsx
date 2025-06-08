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
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";


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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Section Informations personnelles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input 
                      className="h-12 px-4 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all"
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
                  <FormLabel className="text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input 
                      className="h-12 px-4 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all"
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

          <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Téléphone</FormLabel>
                  <FormControl>
                    <Input 
                      className="h-12 px-4 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all"
                      placeholder="+237 6XX XXX XXX"
                      {...field}
                    />
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
                  <FormLabel className="text-gray-700">Ville</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTownId(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 px-4 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all">
                        <SelectValue placeholder="Sélectionnez une ville" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-gray-200">
                      {townsLoading ? (
                        <SelectItem value="loading">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full" />
                            Chargement...
                          </div>
                        </SelectItem>
                      ) : (
                        towns?.towns.map((town: { id: string, town_name: string }) => (
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
                <FormLabel className="text-gray-700">Quartier</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-12 px-4 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all">
                      <SelectValue placeholder="Sélectionnez un quartier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="rounded-xl border-gray-200">
                    {quartersLoading ? (
                      <SelectItem value="loading">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-4 w-4 border-2 border-orange-500 border-t-transparent rounded-full" />
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

          <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Mot de passe</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        className="h-12 px-4 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all pr-10"
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
                  <FormLabel className="text-gray-700">Confirmer le mot de passe</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        className="h-12 px-4 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 transition-all pr-10"
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button 
            disabled={isLoading} 
            className="w-full h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium transition-all duration-300 transform hover:scale-[1.02]"
            type="submit"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Inscription en cours...</span>
              </div>
            ) : (
              "S'inscrire"
            )}
          </Button>
        </motion.div>
      </form>
    </Form>
  );
} 