const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('🔄 Exporting data from local database...');
    
    // Export all data
    const users = await prisma.user.findMany({
      include: {
        company: true,
        profile: true,
        documents: true,
        applications: {
          include: {
            job: {
              include: {
                company: true
              }
            }
          }
        }
      }
    });
    
    const jobs = await prisma.job.findMany({
      include: {
        company: true,
        applications: {
          include: {
            user: true
          }
        }
      }
    });
    
    const announcements = await prisma.announcement.findMany();
    const admins = await prisma.admin.findMany();
    
    const exportData = {
      users,
      jobs,
      announcements,
      admins,
      exportDate: new Date().toISOString()
    };
    
    // Write to file
    const fs = require('fs');
    fs.writeFileSync('data-export.json', JSON.stringify(exportData, null, 2));
    
    console.log('✅ Data exported successfully to data-export.json');
    console.log(`📊 Exported:`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${jobs.length} jobs`);
    console.log(`   - ${announcements.length} announcements`);
    console.log(`   - ${admins.length} admins`);
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
