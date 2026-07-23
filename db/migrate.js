import pg from 'pg';
import dotenv from 'dotenv';

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

const migrate = async () => {
  const client = await pool.connect();
  try {
    console.log("Starting database migration...");
    await client.query("BEGIN");

    // 1. Create Certifications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        issuer TEXT NOT NULL,
        date TEXT NOT NULL,
        verification_url TEXT NOT NULL DEFAULT '',
        badge_image_url TEXT NOT NULL DEFAULT '',
        certificate_pdf_url TEXT NOT NULL DEFAULT '',
        badge_color TEXT NOT NULL DEFAULT '#EA4335',
        type TEXT NOT NULL DEFAULT 'cloud',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Table 'certifications' verified/created.");

    // 2. Create Skill Categories Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skill_categories (
        id SERIAL PRIMARY KEY,
        category TEXT NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Table 'skill_categories' verified/created.");

    // 3. Create Skills Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        category_id INTEGER REFERENCES skill_categories(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        level INTEGER NOT NULL DEFAULT 80,
        icon TEXT NOT NULL DEFAULT 'Code2',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Table 'skills' verified/created.");

    // 4. Create Publications Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS publications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        authors TEXT NOT NULL DEFAULT '',
        journal_or_conference TEXT NOT NULL DEFAULT '',
        date TEXT NOT NULL,
        verification_url TEXT NOT NULL DEFAULT '',
        pdf_url TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✓ Table 'publications' verified/created.");

    // 5. Seed Certifications if empty
    const certsCount = await client.query("SELECT COUNT(*) FROM certifications");
    if (parseInt(certsCount.rows[0].count) === 0) {
      const defaultCerts = [
        ["Associate Cloud Engineer", "Google Cloud", "Dec 2025", "https://credential.google.com", "", "", "#EA4335", "cloud"],
        ["Solutions Architect Associate", "Amazon Web Services (AWS)", "Oct 2025", "https://aws.amazon.com/verification", "", "", "#FF9900", "server"],
        ["ROS2 Robotics Developer", "Construct Sim", "Aug 2025", "https://verify.theconstructsim.com", "", "", "#38BDF8", "robot"],
        ["GDG Bangalore Contributor", "Google Developer Groups", "Active", "https://developers.google.com/community/gdg", "", "", "#10B981", "gdg"]
      ];
      for (const c of defaultCerts) {
        await client.query(`
          INSERT INTO certifications (title, issuer, date, verification_url, badge_image_url, certificate_pdf_url, badge_color, type)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, c);
      }
      console.log("✓ Seeded default certifications.");
    }

    // 6. Seed Skill Categories and Skills if empty
    const catsCount = await client.query("SELECT COUNT(*) FROM skill_categories");
    if (parseInt(catsCount.rows[0].count) === 0) {
      const defaultCats = [
        {
          category: "Frontend Architecture",
          description: "Building responsive, modern, and accessible client interfaces.",
          order: 0,
          items: [
            ["React / Next.js", 95, "Code2"],
            ["TypeScript", 90, "FileCode"],
            ["Tailwind CSS & Modern Design", 95, "Palette"],
            ["Framer Motion / GSAP", 88, "Sparkles"],
            ["Three.js / WebGL", 75, "Box"],
            ["Redux / Zustand", 92, "Layers"]
          ]
        },
        {
          category: "Backend & Systems",
          description: "Designing robust APIs, cloud infrastructure, and microservices.",
          order: 1,
          items: [
            ["Node.js & Express", 92, "Server"],
            ["Python / FastApi / Django", 88, "Terminal"],
            ["PostgreSQL & Prisma", 90, "Database"],
            ["GraphQL & REST APIs", 92, "Network"],
            ["Redis & Caching", 85, "Zap"],
            ["Docker & Kubernetes", 80, "Container"]
          ]
        },
        {
          category: "AI & Cloud Engineering",
          description: "Deploying machine learning models and scalable cloud pipelines.",
          order: 2,
          items: [
            ["OpenAI & Gemini API Integrations", 90, "Cpu"],
            ["LangChain & Vector Databases (Pinecone/pgvector)", 85, "Brain"],
            ["AWS (S3, Lambda, CloudFront)", 88, "Cloud"],
            ["Google Cloud Platform", 82, "CloudSun"],
            ["CI/CD & GitHub Actions", 90, "GitBranch"],
            ["System Security & Auth (OAuth / JWT)", 90, "ShieldCheck"]
          ]
        }
      ];

      for (const cat of defaultCats) {
        const catRes = await client.query(`
          INSERT INTO skill_categories (category, description, display_order)
          VALUES ($1, $2, $3) RETURNING id
        `, [cat.category, cat.description, cat.order]);
        
        const catId = catRes.rows[0].id;
        for (const item of cat.items) {
          await client.query(`
            INSERT INTO skills (category_id, name, level, icon)
            VALUES ($1, $2, $3, $4)
          `, [catId, item[0], item[1], item[2]]);
        }
      }
      console.log("✓ Seeded default skill categories and items.");
    }

    // 7. Seed Publications if empty
    const pubsCount = await client.query("SELECT COUNT(*) FROM publications");
    if (parseInt(pubsCount.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO publications (title, authors, journal_or_conference, date, verification_url, pdf_url)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        "Explainable AI-based Patent Search & Patentability Prediction",
        "Naveen S, et al.",
        "IEEE International Conference on Artificial Intelligence",
        "Nov 2025",
        "https://ieeexplore.ieee.org",
        ""
      ]);
      console.log("✓ Seeded default publication record.");
    }

    await client.query("COMMIT");
    console.log("Database migration finished successfully!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
};

migrate();
