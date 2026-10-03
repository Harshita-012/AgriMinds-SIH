import { storage } from './storage';
import { CROPS, STAGES } from '../data/mockData';

class SimulationEngine {
  constructor() {
    this.interval = null;
    this.speedMultiplier = 1;
    this.subscribers = new Set();
    this.smsSubscribers = new Set();
    this.loadState();
  }

  loadState() {
    const saved = storage.getSimState();
    if (saved) {
      this.state = saved;
    } else {
      this.state = {
        currentCenterId: 'center-1',
        currentServingToken: 142,
        farmerToken: 147,
        speedSeconds: 15, // standard clock step every 15s
        isAutoPlaying: true,
        currentStageId: 1,
        stageTimestamps: {
          1: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        recentAvgMinutesPerFarmer: 8.5
      };
      this.saveState();
    }
  }

  saveState() {
    storage.saveSimState(this.state);
    this.notify();
  }

  start() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      if (this.state.isAutoPlaying) {
        this.stepQueue();
      }
    }, (this.state.speedSeconds * 1000) / this.speedMultiplier);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
    this.start();
  }

  toggleAutoPlay() {
    this.state.isAutoPlaying = !this.state.isAutoPlaying;
    this.saveState();
  }

  stepQueue() {
    const activeToken = storage.getActiveToken();
    const myTokenNum = activeToken ? activeToken.tokenNumber : this.state.farmerToken;
    const isHindi = (storage.getLang() || 'hi').startsWith('hi');

    if (this.state.currentServingToken < myTokenNum + 2) {
      this.state.currentServingToken += 1;
      
      // Stage auto advancement logic based on token position
      if (this.state.currentServingToken === myTokenNum - 2 && this.state.currentStageId < 2) {
        this.advanceStage(2, isHindi ? 'गेट #1 पर प्रवेश सत्यापित' : 'Center Entry verified at Gate #1');
        this.triggerSMS(
          isHindi
            ? 'AgriMinds: आपकी बारी 30 मिनट में आने वाली है। कृपया मंडी गेट पर पहुंचें।'
            : 'AgriMinds: Your turn is approaching in ~30 mins. Please proceed to the mandi gate.'
        );
      } else if (this.state.currentServingToken === myTokenNum && this.state.currentStageId < 3) {
        this.advanceStage(3, isHindi ? 'गुणवत्ता जांच चालू' : 'Quality Inspection started');
        this.triggerSMS(
          isHindi
            ? 'AgriMinds: आपकी बारी आ चुकी है! कृपया गेट पर अपना क्यूआर कोड स्कैन कराएं।'
            : 'AgriMinds: Your turn is up! Please scan your QR code at Gate #1.'
        );
      } else if (this.state.currentServingToken > myTokenNum && this.state.currentStageId === 3) {
        this.advanceStage(4, isHindi ? 'धर्मकांटा तौल चालू' : 'Gross Weighing in progress');
      }

      this.saveState();
    }
  }

  jumpQueue(targetToken) {
    this.state.currentServingToken = targetToken;
    this.saveState();
  }

  advanceStage(stageId, note = '') {
    if (stageId > 7) return;
    this.state.currentStageId = stageId;
    this.state.stageTimestamps[stageId] = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.saveState();

    const stageObj = STAGES.find(s => s.id === stageId);
    const isHindi = (storage.getLang() || 'hi').startsWith('hi');
    if (stageObj) {
      storage.addNotification({
        title: isHindi ? `चरण अपडेट: ${stageObj.nameHi}` : `Stage Update: ${stageObj.nameEn}`,
        body: note || (isHindi ? `स्टेज ${stageId} संपन्न हुआ।` : `Stage ${stageId} completed.`),
        type: 'stage',
        stageId
      });
    }
  }

  resetDemo() {
    const activeToken = storage.getActiveToken();
    const myToken = activeToken ? activeToken.tokenNumber : 147;
    this.state = {
      currentCenterId: activeToken ? activeToken.centerId : 'center-1',
      currentServingToken: myToken - 4,
      farmerToken: myToken,
      speedSeconds: 12,
      isAutoPlaying: true,
      currentStageId: 1,
      stageTimestamps: {
        1: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      recentAvgMinutesPerFarmer: 8.5
    };
    this.saveState();
  }

  triggerSMS(message) {
    const isHindi = (storage.getLang() || 'hi').startsWith('hi');
    const alertData = {
      id: 'sms-' + Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    storage.addNotification({
      title: isHindi ? 'नया एसएमएस अलर्ट' : 'New SMS Alert',
      body: message,
      type: 'sms'
    });
    this.smsSubscribers.forEach(cb => cb(alertData));
  }

  calculateWaitTime(farmerToken, cropId = 'wheat', quantity = 50) {
    const ahead = Math.max(0, farmerToken - this.state.currentServingToken);
    if (ahead === 0) return 0;

    const cropObj = CROPS.find(c => c.id === cropId) || CROPS[0];
    const cropWeightFactor = cropObj.baseMinutes + (quantity * cropObj.extraMinPerQuintal);
    const blendRate = (cropWeightFactor * 0.6) + (this.state.recentAvgMinutesPerFarmer * 0.4);
    
    return Math.round(ahead * blendRate);
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  subscribeSMS(callback) {
    this.smsSubscribers.add(callback);
    return () => this.smsSubscribers.delete(callback);
  }

  notify() {
    this.subscribers.forEach(cb => cb(this.state));
  }
}

export const simulation = new SimulationEngine();
