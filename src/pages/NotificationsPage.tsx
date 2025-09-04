import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Store, Truck, ShoppingBag, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import Header from '@/components/ui/header';
import { Button } from '@/components/ui/button';
import { ScrollRestoration } from 'react-router-dom';
import { cn } from '@/lib/utils';

type NotificationType = 'all' | 'order' | 'store' | 'delivery' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  status?: 'success' | 'warning' | 'info';
}

// Mock notifications data
const notifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Nouvelle commande reçue',
    message: 'Vous avez reçu une nouvelle commande #12345',
    timestamp: '2 minutes',
    isRead: false,
    status: 'success'
  },
  {
    id: '2',
    type: 'store',
    title: 'Boutique approuvée',
    message: 'Votre boutique a été approuvée ! Vous pouvez maintenant commencer à vendre.',
    timestamp: '1 heure',
    isRead: false,
    status: 'success'
  },
  {
    id: '3',
    type: 'delivery',
    title: 'Nouvelle livraison disponible',
    message: 'Une nouvelle livraison est disponible dans votre zone',
    timestamp: '3 heures',
    isRead: false,
    status: 'info'
  },
  {
    id: '4',
    type: 'system',
    title: 'Maintenance prévue',
    message: 'Une maintenance est prévue le 25 janvier à 03:00',
    timestamp: '1 jour',
    isRead: true,
    status: 'warning'
  },
  // Add more notifications as needed
];

const filterTabs = [
  { id: 'all', label: 'Toutes', icon: Bell },
  { id: 'order', label: 'Commandes', icon: ShoppingBag },
  { id: 'store', label: 'Boutique', icon: Store },
  { id: 'delivery', label: 'Livraisons', icon: Truck },
  { id: 'system', label: 'Système', icon: AlertCircle }
];

const NotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<NotificationType>('all');
  const [notificationState, setNotificationState] = useState(notifications);

  const filteredNotifications = notificationState.filter(
    notification => activeFilter === 'all' || notification.type === activeFilter
  );

  const markAllAsRead = () => {
    setNotificationState(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Bell className="w-5 h-5 text-blue-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ScrollRestoration />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Restez informé de vos activités</p>
          </div>
          <Button variant="outline" onClick={markAllAsRead}>
            Tout marquer comme lu
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar mb-6 bg-white p-2 rounded-xl shadow-sm">
          {filterTabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as NotificationType)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors",
                  activeFilter === tab.id
                    ? "bg-[#ed7e0f] text-white"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={cn(
                  "bg-white rounded-xl p-4 shadow-sm transition-colors",
                  !notification.isRead && "border-l-4 border-[#ed7e0f]"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(notification.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {notification.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-gray-600">
                Vous n'avez aucune notification pour le moment
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NotificationsPage;
