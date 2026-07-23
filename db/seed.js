// Database Seeder for Portfolio
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for Neon PostgreSQL
  }
});

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log("Starting database seeding with Naveen's resume profile...");
    await client.query("BEGIN");

    // 1. Clear existing data
    await client.query("TRUNCATE TABLE site_settings, projects, journey, blog, resume RESTART IDENTITY CASCADE");
    console.log("Truncated existing tables.");

    // 2. Seed Resume Link
    await client.query(
      `INSERT INTO resume (url) VALUES ($1)`,
      ['https://res.cloudinary.com/demo/image/upload/v1234567890/sample.pdf']
    );
    console.log("Seeded resume table.");

    // 3. Seed Site Settings (Based on Resume Profile)
    const settingsQuery = `
      INSERT INTO site_settings (
        hero_heading,
        hero_description,
        current_focus,
        profile_picture_url,
        about_text,
        quick_facts,
        social_links,
        location,
        email,
        footer_text,
        seo_title,
        seo_description,
        accent_color,
        favicon_url,
        google_client_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
    `;

    const settingsValues = [
      "Naveen S", 
      "Software Engineer-in-Training specializing in backend systems, document intelligence, and GenAI.",
      JSON.stringify(["Document Intelligence", "GenAI Tooling", "Applied ML", "Robotics Navigation"]),
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&h=400&q=80", 
      "Software Engineer-in-Training with experience in backend systems, document intelligence, applied machine learning, and GenAI tooling. Proven ability to build data processing pipelines involving PDF parsing, semantic similarity, and LLM-based reasoning. Demonstrated leadership across innovation projects, hackathons, and IEEE-published research.",
      JSON.stringify(["B.Tech CS Student @ PESU", "Backend Systems & APIs", "Applied ML & Explainable AI", "AWS Cloud Practitioner", "Bengaluru, India"]),
      JSON.stringify({
        github: "https://github.com/nh-44",
        linkedin: "https://linkedin.com/in/naveen-selvaraj-",
        twitter: "https://x.com",
        email: "naveenselvaraj.selva@gmail.com"
      }),
      "Bengaluru, India",
      "naveenselvaraj.selva@gmail.com",
      "© 2026 Naveen S. Built with precision and growth.",
      "Naveen S — Software Engineer & Machine Learning",
      "Personal digital headquarters and portfolio of Naveen S. Showcasing software architecture, GenAI pipelines, and robotics navigation stacks.",
      "#EAB308", // Nolan Batman Gold
      "https://res.cloudinary.com/demo/image/upload/v1234567890/favicon.ico",
      process.env.GOOGLE_CLIENT_ID || ''
    ];

    await client.query(settingsQuery, settingsValues);
    console.log("Seeded site settings.");

    // 4. Seed Projects (All 6 from Resume)
    const projectQuery = `
      INSERT INTO projects (
        title, slug, short_description, long_description, cover_image, gallery, tech_stack, github_url, demo_url, status, tags, featured
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    `;

    // Project 1: PatentEase
    await client.query(projectQuery, [
      "PatentEase (Capstone Project)",
      "patentease",
      "AI-driven platform for patent officers and inventors to extract, compare, and analyze patent claims.",
      `## Overview
PatentEase is a capstone project designed to streamline patent search and filing. It implements document parsing, vector embeddings, and LLM analysis to predict patentability scores.

## Key Features
- **Document Processing**: Extracted claims and description texts using Python-based OCR and PDF parsers.
- **Semantic Search**: Compared patent filings against historical registries using semantic similarity and vector database indexing.
- **Novelty Detection**: Utilized LLM reasoning nodes to check claim criteria and estimate a novelty score.
- **Translation**: Built an AI-driven translator to interpret international patent documents.`,
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80",
      JSON.stringify([]),
      JSON.stringify(["Python", "NLP", "LLMs", "Vector Embeddings", "PostgreSQL"]),
      "https://github.com/nh-44",
      "",
      "active",
      JSON.stringify(["AI", "NLP", "Capstone"]),
      true
    ]);

    // Project 2: LifeTag
    await client.query(projectQuery, [
      "LifeTag — NFC Emergency Medical ID",
      "lifetag",
      "1st Place Winner at Heal-O-Code Hackathon. NFC-based medical ID dashboard providing emergency responders instant health metrics.",
      `## Overview
LifeTag is a privacy-first emergency healthcare dashboard. Employs cheap, accessible NFC cards that trigger secure redirection profiles when scanned by first responders.

## Technical Details
- **Role-Based Access Control**: Strict access boundaries protecting patient privacy (First Responders, Doctors, and Admin views).
- **Dynamic Security**: Exposes temporary, dynamic URLs on scan to prevent permanent token sharing.
- **Logging**: Integrates robust scan logging and intrusion detection hooks.`,
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
      JSON.stringify([]),
      JSON.stringify(["Next.js", "Express", "Node.js", "NFC Hardware", "RBAC"]),
      "https://github.com/nh-44",
      "",
      "completed",
      JSON.stringify(["Web", "Security", "Hackathon"]),
      true
    ]);

    // Project 3: Medicinal Leaf XAI Classifier
    await client.query(projectQuery, [
      "Medicinal Leaf XAI Classifier",
      "leaf-xai-classifier",
      "Explainable AI classifier identifying medicinal plants utilizing Vision Transformers. Published at IEEE INDICON 2025.",
      `## Overview
Conducted as a Summer Research Intern at **CoDMAV (PES University)**. Fuses vision models with explainable pipelines to verify botanical classification models.

## Architecture & Models
- **Vision Models**: Fine-tuned Vision Transformers (BEiT) to catalog leaf structures.
- **Explainability**: Integrated Grad-CAM, LIME, SHAP, and LRP (Layer-wise Relevance Propagation) to output visual heatmaps explaining the model's classifications.
- **Publication**: Published and presented at the IEEE INDICON 2025 conference.`,
      "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=1200&q=80",
      JSON.stringify([]),
      JSON.stringify(["Python", "Vision Transformers (BEiT)", "Grad-CAM", "LIME", "SHAP"]),
      "https://github.com/nh-44",
      "",
      "completed",
      JSON.stringify(["ML", "Explainable AI", "Research"]),
      true
    ]);

    // Project 4: Fuel Injection System Digital Twin
    await client.query(projectQuery, [
      "Fuel Injection System Digital Twin",
      "fuel-injection-digital-twin",
      "Simscape-based digital twin of an aviation fuel system. Finished in the Top 10 at HAL Aerothon.",
      `## Overview
Developed during the HAL Aerothon 24-hour hackathon. Represents a multi-physics digital simulation representing fuel telemetry, forecasting leaks, and scheduling diagnostic checks.

## Key Outcomes
- **Simulations**: Modeled pressure drops and hydraulic flow inside MATLAB Simscape.
- **Analytics**: Programmed an ML health monitoring pipeline to classify anomalous pressure profiles and predict pump failures.`,
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      JSON.stringify([]),
      JSON.stringify(["MATLAB", "Simulink", "Simscape", "Machine Learning"]),
      "https://github.com/nh-44",
      "",
      "completed",
      JSON.stringify(["Simulation", "Aerospace", "Hackathon"]),
      false
    ]);

    // Project 5: Simplified GDPR Consent Manager (SGCM)
    await client.query(projectQuery, [
      "Simplified GDPR Consent Manager",
      "gdpr-consent-manager",
      "Backend engine providing GDPR compliance logs, secure encryption-at-rest, and role authorization pipelines.",
      `## Overview
A lightweight utility service engineered under strict TDD (Test-Driven Development) methodologies to maintain compliance database stores.

## Features
- **Security**: Complete encryption-at-rest for consent audits.
- **CI/CD**: Configured GitHub Actions pipelines validating code metrics on check-in.
- **Access Control**: Integrated secure role validation hooks.`,
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      JSON.stringify([]),
      JSON.stringify(["Node.js", "Express", "TDD", "CI/CD", "Encryption"]),
      "https://github.com/nh-44",
      "",
      "completed",
      JSON.stringify(["Backend", "Security", "Compliance"]),
      false
    ]);

    // Project 6: HotShot
    await client.query(projectQuery, [
      "HotShot Audience Polling Platform",
      "hotshot-polling",
      "Real-time audience polling and analytics platform supporting dynamic question feeds.",
      `## Overview
HotShot is a personal project creating a real-time classroom and panel polling interface. Participants can add options dynamically, seeing statistics update instantly.

## Architecture
- **Real-Time Synch**: Supabase subscription listeners synchronizing participant votes.
- **Frontend**: Next.js dashboard displaying response distributions and analytical summaries.`,
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      JSON.stringify([]),
      JSON.stringify(["Next.js", "Supabase", "Real-Time Sync", "Tailwind CSS"]),
      "https://github.com/nh-44",
      "",
      "completed",
      JSON.stringify(["Web", "Real-Time"]),
      false
    ]);

    console.log("Seeded 6 projects.");

    // 5. Seed Journey Milestones (Chronological Resume Milestones)
    const journeyQuery = `
      INSERT INTO journey (
        title, date, description, category, lessons_learned, technologies_used, location, thumbnail, gallery, timeline_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `;

    await client.query(journeyQuery, [
      "Secondary Education (SSLC: 94.66%)",
      "2009 - 2021",
      "Completed my basic education at ACTS Secondary School, focusing on foundational sciences and engineering logic.",
      "Academics",
      "Foundational skills in analytical physics and algebra are core pillars when stepping into robotics.",
      JSON.stringify(["Basic Logic", "Mathematics"]),
      "Bengaluru",
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80",
      JSON.stringify([]),
      1
    ]);

    await client.query(journeyQuery, [
      "Junior College (2nd PUC: 96.66%)",
      "2021 - 2023",
      "Completed junior college studies at Christ Academy Junior College, building advanced competencies in computer programming and math.",
      "Academics",
      "Initial steps into formal object-oriented concepts and data representation.",
      JSON.stringify(["C++", "Physics", "Mathematics"]),
      "Bengaluru",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=400&q=80",
      JSON.stringify([]),
      2
    ]);

    await client.query(journeyQuery, [
      "Joined PES University (B.Tech in CSE)",
      "2023 - 2027",
      "Began studying Computer Science Engineering at PES University (Current CGPA: 7.80). Focusing on backend databases, networking, and applied ML.",
      "Academics",
      "Engineering computer networks requires understanding hardware signals just as much as API structures.",
      JSON.stringify(["PostgreSQL", "Data Structures", "Algorithms"]),
      "Bengaluru",
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80",
      JSON.stringify([]),
      3
    ]);

    await client.query(journeyQuery, [
      "Research Intern — CoDMAV",
      "Summer 2025",
      "Two-month research internship at the Centre of Data Modelling, Analytics and Visualization. Researched Vision Transformers (BEiT) and Explainable AI (XAI) models.",
      "Research",
      "Deep learning models require explainability pipelines (Grad-CAM, LIME, SHAP) before they can be trusted in medical or botanical fields.",
      JSON.stringify(["Vision Transformers", "Python", "Grad-CAM", "LIME", "SHAP"]),
      "Bengaluru",
      "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=400&q=80",
      JSON.stringify([]),
      4
    ]);

    await client.query(journeyQuery, [
      "Club Head — Team Vegavath",
      "2025 - Present",
      "Revived and scaled the university's technical innovation club. Directed operations for 35+ members focusing on robotics, automation, and go-kart builds.",
      "Leadership",
      "revived and scaled communities. Organized Ignition 1.0 (Ather Energy) attracting 230+ participants.",
      JSON.stringify(["Project Management", "Robotics", "Arduino", "Raspberry Pi"]),
      "Bengaluru",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80",
      JSON.stringify([]),
      5
    ]);

    await client.query(journeyQuery, [
      "GDG Bangalore & Hackathon Triumphs",
      "2025",
      "Active contributor inside GDG Bangalore. Won 1st Place at Heal-O-Code Hackathon (LifeTag) and Top 10 at HAL Aerothon.",
      "Hackathon",
      "Rapid prototyping under constraints teaches you to focus only on workflows that validate assumptions directly.",
      JSON.stringify(["Next.js", "Express", "NFC Integrations"]),
      "Bengaluru",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80",
      JSON.stringify([]),
      6
    ]);

    console.log("Seeded journey timeline.");

    // 6. Seed Blogs
    const blogQuery = `
      INSERT INTO blog (
        title, slug, cover_image, reading_time, tags, category, markdown_content, gallery, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    await client.query(blogQuery, [
      "An Introduction to Explainable AI (XAI) in Computer Vision",
      "explainable-ai-cv",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
      "6 min read",
      JSON.stringify(["XAI", "Computer Vision", "Grad-CAM", "BEiT"]),
      "AI",
      `# Explainable AI (XAI) in Computer Vision
Explainable AI (XAI) is critical when deploying deep learning models. In botanical classification or medical diagnosis, knowing *why* a model made a decision is as important as the decision itself.

In this article, we cover how Grad-CAM maps focus segments on Vision Transformers (BEiT).`,
      JSON.stringify([]),
      "published"
    ]);

    await client.query("COMMIT");
    console.log("Database seeded successfully with resume details!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Database seeding failed:", err);
  } finally {
    client.release();
    await pool.end();
  }
};

seed();
