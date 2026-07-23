# Naveen S — Software Engineer & AI Architect Headquarters

> **Interactive Cyber-IDE Portfolio & Digital Command Center**  
> Engineered with React 19, Vite, Express, PostgreSQL, Three.js, and Tailwind CSS.

---

## ⚡ Overview

Welcome to the digital headquarters of **Naveen S** — Full Stack Engineer & AI Solutions Architect. Designed with an immersive, high-tech IDE interface inspired by modern code editors and tactical command consoles, this application delivers a seamless interactive developer portfolio and full-stack management system.

---

## ✨ Key Features

### 🦇 1. Bruce Wayne's Dossier & Status Panel
- **Live Status & Track Record**: Real-time availability status (`● Available for Internships`), location (Bangalore, India), current mission (`Building PatentEase`), degree details (`🎓 B.Tech CSE '27`), specialization tags, open roles, and track record metrics (Projects, Leadership, Hackathons, Teams Led, Research).
- **Mobile Drawer Support**: Touchpad gesture scrolling (`data-lenis-prevent`) and responsive drawer access across mobile devices and tablets.

### 🎨 2. Selectable 3D WebGL Shader Engines
- **Cinematic Beams Shader** (`@react-bits/Beams-JS-CSS`): Volumetric lighting rays with real-time beam width, height, speed, color, noise intensity, and rotation sliders.
- **Antigravity Particle Field** (`@react-bits/Antigravity-JS-CSS`): Interactive 3D particle physics ring with magnet radius, wave amplitude, particle shape, and field strength parameters.
- **Tactical Sonar Mesh**: Clean 2D grid canvas with glowing radar reticle sweeps.

### 💻 3. Interactive Terminal Shell (`/terminal`)
An embedded terminal emulator offering a bash-style CLI experience with tab completions and keyboard arrow history:
- `whoami` : Professional profile & developer summary
- `skills` : Technical stack breakdown
- `exp` : Experience & leadership highlights
- `edu` : Academic background (B.Tech CSE '27)
- `projects` : List all portfolio projects with IDs & serial numbers
- `open <id|num>` : Navigate directly to project case studies
- `git` : Navigate to GitHub repository viewer
- `journey` : View career timeline & milestones
- `blog` : Read engineering journal articles
- `resume` : Launch interactive PDF resume viewer
- `contact` : Display contact details & open contact form
- `ls` / `tree` / `pwd` : Workspace file structure exploration
- `clear` / `help` : Shell screen management & command index

### 📜 4. Certifications, Tools & Publications Manager
- **Dynamic Certifications & Badges**: Upload certificate PDFs, verification links, and custom badge images.
- **Tools & Technologies Editor**: Categorized skill management across Frontend Architecture, Backend & Systems, and AI & Cloud Engineering.
- **IEEE & Research Publications**: Upload publication PDFs, DOI links, and abstract summaries.

### 🛠️ 5. Creator Studio Administrative HQ (`/nh-44`)
- Secure password-protected administrative portal.
- Real-time live updating for site settings, hero taglines, current focus, background shader parameters, and Dossier status metrics.
- Direct Cloudinary file upload integration for resumes, certificates, badges, and project media.

### 🐙 6. GitHub Repository & Documentation Sync
- Automatic repository sync with live star counts, fork counts, topic tags, and primary language indicators.
- Instant in-app `README.md` decoding and markdown rendering for expanded repositories using `react-markdown`.

---

## 🏗️ Technical Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Three.js, Lucide Icons, React Markdown, Canvas PDF Renderer
- **Backend API**: Node.js, Express.js, PostgreSQL (Neon DB / SSL Pool), Cloudinary SDK, JWT Auth
- **Design System**: IDE Dark Mode, Custom HSL Accents (Gold / Blue / Purple), Glassmorphism, Micro-animations

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

### 3. Initialize Database Schema
```bash
node db/init.js
node db/alter_settings.js
node db/alter_background_config.js
node db/alter_dossier.js
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
