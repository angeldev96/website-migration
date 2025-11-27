// Simple test script to verify Prisma connection
// Run with: node scripts/test-db.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    
    // Test 1: Count total jobs
    const totalJobs = await prisma.jobsSheet.count();
    
    // Test 2: Get first 3 jobs
    const jobs = await prisma.jobsSheet.findMany({
      take: 3,
      orderBy: {
        jobDate: 'desc'
      },
      select: {
        id: true,
        jobTitle: true,
        category: true,
        company: true,
        jobDate: true
      }
    });
    
    jobs.forEach((job, index) => {
 
    });
    
    // Test 3: Get categories
    const categories = await prisma.jobsSheet.groupBy({
      by: ['category'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5
    });
    
    categories.forEach((cat, index) => {
    });
    
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
