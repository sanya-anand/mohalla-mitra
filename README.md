# 🏘️ Mohalla Mitra

> AI-powered hyperlocal civic issue reporting platform built using Google Gemini AI.

Mohalla Mitra helps citizens report local civic issues while using **Google Gemini AI** to automatically classify complaints, determine severity, identify the responsible authority, generate a formal complaint, and intelligently merge duplicate reports into a single community-backed issue.

---

## 🚀 Live Demo

🔗 https://mohalla-mitra-42ba8.web.app

---

## ✨ Features

- 🤖 AI-powered issue classification
- 🚨 Automatic severity assessment
- 🏛️ Responsible authority recommendation
- 📝 AI-generated formal complaint
- 🔄 Smart duplicate detection & report merging
- 👥 Community confirmation counter
- 📊 Sortable community feed
- 📱 Responsive modern UI
- 🌙 Dark glassmorphism interface

---

## 💡 Problem

Residents often don't know:

- Which department to report an issue to
- How to write a proper complaint
- Whether someone has already reported the same issue

As a result, complaints remain scattered, duplicated, and ineffective.

---

## 🧠 Solution

Mohalla Mitra uses **Gemini AI** to:

- Categorize every complaint
- Assess urgency
- Route it to the correct authority
- Draft a professional complaint
- Detect duplicate reports
- Merge confirmations from multiple residents into one stronger community signal

Instead of 20 duplicate complaints, authorities receive **one issue backed by 20 residents**.

---

## 🛠 Tech Stack

| Category | Technology |
|-----------|------------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| AI | Google Gemini API |
| Hosting | Firebase Hosting |
| Language | JavaScript |

---

## 📂 Project Structure

```text
src/
 ├── components/
 ├── data/
 ├── lib/
 │   ├── gemini.js
 │   └── store.jsx
 ├── App.jsx
 └── main.jsx
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/sanya-anand/mohalla-mitra.git
cd mohalla-mitra
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
VITE_GEMINI_API_KEY=YOUR_API_KEY
```

Run locally

```bash
npm run dev
```

Build

```bash
npm run build
```

---

## 🎯 Demo Flow

1. Submit a civic issue
2. Gemini categorizes it
3. Severity is predicted
4. Correct authority is suggested
5. Complaint is auto-generated
6. Similar reports are merged
7. Community confirmation count increases

---


## 🔮 Future Enhancements

- Firestore backend
- Live map integration
- Status tracking
- WhatsApp/SMS reporting
- Authority dashboard

---

## 👩‍💻 Author

**Sanya Anand**

GitHub: [@sanya-anand](https://github.com/sanya-anand)

---

