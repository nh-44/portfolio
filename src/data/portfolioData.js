export const personalInfo = {
  name: "Naveen S",
  title: "Software Engineer — Backend, Document Intelligence & Applied ML",
  tagline: "Building high-performance backend systems, document intelligence pipelines, and GenAI tooling.",
  about: "Software Engineer-in-Training with experience in backend systems, document intelligence, applied machine learning, and GenAI tooling. Proven ability to build data processing pipelines involving PDF parsing, semantic similarity, and LLM-based reasoning. Demonstrated leadership across innovation projects, hackathons, and IEEE-published research.",
  location: "Bengaluru, India",
  email: "naveenselvaraj.selva@gmail.com",
  phone: "+91 89511 12467",
  status: "Available for Internships",
  resumeUrl: "/resume",
  socials: {
    github: "https://github.com/nh-44",
    linkedin: "https://www.linkedin.com/in/nh44/",
    instagram: "https://www.instagram.com/naveenselvaraj_/",
    email: "naveenselvaraj.selva@gmail.com"
  },
  stats: [
    { label: "Projects & Research", value: "6+" },
    { label: "Hackathon Wins", value: "1st Place" },
    { label: "IEEE Publications", value: "1 Paper" },
    { label: "Teams Led", value: "35+ Members" }
  ]
};

export const skillsData = [
  {
    category: "Backend & Web Architecture",
    description: "Engineering scalable server pipelines, REST APIs, and database stores.",
    items: [
      { name: "Node.js & Express", level: 92, icon: "Server" },
      { name: "Python / FastAPI", level: 95, icon: "Terminal" },
      { name: "PostgreSQL & Supabase", level: 90, icon: "Database" },
      { name: "REST APIs & RBAC Auth", level: 92, icon: "Network" },
      { name: "React & Next.js", level: 88, icon: "Code2" },
      { name: "C / C++", level: 85, icon: "FileCode" }
    ]
  },
  {
    category: "ML, AI & Document Intelligence",
    description: "Building explainable vision transformer models and semantic document search.",
    items: [
      { name: "Document Parsing & OCR", level: 94, icon: "FileText" },
      { name: "Semantic Similarity & Embeddings", level: 92, icon: "Brain" },
      { name: "Vision Transformers (BEiT)", level: 88, icon: "Cpu" },
      { name: "Explainable AI (Grad-CAM, SHAP, LIME)", level: 90, icon: "Sparkles" },
      { name: "LLM Reasoning & RAG", level: 90, icon: "Layers" },
      { name: "Scikit-learn & Random Forests", level: 85, icon: "Zap" }
    ]
  },
  {
    category: "Cloud, DevOps & Tools",
    description: "Cloud infrastructure management and automated deployment pipelines.",
    items: [
      { name: "AWS (Cloud Practitioner)", level: 88, icon: "Cloud" },
      { name: "Amazon Bedrock & Amazon Q", level: 85, icon: "CloudSun" },
      { name: "Docker & Kubernetes", level: 80, icon: "Container" },
      { name: "GitHub Actions & CI/CD", level: 88, icon: "GitBranch" },
      { name: "MATLAB & Simulink", level: 82, icon: "Sliders" },
      { name: "Fusion 360 & Hardware", level: 80, icon: "Box" }
    ]
  }
];

export const projectsData = [
  {
    id: "patentease",
    title: "PatentEase (Capstone Project)",
    category: "AI / Capstone",
    filterTag: "ai",
    description: "Developing an end-to-end AI document processing pipeline for patent officers and inventors to analyze claims, detect novelty, and compute patentability scores.",
    fullDescription: "PatentEase implements vector embeddings, semantic similarity, and LLM reasoning nodes to compare patent claims against historical registries, offering automated summarization and multilingual translation.",
    image: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
    tags: ["Python", "NLP", "LLMs", "Vector Embeddings", "PostgreSQL"],
    liveUrl: "#",
    githubUrl: "https://github.com/nh-44",
    featured: true,
    metrics: ["Semantic Similarity", "Novelty Detection Engine", "Multilingual Patent Search"]
  },
  {
    id: "lifetag",
    title: "LifeTag — NFC Emergency Medical ID",
    category: "Web / Hardware",
    filterTag: "web",
    description: "1st Place Winner at Heal-O-Code Hackathon. NFC-based medical ID dashboard providing emergency responders instant access to patient health data.",
    fullDescription: "Designed with privacy-first role-based access control (First Responders, Doctors, Admin). Features dynamic URLs, emergency-only data views, scan history, and breach detection hooks across 200+ users.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    tags: ["Next.js", "Express", "Node.js", "NFC Hardware", "RBAC"],
    liveUrl: "#",
    githubUrl: "https://github.com/nh-44",
    featured: true,
    metrics: ["1st Place Hackathon Winner", "200+ Users Tested", "Privacy-First Access Control"]
  },
  {
    id: "leaf-xai-classifier",
    title: "Medicinal Leaf XAI Classifier (IEEE INDICON 2025)",
    category: "ML / Research",
    filterTag: "ai",
    description: "Explainable AI classifier identifying medicinal plants utilizing Vision Transformers (BEiT). Published & presented at IEEE INDICON 2025.",
    fullDescription: "Developed during a 2-month summer research internship at CoDMAV (PES University). Built a multimodal XAI system integrating BEiT, TF-IDF, Grad-CAM, LIME, SHAP, and LRP for botanical verification.",
    image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1200&q=80",
    tags: ["Python", "BEiT Vision Transformers", "Grad-CAM", "LIME", "SHAP"],
    liveUrl: "#",
    githubUrl: "https://github.com/nh-44",
    featured: true,
    metrics: ["IEEE INDICON 2025 Publication", "Multimodal XAI Pipeline", "BEiT & Grad-CAM Heatmaps"]
  }
];

