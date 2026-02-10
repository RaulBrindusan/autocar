'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PriceNotification {
  priceCheckId: string;
  oldPrice: number;
  newPrice: number;
  timestamp: number;
}

interface PriceNotificationContextType {
  unreadNotifications: Set<string>;
  hasUnreadNotifications: boolean;
  addNotification: (priceCheckId: string, oldPrice: number, newPrice: number) => void;
  markAsRead: (priceCheckId: string) => void;
  markAllAsRead: () => void;
  isUnread: (priceCheckId: string) => boolean;
  markPageVisited: () => void;
  hasUnreadForSidebar: boolean;
}

const PriceNotificationContext = createContext<PriceNotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'price_notifications_unread';
const PAGE_VISITED_KEY = 'price_notifications_page_visited';

export function PriceNotificationProvider({ children }: { children: ReactNode }) {
  const [unreadNotifications, setUnreadNotifications] = useState<Set<string>>(new Set());
  const [pageVisited, setPageVisited] = useState(false);

  // Load unread notifications and page visited state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUnreadNotifications(new Set(parsed));
      }

      const visitedStored = localStorage.getItem(PAGE_VISITED_KEY);
      if (visitedStored) {
        setPageVisited(JSON.parse(visitedStored));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, []);

  // Save to localStorage whenever unreadNotifications or pageVisited changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(unreadNotifications)));
      localStorage.setItem(PAGE_VISITED_KEY, JSON.stringify(pageVisited));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }, [unreadNotifications, pageVisited]);

  const addNotification = (priceCheckId: string, oldPrice: number, newPrice: number) => {
    // Only add if it's a price drop (new price is lower than old price)
    if (newPrice < oldPrice) {
      setUnreadNotifications(prev => new Set(prev).add(priceCheckId));
      // Reset page visited flag when new notification arrives
      setPageVisited(false);
    }
  };

  const markAsRead = (priceCheckId: string) => {
    setUnreadNotifications(prev => {
      const newSet = new Set(prev);
      newSet.delete(priceCheckId);
      return newSet;
    });
  };

  const markAllAsRead = () => {
    setUnreadNotifications(new Set());
  };

  const markPageVisited = () => {
    setPageVisited(true);
  };

  const isUnread = (priceCheckId: string) => {
    return unreadNotifications.has(priceCheckId);
  };

  const hasUnreadNotifications = unreadNotifications.size > 0;

  // Sidebar should only show notification if page hasn't been visited since new notifications
  const hasUnreadForSidebar = hasUnreadNotifications && !pageVisited;

  return (
    <PriceNotificationContext.Provider
      value={{
        unreadNotifications,
        hasUnreadNotifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        isUnread,
        markPageVisited,
        hasUnreadForSidebar,
      }}
    >
      {children}
    </PriceNotificationContext.Provider>
  );
}

export function usePriceNotifications() {
  const context = useContext(PriceNotificationContext);
  if (context === undefined) {
    throw new Error('usePriceNotifications must be used within a PriceNotificationProvider');
  }
  return context;
}
