import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Mail, Settings } from 'lucide-react';
import AsyncLink from '@/components/ui/AsyncLink';

const AccountNotActivated: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-50 p-6"
        >
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-2xl text-center space-y-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="bg-amber-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6"
                >
                    <ShieldAlert className="w-12 h-12 text-[#ed7e0f]" />
                </motion.div>

                <h2 className="text-2xl font-bold text-gray-900">Compte Vendeur Non Activé</h2>
                <p className="text-md text-gray-700 leading-relaxed">
                    Votre demande de création de compte vendeur est en cours de traitement. Notre équipe est en train de vérifier vos informations.
                </p>
                <p className="text-md text-gray-600">
                    Vous recevrez une notification par e-mail dès que votre compte sera activé. Cela peut prendre quelques heures.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <AsyncLink
                        to="/help"
                        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-[#ed7e0f] hover:bg-[#ed7e0f]/90 transition-colors"
                    >
                        <Mail className="w-5 h-5 mr-2" />
                        Contacter le support
                    </AsyncLink>
                    <AsyncLink
                        to="/seller/settings"
                        className="inline-flex items-center justify-center px-6 py-3 border border-[#ed7e0f] text-base font-medium rounded-full shadow-sm text-[#ed7e0f] bg-white hover:bg-[#ed7e0f]/5 transition-colors"
                    >
                        <Settings className="w-5 h-5 mr-2" />
                        Gérer mon profil
                    </AsyncLink>
                </div>

                <p className="text-sm text-gray-500 mt-6">Merci de votre patience.</p>
            </div>
        </motion.div>
    );
};

export default AccountNotActivated;
