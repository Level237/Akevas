import React, { useState } from "react";
import { Mail, Phone, Send, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import { ScrollRestoration } from "react-router-dom";
import Footer from "@/components/ui/footer";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 2000);
  };

  return (
    <>
     <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col items-center justify-center py-12 px-4">
      <Header />
      <ScrollRestoration />
      <div className="max-w-2xl mt-12 w-full mx-auto">
        <Card className="shadow-xl rounded-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col items-center mb-8">
              <Mail className="w-14 h-14 text-[#ed7e0f] mb-2" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Contactez le support</h1>
              <p className="text-gray-500 text-center">
                Une question, un problème ou un retour ? Notre équipe vous répond rapidement !
              </p>
            </div>
            {!sent ? (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Votre nom"
                    className="px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ed7e0f] focus:ring-[#ed7e0f]/20 transition-all"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Votre email"
                    className="px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ed7e0f] focus:ring-[#ed7e0f]/20 transition-all"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Sujet"
                  className="px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ed7e0f] focus:ring-[#ed7e0f]/20 transition-all w-full"
                />
                <textarea
                  required
                  placeholder="Votre message"
                  rows={5}
                  className="px-4 py-3 rounded-lg border border-gray-200 focus:border-[#ed7e0f] focus:ring-[#ed7e0f]/20 transition-all w-full resize-none"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 text-white font-semibold text-lg py-3 rounded-lg flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </form>
            ) : (
              <div className="flex flex-col items-center py-12">
                <Send className="w-12 h-12 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message envoyé !</h2>
                <p className="text-gray-500 text-center">
                  Merci de nous avoir contactés. Nous reviendrons vers vous rapidement.
                </p>
              </div>
            )}
            <div className="mt-10 border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#ed7e0f]" />
                <span>support@akevas.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#ed7e0f]" />
                <span>+237 6 99 99 99 99</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#ed7e0f]" />
                <span>Douala, Cameroun</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
     
    </div>
    <Footer/>
    </>
   
  );
}