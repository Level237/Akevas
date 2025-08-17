import React from 'react';
import { motion } from 'framer-motion';

interface Notification {
    id: string;
    message: string;
    avatar: string;
    time: string;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = React.memo(
    ({ isOpen, onClose }) => {
        if (!isOpen) return null;

        const notifications: Notification[] = [
            {
                id: "1",
                message: "Votre commande #123 a été expédiée.",
                avatar: "https://i.pravatar.cc/40?img=1",
                time: "2 heures ago",
            },
            {
                id: "2",
                message: "Nouveau message du client John Doe.",
                avatar: "https://i.pravatar.cc/40?img=2",
                time: "4 heures ago",
            },
            {
                id: "3",
                message: "Le produit 'Super Widget' est en rupture de stock.",
                avatar: "https://i.pravatar.cc/40?img=3",
                time: "1 jour ago",
            },
            {
                id: "4",
                message: "Vous avez une nouvelle évaluation pour votre service.",
                avatar: "https://i.pravatar.cc/40?img=4",
                time: "2 jours ago",
            },
            {
                id: "5",
                message: "Votre abonnement expire bientôt.",
                avatar: "https://i.pravatar.cc/40?img=5",
                time: "3 jours ago",
            },
        ];

        const lastThreeNotifications = notifications.slice(-3);

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-0 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
            >
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                    <div className="text-gray-600 text-sm">
                        {lastThreeNotifications.map((notification) => (
                            <React.Fragment key={notification.id}>
                                <div className="flex items-center mb-2 last:mb-0">
                                    <img
                                        src={notification.avatar}
                                        alt="User Avatar"
                                        className="w-8 h-8 rounded-full mr-3 object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="text-gray-800 text-sm">{notification.message}</p>
                                        <p className="text-gray-500 text-xs mt-1">{notification.time}</p>
                                    </div>
                                </div>
                                <hr className="my-2 border-gray-200 last:hidden" />
                            </React.Fragment>
                        ))}
                    </div>
                    <button
                        onClick={onClose}
                        className="mt-4 w-full bg-[#ed7e0f] text-white py-2 rounded-md hover:bg-[#f19b45] transition-colors"
                    >
                        Voir plus
                    </button>
                </div>
            </motion.div>
        );
    }
);

export default NotificationDropdown;
