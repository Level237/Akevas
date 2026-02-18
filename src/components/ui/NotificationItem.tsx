import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { NotificationData } from '@/types/notifications';
import logo from '@/assets/favicon.png';

import { Link } from 'react-router-dom';
interface NotificationItemProps {
    notification: NotificationData;
    isSelected?: boolean;
    onClick?: () => void;
    variant?: 'dropdown' | 'list';
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    isSelected = false,
    onClick,
    variant = 'list'
}) => {
    const isUnread = notification.read_at === null;

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'À l\'instant';
        if (diffInHours < 24) return `Il y a ${diffInHours}h`;
        if (diffInHours < 48) return 'Hier';
        return date.toLocaleDateString('fr-FR');
    };

    const baseClasses = `flex items-start gap-3 transition-all duration-200 ${variant === 'dropdown' ? 'p-3 rounded-lg' : 'p-4'
        }`;

    const selectedClasses = isSelected
        ? 'bg-[#ed7e0f]/5 border-r-2 border-[#ed7e0f]'
        : '';

    const hoverClasses = variant === 'list'
        ? 'hover:bg-gray-50 cursor-pointer'
        : '';

    return (
        <Link

            className={`${baseClasses} ${selectedClasses} ${hoverClasses}`}
            onClick={onClick}
            to={`/seller/notifications/${notification.id}`}
        >
            <div className="relative">
                <img
                    src={logo}
                    alt="Akevas Logo"
                    className={`${variant === 'dropdown' ? 'w-8 h-8' : 'w-10 h-10'} rounded-full object-cover`}
                />
                {isUnread && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ed7e0f] rounded-full border-2 border-white"></div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <p className={`${variant === 'dropdown' ? 'text-sm' : 'text-sm'} font-medium truncate ${isUnread ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                        {notification.data.message}
                    </p>
                    <div className="flex items-center gap-2">
                        {isUnread && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ed7e0f]/10 text-[#ed7e0f]">
                                Nouveau
                            </span>
                        )}
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(notification.created_at)}
                        </span>
                    </div>
                </div>

                {variant === 'list' && (
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                            {notification.customer_name && `Client: ${notification.customer_name}`}
                        </p>
                        {notification.read_at && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default NotificationItem;
