import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Components & UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "@/assets/favicon.png";

// Services
import { useLoginMutation } from "@/services/auth";

export default function LoginForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // ✅ Utilisation réactive de l'URL

  // ✅ Extraction propre des paramètres
  const redirectUrl = searchParams.get('redirect');
  const productId = searchParams.get('productId');
  const quantity = searchParams.get('quantity');
  const price = searchParams.get('price');
  const name = searchParams.get('name');
  const residence = searchParams.get('residence');
  const s = searchParams.get('s');
  const code = searchParams.get("code");

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [login, { isLoading, isError, error, endpointName }] = useLoginMutation();

  useEffect(() => {
    if (isLoading) {
      console.log(`🔐 [Login] Requête en cours - Endpoint: ${endpointName}`);
    }
  }, [isLoading, endpointName]);

  // ✅ CORRECTION CRITIQUE : Gestion des erreurs dans un useEffect pour éviter le spam de toasts
  useEffect(() => {
    if (isError && error) {
      // 🛡️ Vérification TypeScript : on s'assure que c'est une erreur HTTP (avec un status)
      if ('status' in error) {

        // 🚨 CAS 1 : L'utilisateur a été bloqué par le Rate Limiting (429)
        if (error.status === 429) {
          // On récupère le délai exact envoyé par Laravel (ex: 60 secondes)
          const retryAfter = (error as any).meta?.response?.headers?.get('Retry-After') || 30;

          toast.error(`Trop de tentatives. Veuillez patienter ${retryAfter} secondes.`, {
            position: "top-right",
            duration: 5000,
          });
        }
        // 🚨 CAS 2 : Erreurs d'authentification classiques (401, 400, 500)
        else {
          // On utilise le message personnalisé que tu as défini dans transformErrorResponse (authService)
          // Sinon, on met un message par défaut
          const errorMessage = (error.data as any)?.error || "Numéro de téléphone ou mot de passe incorrect.";

          toast.error(errorMessage, {
            position: "top-right",
            duration: 6000,
          });
        }
      } else {
        // 🚨 CAS 3 : Erreur réseau pure (pas de réponse du serveur, ex: perte de connexion)
        toast.error("Erreur de connexion. Vérifiez votre réseau internet.", {
          position: "top-right",
          duration: 6000,
        });
      }
    }
  }, [isError, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const userObject = { phone_number: phone, password: password, role_id: 3 };
      const res = await login(userObject);

      // ✅ Gestion de la réponse (res.error existe si la mutation échoue)
      if (res.error) {
        // Le toast est déjà géré par le useEffect ci-dessus, on ne fait rien de plus ici
        return;
      }

      // ✅ SUCCÈS : Nettoyage et Navigation intelligente
      setPhone('');
      setPassword('');

      if (redirectUrl) {
        // Vérifier si c'est une URL externe (commence par http) ou interne
        if (redirectUrl.startsWith('http')) {
          const url = new URL(redirectUrl);
          if (s === '1') {
            url.searchParams.set('s', s);
          } else {
            url.searchParams.set('s', s || '');
            url.searchParams.set('productId', productId || '');
            url.searchParams.set('quantity', quantity || '');
            url.searchParams.set('price', price || '');
            url.searchParams.set('name', name || '');
            url.searchParams.set('residence', residence || '');
          }
          window.location.href = url.toString(); // OK pour l'externe
        } else {
          // ✅ Navigation SPA pour les routes internes (garde le cache et l'état)
          navigate(redirectUrl, { replace: true });
        }
      } else {
        navigate('/authenticate', { replace: true });
      }
    } catch (err) {
      console.error("Erreur de connexion inattendue:", err);
    }
  };

  const handleGoogleSignIn = () => {
    try {
      setGoogleLoading(true);
      const API_BASE_URL = "https://api.akevas.com";
      const oauthUrl = new URL(API_BASE_URL + "/api/auth/google");
      const originUrl = window.location.origin;

      oauthUrl.searchParams.set("origin_url", originUrl);

      // La redirection navigateur est correcte ici car c'est un flux OAuth externe
      window.location.href = oauthUrl.toString();
    } catch (err) {
      setGoogleLoading(false);
      toast.error("Échec de la redirection vers Google", { position: "bottom-center" });
    }
  };

  return (
    <div className="flex flex-col px-2 py-6">
      <a href="/" className="inline-flex items-center gap-2 mx-2 text-orange-600 hover:underline font-medium w-fit">
        <ArrowLeft className="w-5 h-5" />
        <span className="max-sm:hidden">Retour</span>
      </a>

      <div className="flex flex-col space-y-1 md:px-28 max-w-md mx-auto w-full">
        <div className="space-y-2 flex justify-center items-center">
          <img src={logo} alt="Logo" className="h-24 max-sm:h-16" />
          <h1 className="text-3xl max-sm:text-2xl text-center font-semibold tracking-tight">Connexion</h1>
        </div>

        {/* ✅ Affichage propre des erreurs spécifiques basées sur l'URL (si hérité d'un ancien système) */}
        {code === "500" && (
          <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600 border border-red-200">
            Cette adresse email n'est pas autorisée dans l'espace client.
          </div>
        )}
        {code === "401" && (
          <div className="rounded-md bg-red-50 p-3 text-center text-sm text-red-600 border border-red-200">
            Ce compte n'existe pas dans notre base de données. Veuillez vous enregistrer d'abord.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="phone">Numéro de Téléphone</label>
            <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-200 focus-within:border-[#ed7e0f] focus-within:ring-1 focus-within:ring-[#ed7e0f] transition-all">
              <button type="button" className="flex items-center justify-center w-10 h-12 rounded-l-xl border-r border-gray-200 cursor-default bg-gray-50" tabIndex={-1} disabled>
                <span role="img" aria-label="Cameroun" className="text-lg">🇨🇲</span>
              </button>
              <span className="px-3 text-gray-700 font-semibold select-none text-sm bg-gray-50">+237</span>
              <Input
                id="phone"
                name="phone"
                placeholder="6XX XXX XXX"
                required
                type="tel"
                autoComplete="tel"
                className="flex-1 h-12 border-none bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400 rounded-r-xl"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/^\+?237\s?/, '');
                  // Limite à 9 chiffres après le préfixe
                  if (value.length <= 9 && /^\d*$/.test(value)) {
                    setPhone(value);
                  }
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700" htmlFor="password">Mot de passe</label>
              <a href="/forgot-password" className="text-sm font-medium text-[#ed7e0f] hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                placeholder="Entrez votre mot de passe"
                required
                type={showPassword ? "text" : "password"}
                className="py-6 max-sm:placeholder:text-sm rounded-xl bg-white pr-12 border-gray-200 focus:border-[#ed7e0f] focus:ring-[#ed7e0f]"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-4 max-sm:space-y-5 pt-2">
            <Button
              disabled={isLoading}
              type="submit"
              className="w-full py-6 bg-[#ed7e0f] text-white hover:bg-[#d66a00] transition-colors font-semibold text-base"
            >
              {isLoading ? (
                <div className="animate-spin inline-block size-5 border-[3px] border-current border-t-transparent rounded-full" role="status" aria-label="loading" />
              ) : (
                "Se connecter"
              )}
            </Button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-500 font-medium">ou continuer avec</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              variant="outline"
              className="w-full py-6 bg-white hover:bg-gray-50 border-gray-200 rounded-xl flex items-center justify-center gap-3 font-medium text-gray-700"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.9 29.4 36 24 36 16.8 36 11 30.2 11 23s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.7 4.7 29.6 3 24 3 12.3 3 3 12.3 3 24s9.3 21 21 21c10.5 0 19.3-7.6 21-17.5.1-.8.1-1.6.1-2.4 0-1.4-.1-2.3-.5-4.6z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16.7 18.9 12 24 12c3.3 0 6.3 1.2 8.6 3.2l5.7-5.7C34.7 4.7 29.6 3 24 3 16 3 9.1 7.5 6.3 14.7z" />
                <path fill="#4CAF50" d="M24 45c5.3 0 10.1-2 13.6-5.3l-6.3-5.2C29.2 35.6 26.8 36 24 36c-5.3 0-9.8-3.1-11.8-7.5l-6.6 5.1C8.4 40.3 15.7 45 24 45z" />
                <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.1-4 5.6-7.3 6.5l6.3 5.2C36.6 37.5 39 32.2 39 26c0-1.6-.1-2.7-.4-3.9z" />
              </svg>
              {googleLoading ? (
                <div className="animate-spin inline-block size-5 border-[2px] border-current border-t-transparent text-gray-700 rounded-full" />
              ) : (
                "Google"
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Vous n'avez pas de compte ?{" "}
          <a href="/register" className="text-[#ed7e0f] font-semibold hover:underline">
            S'inscrire
          </a>
        </p>
      </div>
    </div>
  );
}