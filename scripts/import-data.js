const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('🔄 Importing data to Aiven database...');
    
    // Read exported data
    const exportData = JSON.parse(fs.readFileSync('data-export.json', 'utf8'));
    
    console.log(`📊 Found data to import:`);
    console.log(`   - ${exportData.users.length} users`);
    console.log(`   - ${exportData.jobs.length} jobs`);
    console.log(`   - ${exportData.announcements.length} announcements`);
    console.log(`   - ${exportData.admins.length} admins`);
    
    // Clear existing data (in correct order due to foreign keys)
    console.log('🧹 Clearing existing data...');
    await prisma.application.deleteMany();
    await prisma.employeeDocument.deleteMany();
    await prisma.employeeProfile.deleteMany();
    await prisma.job.deleteMany();
    await prisma.company.deleteMany();
    await prisma.user.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.admin.deleteMany();
    
    // Import data in correct order
    console.log('📥 Importing admins...');
    for (const admin of exportData.admins) {
      await prisma.admin.create({
        data: {
          email: admin.email,
          password: admin.password,
          created_at: new Date(admin.created_at)
        }
      });
    }
    
    console.log('📥 Importing users...');
    for (const user of exportData.users) {
      await prisma.user.create({
        data: {
          id: user.id,
          full_name: user.full_name,
          national_id: user.national_id,
          email: user.email,
          role: user.role,
          password: user.password,
          created_at: new Date(user.created_at)
        }
      });
    }
    
    console.log('📥 Importing companies...');
    for (const user of exportData.users) {
      if (user.company) {
        await prisma.company.create({
          data: {
            id: user.company.id,
            name: user.company.name,
            description: user.company.description,
            website: user.company.website,
            owner_id: user.company.owner_id,
            created_at: new Date(user.company.created_at),
            updated_at: new Date(user.company.updated_at)
          }
        });
      }
    }
    
    console.log('📥 Importing jobs...');
    for (const job of exportData.jobs) {
      await prisma.job.create({
        data: {
          id: job.id,
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          location: job.location,
          salary: job.salary,
          type: job.type,
          deadline: job.deadline ? new Date(job.deadline) : null,
          company_id: job.company_id,
          created_at: new Date(job.created_at),
          updated_at: new Date(job.updated_at)
        }
      });
    }
    
    console.log('📥 Importing employee profiles...');
    for (const user of exportData.users) {
      if (user.profile) {
        await prisma.employeeProfile.create({
          data: {
            id: user.profile.id,
            user_id: user.profile.user_id,
            phone: user.profile.phone,
            location: user.profile.location,
            education: user.profile.education,
            skills: user.profile.skills,
            experience: user.profile.experience,
            updated_at: new Date(user.profile.updated_at)
          }
        });
      }
    }
    
    console.log('📥 Importing employee documents...');
    for (const user of exportData.users) {
      for (const doc of user.documents) {
        await prisma.employeeDocument.create({
          data: {
            id: doc.id,
            user_id: doc.user_id,
            file_name: doc.file_name,
            file_path: doc.file_path,
            file_type: doc.file_type,
            uploaded_at: new Date(doc.uploaded_at)
          }
        });
      }
    }
    
    console.log('📥 Importing applications...');
    for (const user of exportData.users) {
      for (const app of user.applications) {
        await prisma.application.create({
          data: {
            id: app.id,
            user_id: app.user_id,
            job_id: app.job_id,
            status: app.status,
            cover_letter: app.cover_letter,
            applied_at: new Date(app.applied_at)
          }
        });
      }
    }
    
    console.log('📥 Importing announcements...');
    for (const announcement of exportData.announcements) {
      await prisma.announcement.create({
        data: {
          id: announcement.id,
          title: announcement.title,
          content: announcement.content,
          expiration_date: announcement.expiration_date ? new Date(announcement.expiration_date) : null,
          created_at: new Date(announcement.created_at)
        }
      });
    }
    
    console.log('✅ Data imported successfully!');
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importData();
