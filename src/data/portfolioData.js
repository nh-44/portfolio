export const personalInfo = {
  name: "Naveen",
  title: "Full Stack Engineer & AI Solutions Architect",
  tagline: "Crafting high-performance web applications, intelligent systems & intuitive digital experiences.",
  about: "I'm a passionate Software Engineer and final year Computer Science student. I design full-stack systems, orchestrate cloud platforms, and program robotics.",
  location: "Bangalore, India",
  email: "naveenselvaraj.selva@gmail.com",
  status: "Available for high-impact roles & research",
  resumeUrl: "/resume",
  socials: {
    github: "https://github.com/nh-44",
    linkedin: "https://www.linkedin.com/in/nh44/",
    instagram: "https://www.instagram.com/naveenselvaraj_/",
    twitter: "https://x.com",
    email: "naveenselvaraj.selva@gmail.com"
  },
  stats: [
    { label: "Projects Completed", value: "15+" },
    { label: "Technologies", value: "20+" },
    { label: "GitHub Contributions", value: "1,200+" },
    { label: "System Uptime", value: "99.9%" },
  ]
};

export const skillsData = [
  {
    category: "Frontend Architecture",
    description: "Building responsive, modern, and accessible client interfaces.",
    items: [
      { name: "React / Next.js", level: 95, icon: "Code2" },
      { name: "TypeScript", level: 90, icon: "FileCode" },
      { name: "Tailwind CSS & Modern Design", level: 95, icon: "Palette" },
      { name: "Framer Motion / GSAP", level: 88, icon: "Sparkles" },
      { name: "Three.js / WebGL", level: 75, icon: "Box" },
      { name: "Redux / Zustand", level: 92, icon: "Layers" }
    ]
  },
  {
    category: "Backend & Systems",
    description: "Designing robust APIs, cloud infrastructure, and microservices.",
    items: [
      { name: "Node.js & Express", level: 92, icon: "Server" },
      { name: "Python / FastAPI / Django", level: 88, icon: "Terminal" },
      { name: "PostgreSQL & Neon DB", level: 90, icon: "Database" },
      { name: "GraphQL & REST APIs", level: 92, icon: "Network" },
      { name: "Redis & Caching", level: 85, icon: "Zap" },
      { name: "Docker & Cloud Deployments", level: 80, icon: "Container" }
    ]
  },
  {
    category: "AI & Cloud Engineering",
    description: "Deploying machine learning models and scalable cloud pipelines.",
    items: [
      { name: "Gemini API & OpenAI Integrations", level: 90, icon: "Cpu" },
      { name: "LangChain & Vector Databases", level: 85, icon: "Brain" },
      { name: "Google Cloud Platform", level: 88, icon: "Cloud" },
      { name: "AWS Cloud Infrastructure", level: 82, icon: "CloudSun" },
      { name: "CI/CD & GitHub Actions", level: 90, icon: "GitBranch" },
      { name: "System Security & Auth", level: 90, icon: "ShieldCheck" }
    ]
  }
];

export const projectsData = [
  {
    id: "patentease",
    title: "PatentEase - AI Patent Automation",
    category: "AI / Full Stack",
    filterTag: "ai",
    description: "Intelligent IP automation system featuring real-time patent prior-art analysis, claims drafting, and automated document generation.",
    fullDescription: "PatentEase is a cutting-edge platform combining LLM reasoning capabilities with automated IP workflows. Engineered using React, Express, PostgreSQL, and Gemini API integrations.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    tags: ["React", "Express", "PostgreSQL", "Gemini API", "Tailwind CSS"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
    metrics: ["Automated Patent Drafting", "99.9% Uptime", "Sub-second AI Search"]
  },
  {
    id: "robotics-control",
    title: "ROS2 Autonomous Rover Suite",
    category: "Robotics / Embedded",
    filterTag: "robotics",
    description: "ROS2 navigation and autonomous telemetry suite for robotic rovers with LiDAR mapping and real-time sensor visualization.",
    fullDescription: "Autonomous mobile robot control system built on ROS2 Humble, Gazebo simulation, and Python telemetry bridges.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    tags: ["ROS2", "Python", "C++", "LiDAR", "Gazebo"],
    liveUrl: "#",
    githubUrl: "#",
    featured: true,
    metrics: ["SLAM Mapping", "Autonomous Pathfinding", "Real-Time Telemetry"]
  }
];

export const experienceData = [
  {
    period: "2024 - Present",
    role: "Full Stack & AI Engineer",
    company: "PatentEase & AI Projects",
    description: "Designing end-to-end full-stack architectures, LLM pipelines, and automated cloud workflows.",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Gemini API", "Tailwind CSS"]
  }
];

export const terminalCommands = {
  help: `Available Commands:
  - bio         : Print developer summary & background
  - skills      : Output technical stack breakdown
  - projects    : List top featured projects
  - contact     : Get direct email and social profiles
  - clear       : Clear terminal window
  - sudo hire   : Unlock secret message ;)`,

  bio: `Naveen | Software Engineer & AI Solutions Architect
Specializing in cloud platforms, high-performance UI systems, AI agents, and robotics.`,

  skills: `Frontend : React, Next.js, TypeScript, Tailwind CSS, Framer Motion
Backend  : Node.js, Express, Python, PostgreSQL, Redis
Cloud/AI : GCP, AWS, Gemini API, Docker, CI/CD`,

  projects: `1. PatentEase - AI Patent Automation Platform
2. ROS2 Autonomous Rover Suite - Autonomous Navigation System`,

  contact: `Email    : naveenselvaraj.selva@gmail.com
GitHub   : github.com
LinkedIn : linkedin.com`,

  "sudo hire": `>>> PERMISSION GRANTED: You've discovered the easter egg!
Let's talk! Shoot an email to naveenselvaraj.selva@gmail.com with code "EASTEREGG"`
};
