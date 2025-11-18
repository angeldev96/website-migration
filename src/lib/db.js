import postgres from 'postgres';

// Lightweight DB helper using postgres driver and simple SQL queries.
// Note: Webflow Edge may restrict direct TCP connections. If you deploy
// and get connection errors, consider using a Data Proxy or an edge-friendly
// proxy. This file provides simple helpers used by the app.

const connectionString = process.env.DATABASE_URL;

let sql;
try {
  sql = postgres(connectionString, { ssl: 'require' });
} catch (err) {
  // In environments without postgres support, keep a no-op client that throws
  sql = () => {
    throw new Error('Postgres client not initialized: ' + err.message);
  };
}

async function countAllJobs() {
  const res = await sql`SELECT COUNT(*)::int AS count FROM jobs_sheet`;
  return res[0]?.count ?? 0;
}

async function findJobsBasic({ skip = 0, take = 10 }) {
  const res = await sql`
    SELECT id, job_title, description, category, company, email_info, phone_number, job_date, gender_category, company_verified, ai_title, ai_description
    FROM jobs_sheet
    ORDER BY id DESC
    LIMIT ${take} OFFSET ${skip}
  `;

  // map column names to camelCase fields used in the app
  return res.map((r) => ({
    id: r.id,
    jobTitle: r.job_title,
    description: r.description,
    category: r.category,
    company: r.company,
    emailInfo: r.email_info,
    phoneNumber: r.phone_number,
    jobDate: r.job_date,
    genderCategory: r.gender_category,
    companyVerified: r.company_verified,
    aiTitle: r.ai_title,
    aiDescription: r.ai_description,
  }));
}

async function getJobById(id) {
  const res = await sql`
    SELECT * FROM jobs_sheet WHERE id = ${Number(id)} LIMIT 1
  `;
  if (!res || res.length === 0) return null;
  const r = res[0];
  return {
    id: r.id,
    jobTitle: r.job_title,
    description: r.description,
    category: r.category,
    company: r.company,
    emailInfo: r.email_info,
    phoneNumber: r.phone_number,
    jobDate: r.job_date,
    genderCategory: r.gender_category,
    companyVerified: r.company_verified,
    aiTitle: r.ai_title,
    aiDescription: r.ai_description,
    updatedAt: r.updated_at,
    carrierPhone: r.carrier_phone,
    // include other fields as needed
  };
}

async function getJobsCountWhere() {
  // Simple alias to countAllJobs for now
  return countAllJobs();
}

async function getDistinctCategories() {
  const res = await sql`
    SELECT category FROM jobs_sheet WHERE category IS NOT NULL GROUP BY category ORDER BY MIN(id) DESC
  `;
  return res.map(r => ({ category: r.category }));
}

async function getCategoriesWithCounts(limit = 100) {
  const res = await sql`
    SELECT category, COUNT(id)::int AS count
    FROM jobs_sheet
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY count DESC
    LIMIT ${limit}
  `;
  return res.map(r => ({ category: r.category, count: r.count }));
}

async function getJobsForSitemap() {
  const res = await sql`SELECT id, job_date FROM jobs_sheet ORDER BY job_date DESC NULLS LAST`;
  return res.map(r => ({ id: r.id, jobDate: r.job_date }));
}

async function countDistinctCompanies() {
  const res = await sql`SELECT COUNT(DISTINCT company)::int AS count FROM jobs_sheet WHERE company IS NOT NULL`;
  return res[0]?.count ?? 0;
}

async function countJobsSince(days) {
  const res = await sql`
    SELECT COUNT(*)::int AS count FROM jobs_sheet WHERE job_date >= (now() - INTERVAL '${String(days)} days')
  `;
  return res[0]?.count ?? 0;
}

export default {
  sql,
  countAllJobs,
  findJobsBasic,
  getJobById,
  getJobsCountWhere,
  getDistinctCategories,
  getCategoriesWithCounts,
  getJobsForSitemap,
  countDistinctCompanies,
  countJobsSince
};
