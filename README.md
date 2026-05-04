# 🚀 Multi-Step Flow App

A clean and modern **React Native onboarding flow** with backend integration, local persistence, and resume capability. 

---

## ✨ Features

* Multi-step onboarding (4–5 steps)
* Conditional step (based on user goal)
* Progress tracking (bar + step count)
* Resume flow (local + backend sync)
* Full validation (no skipping required fields)
* Final summary with edit option
* Offline support (AsyncStorage)
* API error handling with retry

---

## 🧱 Tech Stack

### 📱 Frontend

* Expo (React Native)
* Expo Router
* Zustand (state management)
* AsyncStorage (local storage)
* TypeScript

### ⚙️ Backend

* Node.js + Express
* Prisma ORM
* SQLite
* Zod (validation)
* Helmet + Rate Limiting

---

## 📁 Project Structure

```
root/
├── multi-step-flow/
      ├── BE/      # React Native app
      └── FE/      # Express API
```

---

## 📱 Frontend Setup

```bash
cd BE

npm install

npx expo install expo-router expo-linear-gradient \
@react-native-async-storage/async-storage

npm install zustand

npx expo start
```

📌 Scan QR using Expo Go (same WiFi required)

---

## ⚙️ Backend Setup

```bash
cd FE

npm install


npx prisma generate
npx prisma migrate dev --name init

npm run dev
```

Server runs at:

```
http://localhost:3000
```

---

## 🔗 API Endpoints

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| GET    | `/health`   | Check server  |
| POST   | `/progress` | Save progress |
| GET    | `/progress` | Get progress  |
| DELETE | `/progress` | Reset session |

---

## 🔄 Flow Logic

```
age → goal → (activity if fitness) → preferences → notifications
```

* Fitness goal → 5 steps
* Others → 4 steps

---

## 💾 Persistence

* Local: AsyncStorage (instant + offline)
* Backend: Sync for backup & resume

---

## ⚠️ Edge Handling

* App crash → restores progress
* API failure → retry + local save
* Invalid input → blocked navigation
* Step changes → auto-adjust flow

---

## 🌐 Connect Mobile to Backend

Replace `localhost` with your system IP:

```ts
const BASE_URL = "http://192.168.X.X:3000";
```
OR USE DEPLOYED URL

const BASE_URL = "https://multi-step-flow-app.onrender.com";


---

## 🚀 Deployment

### Backend

* Render
* Run:

```bash
npx prisma migrate deploy
```

### Frontend

```bash
npm install -g eas-cli
eas build --platform android
```

---

## 📌 Key Design Decisions

* Zustand over Redux (simpler, faster)
* AsyncStorage (Expo-friendly)
* SQLite (zero setup for dev)
* Non-blocking API (UX-first)

---

## 🧠 Assumptions

* Session ID generated on device
* Offline-first approach
* Fitness → activity step only
* API failures don’t block user

---

## ⚡ Quick Commands

```bash
# Backend
npm run dev

# Frontend
npx expo start
```

---

## 🏁 Summary

A production-ready onboarding flow with:

* Clean UX
* Reliable state handling
* Offline-first design
* Scalable backend

---

💡 Built for performance, simplicity, and real-world usage.
