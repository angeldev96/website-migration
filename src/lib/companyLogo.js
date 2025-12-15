import prisma from '@/lib/prisma';

/**
 * Get company logo URL by company name
 * @param {string} companyName - The company name from job listing
 * @returns {Promise<string|null>} - The logo URL or null if not found
 */
export async function getCompanyLogo(companyName) {
  if (!companyName || typeof companyName !== 'string') {
    return null;
  }

  try {
    const company = await prisma.company.findUnique({
      where: { name: companyName.trim() },
      select: { logoUrl: true }
    });

    return company?.logoUrl || null;
  } catch (error) {
    console.error('Error fetching company logo:', error);
    return null;
  }
}

/**
 * Enrich jobs array with company logos
 * @param {Array} jobs - Array of job objects
 * @returns {Promise<Array>} - Jobs array with companyLogo field added
 */
export async function enrichJobsWithLogos(jobs) {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return jobs;
  }

  // Get unique company names
  const companyNames = [...new Set(
    jobs
      .map(job => job.company)
      .filter(name => name && typeof name === 'string')
      .map(name => name.trim())
  )];

  if (companyNames.length === 0) {
    return jobs.map(job => ({ ...job, companyLogo: null }));
  }

  try {
    // Fetch all company logos in one query
    const companies = await prisma.company.findMany({
      where: {
        name: {
          in: companyNames
        }
      },
      select: {
        name: true,
        logoUrl: true
      }
    });

    // Create a map for quick lookup
    const logoMap = new Map(
      companies.map(c => [c.name, c.logoUrl])
    );

    // Enrich jobs with logos
    return jobs.map(job => ({
      ...job,
      companyLogo: job.company ? logoMap.get(job.company.trim()) || null : null
    }));
  } catch (error) {
    console.error('Error enriching jobs with logos:', error);
    // Return jobs without logos on error
    return jobs.map(job => ({ ...job, companyLogo: null }));
  }
}
