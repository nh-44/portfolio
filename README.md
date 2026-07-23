# Naveen S — Software Engineer & AI Architect Headquarters

> **Interactive Cyber-IDE Portfolio & Digital Command Center**  
> Engineered with React 19, Vite, Express, PostgreSQL, Three.js, and Tailwind CSS.

---

## ⚡ Overview

Welcome to the digital headquarters of **Naveen S** — Full Stack Engineer & AI Solutions Architect. Designed with an immersive, high-tech IDE interface inspired by modern code editors and tactical command consoles, this application delivers a seamless interactive developer portfolio, real-time status panel, interactive CLI terminal, and administrative management suite.

---

## ✨ Key Features

### 🦇 1. Bruce Wayne's Dossier & Status Panel
- **Live Status & Track Record**: Real-time availability status (`● Available for Internships`), location (`Bengaluru, India`), degree (`🎓 B.Tech CSE '27`), current mission (`Building PatentEase`), specialization tags, open roles, and track record metrics (6+ Projects, 4 Leadership Roles, 1st Place Hackathons, 1 IEEE Publication).
- **Touchpad & Mobile Drawer Support**: Touchpad gesture scrolling (`data-lenis-prevent`) and responsive drawer access across mobile devices and tablets.

### 🎨 2. Selectable 3D WebGL Shader Engines & Accent Color Palette
- **Cinematic Beams Shader** (`@react-bits/Beams-JS-CSS`): Volumetric lighting rays with real-time beam width, height, speed, color, noise intensity, and rotation controls.
- **Antigravity Particle Field** (`@react-bits/Antigravity-JS-CSS`): Interactive 3D particle physics ring with magnet radius, wave amplitude, particle shape, and field strength parameters.
- **Multi-Theme Accent Color Switcher**: Select between **Cyber Cyan (`#06B6D4`)**, **Tactical Steel Metallic (`#94A3B8`)**, **Gotham Gold (`#EAB308`)**, **Electric Blue (`#2563EB`)**, and **Crimson Red (`#EF4444`)**.

### 💻 3. Interactive Terminal Shell (`/terminal`)
An embedded terminal emulator offering a bash-style CLI experience with tab completions and keyboard arrow history:
- `whoami` : Professional profile & developer summary
- `skills` : Technical stack breakdown
- `exp` : Experience & leadership highlights
- `edu` : Academic background (B.Tech CSE '27 @ PES University)
- `projects` : List all portfolio projects with IDs & serial numbers
- `open <id|num>` : Navigate directly to project case studies
- `git` : Navigate to GitHub repository viewer
- `journey` : View career timeline & milestones
- `blog` : Read engineering journal articles
- `resume` : Launch interactive PDF resume viewer
- `contact` : Display contact details & open contact form
- `ls` / `tree` / `pwd` : Workspace file structure exploration
- `clear` / `help` : Shell screen management & command index

### 📥 4. Contact Form Messages & Creator Studio Inbox (`/nh-44`)
- **PostgreSQL Inbox Database**: Contact form submissions are saved to the PostgreSQL `messages` table and optionally forwarded via SMTP email.
- **Admin Inbox Viewer**: Review received messages in **Creator Studio (`/nh-44`)** with sender email, subject, message body, quick mailto reply, and message deletion.

### 🎉 5. Celebratory Confetti & Toast Notification System
- Fires celebratory confetti bursts and renders floating success toast notification banners upon saving settings, updating dossier data, uploading files, or submitting forms.

### 🛠️ 6. Creator Studio Administrative HQ (`/nh-44`)
- Secure password-protected administrative portal.
- Real-time live updating for site settings, hero taglines, background shader parameters, certifications, journey milestones, publications, and Dossier status metrics.
- Direct Cloudinary file upload integration for resumes, certificates, badges, and project media.

---

## 🏗️ Technical Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Three.js, Lucide Icons, React Markdown, Canvas Confetti
- **Backend API**: Node.js, Express.js, PostgreSQL (Neon DB / SSL Pool), Cloudinary SDK, JWT Auth, Nodemailer SMTP
- **Design System**: IDE Dark Mode, Cyber Cyan Neon & Tactical HSL Accents, Glassmorphism, Micro-animations

---

## 🚀 Quick Start & Installation

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/nh-44/portfolio.git
cd portfolio
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
DATABASE_URL=postgres://user:password@endpoint.neon.tech/neondb?sslmode=require
ADMIN_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### 3. Initialize Database Schema & Migrations
```bash
node db/seed.js
node db/alter_messages.js
```

### 4. Run Locally
```bash
# Start backend server & frontend dev server
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📄 License & Credits

Designed and developed by **Naveen S** © 2026. All rights reserved.
