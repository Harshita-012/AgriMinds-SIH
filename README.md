# AgriMinds - Smart Mandi Procurement & Live Queue PWA
**Smart India Hackathon Prototype (Phase 1, Phase 2 & Phase 3)**

AgriMinds is a mobile-first Progressive Web App (PWA) and multi-portal procurement system designed to eliminate congestion, chaotic queues, and opacity at agricultural grain procurement centers (Mandis) across India.

---

## 🚀 How to Run the Project

```bash
# 1. Install dependencies
npm install

# 2. Run the local development server
npm run dev

# 3. Build for production
npm run build
```

Open `http://localhost:5173` in multiple browser tabs side-by-side to experience the **real-time cross-tab synchronization** across the **Farmer App**, **Center Staff Portal**, and **Government Dashboard**.

---

## 🔐 Role Credentials & Access Routes

| Role | Access URL | Credentials | Description |
|---|---|---|---|
| **Farmer** | `http://localhost:5173` | Any Mobile (e.g. `9812345678`), OTP `1234` | Slot booking, live queue, stage tracking, payments, AI assistant, offline pass. |
| **Center Staff** | `http://localhost:5173/#admin` | ID: `EMP-101` / PIN: `1234` | Gate QR scan, verification, stage advancement, walk-ins, and appeals. |
| **Govt Official** | `http://localhost:5173/#govt` | ID: `GOV-101` / PIN: `1234` | District heatmaps, arrival forecasts, stage bottlenecks, anomaly alerts, payments. |

*Additional Accounts:*
- Center Staff (Taraori APMC): `EMP-102` / `1234`
- Center Staff (HAFED Indri Hub): `EMP-103` / `1234`
- Govt Official (State Director): `GOV-102` / `1234`

---

## ⚙️ Simulated Mock Architecture & Production Integration

To ensure full testability without external API dependencies:
1. **Mocked AI Assistant**: Powered by a grounded intent & knowledge engine in `src/phase3/services/aiAssistant.js`. In production, plug in **Google Gemini 1.5 Pro / OpenAI API** using the identical interface `getAssistantReply(context, message, language)`.
2. **Mocked Voice Recognition & TTS**: Powered natively by the browser **Web Speech API** (`SpeechRecognition` & `speechSynthesis`) in both Hindi and English.
3. **Mocked Offline Cache & Sync**: Dual-layer offline cache (`localStorage` + `BroadcastChannel`) that buffers farmer tokens, QR codes, and center staff actions (`check-in`, `advance-stage`, `walk-in`), syncing upon reconnect.
4. **Mocked OCR & Kisan Card Privacy**: Instant auto-fill with **strict 4-digit masking** (`••••-••••-XXXX`) enforced across government dashboards, export reports, AI transcripts, and offline storage.
5. **Mocked SMS Center**: Real-time simulated SMS notifications with an in-app drawer to prove offline and non-smartphone reachability. Can be wired to **Twilio / MSG91**.
6. **Mocked Weather Engine**: Dynamic 4-day forecast with precipitation triggers, readily connectable to **IMD (India Meteorological Department)** or **OpenWeatherMap APIs**.
7. **Mocked DBT Payments**: Simulated PFMS Direct Benefit Transfer pipeline calculating MSP rates (`Quantity × Official MSP`) with 48h SLA tracking.

---

## ⏱️ 5-Minute Evaluator Demo Script

### Step 1: Portal Choice & Language First Launch
1. Open `http://localhost:5173`. Notice the first screen shows **only language selection** with Hindi pre-selected and Hindi voice guidance.
2. Tap **Continue** -> The new **Portal Choice** screen appears with two visual tiles: **Farmer Portal** and **Admin Portal**.
3. Choose **Farmer Portal** -> Complete State Selection (`Haryana`) -> Privacy Consent -> Register Profile with Crop Selection (`Wheat`).

