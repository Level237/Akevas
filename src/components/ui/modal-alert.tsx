import { AlertCircle } from "lucide-react";

export default function ModalAlert({ showWarningModal, setShowWarningModal }: { showWarningModal: boolean, setShowWarningModal: (showWarningModal: boolean) => void }) {
    return (
        <>
            {showWarningModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold mb-4">Attention</h3>
                        <div className="mb-6">
                            <div className="flex items-start gap-2 text-red-600 mb-4">
                                <AlertCircle className="w-5 h-5 mt-1" />
                                <p className="text-sm">
                                    Vous avez une livraison active en cours.
                                    Veuillez la terminer avant de prendre une nouvelle commande.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setShowWarningModal(false)}
                                className="px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#ed7e0f]/90"
                            >
                                J'ai compris
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}