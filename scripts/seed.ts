import { TherapistGender } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/utils/logger";

const PASSWORD_HASH = "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36iHgNsZM3Rp3XIanFkFJ4C"; // "password"

const cityCatalog = [
  { name: "București", county: "București", lat: 44.4268, lng: 26.1025 },
  { name: "Cluj-Napoca", county: "Cluj", lat: 46.7712, lng: 23.6236 },
  { name: "Iași", county: "Iași", lat: 47.1585, lng: 27.6014 }
];

function futureDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function pastDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

async function resetData() {
  await prisma.$transaction([
    prisma.auditLog.deleteMany(),
    prisma.message.deleteMany(),
    prisma.checkIn.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.booking.deleteMany(),
    prisma.availability.deleteMany(),
    prisma.document.deleteMany(),
    prisma.product.deleteMany(),
    prisma.address.deleteMany(),
    prisma.therapist.deleteMany(),
    prisma.patient.deleteMany(),
    prisma.user.deleteMany()
  ]);
}

async function seedProducts() {
  const products = [] as { id: string; price: number; currency: string }[];
  for (const city of cityCatalog) {
    const product = await prisma.product.create({
      data: {
        name: `Physiotherapy session · ${city.name}`,
        description: `Home visit physiotherapy session in ${city.name}`,
        price: 25000,
        currency: "RON",
        vatRate: 19
      }
    });
    products.push({ id: product.id, price: product.price, currency: product.currency });
  }
  return products;
}

async function seedAdmin() {
  await prisma.user.create({
    data: {
      email: "admin@example.com",
      passwordHash: PASSWORD_HASH,
      role: "ADMIN"
    }
  });
}

async function seedTherapists() {
  const genders: TherapistGender[] = ["M", "M", "M", "M", "M", "F", "F", "F", "F", "F"];
  const therapists = [] as { id: string; userId: string }[];
  for (let index = 0; index < genders.length; index += 1) {
    const therapistUser = await prisma.user.create({
      data: {
        email: `therapist${index}@example.com`,
        passwordHash: PASSWORD_HASH,
        role: "THERAPIST",
        therapist: {
          create: {
            gender: genders[index],
            bio: "Licensed physiotherapist with home-visit experience.",
            kycStatus: "Approved",
            availability: {
              create: [
                { dayOfWeek: 1, startTime: "08:00", endTime: "14:00" },
                { dayOfWeek: 3, startTime: "12:00", endTime: "18:00" }
              ]
            }
          }
        }
      },
      include: { therapist: true }
    });
    therapists.push({ id: therapistUser.therapist!.id, userId: therapistUser.id });
  }
  return therapists;
}

async function seedPatients() {
  const patients = [] as {
    id: string;
    addressId: string;
    userId: string;
  }[];

  for (let index = 0; index < 15; index += 1) {
    const city = cityCatalog[index % cityCatalog.length];
    const patientUser = await prisma.user.create({
      data: {
        email: `patient${index}@example.com`,
        passwordHash: PASSWORD_HASH,
        role: "PATIENT",
        patient: {
          create: {
            qualification: {
              concerns: index % 2 === 0 ? "Post-surgery" : "Chronic pain",
              mobility: index % 3 === 0 ? "assisted" : "independent"
            },
            addresses: {
              create: {
                label: "Home",
                line1: `Strada Exemplu ${index + 10}`,
                city: city.name,
                county: city.county,
                postalCode: "010000",
                lat: city.lat + index * 0.01,
                lng: city.lng + index * 0.01
              }
            }
          }
        }
      },
      include: { patient: { include: { addresses: true } } }
    });
    const patient = patientUser.patient!;
    patients.push({ id: patient.id, addressId: patient.addresses[0].id, userId: patientUser.id });
  }

  return patients;
}

async function seedBookings(
  patients: { id: string; addressId: string }[],
  therapists: { id: string; userId: string }[],
  products: { id: string; price: number; currency: string }[]
) {
  const upcomingStatuses = [
    "Pending",
    "Pending",
    "Assigned",
    "Assigned",
    "EnRoute",
    "InProgress",
    "Pending",
    "Assigned",
    "EnRoute",
    "Pending"
  ] as const;

  const upcoming = [] as string[];

  for (let index = 0; index < 10; index += 1) {
    const patient = patients[index % patients.length];
    const therapist = therapists[index % therapists.length];
    const needsTherapist = upcomingStatuses[index] !== "Pending";
    const booking = await prisma.booking.create({
      data: {
        patientId: patient.id,
        therapistId: needsTherapist ? therapist.id : null,
        addressId: patient.addressId,
        status: upcomingStatuses[index],
        therapistGenderPreference: index % 3 === 0 ? "Any" : index % 3 === 1 ? "Female" : "Male",
        scheduledStart: futureDate(index + 1),
        scheduledEnd: futureDate(index + 1),
        notes: index % 2 === 0 ? "Initial evaluation" : "Follow-up session"
      }
    });
    upcoming.push(booking.id);
  }

  for (let index = 0; index < 5; index += 1) {
    const patient = patients[index];
    const therapist = therapists[index];
    const product = products[index % products.length];
    const booking = await prisma.booking.create({
      data: {
        patientId: patient.id,
        therapistId: therapist.id,
        addressId: patient.addressId,
        status: "Completed",
        therapistGenderPreference: "Any",
        scheduledStart: pastDate(index + 2),
        scheduledEnd: pastDate(index + 2),
        notes: "Completed session with discharge exercises",
        payment: {
          create: {
            amount: product.price,
            currency: product.currency,
            status: "succeeded",
            metadata: { invoiceNumber: `INV-${index + 1001}` }
          }
        },
        checkIns: {
          create: {
            method: "PatientApp",
            confirmedBy: "Patient",
            lat: cityCatalog[index % cityCatalog.length].lat,
            lng: cityCatalog[index % cityCatalog.length].lng
          }
        }
      }
    });

    await prisma.order.create({
      data: {
        patientId: patient.id,
        total: product.price,
        currency: product.currency,
        status: "Paid",
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            price: product.price
          }
        }
      }
    });

    await prisma.document.create({
      data: {
        type: "Invoice",
        url: `https://minio.local/invoices/${booking.id}.pdf`,
        bucketKey: `invoices/${booking.id}.pdf.enc`,
        patientId: patient.id,
        extractedText: `Invoice for booking ${booking.id}`
      }
    });
  }

  logger.info("Seeded bookings", { upcoming: upcoming.length, past: 5 });
}

export async function main() {
  logger.info("Seeding database...");
  await resetData();
  const products = await seedProducts();
  await seedAdmin();
  const therapists = await seedTherapists();
  const patients = await seedPatients();
  await seedBookings(patients, therapists, products);
  logger.info("Seed completed");
}

main().catch((error) => {
  logger.error("Seed failed", { error: (error as Error).message });
  process.exit(1);
});

export { main as seed };
