# 📊 Pollzy - Real-Time Polling & Analytics Platform

A full-stack web platform where users can create, share, and track polls in real-time[cite: 1]. Built for speed and scalability, it features dynamic forms, live WebSocket updates, and robust data management[cite: 1].

**🔗 Live Demo:** [https://pollzy-pi.vercel.app/](https://pollzy-pi.vercel.app/)[cite: 1]

---

## ✨ Features

### 📝 Dynamic Poll Creation
* **Single-Option Questions:** Build comprehensive polls featuring multiple questions with clear single-choice answers[cite: 1].
* **Smart Validation:** Questions can be set as **Mandatory** or **Optional**[cite: 1].
* **Access Control:** Support for **Anonymous** feedback or **Authenticated** user restrictions[cite: 1].
* **Auto-Expiry:** Automatic deactivation via an expiry timer to prevent late submissions[cite: 1].

### 🗳️ Respondent Experience
* **Public Links:** Shareable unique URLs for easy access[cite: 1].
* **Optimized Forms:** Secure and smooth submission process using dynamic React forms[cite: 1].

### 📈 Real-Time Analytics
* **Live Updates:** Dashboard updates instantly using **Socket.io** upon each submission[cite: 1].
* **Deep Insights:** Visualize total responses, question summaries, and participation metrics[cite: 1].

### 📢 Results Publishing
* **Public Results:** Creators can choose to publish final outcomes[cite: 1].
* **Seamless Transition:** Once published, the poll link automatically displays results instead of the voting form[cite: 1].

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, TanStack Router, React Hook Form[cite: 1] |
| **Backend** | Node.js, Express.js[cite: 1] |
| **Real-Time** | Socket.io / WebSockets[cite: 1] |
| **Database** | PostgreSQL[cite: 1] |
| **Performance** | Redis (Caching)[cite: 1] |
| **Architecture** | Monorepo[cite: 1] |

---

## 🛡️ Hackathon Requirements Fulfilled

- [x] **Question Type:** Single-option questions[cite: 1].
- [x] **Response Modes:** Anonymous and authenticated support[cite: 1].
- [x] **Time Limits:** Link expiry system[cite: 1].
- [x] **Validation:** Frontend and backend handling for mandatory fields[cite: 1].
- [x] **Insights:** Full analytics dashboard[cite: 1].
- [x] **Visibility:** Result publishing to public links[cite: 1].
- [x] **Live Data:** Real-time updates via Socket.io[cite: 1].
- [x] **Full-Stack:** Complete API and UI implementation[cite: 1].
- [x] **Version Control:** Single GitHub repository[cite: 1].