# 📊 PollStream - Real-Time Polling & Analytics Platform

A full-stack web platform where users can create, share, and track polls in real-time. Built for speed and scalability, it features dynamic forms, live WebSocket updates, and robust data management.

---

## ✨ What It Does

### 📝 Dynamic Poll Creation
* **Single-Option Questions:** Creators can build comprehensive polls featuring multiple questions where respondents select one clear answer from the provided options.
* **Smart Validation:** Individual questions can be explicitly marked as either **Mandatory** or **Optional**.
* **Access Control:** Polls can be configured to accept **Anonymous** feedback or strictly require **Authenticated** users.
* **Auto-Expiry:** Every poll is bound by an expiry timer. Once the deadline passes, the poll automatically deactivates and no further responses are accepted.

### 🗳️ Seamless Respondent Experience
* **Public Links:** Polls are easily shareable via unique URLs. 
* **Smooth Submissions:** Respondents can open the link, breeze through the dynamic React forms, and submit their feedback securely.

### 📈 Real-Time Analytics Dashboard
* **Live Updates:** Powered by **Socket.io**, the creator's dashboard updates instantly the moment a new response is submitted.
* **Deep Insights:** Creators get a clear view of total responses, question-wise summaries, option counts, and overall participation metrics.

### 📢 Publishing Results
* **Transparency:** Once a poll is completed, the creator has the option to publish the final results.
* **Public Viewing:** After publishing, anyone who visits the original poll link will automatically see the final poll outcome and response summaries instead of the voting form.

---

## 🛠️ Technology Stack

* **Frontend Engine:** React
* **Routing:** TanStack Router (Handling protected routes and public forms)
* **Form Handling:** React Hook Form (For dynamic validation)
* **Backend API:** Node.js & Express.js
* **Real-Time Communication:** Socket.io / WebSockets
* **Primary Database:** PostgreSQL (Structured schema for users, polls, questions, and responses)
* **Caching & Performance:** Redis
* **Architecture:** Monorepo (Frontend and Backend housed within a single repository)

---

## 🛡️ Hackathon Requirements Fulfilled

- [x] **Question Type:** Single-option based questions supported.
- [x] **Response Modes:** Both anonymous and authenticated modes implemented.
- [x] **Time Limits:** Poll link expiry system actively prevents late submissions.
- [x] **Validation:** Mandatory and optional questions strictly handled on both frontend and backend.
- [x] **Insights:** Complete analytics dashboard built for creators.
- [x] **Visibility:** Final poll results can be published to the same public link.
- [x] **Live Data:** Real-time response counts and updates achieved via Socket.io.
- [x] **Full-Stack:** Both API and UI fully implemented.
- [x] **Version Control:** Maintained cleanly inside one single GitHub repository.