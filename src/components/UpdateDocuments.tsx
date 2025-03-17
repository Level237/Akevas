import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { useGetUserQuery, useUpdateDocumentsMutation } from '@/services/auth'

type DocumentKeys = 'identity_card_in_front' | 'identity_card_with_the_person' | 'drivers_license' | 'vehicle_image';

const documentLabels: Record<DocumentKeys, string> = {
  identity_card_in_front: "Carte d'identité",
  identity_card_with_the_person: "Photo de vous avec la carte d'identité",
  drivers_license: "Permis de conduire",
  vehicle_image: "Photo du véhicule"
}

const UpdateDocuments = () => {
  const [updateDocuments] = useUpdateDocumentsMutation()
  const { data: userData } = useGetUserQuery('Auth', {
    refetchOnFocus: false,
    refetchOnMountOrArgChange: false,
    refetchOnReconnect: false,
    pollingInterval: 0,
  });

  console.log(userData)
  const [documents, setDocuments] = useState({
    identity_card_in_front: null,
    identity_card_with_the_person: null,
    drivers_license: null,
    vehicle_image: null
  })
  const [preview, setPreview] = useState({
    identity_card_in_front: userData?.identity_card_in_front || null,
    identity_card_with_the_person: userData?.identity_card_with_the_person || null,
    drivers_license: userData?.drivers_license || null,
    vehicle_image: userData?.vehicle?.vehicle_image || null
  })
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e:any, documentType:any) => {
    const file = e.target.files[0]
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [documentType]: file
      }))
      
      // Créer une URL pour la prévisualisation
      const previewUrl = URL.createObjectURL(file)
      setPreview(prev => ({
        ...prev,
        [documentType]: previewUrl
      }))
    }
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      Object.entries(documents).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file)
        }
      })

      await updateDocuments(formData)
      setTimeout(() => setLoading(false), 2000);
    sessionStorage.setItem("message","Vous aviez modifié vos documents avec success patientez nous traitons vos données pour confirmer votre compte")
    window.location.href="/"
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFile = (documentType:any) => {
    setDocuments(prev => ({
      ...prev,
      [documentType]: null
    }))
    setPreview(prev => ({
      ...prev,
      [documentType]: null
    }))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Mise à jour des documents
      </h1>

      {userData?.feedbacks && userData.feedbacks.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-orange-800 mb-2">Message de l'administrateur :</h3>
          {userData.feedbacks.map((feedback:any) => (
            <p key={feedback.id} className="text-orange-700">
              {feedback.message}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {Object.entries(documentLabels).map(([key, label]) => (
          <div key={key} className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-medium mb-4">{label}</h3>
            
            {!preview[key as DocumentKeys] ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">
                    Cliquez ou glissez un fichier ici
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, key)}
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview[key as DocumentKeys]}
                  alt={label}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeFile(key)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={loading || (!Object.values(documents).some(doc => doc) && !Object.values(preview).some(prev => prev))}
          className={`w-full py-3 rounded-lg font-medium ${
            loading || (!Object.values(documents).some(doc => doc) && !Object.values(preview).some(prev => prev))
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#ed7e0f] text-white hover:bg-[#d97100]'
          } transition-colors`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Envoi en cours...
            </span>
          ) : (
            'Mettre à jour mes documents'
          )}
        </button>
      </form>
    </div>
  )
}

export default UpdateDocuments 