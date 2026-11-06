import AsyncStorage from '@react-native-async-storage/async-storage';
import { ordersService, customersService, paymentsService, expensesService } from './api';

export interface QueueItem {
  id: string;
  type: 'CREATE_ORDER' | 'CREATE_CUSTOMER' | 'RECORD_PAYMENT' | 'CREATE_EXPENSE';
  data: any;
  timestamp: number;
}

const QUEUE_STORAGE_KEY = '@business_sync_queue_v1';
const CACHE_PREFIX = '@offline_cache_';

export const offlineStorage = {
  // Save cache snapshot
  async saveCache(key: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(data));
    } catch (e) {
      console.warn('Error saving offline cache:', e);
    }
  },

  // Read cache snapshot
  async getCache<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.warn('Error reading offline cache:', e);
      return null;
    }
  },

  // Add action to pending sync queue
  async enqueue(type: QueueItem['type'], data: any): Promise<void> {
    try {
      const queue = await this.getQueue();
      const item: QueueItem = {
        id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type,
        data,
        timestamp: Date.now(),
      };
      queue.push(item);
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
      console.log(`[Offline Queue] Enqueued ${type}. Total pending: ${queue.length}`);
    } catch (e) {
      console.warn('Error enqueuing offline task:', e);
    }
  },

  // Get all pending actions
  async getQueue(): Promise<QueueItem[]> {
    try {
      const raw = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  },

  // Clear queue
  async clearQueue(): Promise<void> {
    try {
      await AsyncStorage.removeItem(QUEUE_STORAGE_KEY);
    } catch (e) {
      console.warn('Error clearing queue:', e);
    }
  },

  // Process & Sync queue with PostgreSQL backend
  async syncPendingQueue(): Promise<{ synced: number; remaining: number }> {
    const queue = await this.getQueue();
    if (queue.length === 0) {
      return { synced: 0, remaining: 0 };
    }

    console.log(`[Offline Sync] Processing ${queue.length} pending items...`);
    const remainingQueue: QueueItem[] = [];
    let synced = 0;

    for (const item of queue) {
      try {
        let res: any = null;
        switch (item.type) {
          case 'CREATE_ORDER':
            res = await ordersService.createOrder(item.data);
            break;
          case 'CREATE_CUSTOMER':
            res = await customersService.addCustomer(item.data.name, item.data.phone, item.data.openingDue);
            break;
          case 'RECORD_PAYMENT':
            res = await paymentsService.recordPayment(item.data);
            break;
          case 'CREATE_EXPENSE':
            res = await expensesService.createExpense(item.data);
            break;
        }

        if (res && res.success) {
          synced++;
        } else {
          // If still failing (e.g. backend down), retain in queue
          remainingQueue.push(item);
        }
      } catch (err) {
        remainingQueue.push(item);
      }
    }

    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(remainingQueue));
    console.log(`[Offline Sync] Finished. Synced: ${synced}, Remaining: ${remainingQueue.length}`);
    return { synced, remaining: remainingQueue.length };
  },
};
