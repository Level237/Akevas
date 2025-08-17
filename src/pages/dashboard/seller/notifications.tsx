import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAllNotificationQuery, useGetNotificationQuery } from '@/services/sellerService';
import { Bell, CheckCircle, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '@/assets/favicon.png';
import NotificationItem from '@/components/ui/NotificationItem';

interface NotificationData {
    id: number;
    order_id?: number;
    customer_name?: string;
    total_amount?: string;
    data: {
        message: string;
    };
    read_at: string | null;
    created_at: string;
}

const NotificationsPage: React.FC = () => {
    const { notificationId } = useParams<{ notificationId?: string }>();
    const navigate = useNavigate();
    const [selectedNotificationId, setSelectedNotificationId] = useState<number | null>(null);

    const { data: allNotifications, isLoading } = useAllNotificationQuery("seller");
    const { data: selectedNotification } = useGetNotificationQuery(notificationId, {
        skip: !selectedNotificationId,
    });
    console.log(selectedNotificationId)
    // Sync URL parameter with state
    useEffect(() => {
        if (notificationId) {
            const id = parseInt(notificationId);
            if (!isNaN(id)) {
                setSelectedNotificationId(id);
            }
        } else {
            setSelectedNotificationId(null);
        }
    }, [notificationId]);

    // Update URL when notification is selected
    const handleNotificationSelect = (id: number) => {
        setSelectedNotificationId(id);
        navigate(`/seller/notifications/${id}`);
    };

    // Clear selection and update URL
    const handleClearSelection = () => {
        setSelectedNotificationId(null);
        navigate('/seller/notifications');
    };

    const unreadCount = allNotifications?.filter((n: any) => n.read_at === null).length || 0;

    return (
        <div className="min-h-screen mx-24 bg-gray-50">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-[#ed7e0f] rounded-lg">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                        {unreadCount > 0 && (
                            <span className="px-2 py-1 bg-[#ed7e0f] text-white text-xs font-medium rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-600">Gérez toutes vos notifications et restez informé de vos activités</p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="flex h-[600px]">
                        {/* Left Sidebar - Notification List */}
                        <div className="w-1/2 border-r border-gray-200 flex flex-col">
                            {/* Search/Filter Header */}
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Rechercher dans les notifications..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ed7e0f] focus:border-transparent"
                                    />
                                    <Bell className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Notifications List */}
                            <div className="flex-1 overflow-y-auto">
                                {isLoading ? (
                                    <div className="flex items-center justify-center h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ed7e0f]"></div>
                                    </div>
                                ) : allNotifications && allNotifications.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {allNotifications.map((notification: NotificationData) => (
                                            <NotificationItem
                                                key={notification.id}
                                                notification={notification}
                                                isSelected={selectedNotificationId === notification.id}
                                                onClick={() => handleNotificationSelect(notification.id)}
                                                variant="list"
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                            <Bell className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                                        <p className="text-gray-500">Vous n'avez pas encore reçu de notifications</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Panel - Notification Details */}
                        <div className="w-1/2 flex flex-col">
                            {selectedNotificationId ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedNotificationId}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex-1 flex flex-col"
                                    >
                                        {/* Notification Header */}
                                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-gray-900">Détails de la notification</h3>
                                                <button
                                                    onClick={handleClearSelection}
                                                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-gray-500" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Notification Content */}
                                        <div className="flex-1 p-6 overflow-y-auto">
                                            {selectedNotification ? (
                                                <div className="space-y-6">
                                                    {/* Notification Card */}
                                                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                                        <div className="flex items-start gap-4 mb-4">
                                                            <img
                                                                src={logo}
                                                                alt="Akevas Logo"
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                            <div className="flex-1">
                                                                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                                                                    Nouvelle commande
                                                                </h4>
                                                                <p className="text-gray-600">
                                                                    {selectedNotification.data.message}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Order Details */}
                                                        {selectedNotification.order_id && (
                                                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                                                <h5 className="font-medium text-gray-900 mb-3">Détails de la commande</h5>
                                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                                    <div>
                                                                        <span className="text-gray-500">Numéro de commande:</span>
                                                                        <p className="font-medium">#{selectedNotification.order_id}</p>
                                                                    </div>
                                                                    {selectedNotification.customer_name && (
                                                                        <div>
                                                                            <span className="text-gray-500">Client:</span>
                                                                            <p className="font-medium">{selectedNotification.customer_name}</p>
                                                                        </div>
                                                                    )}
                                                                    {selectedNotification.total_amount && (
                                                                        <div>
                                                                            <span className="text-gray-500">Montant total:</span>
                                                                            <p className="font-medium">{selectedNotification.total_amount} FCFA</p>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <span className="text-gray-500">Date:</span>
                                                                        <p className="font-medium">
                                                                            {new Date(selectedNotification.created_at).toLocaleDateString('fr-FR', {
                                                                                year: 'numeric',
                                                                                month: 'long',
                                                                                day: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Status */}
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-sm text-gray-500">Statut:</span>
                                                                {selectedNotification.read_at ? (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                                        Lu
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#ed7e0f]/10 text-[#ed7e0f]">
                                                                        Non lu
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <button className="px-4 py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#f19b45] transition-colors">
                                                                Voir la commande
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center h-full">
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ed7e0f]"></div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                        <Bell className="w-10 h-10 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Sélectionnez une notification
                                    </h3>
                                    <p className="text-gray-500 max-w-md">
                                        Choisissez une notification dans la liste à gauche pour voir ses détails complets
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