### Step 2: Farmer Books a Delivery Slot
1. On the Farmer Home screen, tap **Book Delivery Slot**.
2. Pick a mandi (e.g. `Nilokheri Main Grain Mandi`) and a time slot (`11:00 AM - 12:30 PM`), enter `40` Quintals, and confirm.
3. Instant digital Gate Pass appears with Token `#147`, QR Code, and Backup SMS Code `AGRI-7K92M`.

### Step 3: Mandi Staff QR Scan & Privacy Masking
1. Open a new browser tab: `http://localhost:5173/#admin` (or choose Admin Portal -> Center Staff). Sign in with `EMP-101` / `1234`.
2. Go to **QR Gate Scan**, enter `147` or `AGRI-7K92M`, and tap **Validate**. Notice immediate gate verification to Stage 2 (`Center Entry`).
3. Go to **Farmer Verification**. Notice the Kisan card number is masked (`••••-••••-8921`). Tap **Reveal** to view for 5 seconds — this automatically writes an entry into the immutable **Audit Log**.
4. Go to **Stage Progression** and advance through `Quality Check (3)` -> `Weighbridge (4)` -> `J-Form (5)`. The Farmer tab updates instantly in real-time via `BroadcastChannel`!

### Step 4: No-Show Auto-Promotion & Rain Rescheduling
1. In **Queue Management**, find an unarrived token and tap **No-Show** (or use Demo Tools -> `No-Show`).
2. The slot is cancelled, and the top waitlisted farmer is automatically promoted with a 15-minute confirmation countdown!
3. In Demo Tools, tap **Trigger Rain** -> Farmer tab displays a **Weather Alert Banner** and offers 1-tap priority rescheduling.

### Step 5: AI Assistant & Mandi Staff Handover
1. On the Farmer App, tap the floating **AI Assistant** button (bottom right) or the voice mic.
2. Ask: *"What is my token and queue status?"* or *"When will I get paid?"* -> The assistant replies in the selected language with grounded data.
3. Tap or say *"Talk to Mandi Staff"* -> Assistant creates a support ticket in the Center Staff **Appeals & Inbox**.
4. When Center Staff taps **Mark Resolved**, the resolution appears live in the farmer's chat window!

### Step 6: Offline Mode & Reconnection Sync
1. Open **Demo Tools** and toggle **Simulate Offline Mode** (or disconnect Wi-Fi).
2. The Farmer App displays the **Offline Banner** with last updated timestamp; Token pass, QR code, and stage tracker continue to function seamlessly.
3. On the Center Portal, perform a QR check-in or walk-in booking while offline -> Notice the **Pending Sync** badge.
4. Toggle Offline OFF -> An instant green **Synced** confirmation appears and all actions are reconciled.

### Step 7: Government Official Dashboard Analytics
1. In a new tab, open `http://localhost:5173/#govt` (or choose Admin Portal -> Government Official). Sign in with `GOV-101` / `1234`.
2. **Overview KPI**: Live total grain procured (Qtl), farmers served, average wait time, and no-show rate across all 8 centers.
3. **Mandi Centers Table**: Sortable, filterable table by district and crop with utilization gauges.
4. **District Heatmap**: Interactive stylized map of Karnal, Kurukshetra, and Kaithal with live color-coded crowd levels (Green, Yellow, Red).
5. **7-Day Arrival Forecast**: Projected harvest arrivals flagging centers needing extra gunny bags (+25,000 bags) and weighbridge staff.
6. **Bottleneck Analysis**: Identifies Quality Check (14.5 mins) as the slowest stage with root-cause insights.
7. **Anomaly Alerts**: 5 rule-based alerts (stuck tractor, land-yield ceiling excess, multi-center double bookings) with interactive **Mark Reviewed** buttons.
8. **DBT Payment Tracking & Reports**: Total ₹4.82 Cr disbursed, delayed exception queue with resolution notices, and 1-click **CSV Download** or **Print Official Report**.
