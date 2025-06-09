import Header from '@/components/ui/header';
import TopBar from '@/components/ui/topBar';
import MobileNav from '@/components/ui/mobile-nav';

const PrivacyPolicyPage = () => {
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
              Politique de Confidentialité - AKEVAS
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
                <a href="#collecte" className="block text-gray-600 hover:text-gray-900">1. Collecte des Informations</a>
                <a href="#utilisation" className="block text-gray-600 hover:text-gray-900">2. Utilisation des Informations</a>
                <a href="#partage" className="block text-gray-600 hover:text-gray-900">3. Partage des Informations</a>
                <a href="#securite" className="block text-gray-600 hover:text-gray-900">4. Sécurité des Données</a>
                <a href="#conservation" className="block text-gray-600 hover:text-gray-900">5. Conservation des Données</a>
                <a href="#droits" className="block text-gray-600 hover:text-gray-900">6. Droits des Utilisateurs</a>
                <a href="#cookies" className="block text-gray-600 hover:text-gray-900">7. Cookies et Suivi</a>
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
                  Chez AKEVAS, nous nous engageons à protéger la confidentialité et la sécurité
                  de vos données personnelles. Cette politique de confidentialité décrit comment
                  nous collectons, utilisons, partageons et protégeons vos informations lorsque
                  vous utilisez notre plateforme. Elle explique également vos droits concernant
                  vos données personnelles et la manière dont vous pouvez les exercer.
                </p>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  La présente politique de confidentialité vous donne un aperçu du traitement de
                  vos données par Akevas. Elle s'applique à tous les sites web et à toutes les applis,
                  ainsi qu'aux autres services et prestations offerts par Akevas.
                </p>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Pour toute question concernant la présente politique de confidentialité ou
                  concernant la protection des données chez Akevas, vous pouvez vous adresser à
                  notre équipe de la protection des données à l'adresse temerprodesign@yahoo.fr.
                  Veuillez également envoyer un e-mail à notre équipe de la protection des données
                  si vous souhaitez exercer votre droit d'accès ou votre droit à la suppression de vos
                  données ou tout autre droit relatif à la protection des données conformément, y
                  compris la rétractation de votre consentement pour le marketing, le
                  désabonnement de la newsletter, etc.
                </p>

                <h3 className="text-xl font-semibold mb-4">Comment lire la présente politique de confidentialité</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Nous vous proposons plusieurs possibilités vous permettant de lire la présente politique de
                  confidentialité. Dans cette section, vous trouverez tout d'abord quelques
                  informations fondamentales. Ensuite, vous trouverez dans chaque chapitre les
                  sujets qui vous concernent. Si vous êtes déjà un « pro », vous pouvez directement
                  aller d'un chapitre à l'autre à l'aide du menu déroulant.
                </p>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Chaque chapitre est précédé d'un court texte. Ce texte récapitule le contenu du
                  chapitre. Nous vous recommandons de lire ces textes si vous souhaitez
                  uniquement avoir un bref aperçu de tous les traitements de données. Si vous
                  souhaitez avoir plus de détails, vous pouvez cliquer sous le texte sur « En savoir
                  plus ». Vous pourrez alors lire l'ensemble du contenu du chapitre.
                </p>

                <p className="text-gray-600 mb-8 leading-relaxed">
                  Nous avons renoncé autant que possible aux références croisées. Toutes les
                  informations sont ainsi clairement expliquées, où que vous soyez dans le chapitre.
                  Si vous lisez la politique de confidentialité du début à la fin, vous trouverez le cas
                  échéant des répétitions. Nous ne pouvons pas éviter totalement les références
                  croisées. Par exemple, nous avons réuni tous les traitements des données
                  spécifiques à chaque pays dans un seul chapitre auquel nous renvoyons le cas
                  échéant.
                </p>

                <h3 className="text-xl font-semibold mb-4">À quels services et offres s'applique la présente politique de confidentialité</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  La manière dont Akevas traite vos données est la même pour la plupart de nos
                  offres. La présente politique de confidentialité s'applique ainsi à tous les services
                  et prestations que nous proposons à nos clients au Cameroun, que nous le faisions
                  sur un site web, une appli, dans des magasins, par téléphone, à l'occasion
                  d'événements ou sur les réseaux sociaux ou autres canaux. Pour une meilleure
                  lisibilité, nous utilisons pour ce « cas normal » le terme générique de « services ».
                </p>

                <h3 className="text-xl font-semibold mb-4">Que vous apprend la présente politique de confidentialité</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Quelles sont les données stockées par Akevas.</li>
                  <li>Ce que nous faisons avec ces données et pour quoi nous en avons besoin.</li>
                  <li>Quels sont vos droits en matière de protection des données et quels sont vos choix.</li>
                  <li>Quelles sont les technologies et les données que nous utilisons pour personnaliser et coordonner nos services et contenus, pour un shopping sûr, simple, fluide et individuel.</li>
                  <li>Quelles sont les technologies et les données que nous utilisons pour la publicité, y compris les technologies de tracking.</li>
                </ul>
              </div>

              <section id="collecte" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">1. Collecte des Informations Personnelles</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nous recueillons des informations personnelles auprès de trois types d'utilisateurs de la plateforme AKEVAS : les clients, les vendeurs et les livreurs. La collecte des informations se fait lors de la création de comptes et de l'utilisation de nos services.
                </p>

                <h3 className="text-xl font-semibold mb-4">1.1. Informations Collectées auprès des Clients</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pour les clients, nous collectons les informations suivantes :
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Nom : Prénom et nom de famille</li>
                  <li>Coordonnées : Adresse de résidence, numéro de téléphone, e-mail, ville et quartier de résidence</li>
                  <li>Pièce d'Identification : Une copie d’une pièce d'identification valide.</li>
                  <li>Photographies : Une photo du vendeur tenant sa carte d'identité et une
                  photo de la boutique physique.</li>
                  <li>Informations sur la Boutique : Le nom de la boutique et d'autres
                  informations commerciales.</li>
                </ul>

               

                <h4 className="text-lg font-semibold mb-12">Pourquoi les vendeurs sont identifié Identification</h4>
               

                <h4 className="text-md italic mb-8">Renforcer la confiance des client</h4>


               <ul className="list-disc  pl-6 mx-4 mb-6 text-gray-600">
                  <li>Lorsque les vendeurs fournissent des informations telles que leur nom,
                    adresse, pièce d'identité et images de leur boutique, cela montre un
                    engagement envers la transparence et le professionnalisme. Cela contribue
                    à responsabiliser les vendeurs en cas de litiges ou de problèmes liés aux
                    commandes, car ils peuvent être contactés et identifiés facilement par la
                    plateforme.</li>
                
                </ul>

                <h4 className="text-md italic mb-8"> Responsabilité et professionnalisme</h4>


               <ul className="list-disc  pl-6 mx-4 mb-6 text-gray-600">
                  <li>Lorsque les vendeurs fournissent des informations telles que leur nom,
                    adresse, pièce d'identité et images de leur boutique, cela montre un
                    engagement envers la transparence et le professionnalisme. Cela contribue
                    à responsabiliser les vendeurs en cas de litiges ou de problèmes liés aux
                    commandes, car ils peuvent être contactés et identifiés facilement par la
                    plateforme.</li>
                
                </ul>

                
                <h4 className="text-md italic mb-8"> Lutter contre la fraude et les activités illégales</h4>


                <ul className="list-disc  pl-6 mx-4 mb-6 text-gray-600">
                <li>L'identification des vendeurs est une mesure essentielle pour prévenir les
                    fraudes, les arnaques et les activités illégales sur la plateforme. En
                    disposant d'informations personnelles vérifiées, AKEVAS peut plus
                    facilement détecter et prévenir les comportements malveillants, assurant
                    ainsi une meilleure expérience pour tous les utilisateurs.</li>
                
                </ul>

                <h4 className="text-md italic mb-8">Accès à des opportunités commerciales</h4>


                <ul className="list-disc  pl-6 mx-4 mb-6 text-gray-600">
                        <li>Les vendeurs identifiés ont plus de chances de participer à des
                    promotions, des campagnes de marketing ciblées ou des collaborations
                    exclusives avec AKEVAS. En remplissant leurs informations
                    personnelles, ils peuvent bénéficier de ces opportunités qui boostent leur
                    visibilité et leur chiffre d'affaires.</li>

                </ul>

                <h4 className="text-md italic mb-8">Faciliter la gestion de la relation client</h4>


                <ul className="list-disc  pl-6 mx-4 mb-6 text-gray-600">
                                <li>Avoir des informations détaillées sur les vendeurs permet à AKEVAS de
                            mieux gérer les relations entre vendeurs et clients. En cas de problème ou
                            de demande de support, la plateforme peut contacter rapidement le
                            vendeur, facilitant ainsi la résolution des problèmes et améliorant
                            l'expérience client.</li>

                </ul>

                <h4 className="text-md italic mb-8">Service client amélioré</h4>


                <ul className="list-disc  pl-6 mx-4 mb-6 text-gray-600">
                                <li>Les informations personnelles permettent à AKEVAS d’offrir un meilleur
                                service client. En cas de problème avec une commande, une livraison ou un
                                paiement, ces informations permettent au service client de contacter
                                rapidement le client pour résoudre le problème. Cela aide à améliorer la
                                satisfaction client et à maintenir un haut niveau de qualité de service.</li>

                </ul>
                <h4 className="text-lg font-semibold mb-3">Facilitation de la livraison</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les informations telles que l'adresse et le numéro de téléphone sont essentielles pour assurer une livraison rapide et précise. Cela permet au prestataire de livraison de localiser facilement le client et de s'assurer que le colis est remis à la bonne personne. Sans ces informations, il serait impossible d'organiser des livraisons efficaces.
                </p>

                <h4 className="text-lg font-semibold mb-3">Service client amélioré</h4>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les informations personnelles permettent à AKEVAS d'offrir un meilleur service client. En cas de problème avec une commande, une livraison ou un paiement, ces informations permettent au service client de contacter rapidement le client pour résoudre le problème. Cela aide à améliorer la satisfaction client et à maintenir un haut niveau de qualité de service.
                </p>

                <h3 className="text-xl font-semibold mb-4">1.2. Informations Collectées auprès des Vendeurs et identification</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pour les vendeurs inscrits sur la plateforme, nous collectons les données suivantes :
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Nom : Prénom et nom de famille</li>
                  <li>Coordonnées : Adresse physique, numéro de téléphone, e-mail, ville et quartier</li>
                  <li>Pièce d'Identification : Une copie d'une pièce d'identification valide</li>
                  <li>Photographies : Une photo du vendeur tenant sa carte d'identité et une photo de la boutique physique</li>
                  <li>Informations sur la Boutique : Le nom de la boutique et d'autres informations commerciales</li>
                </ul>

                <h4 className="text-lg font-semibold mb-3">Pourquoi les vendeurs sont identifiés</h4>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Renforcer la confiance des clients</li>
                  <li>Responsabilité et professionnalisme</li>
                  <li>Lutter contre la fraude et les activités illégales</li>
                  <li>Accès à des opportunités commerciales</li>
                  <li>Faciliter la gestion de la relation client</li>
                  <li>Conformité avec les lois et règlements</li>
                  <li>Amélioration de la crédibilité de la plateforme</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">1.3. Informations Collectées auprès des Livreurs et Identification</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pour les livreurs, nous collectons les informations suivantes :
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Nom : Prénom et nom de famille</li>
                  <li>Coordonnées : Adresse de résidence, numéro de téléphone, e-mail, ville et quartier</li>
                  <li>Pièce d'Identification : Une pièce d'identité valide</li>
                  <li>Photographies : Une photo du livreur tenant sa pièce d'identité</li>
                  <li>Moyen de Transport : Le type de véhicule utilisé pour effectuer les livraisons</li>
                </ul>

                <h4 className="text-lg font-semibold mb-3">Pourquoi les livreurs sont identifiés</h4>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Sécurité des clients</li>
                  <li>Traçabilité des livraisons</li>
                  <li>Prévention de la fraude et des comportements malveillants</li>
                  <li>Responsabilité et confiance mutuelle</li>
                  <li>Conformité avec les exigences légales</li>
                  <li>Amélioration du service client</li>
                  <li>Éviter les abus et améliorer la qualité du service</li>
                  <li>Personnalisation des services</li>
                  <li>Promotion de l'image de la plateforme</li>
                  <li>Gestion des paiements et rémunération</li>
                </ul>
              </section>

              <section id="utilisation" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">2. Utilisation des Informations Personnelles</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les informations personnelles collectées sont utilisées pour améliorer la qualité des services fournis par AKEVAS. Voici les principales finalités pour lesquelles nous utilisons vos données :
                </p>

                <h3 className="text-xl font-semibold mb-4">2.1. Gestion des Commandes et des Livraisons</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les informations des clients, des vendeurs et des livreurs sont utilisées pour organiser la livraison des produits commandés sur la plateforme. Cela inclut :
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>La transmission des détails de la commande au vendeur</li>
                  <li>L'organisation de la récupération des colis auprès des vendeurs</li>
                  <li>L'envoi des colis aux clients par le biais des livreurs</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">2.2. Traitement des Paiements</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nous utilisons les informations fournies pour gérer les paiements via Mobile Money. Les paiements sont sécurisés et les informations nécessaires pour effectuer les transactions sont strictement confidentielles.
                </p>

                <h3 className="text-xl font-semibold mb-4">2.3. Personnalisation des Services</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nous utilisons les données collectées pour personnaliser l'expérience utilisateur, par exemple en proposant des recommandations de produits basées sur les préférences du client, ou en suggérant des promotions et des offres spéciales adaptées à chaque utilisateur.
                </p>

                <h3 className="text-xl font-semibold mb-4">2.4. Marketing et Promotions</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nous utilisons également les informations des utilisateurs (principalement des vendeurs et des prestataires) pour des campagnes marketing. Les données peuvent être utilisées pour envoyer des offres et des promotions relatives aux produits ou services proposés sur la plateforme AKEVAS.
                </p>
              </section>

              <section id="partage" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">3. Partage des Informations</h2>

                <h3 className="text-xl font-semibold mb-4">3.1. Accès aux Informations entre les Utilisateurs</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Les clients n'ont pas accès aux informations personnelles des vendeurs, sauf celles strictement nécessaires à la livraison</li>
                  <li>Les vendeurs n'ont pas accès aux informations des clients, à l'exception des détails nécessaires pour traiter les commandes</li>
                  <li>Les livreurs reçoivent uniquement les informations de livraison (adresse et contact) nécessaires pour mener à bien leur mission</li>
                </ul>

                <h3 className="text-xl font-semibold mb-4">3.2. Partenaires et Prestataires</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nous pouvons partager des informations avec des tiers qui nous fournissent des services, tels que des prestataires de services marketing ou des fournisseurs de services technologiques. Cependant, ces tiers ne peuvent utiliser les informations qu'aux fins prévues par AKEVAS et dans le respect de cette politique de confidentialité.
                </p>
              </section>

              <section id="securite" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">4. Sécurité des Données</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nous prenons la sécurité de vos informations très au sérieux et mettons en œuvre plusieurs mesures pour les protéger contre tout accès non autorisé, perte, destruction ou altération.
                </p>

                <h3 className="text-xl font-semibold mb-4">4.1. Chiffrement et Sécurité des Serveurs</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les données que vous partagez avec nous sont stockées sur des serveurs sécurisés. Nous utilisons des techniques de chiffrement pour garantir que les informations sensibles (comme les données personnelles et les transactions) soient protégées lors de leur transmission.
                </p>

                <h3 className="text-xl font-semibold mb-4">4.2. Pare-feu et Systèmes de Protection</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nos serveurs sont protégés par des pare-feu pour empêcher tout accès non autorisé aux informations personnelles. Nous surveillons également en permanence nos systèmes pour détecter et prévenir les vulnérabilités.
                </p>
              </section>

              <section id="conservation" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">5. Conservation des Données</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Les données personnelles collectées sur AKEVAS sont conservées aussi longtemps que nécessaire pour fournir les services demandés. Les informations des utilisateurs sont stockées jusqu'à la suppression de leur compte sur la plateforme.
                </p>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Si un utilisateur demande la suppression de son compte, toutes les données associées seront définitivement effacées, sauf en cas de nécessité légale de conservation</li>
                  <li>Nous pouvons conserver des données anonymisées à des fins statistiques</li>
                </ul>
              </section>

              <section id="droits" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">6. Droits des Utilisateurs</h2>

                <h3 className="text-xl font-semibold mb-4">6.1. Accès, Correction et Suppression des Données</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Vous avez le droit d'accéder, de corriger ou de demander la suppression de vos informations personnelles. Vous pouvez exercer ces droits à tout moment en accédant à votre tableau de bord sur la plateforme AKEVAS.
                </p>

                <h3 className="text-xl font-semibold mb-4">6.2. Retrait du Consentement</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Le consentement au traitement des données peut être retiré uniquement sur interpellation de la plateforme. Pour ce faire, vous devrez remplir un formulaire spécifique accessible via le service client d'AKEVAS.
                </p>
              </section>

              <section id="cookies" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">7. Utilisation des Cookies et Technologies de Suivi</h2>

                <h3 className="text-xl font-semibold mb-4">7.1. Cookies</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Nous utilisons des cookies sur notre site et dans nos applications pour améliorer votre expérience utilisateur, suivre vos interactions avec notre plateforme, et analyser les visites et comportements d'achat.
                </p>

                <h3 className="text-xl font-semibold mb-4">7.2. Finalités des Cookies</h3>
                <ul className="list-disc pl-6 mb-6 text-gray-600">
                  <li>Cookies de Fonctionnalité : Ces cookies sont utilisés pour assurer le bon fonctionnement du site et de l'application</li>
                  <li>Cookies Analytiques : Nous les utilisons pour comprendre comment vous utilisez notre plateforme et améliorer nos services en conséquence</li>
                </ul>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Vous pouvez à tout moment configurer votre navigateur pour refuser les cookies, mais cela pourrait altérer certaines fonctionnalités de la plateforme.
                </p>
              </section>

              <section id="modifications" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">8. Modifications de la Politique de Confidentialité</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  AKEVAS se réserve le droit de modifier cette politique de confidentialité pour s'adapter aux évolutions technologiques, légales ou opérationnelles. Toute modification sera publiée sur notre site web, et nous vous informerons si les changements sont substantiels.
                </p>
              </section>
              
              <section id="contact" className="mb-8">
                <h2 className="text-2xl font-bold mb-6">9. Contact</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pour toute question relative à cette politique de confidentialité ou pour exercer vos droits, veuillez contacter notre service client à l'adresse suivante :
                </p>
                <p className="text-gray-600 font-semibold">AKEVAS237@GMAIL.COM</p>
                <p className="text-gray-600 mt-6 leading-relaxed">
                  AKEVAS s'engage à assurer une protection maximale de vos données personnelles et à vous offrir une expérience sécurisée et personnalisée sur notre plateforme.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 