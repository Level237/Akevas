import React, { useState } from 'react';
import {
  User,
  Truck,
  MapPin,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  Check
} from 'lucide-react';
import { Link, ScrollRestoration } from 'react-router-dom';
import Header from '@/components/ui/header';
import AsyncLink from '@/components/ui/AsyncLink';
import { Button } from '@/components/ui/button';

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
    route: '/delivery/register/vehicle'
  },
  {
    id: 3,
    name: 'Zone de livraison',
    icon: MapPin,
    route: '/delivery/register/zone'
  },
  {
    id: 4,
    name: 'Documents',
    icon: FileText,
    route: '/delivery/register/documents'
  },
  {
    id: 5,
    name: 'Validation',
    icon: CheckCircle,
    route: '/delivery/register/validation'
  }
];

interface Document {
  id: string;
  name: string;
  description: string;
  required: boolean;
  file?: File;
}

const requiredDocuments: Document[] = [
  {
    id: 'id_card',
    name: 'Pièce d\'identité',
    description: 'Carte nationale d\'identité, passeport ou permis de conduire',
    required: true
  },
  {
    id: 'photo',
    name: 'Photo d\'identité',
    description: 'Photo récente sur fond blanc',
    required: true
  },
  {
    id: 'criminal_record',
    name: 'Casier judiciaire',
    description: 'Extrait de casier judiciaire de moins de 3 mois',
    required: true
  },
  {
    id: 'drivers_license',
    name: 'Permis de conduire',
    description: 'Pour les véhicules motorisés uniquement',
    required: false
  },
  {
    id: 'insurance',
    name: 'Attestation d\'assurance',
    description: 'Pour les véhicules motorisés uniquement',
    required: false
  }
];

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(requiredDocuments);

  const handleFileChange = (documentId: string, file: File) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId ? { ...doc, file } : doc
    ));
  };

  const removeFile = (documentId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId ? { ...doc, file: undefined } : doc
    ));
  };

  const isComplete = () => {
    return documents
      .filter(doc => doc.required)
      .every(doc => doc.file);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollRestoration />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Documents requis
          </h1>
          <p className="mt-2 text-gray-600">
            Téléchargez les documents nécessaires pour compléter votre inscription
          </p>
        </div>

        {/* Progress Steps */}
        <nav className="mb-8">
          <ol className="flex items-center justify-center space-x-8">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step.id <= 4
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
                      step.id <= 4 ? 'text-[#ed7e0f]' : 'text-gray-500'
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Documents List */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="space-y-6">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border rounded-xl p-4 hover:border-[#ed7e0f] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium flex items-center gap-2">
                          {doc.name}
                          {doc.required && (
                            <span className="text-xs text-red-500">*Requis</span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {doc.description}
                        </p>
                      </div>
                      {doc.file && (
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-500" />
                          <button
                            onClick={() => removeFile(doc.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {!doc.file ? (
                      <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#ed7e0f] transition-colors">
                        <div className="text-center">
                          <Upload className="mx-auto w-8 h-8 text-gray-400" />
                          <span className="mt-2 block text-sm text-gray-500">
                            Cliquez pour télécharger
                          </span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileChange(doc.id, file);
                          }}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <FileText className="w-5 h-5 text-[#ed7e0f]" />
                        {doc.file.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t flex justify-between">
              <AsyncLink
                to="/auth/delivery/zone"
                className="px-6 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Retour
              </AsyncLink>
              <AsyncLink to="/delivery/validation">
              <Button
                
                className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                  isComplete()
                    ? 'bg-[#ed7e0f] text-white hover:bg-[#ed7e0f]/80'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={(e: React.MouseEvent) => {
                  if (!isComplete()) {
                    e.preventDefault();
                  }
                }}
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </Button>

              </AsyncLink>
             
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#ed7e0f]" />
              Informations importantes
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Les documents doivent être lisibles et en cours de validité</li>
              <li>• Formats acceptés : PDF, JPG, PNG</li>
              <li>• Taille maximale : 5 MB par document</li>
              <li>• Les documents seront vérifiés sous 24-48h ouvrées</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;
