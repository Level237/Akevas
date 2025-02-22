import React, { useEffect, useState } from 'react';

import {
  User,
  Truck,
  MapPin,
  FileText,
  CheckCircle,
  ChevronRight
} from 'lucide-react';
import { ScrollRestoration } from 'react-router-dom';
import { PageTransition } from '@/components/ui/page-transition';
import TopLoader from '@/components/ui/top-loader';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useGetTownsQuery, useGetQuartersQuery } from '@/services/guardService';
const steps = [
  {
    id: 1,
    name: 'Informations personnelles',
    icon: User,
    route: '/delivery/register'
  },
  {
    id: 2,
    name: 'Véhicule',
    icon: Truck,
    route: '/delivery/vehicle'
  },
  {
    id: 3,
    name: 'Zone de livraison',
    icon: MapPin,
    route: '/delivery/zone'
  },
  {
    id: 4,
    name: 'Documents',
    icon: FileText,
    route: '/delivery/documents'
  },
  {
    id: 5,
    name: 'Validation',
    icon: CheckCircle,
    route: '/delivery/validation'
  }
];


const formSchema=z.object({
  firstName:z.string().min(2,"le prenom doit contenir au moins 2 caractères"),
  lastName:z.string().min(2,"le nom doit contenir au moins 2 caractères"),
  email:z.string().email("email invalide"),
  phone:z.string().min(10,"le numero de telephone doit contenir au moins 10 caractères"),
  birthDate:z.string().min(10,"la date de naissance est obligatoire"),
  nationality:z.string().min(2,"la nationalité est obligatoire"),
  idNumber:z.string().min(2,"le numero de piece d'identité est obligatoire"),
  address:z.string().min(2,"l'adresse est obligatoire"),
  city:z.string().min(1,"la ville est obligatoire"),
  quarter:z.string().min(1,"le quartier est obligatoire"),
  
})
const DeliveryRegisterPage: React.FC = () => {
  const form=useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues:{
      firstName:'',
      lastName:'',
      email:'',
      phone:'',
      birthDate:'',
    nationality: '',
    idNumber: '',
    city: '',
    quarter: ''
  }
}
);
const { data: towns, isLoading: townsLoading } = useGetTownsQuery('guard');
 const { data: quarters, isLoading: quartersLoading } = useGetQuartersQuery('guard');
  const [townId,setTownId]=useState<string>('')
  const filteredQuarters = quarters?.quarters.filter((quarter: { town_id: string }) => quarter.town_id === parseInt(townId));
  const onSubmit=async(values:z.infer<typeof formSchema>)=>{
    console.log(values)
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-gray-50">
      <TopLoader progress={16.7} />
      <ScrollRestoration/>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            
            Devenir livreur partenaire
          </h1>
          <p className="mt-2 text-gray-600">
            Rejoignez notre réseau de livreurs et gagnez un revenu supplémentaire
          </p>
        </div>

        {/* Progress Steps */}
        <nav className="mb-8 max-sm:hidden">
          <ol className="flex items-center justify-center space-x-8">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.id === 1
                        ? 'bg-[#ed7e0f] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <step.icon className="w-6 h-6" />
                  </div>
                  {stepIdx !== steps.length - 1 && (
                    <div className="hidden sm:block w-24 h-0.5 bg-gray-200 ml-4" />
                  )}
                </div>
                <div className="mt-2">
                  <span
                    className={`text-sm font-medium ${
                      step.id === 1 ? 'text-[#ed7e0f]' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Informations personnelles
              </h2>

            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
                  
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                              
                      />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                      )}
                      />
                  

                  
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  
                </div>


                <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
                  
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                            />
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
                            <Input
                              {...field}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                            />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                      )}
                      />
                     
                </div>


                <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
                  
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de naissance</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                            />
                          </FormControl>  
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                                      <FormField
                      control={form.control}
                      name="nationality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nationalité</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>


                  
               

              

                  
                  <FormField
                    control={form.control}
                    name="idNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Numéro de pièce d'identité</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
           

                <div className="grid max-sm:grid-cols-1 grid-cols-2 gap-6">
              
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
              <FormItem>
              <FormLabel>Ville</FormLabel>
              <Select onValueChange={(value) => {
          field.onChange(value); // Met à jour la valeur du champ
          setTownId(value); // Met à jour l'état townId
        }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectionnez une ville" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {townsLoading ? (
                    <SelectItem value="loading">Chargement des villes...</SelectItem>
                  ) : (
                    towns.towns.map((town:{id:string,town_name:string}) => (
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
                            <FormField
                        control={form.control}
                      name="quarter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quartier</FormLabel>
                          <Select 
                              onValueChange={field.onChange}  
                              defaultValue={field.value}
                            >
                          <FormControl>
                            
                              <SelectTrigger>
                                <SelectValue placeholder="Selectionnez un quartier" />
                              </SelectTrigger>
                               </FormControl>
                              <SelectContent>
                               {quartersLoading ? (
                  <SelectItem value="loading">Chargement des quartiers...</SelectItem>
                ) : (
                  filteredQuarters?.map((quarter:{id:string,quarter_name:string}) => (
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
                  </div>

                    
           


                

                  
               

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/80 transition-colors flex items-center gap-2"
                  >
                    Suivant
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </Form>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Flexibilité totale</h3>
              <p className="text-gray-600 text-sm">
                Choisissez vos horaires et zones de livraison
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <User className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Revenus attractifs</h3>
              <p className="text-gray-600 text-sm">
                Gagnez un revenu complémentaire intéressant
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#ed7e0f]" />
              </div>
              <h3 className="font-medium mb-2">Support dédié</h3>
              <p className="text-gray-600 text-sm">
                Une équipe à votre écoute 7j/7
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
    </PageTransition>
  );
};

export default DeliveryRegisterPage;
