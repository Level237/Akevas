import React from 'react';
import { motion } from 'framer-motion';
import { useRecentNotificationsQuery } from '@/services/sellerService';
import logo from '@/assets/favicon.png'
import AsyncLink from './AsyncLink';

interface NotificationData {
    id: number,
    order_id?: number;
    customer_name?: string;
    total_amount?: string;
    data: {
        message: string
    },
    read_at: string | null,
    created_at: string
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = React.memo(
    ({ isOpen, onClose }) => {
        if (!isOpen) return null;
        const { data: recentNotifications, isLoading } = useRecentNotificationsQuery('seller');

        if (isLoading) {
            return (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-0 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 p-4"
                >
                    <p className="text-gray-600 text-sm">Loading notifications...</p>
                </motion.div>
            );
        }

        const notificationsToDisplay = recentNotifications ? recentNotifications.slice(-3) : [];

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
                    <div className="text-gray-600 text-sm space-y-2">
                        {notificationsToDisplay.length > 0 ? (
                            notificationsToDisplay.map((notification: NotificationData, index: number) => {
                                const isUnread = notification.read_at === null;
                                return (
                                    <React.Fragment key={notification.id}>
                                        <div className={`flex items-start p-3 rounded-lg transition-all duration-200 cursor-pointer hover:shadow-sm ${isUnread
                                            ? 'bg-gray-100 hover:bg-gray-200 border-l-4 border-[#6e0a13] shadow-sm'
                                            : 'bg-gray-50 hover:bg-gray-200 border-l-4 border-transparent hover:bg-gray-100'
                                            }`}>
                                            <div className="relative">
                                                <img
                                                    src={logo}
                                                    alt="Akevas Logo"
                                                    className="w-8 h-8 rounded-full mr-3 object-cover"
                                                />
                                                {isUnread && (
                                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ed7e0f] rounded-full border-2 border-white"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium ${isUnread ? 'text-gray-900' : 'text-gray-700'
                                                    }`}>
                                                    {notification.data.message}
                                                </p>
                                                <p className="text-gray-500 text-xs mt-1">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </p>
                                                {isUnread && (
                                                    <div className="flex items-center mt-2">
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ed7e0f]/10 text-[#ed7e0f]">
                                                            Nouveau
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {index < notificationsToDisplay.length - 1 && (
                                            <hr className="border-gray-200" />
                                        )}
                                    </React.Fragment>
                                );
                            })
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-sm">Aucune notification</p>
                            </div>
                        )}
                    </div>
                    <AsyncLink
                        to='/seller/notifications'
                        className="mt-4 p-4 flex items-center w-full bg-[#ed7e0f] text-white py-2 rounded-md hover:bg-[#f19b45] transition-colors"
                    >
                        Voir plus
                    </AsyncLink>
                </div>
            </motion.div>
        );
    }
);

export default NotificationDropdown;
