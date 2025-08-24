import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

enum Role {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

const hashedPassword = '$2b$12$zMByhnz4cH0bELzdU6PVL.mzgCv.nObrIuek5u6ZG2xAy56jHyTUe'; //password

async function main() {
  console.log('🌱 Seeding database...');

  // Create hospitals
  const hospitals = await Promise.all([
    prisma.hospital.create({
      data: {
        name: 'General Hospital',
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'City Medical Center',
      },
    }),
    prisma.hospital.create({
      data: {
        name: 'Regional Healthcare',
      },
    }),
  ]);

  console.log('✅ Created hospitals');

  // Create users for each hospital
  const users = await Promise.all([
    // General Hospital users
    prisma.user.create({
      data: {
        hospitalId: hospitals[0].id,
        email: 'admin@general.com',
        passwordHash: hashedPassword,
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        hospitalId: hospitals[0].id,
        email: 'staff1@general.com',
        passwordHash: hashedPassword,
        role: Role.STAFF,
      },
    }),
    // City Medical Center users
    prisma.user.create({
      data: {
        hospitalId: hospitals[1].id,
        email: 'admin@citymedical.com',
        passwordHash: hashedPassword,
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        hospitalId: hospitals[1].id,
        email: 'staff1@citymedical.com',
        passwordHash: hashedPassword,
        role: Role.STAFF,
      },
    }),
    // Regional Healthcare users
    prisma.user.create({
      data: {
        hospitalId: hospitals[2].id,
        email: 'admin@regional.com',
        passwordHash: hashedPassword,
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        hospitalId: hospitals[2].id,
        email: 'staff1@regional.com',
        passwordHash: hashedPassword,
        role: Role.STAFF,
      },
    }),
  ]);

  console.log('✅ Created users');

  // Create patients for each hospital
  const patients = await Promise.all([
    // General Hospital patients
    prisma.patient.create({
      data: {
        hospitalId: hospitals[0].id,
        fullName: 'John Smith',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'Male',
        mobile: '+1234567890',
      },
    }),
    prisma.patient.create({
      data: {
        hospitalId: hospitals[0].id,
        fullName: 'Sarah Johnson',
        dateOfBirth: new Date('1990-07-22'),
        gender: 'Female',
        mobile: '+1234567891',
      },
    }),
    prisma.patient.create({
      data: {
        hospitalId: hospitals[0].id,
        fullName: 'Michael Brown',
        dateOfBirth: new Date('1978-12-08'),
        gender: 'Male',
        mobile: '+1234567892',
      },
    }),
    // City Medical Center patients
    prisma.patient.create({
      data: {
        hospitalId: hospitals[1].id,
        fullName: 'Emily Davis',
        dateOfBirth: new Date('1988-05-14'),
        gender: 'Female',
        mobile: '+1234567893',
      },
    }),
    prisma.patient.create({
      data: {
        hospitalId: hospitals[1].id,
        fullName: 'Robert Wilson',
        dateOfBirth: new Date('1975-09-30'),
        gender: 'Male',
        mobile: '+1234567894',
      },
    }),
    prisma.patient.create({
      data: {
        hospitalId: hospitals[1].id,
        fullName: 'Lisa Anderson',
        dateOfBirth: new Date('1992-11-18'),
        gender: 'Female',
        mobile: '+1234567895',
      },
    }),
    // Regional Healthcare patients
    prisma.patient.create({
      data: {
        hospitalId: hospitals[2].id,
        fullName: 'David Miller',
        dateOfBirth: new Date('1980-02-25'),
        gender: 'Male',
        mobile: '+1234567896',
      },
    }),
    prisma.patient.create({
      data: {
        hospitalId: hospitals[2].id,
        fullName: 'Jennifer Taylor',
        dateOfBirth: new Date('1987-08-12'),
        gender: 'Female',
        mobile: '+1234567897',
      },
    }),
    prisma.patient.create({
      data: {
        hospitalId: hospitals[2].id,
        fullName: 'Christopher Garcia',
        dateOfBirth: new Date('1983-04-07'),
        gender: 'Male',
        mobile: '+1234567898',
      },
    }),
  ]);

  console.log('✅ Created patients');

  console.log('🎉 Seeding completed successfully!');
  console.log(`Created ${hospitals.length} hospitals, ${users.length} users, and ${patients.length} patients`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
