import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { storage } from './services/storage';
import { getLanguageConfig } from './i18n/languages';
import { sharedStore } from './phase2/store';
import { ROLES } from './phase2/roles';
import { offlineSync } from './phase3/services/offlineSync';

// Phase 1 Farmer Screens
import LanguageSelectionScreen from './screens/0_LanguageSelection';
import PortalChoiceScreen from './screens/0a_PortalChoice';
import StateSelectionScreen from './screens/0b_StateSelection';
import PrivacyConsentScreen from './screens/1_PrivacyConsent';
import RegistrationScreen from './screens/2_Registration';
import HomeScreen from './screens/3_Home';
import CentersListScreen from './screens/4_CentersList';
import SlotBookingScreen from './screens/5_SlotBooking';
import TokenQRScreen from './screens/6_TokenQR';
import LiveQueueScreen from './screens/7_LiveQueue';
import StageTrackerScreen from './screens/8_StageTracker';
import SettingsPrivacyScreen from './screens/9_SettingsPrivacy';

// Phase 2 Admin Screens & Components
import AdminRoleSelectionScreen from './phase2/screens/AdminRoleSelection';
import AdminLoginScreen from './phase2/screens/AdminLogin';
import CenterPortalScreen from './phase2/screens/CenterPortal';
import WaitlistBanner from './phase2/components/WaitlistBanner';

// Phase 3 Screens
import GovtLoginScreen from './phase3/screens/GovtLogin';
import GovernmentDashboardScreen from './phase3/screens/GovernmentDashboard';
import PaymentStatusScreen from './phase3/screens/PaymentStatusScreen';
import HelpScreen from './phase3/screens/HelpScreen';

// Global Components
import DemoControls from './components/common/DemoControls';
import SMSNotificationToast from './components/common/SMSNotificationToast';

