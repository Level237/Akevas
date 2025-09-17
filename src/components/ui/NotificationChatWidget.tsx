import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Bell } from 'lucide-react';
import { useAllNotificationQuery } from '@/services/sellerService';
import { NotificationData } from '@/types/notifications';
import AsyncLink from './AsyncLink';
import logo from '@/assets/logo.png';

interface NotificationChatWidgetProps {
  bottomClass?: string;
  whatsappNumber?: string; // E.164 without '+' e.g. 2376XXXXXXXX
  whatsappMessage?: string;
}

const NotificationChatWidget: React.FC<NotificationChatWidgetProps> = ({ bottomClass = 'bottom-4 max-sm:bottom-24', whatsappNumber = "237674654624", whatsappMessage = "Bonjour, j'ai besoin d'aide en tant que vendeur AKEVAS." }) => {
  const { data: allNotifications, isLoading } = useAllNotificationQuery('seller');
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const unreadCount = useMemo(() => {
    return allNotifications?.filter((n: NotificationData) => n.read_at === null).length || 0;
  }, [allNotifications]);

  // Oldest to newest for chat feel
  const sortedNotifications: NotificationData[] = useMemo(() => {
    if (!allNotifications) return [] as NotificationData[];
    return [...allNotifications].sort(
      (a: NotificationData, b: NotificationData) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  }, [allNotifications]);

  const endOfListRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      if (listRef.current) {
        listRef.current.scrollTop = listRef.current.scrollHeight;
      } else {
        endOfListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }, [isOpen, sortedNotifications]);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const formatDay = (d: Date) =>
    d.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });

  const formatTime = (d: Date) => d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const firstUnreadIndex = useMemo(() => {
    if (!sortedNotifications.length) return -1;
    return sortedNotifications.findIndex((n) => n.read_at === null);
  }, [sortedNotifications]);

  return (
    <div className={`fixed ${bottomClass} right-4 z-50`}>
      <div className="relative">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="panel"
              ref={panelRef}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-16 right-0 w-[360px] max-h-[60vh] bg-white shadow-xl rounded-xl border border-gray-200 overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <button
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    const ok = window.confirm('Contacter AKEVAS via WhatsApp ?');
                    if (ok) {
                      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <div className="relative">
                    <img src={logo} alt="AKEVAS" className="w-8 h-8 rounded-full object-cover" />
                    <span className="absolute -bottom-0 -right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-900">AKEVAS SELLER</span>
                    <span className="text-[11px] text-gray-500">Support • WhatsApp</span>
                  </div>
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-gray-200">
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Chat transcript */}
              <div ref={listRef} className="flex-1 flex flex-col gap-2 overflow-y-auto bg-white" style={{ maxHeight: '48vh' }}>
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ed7e0f]"></div>
                  </div>
                ) : sortedNotifications.length > 0 ? (
                  <div className="px-3 py-2">
                    {sortedNotifications.map((n: NotificationData, idx: number) => {
                      const currentDate = new Date(n.created_at);
                      const prev = idx > 0 ? new Date(sortedNotifications[idx - 1].created_at) : null;
                      const showDaySeparator = !prev || !isSameDay(currentDate, prev);
                      const showUnreadSeparator = idx === firstUnreadIndex && firstUnreadIndex !== -1;
                      const isUnread = n.read_at === null;
                      return (
                        <div key={n.id} className="w-full">
                          {showDaySeparator && (
                            <div className="flex items-center my-3">
                              <div className="flex-1 h-px bg-gray-200"></div>
                              <span className="mx-3 text-[11px] text-gray-500 whitespace-nowrap">
                                {formatDay(currentDate)}
                              </span>
                              <div className="flex-1 h-px bg-gray-200"></div>
                            </div>
                          )}
                          {showUnreadSeparator && (
                            <div className="flex items-center my-2">
                              <div className="flex-1 h-px bg-[#ed7e0f]/30"></div>
                              <span className="mx-3 text-[11px] font-medium text-[#ed7e0f] whitespace-nowrap">
                                Nouveaux messages
                              </span>
                              <div className="flex-1 h-px bg-[#ed7e0f]/30"></div>
                            </div>
                          )}
                          <div className="flex items-end mb-3 gap-2">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                              <img src={logo} alt="AKEVAS" className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className={`max-w-[78%] rounded-2xl px-3 py-2 ${
                              isUnread ? 'bg-[#ed7e0f]/10 text-gray-900' : 'bg-gray-100 text-gray-800'
                            }`}> 
                              <p className="text-sm break-words leading-relaxed">{n.data.message}</p>
                              <div className="mt-1 text-[10px] text-gray-500 text-right">
                                {formatTime(currentDate)}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={endOfListRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-8">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Bell className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">Aucune notification</p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="border-t border-gray-200 p-3 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <AsyncLink to="/seller/notifications">
                    <button className="w-full py-2 bg-[#ed7e0f] text-white rounded-lg hover:bg-[#f19b45] transition-colors text-sm font-medium">
                      Voir plus
                    </button>
                  </AsyncLink>
                  <button
                    onClick={() => {
                      const ok = window.confirm('Contacter le support AKEVAS via WhatsApp ?');
                      if (ok) {
                        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                        window.open(url, '_blank');
                      }
                    }}
                    className="w-full py-2.5 bg-white text-[#ed7e0f] border border-[#ed7e0f] rounded-lg hover:bg-[#ed7e0f]/10 transition-colors text-sm font-medium"
                  >
                    Contacter le support
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Button */}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="bg-[#6e0a13] shadow-xl rounded-full w-14 h-14 flex items-center justify-center hover:scale-110 transition-transform duration-200 focus:outline-none relative"
          aria-label="Ouvrir les notifications"
          style={{ minWidth: 56, minHeight: 56 }}
        >
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500 text-white shadow">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          <MessageCircle className="w-7 h-7 text-white" />
        </button>
      </div>
    </div>
  );
};

export default NotificationChatWidget;


