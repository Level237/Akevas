import React, { useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAllNotificationQuery } from '@/services/sellerService';
import NotificationItem from './NotificationItem';
import AsyncLink from './AsyncLink';
import { NotificationData } from '@/types/notifications';

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = React.memo(
    ({ isOpen, onClose }) => {
        const { data: allNotifications, isLoading } = useAllNotificationQuery("seller");
        const dropdownRef = useRef<HTMLDivElement>(null);
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                    onClose();
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [onClose]);

        if (!isOpen) return null;

        const unreadNotifications = allNotifications?.filter((n: NotificationData) => n.read_at === null) || [];
        const notificationsToDisplay = unreadNotifications.slice(0, 3);

        return (
            <motion.div
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-0 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
            >
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                    <div className="text-gray-600 text-sm space-y-2">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ed7e0f]"></div>
                            </div>
                        ) : notificationsToDisplay.length > 0 ? (
                            notificationsToDisplay.map((notification: NotificationData) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    isSelected={false}
                                    onClick={() => onClose()} // Close dropdown on item click
                                    variant="list"
                                />
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm">Aucune notification</p>
                            </div>
                        )}
                    </div>
                    <AsyncLink
                        to='/seller/notifications'
                        className="mt-4 p-4 cursor-pointer flex items-center w-full bg-[#ed7e0f] text-white py-2 rounded-md hover:bg-[#f19b45] transition-colors"
                        OnClick={onClose}
                    >
                        <div className="flex justify-center items-center gap-2 w-full">
                            <Bell className="w-4 h-4" />
                            <div>
                                <p>Voir toutes les notifications</p>
                            </div>
                        </div>
                    </AsyncLink>
                </div>
            </motion.div>
        );
    }
);

export default NotificationDropdown;
