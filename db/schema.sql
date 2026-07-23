-- Database Schema for Portfolio & Digital Headquarters

-- Drop tables if they exist (for migration ease)
DROP TABLE IF EXISTS site_settings;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS journey;
DROP TABLE IF EXISTS blog;
DROP TABLE IF EXISTS resume;

-- Site Settings Table (stores general site configs)
CREATE TABLE site_settings (
    id SERIAL PRIMARY KEY,
    hero_heading TEXT NOT NULL,
    hero_description TEXT NOT NULL,
    current_focus JSONB NOT NULL DEFAULT '[]', -- List of tags e.g. ["PatentEase", "AI Agents"]
    profile_picture_url TEXT NOT NULL DEFAULT '',
    about_text TEXT NOT NULL,
    quick_facts JSONB NOT NULL DEFAULT '[]', -- e.g. ["Final Year CS Student", "Bangalore"]
    social_links JSONB NOT NULL DEFAULT '{}', -- e.g. {"github": "...", "linkedin": "..."}
    location TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    footer_text TEXT NOT NULL DEFAULT '',
    seo_title TEXT NOT NULL DEFAULT '',
    seo_description TEXT NOT NULL DEFAULT '',
    accent_color TEXT NOT NULL DEFAULT '#EAB308', -- Accent hex (default: gold)
    favicon_url TEXT NOT NULL DEFAULT '',
    google_client_id TEXT NOT NULL DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table (stores project details & case studies)
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT NOT NULL,
    long_description TEXT NOT NULL, -- Detailed markdown description / case study
    cover_image TEXT NOT NULL,
    gallery JSONB NOT NULL DEFAULT '[]', -- List of photo URLs
    tech_stack JSONB NOT NULL DEFAULT '[]', -- e.g. ["React", "Express", "PostgreSQL"]
    github_url TEXT NOT NULL DEFAULT '',
    demo_url TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'completed', -- 'active' | 'completed' | 'archived'
    tags JSONB NOT NULL DEFAULT '[]', -- Filter tags
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Journey Milestones Table (stores milestones for the growth timeline)
CREATE TABLE journey (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    date TEXT NOT NULL, -- e.g. "Sept 2025" or "2026 - Present"
    description TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. "Work", "Academics", "Hackathon"
    lessons_learned TEXT NOT NULL DEFAULT '', -- Markdown list of lessons
    technologies_used JSONB NOT NULL DEFAULT '[]', -- Array of tags used
    location TEXT NOT NULL DEFAULT '',
    thumbnail TEXT NOT NULL DEFAULT '',
    gallery JSONB NOT NULL DEFAULT '[]', -- Images related to milestone
    timeline_order INTEGER NOT NULL DEFAULT 0, -- Higher or lower first
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table (stores articles and reviews)
CREATE TABLE blog (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_image TEXT NOT NULL,
    reading_time TEXT NOT NULL DEFAULT '3 min read',
    tags JSONB NOT NULL DEFAULT '[]',
    category TEXT NOT NULL, -- 'Engineering' | 'AI' | 'Cycling' | 'Movies' | 'Anime' | 'Life' | 'Projects'
    markdown_content TEXT NOT NULL,
    gallery JSONB NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' | 'published'
    journey_id INTEGER REFERENCES journey(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resume Table
CREATE TABLE resume (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
