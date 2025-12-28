import React, { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Link2, 
  Check,
  Share2,
} from 'lucide-react';
import { toast } from 'sonner';

interface ShareProductProps {
  productName: string;
  url: string;
}

const ShareProduct: React.FC<ShareProductProps> = ({ productName, url }) => {
  const [copied, setCopied] = useState(false);

  const shareLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-600 hover:text-white text-blue-600 bg-blue-50',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(url)}`,
      color: 'hover:bg-sky-500 hover:text-white text-sky-500 bg-sky-50',
    },
    {
      name: 'WhatsApp',
      icon: ({ className }: { className?: string }) => (
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className={className}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(`${productName} ${url}`)}`,
      color: 'hover:bg-green-600 hover:text-white text-green-600 bg-green-50',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      color: 'hover:bg-blue-700 hover:text-white text-blue-700 bg-blue-50',
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Erreur lors de la copie du lien');
    }
  };

  const handleShare = (shareUrl: string, platform: string) => {
    window.open(shareUrl, '_blank', 'width=600,height=400');
    console.log(platform);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productName,
          text: `Découvrez ce produit : ${productName}`,
          url: url,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
             toast.error('Erreur lors du partage');
        }
      }
    } else {
      toast.error('Le partage n\'est pas supporté sur cet appareil');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700">Partager cet article</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {shareLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => handleShare(link.url, link.name)}
            className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${link.color}`}
            title={`Partager sur ${link.name}`}
          >
            <link.icon className="w-5 h-5" />
          </button>
        ))}
        
        <button
          onClick={handleCopyLink}
          className={`p-2.5 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 ${
            copied 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Copier le lien"
        >
          {copied ? <Check className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}
        </button>

        <button
            onClick={handleNativeShare}
            className="p-2.5 rounded-xl transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105 active:scale-95"
            title="Plus d'options"
        >
            <Share2 className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default ShareProduct;
