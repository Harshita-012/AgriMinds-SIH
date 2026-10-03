// Offline Mode & Two-Way Sync Engine for AgriMinds (Phase 3)
import { sharedStore } from '../../phase2/store';

const FARMER_CACHE_KEY = 'agriminds_farmer_offline_cache';
const CENTER_OFFLINE_QUEUE_KEY = 'agriminds_center_offline_queue';

class OfflineSyncService {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.simulatedOffline = false;
    this.listeners = new Set();
    this.initListeners();
  }

  initListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.notify();
        this.syncPendingActions();
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
        this.notify();
      });
    }
  }

  getEffectiveOnlineStatus() {
    if (this.simulatedOffline) return false;
    return this.isOnline;
  }

  setSimulatedOffline(status) {
    this.simulatedOffline = status;
    this.notify();
    if (!status && this.isOnline) {
      this.syncPendingActions();
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify() {
    const status = this.getEffectiveOnlineStatus();
    this.listeners.forEach(cb => cb(status, this.getPendingQueueCount()));
  }

  // ==================== FARMER OFFLINE CACHE ====================

  saveFarmerCache(data) {
    try {
      const cacheObj = {
        ...data,
        // Enforce strict masking in offline storage
        kisanCardMasked: data?.kisanCardMasked || '••••-••••-8921',
        cachedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
        cachedDate: new Date().toLocaleDateString()
      };
      localStorage.setItem(FARMER_CACHE_KEY, JSON.stringify(cacheObj));
    } catch (e) {
      console.warn('Failed to save farmer offline cache', e);
    }
  }

  getFarmerCache() {
    try {
      const raw = localStorage.getItem(FARMER_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  // ==================== CENTER STAFF OFFLINE QUEUE ====================

  queueCenterAction(actionType, payload, staffName = 'Center Staff') {
    const queue = this.getPendingQueue();
    const actionItem = {
      id: 'offline-act-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      actionType,
      payload,
      staffName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      createdAt: Date.now()
    };
    queue.push(actionItem);
    localStorage.setItem(CENTER_OFFLINE_QUEUE_KEY, JSON.stringify(queue));
    this.notify();
    return actionItem;
  }

  getPendingQueue() {
    try {
      const raw = localStorage.getItem(CENTER_OFFLINE_QUEUE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getPendingQueueCount() {
    return this.getPendingQueue().length;
  }

  syncPendingActions() {
    const queue = this.getPendingQueue();
    if (queue.length === 0) return { syncedCount: 0 };

    let successCount = 0;
    queue.forEach(item => {
      try {
        switch (item.actionType) {
          case 'QR_CHECKIN':
            sharedStore.checkInFarmer(item.payload.tokenInput, item.payload.centerId, item.staffName);
            break;
          case 'ADVANCE_STAGE':
            sharedStore.advanceStage(item.payload.tokenNumber, item.payload.nextStageId, item.staffName, item.payload.note);
            break;
          case 'REJECT_QUALITY':
            sharedStore.rejectQuality(item.payload.tokenNumber, item.payload.reason, item.payload.note, item.staffName);
            break;
          case 'MARK_NOSHOW':
            sharedStore.markNoShow(item.payload.tokenNumber, item.staffName);
            break;
          case 'WALKIN_BOOKING':
            sharedStore.createWalkInBooking(item.payload, item.staffName);
            break;
          default:
            break;
        }
        sharedStore.addAuditLog(
          item.staffName,
          'Offline Action Synced',
          `Type: ${item.actionType}`,
          `Queued at ${item.timestamp}, reconciled to live store on reconnect.`
        );
        successCount++;
      } catch (err) {
        console.error('Error syncing item:', item, err);
      }
    });

    // Clear queue after sync
    localStorage.removeItem(CENTER_OFFLINE_QUEUE_KEY);
    this.notify();
    return { syncedCount: successCount };
  }
}

export const offlineSync = new OfflineSyncService();