export const experienceData = [
  {
    period: "Summer 2025",
    role: "Research Intern",
    company: "CoDMAV — PES University",
    description: "Researched multimodal AI systems combining Vision Transformers (BEiT) and NLP. Built Explainable AI pipelines using Grad-CAM, LIME, SHAP, and LRP. Co-authored research published at IEEE INDICON 2025.",
    skills: ["Vision Transformers", "Python", "Grad-CAM", "SHAP", "LIME", "NLP"]
  },
  {
    period: "2025 - Present",
    role: "Club Head",
    company: "Team Vegavath (Student Innovation Club)",
    description: "Revived and scaled the club into a leading innovation community on campus. Shifted focus to SDVs, robotics, and automation systems. Organized Ignition 1.0 (Ather Energy) for 230+ participants with a 35-member team.",
    skills: ["Leadership", "Robotics", "SDVs", "Event Management", "Automation"]
  },
  {
    period: "2025",
    role: "Teaching Assistant",
    company: "PES University",
    description: "Assisted in laboratory sessions, mentoring, evaluation, and academic coordination for MPCA (Microprocessors & Computer Architecture) coursework.",
    skills: ["Mentorship", "Microprocessors", "Academic Coordination"]
  },
  {
    period: "2024 - 2025",
    role: "Data Analytics Head",
    company: "Nexus AWS",
    description: "Worked with AWS cloud services, conducted hands-on cloud engineering workshops, and explored GenAI tools including Amazon Bedrock and Amazon Q.",
    skills: ["AWS Cloud", "Amazon Bedrock", "Amazon Q", "Analytics"]
  },
  {
    period: "2024 - 2025",
    role: "Professional Development Director",
    company: "Rotaract PESU ECC",
    description: "Organized skill-building workshops, professional development seminars, and campus collaborations.",
    skills: ["Workshops", "Event Planning", "Campus Collaborations"]
  },
  {
    period: "2023 - Present",
    role: "Member & Volunteer",
    company: "PAWS",
    description: "Volunteered in animal welfare drives, community outreach, and fundraising initiatives.",
    skills: ["Community Outreach", "Fundraising", "Volunteering"]
  },
  {
    period: "2023 - Present",
    role: "Class Representative (3 Years)",
    company: "PES University",
    description: "Managed student-faculty coordination, academic communication, and batch logistics across 3 academic years.",
    skills: ["Communication", "Faculty Liaison", "Logistics"]
  }
];

export const terminalCommands = {
  help: `Available Commands:
  - whoami      : Print developer summary & background
  - skills      : Output technical stack breakdown
  - projects    : List top capstone & research projects
  - contact     : Get direct email and social profiles
  - clear       : Clear terminal window`,

  whoami: `Naveen S | Software Engineer-in-Training
Location : Bengaluru, India
Focus    : Backend Systems, Document Intelligence, Applied ML & GenAI
About    : Final year CS Student at PES University. Research Intern at CoDMAV. IEEE INDICON 2025 Author.`,

  skills: `Languages : Python, C, C++, JavaScript
Backend   : Node.js, Express, React, Next.js, REST APIs, RBAC
Databases : PostgreSQL, MySQL, Supabase
ML & AI   : Scikit-learn, Vision Transformers (BEiT), Explainable AI (Grad-CAM, LIME, SHAP)
Cloud     : AWS (Cloud Practitioner), Amazon Bedrock, Amazon Q, Docker, Kubernetes, CI/CD`,

  projects: `1. PatentEase (Capstone Project) - AI Patent Document Processing Pipeline
2. LifeTag - NFC Emergency Medical ID (1st Place Heal-O-Code Hackathon)
3. Medicinal Leaf XAI Classifier - IEEE INDICON 2025 Research Paper
4. Fuel Injection Digital Twin - Top 10 HAL Aerothon
5. Simplified GDPR Consent Manager (SGCM)`,

  contact: `Email    : naveenselvaraj.selva@gmail.com
GitHub   : https://github.com/nh-44
LinkedIn : https://www.linkedin.com/in/nh44/`
};
