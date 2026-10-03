// Central Shared Store for AgriMinds Phase 2 with BroadcastChannel Sync
import { CROPS, TIME_SLOTS, CENTERS, STAGES } from '../data/mockData';
import { INITIAL_WEATHER_FORECAST } from './weather';

const STORE_KEY = 'agriminds_shared_store_v2';
const ADMIN_SESSION_KEY = 'agriminds_admin_session';

// Crop yield reasonableness limits (Quintals per acre)
export const MAX_YIELD_PER_ACRE = {
  wheat: 26,
  paddy: 30,
  maize: 28,
  bajra: 16,
  barley: 20,
  gram: 12,
  moong: 10,
  arhar: 12,
  mustard: 14,
  soybean: 15,
  groundnut: 18,
  cotton: 16,
  sugarcane: 350
};

// Initial Seed Data for Phase 2
const createInitialState = () => {
  const todayStr = 'Today, 24 Sep';
  const tomorrowStr = 'Tomorrow, 25 Sep';

  return {
    version: '2.0',
    settings: {
      gracePeriodMins: 30,
      autoPromoteWaitlist: true,
      maxYieldPerAcre: MAX_YIELD_PER_ACRE
    },
    // Weather forecast state
    weatherForecast: INITIAL_WEATHER_FORECAST,
    // Active Mandi Bookings & Tokens
    bookings: [
      {
        tokenNumber: 140,
        backupCode: 'AGRI-4M81X',
        centerId: 'center-1',
        centerName: 'Nilokheri Main Mandi',
        date: todayStr,
        slotTime: '08:00 AM - 09:30 AM',
        slotId: 's1',
        farmerName: 'Balwant Singh',
        mobile: '9876543210',
        kisanCardMasked: '••••-••••-4102',
        cropId: 'wheat',
        cropName: 'Wheat',
        quantity: 45,
        landSize: 2.0,
        status: 'completed', // completed, active, checked-in, waiting, rejected, no-show, cancelled
        currentStageId: 7,
        checkedInAt: '08:15 AM',
        verified: true,
        noShowCount: 0
      },
      {
        tokenNumber: 141,
        backupCode: 'AGRI-9N22B',
        centerId: 'center-1',
        centerName: 'Nilokheri Main Mandi',
        date: todayStr,
        slotTime: '08:00 AM - 09:30 AM',
        slotId: 's1',
        farmerName: 'Surjit Kumar',
        mobile: '9812341122',
        kisanCardMasked: '••••-••••-5581',
        cropId: 'wheat',
        cropName: 'Wheat',
        quantity: 60,
        landSize: 2.5,
        status: 'completed',
        currentStageId: 7,
        checkedInAt: '08:25 AM',
        verified: true,
        noShowCount: 0
      },
      {
        tokenNumber: 142,
        backupCode: 'AGRI-3K11Z',
        centerId: 'center-1',
        centerName: 'Nilokheri Main Mandi',
        date: todayStr,
        slotTime: '08:00 AM - 09:30 AM',
        slotId: 's1',
        farmerName: 'Harpreet Singh',
        mobile: '9845012398',
        kisanCardMasked: '••••-••••-7714',
        cropId: 'paddy',
        cropName: 'Paddy',
        quantity: 30,
        landSize: 1.5,
        status: 'in-service',
        currentStageId: 4, // Weighing
        checkedInAt: '08:40 AM',
        verified: true,
        noShowCount: 0
      },
      {
        tokenNumber: 143,
        backupCode: 'AGRI-6P99Q',
        centerId: 'center-1',
        centerName: 'Nilokheri Main Mandi',
        date: todayStr,
        slotTime: '09:30 AM - 11:00 AM',
        slotId: 's2',
        farmerName: 'Kuldeep Sharma',
        mobile: '9811099234',
        kisanCardMasked: '••••-••••-9012',
        cropId: 'mustard',
        cropName: 'Mustard',
        quantity: 25,
        landSize: 2.0,
        status: 'checked-in',
        currentStageId: 2, // Center Entry
        checkedInAt: '09:15 AM',
        verified: false,
        noShowCount: 1
      },
      {
        tokenNumber: 144,
        backupCode: 'AGRI-8W33T',
        centerId: 'center-1',
        centerName: 'Nilokheri Main Mandi',
        date: todayStr,
        slotTime: '09:30 AM - 11:00 AM',
        slotId: 's2',
        farmerName: 'Jagjit Singh',
        mobile: '9877112233',
        kisanCardMasked: '••••-••••-6623',
        cropId: 'wheat',
        cropName: 'Wheat',
        quantity: 50,
        landSize: 2.0,
        status: 'booked',
        currentStageId: 1,
        verified: false,
        noShowCount: 0
      },
      {
        tokenNumber: 145,
        backupCode: 'AGRI-2X44M',
        centerId: 'center-1',
        centerName: 'Nilokheri Main Mandi',
        date: todayStr,
        slotTime: '09:30 AM - 11:00 AM',
        slotId: 's2',
        farmerName: 'Dharmpal Yadav',
        mobile: '9822334455',
        kisanCardMasked: '••••-••••-1190',
        cropId: 'paddy',
        cropName: 'Paddy',
        quantity: 110, // Intentionally high for 1.5 acres to demo reasonableness check!
        landSize: 1.5,
        status: 'checked-in',
        currentStageId: 2,
        checkedInAt: '09:35 AM',
        verified: false,
        noShowCount: 2
      },
      {
        tokenNumber: 146,
        backupCode: 'AGRI-5Y88R',
        centerId: 'center-1',
        centerName: 'Nilokheri Main Mandi',
        date: todayStr,
        slotTime: '09:30 AM - 11:00 AM',
        slotId: 's2',
        farmerName: 'Satpal Gurjar',
        mobile: '9899001122',
        kisanCardMasked: '••••-••••-3344',
        cropId: 'wheat',
        cropName: 'Wheat',
        quantity: 35,
        landSize: 1.8,
        status: 'booked',
        currentStageId: 1,
        verified: false,
        noShowCount: 0
      },
      {
        tokenNumber: 147,
        backupCode: 'AGRI-7K92M',
        centerId: 'center-1',
        centerName: 'Nilokheri Main Mandi',
        date: todayStr,
        slotTime: '11:00 AM - 12:30 PM',
        slotId: 's3',
        farmerName: 'Ram Kishan (Demo Farmer)',
        mobile: '9812345678',
        kisanCardMasked: '••••-••••-8921',
        cropId: 'wheat',
        cropName: 'Wheat',
        quantity: 40,
        landSize: 4.5,
        status: 'booked',
        currentStageId: 1,
        verified: false,
        noShowCount: 0
      }
    ],
    // Waitlist queue
    waitlist: [
      {
        id: 'wl-101',
        centerId: 'center-1',
        date: todayStr,
        slotId: 's2',
        slotTime: '09:30 AM - 11:00 AM',
        farmerName: 'Mohan Lal Saini',
        mobile: '9819001122',
        kisanCardMasked: '••••-••••-7123',
        cropId: 'wheat',
        cropName: 'Wheat',
        quantity: 40,
        landSize: 2.0,
        position: 1,
        status: 'waiting', // waiting, promoted, expired, confirmed
        joinedAt: '07:45 AM',
        promotionExpiresAt: null
      },
      {
        id: 'wl-102',
        centerId: 'center-1',
        date: todayStr,
        slotId: 's2',
        slotTime: '09:30 AM - 11:00 AM',
        farmerName: 'Avtar Singh Sandhu',
        mobile: '9822119900',
        kisanCardMasked: '••••-••••-3982',
        cropId: 'wheat',
        cropName: 'Wheat',
        quantity: 55,
        landSize: 2.5,
        position: 2,
        status: 'waiting',
        joinedAt: '08:10 AM',
        promotionExpiresAt: null
      }
    ],
    // Center In-box for Re-check requests & Complaints
    centerInbox: [
      {
        id: 'inbox-1',
        type: 'recheck',
        tokenNumber: 139,
        farmerName: 'Pritam Chand',
        mobile: '9811223344',
        crop: 'Wheat',
        reason: 'Moisture was 12.8% at local lab, Mandi reported 14.5%',
        timestamp: '08:50 AM',
        status: 'pending' // pending, resolved
      }
    ],
    // Chronological Audit Log
    auditLog: [
      {
        id: 'log-1',
        timestamp: '08:15 AM',
        staffName: 'Ramesh Verma',
        action: 'QR Scan Check-in',
        targetFarmer: 'Balwant Singh (#140)',
        details: 'Gate entry verified at Gate #1 via QR scan.'
      },
      {
        id: 'log-2',
        timestamp: '08:20 AM',
        staffName: 'Ramesh Verma',
        action: 'Quality Check Approved',
        targetFarmer: 'Balwant Singh (#140)',
        details: 'Wheat moisture 11.8%, foreign matter 0.5%. Grade A.'
      },
      {
        id: 'log-3',
        timestamp: '08:40 AM',
        staffName: 'Ramesh Verma',
        action: 'Weighing Recorded',
        targetFarmer: 'Balwant Singh (#140)',
        details: 'Gross weight 45.0 Quintals registered on weighbridge #2.'
      },
      {
        id: 'log-4',
        timestamp: '08:45 AM',
        staffName: 'Ramesh Verma',
        action: 'QR Scan Check-in',
        targetFarmer: 'Harpreet Singh (#142)',
        details: 'Gate entry scanned on time.'
      }
    ],
    // Simulated SMS Outbound / Received Box (for offline fallback showcase)
    smsMessages: [
      {
        id: 'sms-init-1',
        to: '9812345678',
        timestamp: '07:30 AM',
        text: 'AgriMinds: Your booking for Nilokheri Main Mandi is confirmed for Today, 11:00 AM. Token #147, Backup code: AGRI-7K92M.',
        type: 'booking'
      }
    ]
  };
};

