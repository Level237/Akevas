import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import MobileNav from '@/components/ui/mobile-nav';

const LegalTermsPage = () => {
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
              Termes légaux - AKEVAS
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
                <a href="#propriete" className="block text-gray-600 hover:text-gray-900">1. Propriété intellectuelle</a>
                <a href="#limitation" className="block text-gray-600 hover:text-gray-900">2. Limitation de responsabilité</a>
                <a href="#protection" className="block text-gray-600 hover:text-gray-900">3. Protection des données</a>
                <a href="#juridiction" className="block text-gray-600 hover:text-gray-900">4. Juridiction applicable</a>
                <a href="#litiges" className="block text-gray-600 hover:text-gray-900">5. Litiges et résolutions</a>
                <a href="#droits" className="block text-gray-600 hover:text-gray-900">6. Droits et obligations</a>
                <a href="#responsabilite" className="block text-gray-600 hover:text-gray-900">7. Responsabilité vendeurs</a>
                <a href="#modifications" className="block text-gray-600 hover:text-gray-900">8. Modifications</a>
                <a href="#contact" className="block text-gray-600 hover:text-gray-900">9. Contact</a>
              </nav>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div id="intro">
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Ces Termes légaux (ci-après « Termes ») définissent les responsabilités légales
                  et les obligations de TEMER BTP SARL, opérant sous la marque AKEVAS, et
                  de ses utilisateurs (clients, vendeurs et livreurs). En utilisant les services de la
                  plateforme AKEVAS, vous acceptez de vous conformer aux présentes
                  conditions légales.
                </p>
              </div>

              <section id="propriete" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">1. Propriété intellectuelle</h2>
                
                <h3 className="text-xl font-semibold mb-4">1.1. Droits d'auteur</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Tous les éléments présents sur la plateforme AKEVAS, y compris les textes,
                  images, logos, graphismes, icônes, interfaces et tout autre contenu, sont la
                  propriété exclusive de TEMER BTP SARL ou de ses partenaires affiliés. Toute
                  reproduction, modification, distribution, diffusion ou utilisation, sans
                  autorisation expresse préalable, est interdite et peut donner lieu à des poursuites
                  judiciaires.
                </p>

                <h3 className="text-xl font-semibold mb-4">1.2. Marques commerciales</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Le nom "AKEVAS", ainsi que les logos et autres marques associées, sont des
                  marques déposées de TEMER BTP SARL. Vous n'êtes pas autorisé à utiliser
                  ces marques sans le consentement écrit préalable de TEMER BTP SARL.
                </p>
              </section>

              <section id="limitation" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">2. Limitation de responsabilité</h2>
                
                <h3 className="text-xl font-semibold mb-4">2.1. Usage du service</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  AKEVAS met à disposition une plateforme facilitant la création de boutiques en
                  ligne pour les vendeurs et permettant aux clients d'acheter des vêtements et
                  accessoires de beauté. AKEVAS ne peut être tenu responsable des dommages
                  directs ou indirects causés par l'utilisation incorrecte ou illégale de ses services.
                </p>

                <h3 className="text-xl font-semibold mb-4">2.2. Contenu utilisateur</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les vendeurs sont seuls responsables du contenu qu'ils publient sur leurs
                  boutiques (y compris les descriptions, images et informations sur les produits).
                  AKEVAS décline toute responsabilité en cas d'erreurs, omissions ou fausses
                  déclarations dans les contenus fournis par les utilisateurs.
                </p>

                <h3 className="text-xl font-semibold mb-4">2.3. Problèmes techniques</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  AKEVAS ne garantit pas un accès continu et ininterrompu à ses services. En cas
                  de panne, maintenance ou tout autre problème technique, AKEVAS ne pourra
                  être tenu responsable des interruptions de service, de la perte de données ou des
                  dommages occasionnés.
                </p>
              </section>

              <section id="protection" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">3. Protection des données personnelles</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  AKEVAS respecte les lois camerounaises et internationales en matière de
                  protection des données. Les informations collectées auprès des utilisateurs sont
                  traitées conformément à notre Politique de confidentialité. Nous mettons en
                  place des mesures de sécurité adaptées pour protéger les informations des
                  utilisateurs contre les accès non autorisés, les modifications, la divulgation ou la
                  destruction.
                </p>
              </section>

              <section id="juridiction" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">4. Juridiction applicable</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Ces Termes sont régis par les lois en vigueur au Cameroun. En cas de litige
                  découlant de l'utilisation de la plateforme AKEVAS ou de l'interprétation des
                  présentes conditions, les tribunaux compétents de Douala, Cameroun seront
                  exclusivement compétents.
                </p>
              </section>

              <section id="litiges" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">5. Litiges et résolutions des conflits</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  En cas de litige entre AKEVAS et un utilisateur (client, vendeur ou livreur), les
                  parties s'efforceront de résoudre le différend à l'amiable. Si une solution amiable
                  ne peut être trouvée, les parties peuvent engager une procédure judiciaire devant
                  les tribunaux compétents du Cameroun.
                </p>
              </section>

              <section id="droits" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">6. Droits et obligations des utilisateurs</h2>
                
                <h3 className="text-xl font-semibold mb-4">6.1. Respect des lois</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  En utilisant la plateforme AKEVAS, les utilisateurs s'engagent à respecter les
                  lois et réglementations en vigueur au Cameroun, y compris en matière de
                  commerce en ligne, de protection des consommateurs et de protection des
                  données personnelles.
                </p>

                <h3 className="text-xl font-semibold mb-4">6.2. Engagement contractuel</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  L'utilisation des services d'AKEVAS implique un accord contractuel entre
                  l'utilisateur et TEMER BTP SARL. Toute violation des présentes Conditions ou
                  des obligations légales pourra entraîner la suspension ou la suppression du
                  compte utilisateur.
                </p>
              </section>

              <section id="responsabilite" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">7. Responsabilité des vendeurs et livreurs</h2>
                
                <h3 className="text-xl font-semibold mb-4">7.1. Conformité des produits</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les vendeurs sont tenus de garantir la conformité des produits qu'ils mettent en
                  vente sur AKEVAS. Ils doivent respecter les normes applicables en matière de
                  qualité et de sécurité des produits.
                </p>

                <h3 className="text-xl font-semibold mb-4">7.2. Services de livraison</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les livreurs inscrits sur la plateforme AKEVAS sont responsables de la
                  livraison des commandes dans les délais convenus et en bon état. Toute
                  négligence ou faute de la part des livreurs pourra entraîner des sanctions,
                  incluant la suppression du compte.
                </p>
              </section>

              <section id="modifications" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">8. Modifications des termes légaux</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  AKEVAS se réserve le droit de modifier ces Termes à tout moment afin de
                  s'adapter aux changements législatifs, technologiques ou organisationnels.
                  Toute modification sera publiée sur la plateforme, et les utilisateurs seront
                  informés. En continuant à utiliser les services d'AKEVAS après ces
                  modifications, vous acceptez les nouveaux Termes.
                </p>
              </section>

              <section id="contact" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">9. Contact</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pour toute question relative à ces Termes ou pour signaler un problème
                  juridique, vous pouvez contacter notre service juridique à l'adresse suivante :
                </p>
                <ul className="text-gray-600 list-disc pl-6">
                  <li>Email : akevas237@gmail.com</li>
                  <li>Adresse : TEMER BTP SARL, Douala, Cameroun</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalTermsPage;