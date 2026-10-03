const KEYS = {
  LANG: 'agriminds_lang',
  STATE: 'agriminds_selected_state',
  CONSENT: 'agriminds_dpdp_consent',
  USER: 'agriminds_user_profile',
  ACTIVE_TOKEN: 'agriminds_active_token',
  SIMULATION_STATE: 'agriminds_sim_state',
  NOTIFICATIONS: 'agriminds_notifications',
  FARMER_SESSION: 'agriminds_farmer_session_active',
  DELETED_FLAG: 'agriminds_data_deleted_notice'
};

export const CURRENT_NOTICE_VERSION = '1.0';

export const storage = {
  // Language
  getLang: () => localStorage.getItem(KEYS.LANG),
  setLang: (code) => localStorage.setItem(KEYS.LANG, code),

  // State Selection
  getState: () => localStorage.getItem(KEYS.STATE),
  saveState: (stateName) => localStorage.setItem(KEYS.STATE, stateName),
  clearState: () => localStorage.removeItem(KEYS.STATE),

  // Session State for Farmer (Blocks back navigation after logout)
  isFarmerSessionActive: () => {
    return localStorage.getItem(KEYS.FARMER_SESSION) === 'true';
  },
  setFarmerSessionActive: (isActive) => {
    if (isActive) {
      localStorage.setItem(KEYS.FARMER_SESSION, 'true');
    } else {
      localStorage.removeItem(KEYS.FARMER_SESSION);
    }
  },

  // Deletion Notice Flag
  getDeletedNotice: () => {
    const val = localStorage.getItem(KEYS.DELETED_FLAG);
    if (val) {
      localStorage.removeItem(KEYS.DELETED_FLAG);
      return true;
    }
    return false;
  },
  setDeletedNotice: () => {
    localStorage.setItem(KEYS.DELETED_FLAG, 'true');
  },

  // DPDP Consent
  getConsent: () => {
    try {
      const data = localStorage.getItem(KEYS.CONSENT);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveConsent: (language) => {
    const record = {
      hasConsented: true,
      timestamp: new Date().toISOString(),
      formattedDate: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      version: CURRENT_NOTICE_VERSION,
      language: language || 'hi',
      dpdpCompliantPrinciples: ['Purpose Limitation', 'Data Minimisation', 'Storage Limitation', 'User Rights']
    };
    localStorage.setItem(KEYS.CONSENT, JSON.stringify(record));
    return record;
  },
  withdrawConsent: () => {
    localStorage.removeItem(KEYS.CONSENT);
  },

  // User Profile
  getUser: () => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveUser: (user) => {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  // Active Token / Booking
  getActiveToken: () => {
    try {
      const data = localStorage.getItem(KEYS.ACTIVE_TOKEN);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveActiveToken: (tokenData) => {
    localStorage.setItem(KEYS.ACTIVE_TOKEN, JSON.stringify(tokenData));
  },
  clearActiveToken: () => {
    localStorage.removeItem(KEYS.ACTIVE_TOKEN);
  },

  // Simulation State
  getSimState: () => {
    try {
      const data = localStorage.getItem(KEYS.SIMULATION_STATE);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  saveSimState: (state) => {
    localStorage.setItem(KEYS.SIMULATION_STATE, JSON.stringify(state));
  },

  // Notifications
  getNotifications: () => {
    try {
      const data = localStorage.getItem(KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  addNotification: (notification) => {
    const list = storage.getNotifications();
    const item = {
      id: 'notif-' + Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      ...notification
    };
    list.unshift(item);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(list.slice(0, 20)));
    return item;
  },

  // Complete Farmer Data Deletion
  deleteAllData: () => {
    localStorage.removeItem(KEYS.LANG);
    localStorage.removeItem(KEYS.STATE);
    localStorage.removeItem(KEYS.CONSENT);
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.ACTIVE_TOKEN);
    localStorage.removeItem(KEYS.SIMULATION_STATE);
    localStorage.removeItem(KEYS.NOTIFICATIONS);
    localStorage.removeItem(KEYS.FARMER_SESSION);
    localStorage.removeItem('agriminds_farmer_offline_cache');
    storage.setDeletedNotice();
  }
};