export default function App() {
  const { i18n } = useTranslation();
  
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [previousScreen, setPreviousScreen] = useState('home');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [activeTokenData, setActiveTokenData] = useState(null);
  const [storeState, setStoreState] = useState(sharedStore.getState());

  // Listen to shared store real-time changes
  useEffect(() => {
    const unsub = sharedStore.subscribe((newState) => {
      setStoreState({ ...newState });
      const activeTok = storage.getActiveToken();
      if (activeTok) {
        const live = newState.bookings.find(b => b.tokenNumber === activeTok.tokenNumber);
        if (live) {
          setActiveTokenData({ ...activeTok, ...live });
        }
      }
    });
    return () => unsub();
  }, []);

  // Initialize Routing on mount based on stored milestones or URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const adminSession = sharedStore.getAdminSession();

    // Direct /settings route
    if (hash === '#settings' || hash === '#/settings') {
      if (adminSession?.role === 'center_staff' || adminSession?.role === 'govt_official' || (storage.getUser() && storage.isFarmerSessionActive())) {
        setCurrentScreen('settings');
        return;
      }
    }

    // Direct /admin or #admin route opens admin flow
    if (hash === '#admin' || hash === '#/admin') {
      if (adminSession?.role === 'center_staff') {
        setCurrentScreen('admin_portal');
      } else {
        setCurrentScreen('admin_roles');
      }
      return;
    }

    // Direct /govt or #govt route opens government official flow
    if (hash === '#govt' || hash === '#/govt') {
      if (adminSession?.role === 'govt_official') {
        setCurrentScreen('govt_portal');
      } else {
        setCurrentScreen('govt_login');
      }
      return;
    }

    const savedLang = storage.getLang();
    const user = storage.getUser();
    const token = storage.getActiveToken();

    // Set document direction & language
    const currentLang = savedLang || 'hi';
    const langObj = getLanguageConfig(currentLang);
    document.documentElement.dir = langObj.dir || 'ltr';
    document.documentElement.lang = currentLang;

    // Startup routing:
    // 1. If language not selected yet, first screen is ONLY language selection
    // 2. Repeat launches: returning farmer with active session goes straight to Home
    // 3. Returning admin with session goes straight to their portal (Center or Govt)
    // 4. Otherwise opens on the Portal Choice page (language remembered)
    if (!savedLang) {
      setCurrentScreen('language');
    } else if (user && storage.isFarmerSessionActive()) {
      setActiveTokenData(token);
      // Cache farmer offline state
      offlineSync.saveFarmerCache({ user, activeToken: token });
      setCurrentScreen('home');
    } else if (adminSession) {
      if (adminSession.role === 'govt_official') {
        setCurrentScreen('govt_portal');
      } else {
        setCurrentScreen('admin_portal');
      }
    } else {
      setCurrentScreen('portal_choice');
    }
  }, []);

  const navigateTo = (screen, extraData = null) => {
    // Record previous screen before transition
    if (currentScreen !== 'settings' && currentScreen !== 'loading') {
      setPreviousScreen(currentScreen);
    }

    // Center Staff Admin routes and guards
    if (screen === 'admin_roles' || screen === 'admin_login' || screen === 'admin_portal') {
      if (screen === 'admin_portal') {
        const session = sharedStore.getAdminSession();
        if (!session || session.role !== 'center_staff') {
          setCurrentScreen('admin_login');
          return;
        }
      }
      setCurrentScreen(screen);
      window.location.hash = screen === 'admin_portal' ? '#admin' : screen;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Government Official routes and guards
    if (screen === 'govt_login' || screen === 'govt_portal') {
      if (screen === 'govt_portal') {
        const session = sharedStore.getAdminSession();
        if (!session || session.role !== 'govt_official') {
          setCurrentScreen('govt_login');
          return;
        }
      }
      setCurrentScreen(screen);
      window.location.hash = screen === 'govt_portal' ? '#govt' : screen;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Portal choice & Language are public
    if (screen === 'language' || screen === 'portal_choice') {
      setCurrentScreen(screen);
      window.location.hash = screen;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Settings screen guard
    if (screen === 'settings') {
      const adminSession = sharedStore.getAdminSession();
      const user = storage.getUser();
      if (!adminSession && !user) {
        setCurrentScreen('portal_choice');
        return;
      }
      setCurrentScreen('settings');
      window.location.hash = '#settings';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Farmer protected routes guard (requires active session)
    const savedLang = storage.getLang();
    const savedState = storage.getState();
    const consent = storage.getConsent();
    const user = storage.getUser();

    if (!savedLang) {
      setCurrentScreen('language');
      return;
    }
    if (screen !== 'state' && !savedState) {
      setCurrentScreen('state');
      return;
    }
    if (screen !== 'state' && screen !== 'privacy' && (!consent || !consent.hasConsented)) {
      setCurrentScreen('privacy');
      return;
    }
    if (screen !== 'state' && screen !== 'privacy' && screen !== 'registration' && !user) {
      setCurrentScreen('registration');
      return;
    }
    if (screen === 'home' || screen === 'centers' || screen === 'booking' || screen === 'token' || screen === 'queue' || screen === 'tracker') {
      if (!storage.isFarmerSessionActive()) {
        setCurrentScreen('portal_choice');
        return;
      }
    }

    if (extraData) {
      if (screen === 'booking') setSelectedCenter(extraData);
      if (screen === 'token') {
        setActiveTokenData(extraData);
        offlineSync.saveFarmerCache({ user, activeToken: extraData });
      }
    }
    setCurrentScreen(screen);
    window.location.hash = screen;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFarmerPortalSelect = () => {
    const savedState = storage.getState();
    const consent = storage.getConsent();
    const user = storage.getUser();

    storage.setFarmerSessionActive(true);

    if (user) {
      navigateTo('home');
    } else if (!savedState) {
      navigateTo('state');
    } else if (!consent || !consent.hasConsented) {
      navigateTo('privacy');
    } else {
      navigateTo('registration');
    }
  };

  const handleAdminChoice = (route) => {
    if (ROLES.length === 1) {
      navigateTo(route || 'admin_login');
    } else {
      navigateTo('admin_roles');
    }
  };

  const handleLogout = () => {
    storage.setFarmerSessionActive(false);
    navigateTo('portal_choice');
  };

  const handleAdminLogout = () => {
    sharedStore.clearAdminSession();
    navigateTo('portal_choice');
  };

  // Farmer waitlist check for active user
  const farmerWaitlist = storeState.waitlist.find(w => w.status === 'promoted' || w.status === 'waiting');

  const handleConfirmWaitlistPromotion = (waitlistId) => {
    const newBooking = sharedStore.confirmWaitlistPromotion(waitlistId);
    if (newBooking) {
      storage.saveActiveToken(newBooking);
      setActiveTokenData(newBooking);
      offlineSync.saveFarmerCache({ user: storage.getUser(), activeToken: newBooking });
      navigateTo('token', newBooking);
    }
  };

  // Determine user role and back target for settings
  const adminSession = sharedStore.getAdminSession();
  const currentRole = adminSession?.role || 'farmer';
  const getSettingsBackTarget = () => {
    if (previousScreen && previousScreen !== 'settings' && previousScreen !== 'loading') {
      return previousScreen;
    }
    if (currentRole === 'center_staff') return 'admin_portal';
    if (currentRole === 'govt_official') return 'govt_portal';
    return 'home';
  };

  if (currentScreen === 'loading') {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-bold text-stone-700 text-sm">Loading AgriMinds...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-200/50 flex flex-col font-sans">
      {/* Real-time SMS Popup */}
      <SMSNotificationToast />

      {/* Screen Router */}
      {currentScreen === 'language' && (
        <LanguageSelectionScreen
          onContinue={() => navigateTo('portal_choice')}
        />
      )}

      {currentScreen === 'portal_choice' && (
        <PortalChoiceScreen
          onSelectFarmer={handleFarmerPortalSelect}
          onSelectAdmin={() => handleAdminChoice()}
          onBack={() => navigateTo('language')}
        />
      )}

      {currentScreen === 'state' && (
        <StateSelectionScreen
          onSelectState={(stateObj) => navigateTo('privacy')}
          onBack={() => navigateTo('portal_choice')}
        />
      )}

      {currentScreen === 'privacy' && (
        <PrivacyConsentScreen
          onAgree={() => navigateTo('registration')}
          onBackToState={() => navigateTo('state')}
        />
      )}

      {currentScreen === 'registration' && (
        <RegistrationScreen
          onComplete={(profile) => {
            storage.setFarmerSessionActive(true);
            navigateTo('home');
          }}
          onBack={() => navigateTo('privacy')}
        />
      )}

      {currentScreen === 'home' && (
        <div className="flex flex-col min-h-screen">
          {/* Waitlist Promotion Banner if active */}
          {farmerWaitlist && farmerWaitlist.status === 'promoted' && (
            <div className="max-w-md mx-auto w-full p-3 pt-4">
              <WaitlistBanner
                waitlistEntry={farmerWaitlist}
                onConfirmPromotion={handleConfirmWaitlistPromotion}
              />
            </div>
          )}
          <HomeScreen onNavigate={(screen) => navigateTo(screen)} />
        </div>
      )}

      {currentScreen === 'centers' && (
        <CentersListScreen
          onSelectCenter={(center) => navigateTo('booking', center)}
          onNavigate={(screen) => navigateTo(screen)}
          onBack={() => navigateTo('home')}
        />
      )}

      {currentScreen === 'booking' && selectedCenter && (
        <SlotBookingScreen
          center={selectedCenter}
          onBookingConfirmed={(tokenData) => {
            offlineSync.saveFarmerCache({ user: storage.getUser(), activeToken: tokenData });
            navigateTo('token', tokenData);
          }}
          onNavigate={(screen) => navigateTo(screen)}
          onBack={() => navigateTo('centers')}
        />
      )}

      {currentScreen === 'token' && (
        <TokenQRScreen
          tokenData={activeTokenData}
          onNavigate={(screen) => navigateTo(screen)}
          onBack={() => navigateTo('home')}
        />
      )}

      {currentScreen === 'queue' && (
        <LiveQueueScreen
          onNavigate={(screen) => navigateTo(screen)}
          onBack={() => navigateTo('home')}
        />
      )}

      {currentScreen === 'tracker' && (
        <StageTrackerScreen
          onNavigate={(screen) => navigateTo(screen)}
          onBack={() => navigateTo('home')}
        />
      )}

      {currentScreen === 'payment_status' && (
        <PaymentStatusScreen
          onNavigate={(screen) => navigateTo(screen)}
          onBack={() => navigateTo('home')}
        />
      )}

      {currentScreen === 'help' && (
        <HelpScreen
          onNavigate={(screen) => navigateTo(screen)}
          onBack={() => navigateTo('home')}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsPrivacyScreen
          userRole={currentRole}
          onNavigate={(screen) => navigateTo(screen)}
          onLogout={currentRole === 'farmer' ? handleLogout : handleAdminLogout}
          onBack={() => navigateTo(getSettingsBackTarget())}
        />
      )}

      {/* PHASE 2 CENTER STAFF SCREENS */}
      {currentScreen === 'admin_roles' && (
        <AdminRoleSelectionScreen
          onSelectRole={(role) => navigateTo(role.route || 'admin_login')}
          onBack={() => navigateTo('portal_choice')}
        />
      )}

      {currentScreen === 'admin_login' && (
        <AdminLoginScreen
          onLoginSuccess={(session) => navigateTo('admin_portal')}
          onBack={() => navigateTo('admin_roles')}
        />
      )}

      {currentScreen === 'admin_portal' && (
        <CenterPortalScreen
          onLogout={handleAdminLogout}
          onNavigate={(screen) => navigateTo(screen)}
        />
      )}

      {/* PHASE 3 GOVERNMENT OFFICIAL SCREENS */}
      {currentScreen === 'govt_login' && (
        <GovtLoginScreen
          onLoginSuccess={(session) => navigateTo('govt_portal')}
          onBack={() => navigateTo('admin_roles')}
        />
      )}

      {currentScreen === 'govt_portal' && (
        <GovernmentDashboardScreen
          onLogout={handleAdminLogout}
          onSwitchPortal={() => navigateTo('portal_choice')}
          onNavigate={(screen) => navigateTo(screen)}
        />
      )}

      {/* Floating Demo Controls for Evaluator */}
      {currentScreen !== 'language' && currentScreen !== 'portal_choice' && currentScreen !== 'state' && currentScreen !== 'privacy' && currentScreen !== 'admin_roles' && currentScreen !== 'admin_login' && currentScreen !== 'govt_login' && (
        <DemoControls />
      )}
    </div>
  );
}

