import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import MobileNav from '@/components/ui/mobile-nav';

const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <Header />
      <MobileNav />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">
              Conditions d'Utilisation - AKEVAS
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation latérale */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Sommaire</h3>
              <nav className="space-y-2">
                <a href="#intro" className="block text-gray-600 hover:text-gray-900">Introduction</a>
                <a href="#definitions" className="block text-gray-600 hover:text-gray-900">1. Définition des termes</a>
                <a href="#inscription" className="block text-gray-600 hover:text-gray-900">2. Inscription et création de compte</a>
                <a href="#services" className="block text-gray-600 hover:text-gray-900">3. Accès aux services</a>
                <a href="#obligations" className="block text-gray-600 hover:text-gray-900">4. Obligations des utilisateurs</a>
                <a href="#confidentialite" className="block text-gray-600 hover:text-gray-900">5. Politique de confidentialité</a>
                <a href="#modifications" className="block text-gray-600 hover:text-gray-900">6. Modification des conditions</a>
                <a href="#denonciation" className="block text-gray-600 hover:text-gray-900">7. Dénonciation de l'accord</a>
                <a href="#contact" className="block text-gray-600 hover:text-gray-900">8. Contact et assistance</a>
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div id="intro">
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Les présentes Conditions d'utilisation (ci-après dénommées « Conditions »)
                  régissent l'accès et l'utilisation de la plateforme AKEVAS, exploitée par
                  TEMER BTP SARL, basée à Douala Cameroun. En accédant à nos services ou
                  en créant un compte sur notre plateforme, vous acceptez les présentes
                  Conditions. Veuillez lire attentivement ces termes, car ils régissent vos droits et
                  obligations en tant qu'utilisateur.
                </p>
              </div>

              <section id="definitions" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">1. Définition des termes</h2>
                <ul className="space-y-4 text-gray-600">
                  <li><span className="font-semibold">Client :</span> Utilisateur de la plateforme qui achète des produits vendus par les vendeurs inscrits.</li>
                  <li><span className="font-semibold">Vendeur :</span> Utilisateur de la plateforme qui propose à la vente des vêtements et accessoires de beauté via sa boutique virtuelle.</li>
                  <li><span className="font-semibold">Livreur :</span> Utilisateur qui se charge de la livraison des produits achetés sur la plateforme AKEVAS.</li>
                  <li><span className="font-semibold">Services :</span> Désigne tous les services proposés sur la plateforme AKEVAS, y compris l'achat de produits, la gestion de boutiques virtuelles et la livraison de commandes.</li>
                  <li><span className="font-semibold">Plateforme :</span> Le site web ou les applications mobiles d'AKEVAS.</li>
                </ul>
              </section>

              <section id="inscription" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">2. Inscription et création de compte</h2>
                
                <h3 className="text-xl font-semibold mb-4">2.1. Eligibilité</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Les utilisateurs doivent avoir au moins 15 ans pour s'inscrire et utiliser les services d'AKEVAS.</li>
                  <li>Les informations fournies doivent être exactes et complètes. En vous inscrivant, vous vous engagez à ne pas utiliser les informations de tiers sans leur consentement.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">2.2. Types de Comptes</h3>
                <div className="space-y-4 text-gray-600">
                  <p><span className="font-semibold">Clients :</span> Pour acheter des produits, les clients doivent créer un compte en fournissant leur nom, prénom, adresse, numéro de téléphone, sexe, e-mail, ville et quartier de résidence.</p>
                  <p><span className="font-semibold">Vendeurs :</span> Les vendeurs doivent fournir leur nom, prénom, adresse, numéro de téléphone, e-mail, une pièce d'identification valide, la ville, le quartier, une photo du vendeur avec sa pièce d'identité, ainsi qu'une photo de la boutique physique et son nom.</p>
                  <p><span className="font-semibold">Livreurs :</span> Les livreurs doivent s'inscrire en fournissant leur nom, prénom, adresse, numéro de téléphone, sexe, e-mail, ville, quartier de résidence, une pièce d'identification, une photo avec leur pièce d'identité en main, et le moyen de locomotion utilisé pour les livraisons.</p>
                </div>

                <h3 className="text-xl font-semibold mb-4 mt-6">2.3. Compte unique</h3>
                <p className="text-gray-600 mb-6">
                  Chaque utilisateur ne peut détenir qu'un seul compte à la fois. Nous nous réservons le droit de supprimer ou de fusionner les comptes multiples créés par un même utilisateur.
                </p>
              </section>

              <section id="services" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">3. Accès aux services</h2>

                <h3 className="text-xl font-semibold mb-4">3.1. Services proposés</h3>
                <p className="text-gray-600 mb-6">
                  AKEVAS met à disposition une plateforme où des vendeurs peuvent créer des boutiques en ligne pour vendre des vêtements et accessoires de beauté, tandis que les clients peuvent acheter ces produits. Les livreurs inscrits s'occupent de la livraison des articles aux clients.
                </p>

                <h3 className="text-xl font-semibold mb-4">3.2. Paiement</h3>
                <p className="text-gray-600 mb-6">
                  Les paiements se font via Mobile Money et les CARTE VISA, MARSTERCARD. Une fois qu'un client passe sa commande et effectue le paiement, AKEVAS se charge de notifier le vendeur et d'organiser la livraison.
                </p>

                <h3 className="text-xl font-semibold mb-4">3.3. Récupération et livraison des commandes</h3>
                <p className="text-gray-600 mb-6">
                  Après la validation de la commande et le paiement reçu, un livreur inscrit sur AKEVAS récupère les produits chez le vendeur pour les livrer au client.
                </p>
              </section>

              <section id="obligations" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">4. Obligations des utilisateurs</h2>

                <h3 className="text-xl font-semibold mb-4">4.1. Obligations générales</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Les utilisateurs s'engagent à utiliser la plateforme uniquement à des fins personnelles et non commerciales (sauf pour les vendeurs qui vendent leurs produits via leur boutique).</li>
                  <li>AKEVAS interdit toute tentative d'introduction de virus, logiciels malveillants, chevaux de Troie ou autre code nuisible via son site web ou ses applications.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">4.2. Restrictions d'utilisation</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Vous ne devez pas utiliser des systèmes automatisés, des scripts ou des services tiers pour accéder à la plateforme ou interagir avec elle de manière non autorisée.</li>
                  <li>Il est strictement interdit de contourner les restrictions imposées par AKEVAS, comme l'utilisation d'un seul compte utilisateur ou le respect des limites de paiement.</li>
                </ul>
              </section>

              <section id="confidentialite" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">5. Politique de confidentialité et protection des données</h2>

                <h3 className="text-xl font-semibold mb-4">5.1. Données collectées</h3>
                <p className="text-gray-600 mb-4">Les informations collectées par AKEVAS incluent :</p>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li><span className="font-semibold">Clients :</span> Nom, prénom, adresse, numéro de téléphone, sexe, e-mail, ville et quartier de résidence.</li>
                  <li><span className="font-semibold">Vendeurs :</span> Nom, prénom, adresse, numéro de téléphone, e-mail, pièce d'identification, ville, quartier, sexe, photo du vendeur avec sa carte en main, photo de la boutique physique, nom de la boutique.</li>
                  <li><span className="font-semibold">Livreurs :</span> Nom, prénom, adresse, numéro de téléphone, sexe, e-mail, ville, quartier de résidence, pièce d'identification, photo avec sa pièce d'identité en main, moyen de locomotion utilisé.</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">5.2. Utilisation des données</h3>
                <p className="text-gray-600 mb-6">
                  Les données sont utilisées pour faciliter les livraisons, traiter les paiements, fournir des factures électroniques, personnaliser les services et envoyer des offres promotionnelles. Les vendeurs n'ont pas accès aux informations des clients, et inversement.
                </p>

                <h3 className="text-xl font-semibold mb-4">5.3. Sécurité des données</h3>
                <p className="text-gray-600 mb-6">
                  Les données collectées sont stockées de manière sécurisée sur des serveurs protégés par un pare-feu et chiffrées pour assurer leur sécurité. Les utilisateurs peuvent demander à consulter, corriger ou supprimer leurs données via leur tableau de bord.
                </p>

                <h3 className="text-xl font-semibold mb-4">5.4. Conservation des données</h3>
                <p className="text-gray-600 mb-6">
                  Les données sont conservées tant que l'utilisateur n'a pas demandé la suppression de son compte. Une demande de suppression entraîne la suppression complète des données associées au compte.
                </p>

                <h3 className="text-xl font-semibold mb-4">5.5. Cookies et technologies de suivi</h3>
                <p className="text-gray-600 mb-6">
                  AKEVAS utilise des cookies et autres technologies de suivi pour améliorer l'expérience utilisateur, analyser les visites et proposer des contenus pertinents.
                </p>
              </section>

              <section id="modifications" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">6. Modification des conditions</h2>
                <p className="text-gray-600 mb-6">
                  AKEVAS se réserve le droit de modifier ces Conditions à tout moment pour refléter les changements dans les lois ou pour améliorer ses services. Les modifications seront publiées sur notre site web. En continuant à utiliser nos services après la publication des modifications, vous acceptez les nouvelles Conditions.
                </p>
              </section>

              <section id="denonciation" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">7. Dénonciation de l'accord</h2>
                <p className="text-gray-600 mb-6">
                  AKEVAS se réserve le droit de résilier votre compte avec un préavis de 30 jours si vous enfreignez ces Conditions. Vous avez également la possibilité de résilier cet accord à tout moment en demandant la suppression de votre compte.
                </p>
              </section>

              <section id="contact" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">8. Contact et assistance</h2>
                <p className="text-gray-600 mb-6">
                  Pour toute question ou besoin d'assistance concernant ces Conditions d'utilisation ou l'utilisation de la plateforme AKEVAS, vous pouvez contacter notre équipe de service client via l'e-mail ou le formulaire de contact disponible sur notre site.
                </p>
                <p className="text-gray-600 italic">
                  Ces Conditions d'utilisation sont adaptées aux services offerts par AKEVAS, garantissant une transparence pour les utilisateurs (clients, vendeurs, et livreurs) tout en mettant en avant la sécurité et la confidentialité des données.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage; 