class SharedStore {
  constructor() {
    this.subscribers = new Set();
    this.channel = null;
    this.state = this.loadState();
    this.initBroadcastChannel();
  }

  initBroadcastChannel() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.channel = new BroadcastChannel('agriminds_phase2_sync');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.type === 'SYNC_STATE') {
            this.state = event.data.payload;
            this.notifySubscribers(false);
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported or error:', e);
    }

    // Storage fallback for cross-tab sync
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORE_KEY && e.newValue) {
          try {
            this.state = JSON.parse(e.newValue);
            this.notifySubscribers(false);
          } catch {}
        }
      });
    }
  }

  loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.version === '2.0') return parsed;
      }
    } catch {}
    const initial = createInitialState();
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(initial));
    } catch {}
    return initial;
  }

  saveState(broadcast = true) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }

    if (broadcast && this.channel) {
      try {
        this.channel.postMessage({
          type: 'SYNC_STATE',
          payload: this.state
        });
      } catch {}
    }

    this.notifySubscribers(true);
  }

  getState() {
    return this.state;
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(isLocalChange = true) {
    this.subscribers.forEach(cb => cb(this.state, isLocalChange));
  }

  // Admin Session Management
  getAdminSession() {
    try {
      const raw = localStorage.getItem(ADMIN_SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  saveAdminSession(session) {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  }

  clearAdminSession() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }

  // ==================== CORE PHASE 2 ACTIONS ====================

  // 1. Audit Log helper
  addAuditLog(staffName, action, targetFarmer, details) {
    const logItem = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      staffName: staffName || 'Center Staff',
      action,
      targetFarmer,
      details
    };
    this.state.auditLog.unshift(logItem);
    this.state.auditLog = this.state.auditLog.slice(0, 50); // Keep last 50
  }

  // 2. Simulated SMS Outbox
  sendSMS(toMobile, message, type = 'general') {
    const smsItem = {
      id: 'sms-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      to: toMobile || 'Farmer Mobile',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      text: message,
      type
    };
    this.state.smsMessages.unshift(smsItem);
    this.state.smsMessages = this.state.smsMessages.slice(0, 30);
  }

  // 3. QR Check-in with validation
  checkInFarmer(tokenInput, centerId, staffName = 'Center Staff') {
    const cleanInput = (tokenInput || '').toString().trim().toUpperCase();
    
    // Find matching booking
    const booking = this.state.bookings.find(b => 
      b.tokenNumber.toString() === cleanInput || 
      (b.backupCode && b.backupCode.toUpperCase() === cleanInput)
    );

    if (!booking) {
      return { success: false, reason: 'invalid_token', message: 'Token or backup code not found in system.' };
    }

    if (booking.centerId !== centerId) {
      return { 
        success: false, 
        reason: 'wrong_center', 
        message: `Token is for ${booking.centerName}, not this center.` 
      };
    }

    if (booking.status === 'checked-in' || booking.status === 'in-service' || booking.status === 'completed') {
      return { 
        success: false, 
        reason: 'already_used', 
        message: `Token #${booking.tokenNumber} has already been checked in at ${booking.checkedInAt || 'earlier'}.` 
      };
    }

    if (booking.status === 'no-show' || booking.status === 'cancelled') {
      return { 
        success: false, 
        reason: 'cancelled', 
        message: `Token #${booking.tokenNumber} was marked as ${booking.status}. Please direct to walk-in desk.` 
      };
    }

    // Success Check-in!
    booking.status = 'checked-in';
    booking.currentStageId = 2; // Center Entry
    booking.checkedInAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    this.addAuditLog(
      staffName,
      'QR Check-In Approved',
      `${booking.farmerName} (#${booking.tokenNumber})`,
      `Verified gate entry. Stage set to Center Entry (2).`
    );

    this.sendSMS(
      booking.mobile,
      `AgriMinds: Entry verified for Token #${booking.tokenNumber} at ${booking.centerName}. Please proceed to Quality Check area.`,
      'entry'
    );

    this.saveState();
    return { success: true, booking };
  }

  // 4. Advance Stage
  advanceStage(tokenNumber, nextStageId, staffName = 'Center Staff', note = '') {
    const booking = this.state.bookings.find(b => b.tokenNumber === Number(tokenNumber));
    if (!booking) return false;

    booking.currentStageId = nextStageId;
    if (nextStageId === 7) {
      booking.status = 'completed';
    } else if (nextStageId >= 3) {
      booking.status = 'in-service';
    }

    const stageObj = STAGES.find(s => s.id === nextStageId) || { nameEn: `Stage ${nextStageId}` };

    this.addAuditLog(
      staffName,
      `Stage: ${stageObj.nameEn}`,
      `${booking.farmerName} (#${booking.tokenNumber})`,
      note || `Advanced to Stage ${nextStageId} (${stageObj.nameEn}).`
    );

    this.sendSMS(
      booking.mobile,
      `AgriMinds: Token #${booking.tokenNumber} update - ${stageObj.nameEn} completed at ${booking.centerName}.`,
      'stage'
    );

    this.saveState();
    return true;
  }

  // 5. Quality Check Rejection
  rejectQuality(tokenNumber, reason, note = '', staffName = 'Center Staff') {
    const booking = this.state.bookings.find(b => b.tokenNumber === Number(tokenNumber));
    if (!booking) return false;

    booking.status = 'rejected';
    booking.rejectionReason = reason;
    booking.rejectionNote = note;
    booking.rejectedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    this.addAuditLog(
      staffName,
      'Quality Check Rejected',
      `${booking.farmerName} (#${booking.tokenNumber})`,
      `Reason: ${reason}. Note: ${note || 'None'}`
    );

    this.sendSMS(
      booking.mobile,
      `AgriMinds Notice: Crop for Token #${booking.tokenNumber} could not be accepted due to: ${reason}. You can request re-check or file feedback via app.`,
      'rejection'
    );

    this.saveState();
    return true;
  }

  // 6. Farmer Requests Re-check / Files Complaint
  submitFarmerRequest(type, tokenNumber, farmerName, mobile, crop, message) {
    const inboxItem = {
      id: 'inbox-' + Date.now(),
      type, // 'recheck' or 'complaint'
      tokenNumber,
      farmerName,
      mobile,
      crop,
      reason: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      status: 'pending'
    };
    this.state.centerInbox.unshift(inboxItem);
    this.saveState();
    return inboxItem;
  }

  // 7. Verify / Flag Farmer Documents & Masking
  verifyFarmer(tokenNumber, staffName = 'Center Staff') {
    const booking = this.state.bookings.find(b => b.tokenNumber === Number(tokenNumber));
    if (!booking) return false;
    booking.verified = true;

    this.addAuditLog(
      staffName,
      'Farmer ID Verified',
      `${booking.farmerName} (#${booking.tokenNumber})`,
      'Kisan Card & Land size verified against procurement limits.'
    );

    this.saveState();
    return true;
  }

  flagFarmer(tokenNumber, reason, staffName = 'Center Staff') {
    const booking = this.state.bookings.find(b => b.tokenNumber === Number(tokenNumber));
    if (!booking) return false;
    booking.flagged = true;
    booking.flagReason = reason;

    this.addAuditLog(
      staffName,
      'Farmer Flagged for Inspection',
      `${booking.farmerName} (#${booking.tokenNumber})`,
      `Reason: ${reason}`
    );

    this.saveState();
    return true;
  }

  logCardReveal(tokenNumber, farmerName, staffName = 'Center Staff') {
    this.addAuditLog(
      staffName,
      'Card Number Revealed',
      `${farmerName} (#${tokenNumber})`,
      'Temporary 5-second unmasking for ID matching.'
    );
    this.saveState();
  }

  // 8. No-Show Handling & Automatic Waitlist Promotion
  markNoShow(tokenNumber, staffName = 'Center Staff') {
    const booking = this.state.bookings.find(b => b.tokenNumber === Number(tokenNumber));
    if (!booking) return false;

    booking.status = 'no-show';
    booking.noShowCount = (booking.noShowCount || 0) + 1;

    this.addAuditLog(
      staffName,
      'Marked No-Show',
      `${booking.farmerName} (#${booking.tokenNumber})`,
      `Grace period (+30 mins) expired without arrival.`
    );

    this.sendSMS(
      booking.mobile,
      `AgriMinds: Token #${booking.tokenNumber} slot cancelled due to no-show (+30m grace). Please re-book or visit walk-in counter.`,
      'no_show'
    );

    // Auto promote first farmer from waitlist for this center & slot
    const waitlisted = this.state.waitlist.find(w => 
      w.centerId === booking.centerId && w.status === 'waiting'
    );

    if (waitlisted) {
      this.promoteWaitlistFarmer(waitlisted.id, booking.slotTime, staffName);
    }

    this.saveState();
    return true;
  }

  // 9. Waitlist Management
  joinWaitlist(entry) {
    const id = 'wl-' + Date.now();
    const existing = this.state.waitlist.filter(w => w.centerId === entry.centerId && w.status === 'waiting');
    const position = existing.length + 1;

    const newWaitlist = {
      id,
      centerId: entry.centerId,
      date: entry.date || 'Today, 24 Sep',
      slotId: entry.slotId || 's2',
      slotTime: entry.slotTime || '09:30 AM - 11:00 AM',
      farmerName: entry.farmerName || 'Farmer',
      mobile: entry.mobile || '9812345678',
      kisanCardMasked: entry.kisanCardMasked || '••••-••••-8921',
      cropId: entry.cropId || 'wheat',
      cropName: entry.cropName || 'Wheat',
      quantity: entry.quantity || 40,
      landSize: entry.landSize || 2.0,
      position,
      status: 'waiting',
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      promotionExpiresAt: null
    };

    this.state.waitlist.push(newWaitlist);

    this.sendSMS(
      newWaitlist.mobile,
      `AgriMinds: You have joined the waitlist at ${entry.centerName || 'Center'}. Your position is #${position}. We will alert you immediately if a slot opens up!`,
      'waitlist_join'
    );

    this.saveState();
    return newWaitlist;
  }

  promoteWaitlistFarmer(waitlistId, availableSlotTime, staffName = 'Center Staff') {
    const entry = this.state.waitlist.find(w => w.id === waitlistId);
    if (!entry) return false;

    entry.status = 'promoted';
    entry.promotedSlotTime = availableSlotTime || entry.slotTime;
    // 15 minutes confirmation window
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
    entry.promotionExpiresAt = expiryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    this.addAuditLog(
      staffName,
      'Waitlist Promotion Sent',
      entry.farmerName,
      `Offered freed slot (${entry.promotedSlotTime}). 15-minute confirmation timer started.`
    );

    this.sendSMS(
      entry.mobile,
      `AgriMinds URGENT: A slot is now available at ${entry.promotedSlotTime}! Confirm within 15 minutes in the app to secure your token.`,
      'waitlist_promotion'
    );

    this.saveState();
    return true;
  }

  confirmWaitlistPromotion(waitlistId) {
    const entry = this.state.waitlist.find(w => w.id === waitlistId);
    if (!entry) return null;

    entry.status = 'confirmed';

    // Generate active booking token
    const tokenNumber = Math.floor(150 + Math.random() * 20);
    const backupCode = 'AGRI-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const newBooking = {
      tokenNumber,
      backupCode,
      centerId: entry.centerId,
      centerName: 'Nilokheri Main Mandi',
      date: entry.date,
      slotTime: entry.promotedSlotTime || entry.slotTime,
      slotId: entry.slotId,
      farmerName: entry.farmerName,
      mobile: entry.mobile,
      kisanCardMasked: entry.kisanCardMasked,
      cropId: entry.cropId,
      cropName: entry.cropName,
      quantity: entry.quantity,
      landSize: entry.landSize,
      status: 'booked',
      currentStageId: 1,
      verified: false,
      noShowCount: 0
    };

    this.state.bookings.push(newBooking);

    this.addAuditLog(
      'System (Auto-Sync)',
      'Waitlist Confirmed to Token',
      `${entry.farmerName} (#${tokenNumber})`,
      `Promoted from waitlist position to confirmed token #${tokenNumber}.`
    );

    this.sendSMS(
      entry.mobile,
      `AgriMinds: Token #${tokenNumber} confirmed for ${newBooking.slotTime}. Show your QR pass at gate.`,
      'booking'
    );

    this.saveState();
    return newBooking;
  }

  // 10. Weather Alerts & Rescheduling
  setWeatherForecast(forecastList) {
    this.state.weatherForecast = forecastList;
    this.saveState();
  }

  notifyAffectedWeatherFarmers(centerId, date, staffName = 'Center Staff') {
    const affected = this.state.bookings.filter(b => 
      b.centerId === centerId && (b.status === 'booked' || b.status === 'waiting')
    );

    affected.forEach(b => {
      this.sendSMS(
        b.mobile,
        `AgriMinds Weather Alert: Rain is forecast for your booked day. Please open AgriMinds to reschedule to a safer day with priority booking.`,
        'weather'
      );
    });

    this.addAuditLog(
      staffName,
      'Weather SMS Broadcast',
      `${affected.length} Farmers`,
      `Sent rain weather rescheduling advisory to all scheduled bookings.`
    );

    this.saveState();
    return affected.length;
  }

  rescheduleBooking(tokenNumber, newDate, newSlotTime, reason = 'weather') {
    const booking = this.state.bookings.find(b => b.tokenNumber === Number(tokenNumber));
    if (!booking) return false;

    const oldDate = booking.date;
    const oldSlot = booking.slotTime;

    booking.date = newDate;
    booking.slotTime = newSlotTime;
    booking.status = 'booked';
    booking.rescheduledReason = reason;

    this.addAuditLog(
      'Farmer (Self-Service)',
      'Booking Rescheduled',
      `${booking.farmerName} (#${booking.tokenNumber})`,
      `Rescheduled from ${oldDate} ${oldSlot} to ${newDate} ${newSlotTime}. (Reason: ${reason})`
    );

    this.sendSMS(
      booking.mobile,
      `AgriMinds: Your slot has been rescheduled to ${newDate}, ${newSlotTime}. Token #${booking.tokenNumber} remains valid.`,
      'reschedule'
    );

    // If there was a waitlist on the old slot, promote
    const waitlisted = this.state.waitlist.find(w => w.centerId === booking.centerId && w.status === 'waiting');
    if (waitlisted) {
      this.promoteWaitlistFarmer(waitlisted.id, oldSlot, 'System (Auto-Sync)');
    }

    this.saveState();
    return true;
  }

  cancelBooking(tokenNumber, reason = 'farmer_request') {
    const booking = this.state.bookings.find(b => b.tokenNumber === Number(tokenNumber));
    if (!booking) return false;

    booking.status = 'cancelled';
    booking.cancelReason = reason;

    this.addAuditLog(
      'Farmer (Self-Service)',
      'Booking Cancelled',
      `${booking.farmerName} (#${booking.tokenNumber})`,
      `Cancelled without penalty. Freed slot offered to waitlist.`
    );

    this.sendSMS(
      booking.mobile,
      `AgriMinds: Your booking #${booking.tokenNumber} has been cancelled as requested. You may book anytime again.`,
      'cancel'
    );

    // Promote waitlist
    const waitlisted = this.state.waitlist.find(w => w.centerId === booking.centerId && w.status === 'waiting');
    if (waitlisted) {
      this.promoteWaitlistFarmer(waitlisted.id, booking.slotTime, 'System (Auto-Sync)');
    }

    this.saveState();
    return true;
  }

  // 11. Walk-in / Assisted Booking by Staff
  createWalkInBooking(data, staffName = 'Center Staff') {
    const tokenNumber = Math.floor(160 + Math.random() * 20);
    const backupCode = 'WALK-' + Math.random().toString(36).substring(2, 7).toUpperCase();

    const walkInBooking = {
      tokenNumber,
      backupCode,
      centerId: data.centerId || 'center-1',
      centerName: data.centerName || 'Nilokheri Main Mandi',
      date: data.date || 'Today, 24 Sep',
      slotTime: data.slotTime || '04:30 PM - 06:00 PM (Walk-in)',
      slotId: 's6',
      farmerName: data.farmerName,
      mobile: data.mobile,
      kisanCardMasked: data.kisanCardMasked || '••••-••••-' + (data.cardNumber ? data.cardNumber.slice(-4) : '9981'),
      cropId: data.cropId || 'wheat',
      cropName: data.cropName || 'Wheat',
      quantity: Number(data.quantity) || 30,
      landSize: Number(data.landSize) || 2.0,
      status: 'checked-in', // Walk-ins at center are immediately checked-in
      currentStageId: 2,
      checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      isWalkIn: true,
      verified: true
    };

    this.state.bookings.push(walkInBooking);

    this.addAuditLog(
      staffName,
      'Walk-In Assisted Booking Created',
      `${walkInBooking.farmerName} (#${tokenNumber})`,
      `Printed slip issued from reserved walk-in quota. Stage 2 (Center Entry).`
    );

    this.sendSMS(
      walkInBooking.mobile,
      `AgriMinds Walk-in Pass: Token #${tokenNumber} issued at ${walkInBooking.centerName}. Stage: Center Entry. Backup code: ${backupCode}`,
      'walkin'
    );

    this.saveState();
    return walkInBooking;
  }

  // 12. Delete Farmer Data & Real-time Anonymization
  deleteFarmerData(farmerMobile, farmerCardMasked) {
    const cardLast4 = farmerCardMasked ? farmerCardMasked.slice(-4) : null;

    // 1. Remove all active / waiting / booked records for this farmer from bookings
    this.state.bookings = this.state.bookings.filter(b => {
      if (farmerMobile && b.mobile === farmerMobile) return false;
      if (cardLast4 && b.kisanCardMasked && b.kisanCardMasked.endsWith(cardLast4)) return false;
      return true;
    });

    // 2. Remove all waitlist entries for this farmer
    this.state.waitlist = this.state.waitlist.filter(w => {
      if (farmerMobile && w.mobile === farmerMobile) return false;
      return true;
    });

    // 3. Clear farmer SMS messages
    if (farmerMobile) {
      this.state.smsMessages = (this.state.smsMessages || []).filter(m => m.mobile !== farmerMobile);
    }

    // 4. Sanitize audit logs (statutory requirement: replace name with 'Deleted farmer', keep only masked card number)
    if (this.state.auditLog && Array.isArray(this.state.auditLog)) {
      this.state.auditLog = this.state.auditLog.map(log => {
        let updatedTarget = log.target;
        let updatedDetails = log.details;

        if (farmerMobile && updatedDetails && updatedDetails.includes(farmerMobile)) {
          updatedDetails = updatedDetails.replaceAll(farmerMobile, '[Deleted]');
        }
        if (updatedTarget) {
          // Anonymize target if it matches farmer name
          updatedTarget = updatedTarget.replace(/^[A-Za-z\s]+(\s*\(#\d+\))/, 'Deleted farmer$1');
        }

        return {
          ...log,
          target: updatedTarget,
          details: updatedDetails
        };
      });
    }

    // Broadcast change to all open browser tabs and center portals
    this.saveState();
    return true;
  }

  // 13. Demo Controls Trigger Helpers
  fillSlot(centerId, slotId = 's2') {
    this.state.bookings.forEach(b => {
      if (b.centerId === centerId && b.slotId === slotId) {
        b.status = 'booked';
      }
    });
    this.saveState();
  }

  triggerRainAlert(dayIndex = 0) {
    const updated = [...this.state.weatherForecast];
    updated[dayIndex] = { ...updated[dayIndex], type: 'heavy_rain', temp: '25°C', rainfallChance: '90%' };
    this.setWeatherForecast(updated);
  }

  resetAllData() {
    this.state = createInitialState();
    this.saveState();
  }
}

export const sharedStore = new SharedStore();
