// Simple test script to verify Prisma connection
// Run with: node scripts/test-db.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Test 1: Count total jobs
    const totalJobs = await prisma.jobsSheet.count();
    console.log(`✅ Total jobs in database: ${totalJobs}`);
    
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
    
    console.log('\n📋 Sample jobs:');
    jobs.forEach((job, index) => {
      console.log(`\n${index + 1}. ${job.jobTitle}`);
      console.log(`   Company: ${job.company || 'N/A'}`);
      console.log(`   Category: ${job.category}`);
      console.log(`   Date: ${job.jobDate?.toLocaleDateString() || 'N/A'}`);
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
    
    console.log('\n🏷️  Top 5 categories:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.category}: ${cat._count.id} jobs`);
    });
    
    console.log('\n✅ Database connection successful!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
