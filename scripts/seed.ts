import { prisma } from "../lib/prisma";

async function main() {
  console.info("Seeding database...");
  const passwordHash = "$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36iHgNsZM3Rp3XIanFkFJ4C"; // password

  const cities = [
    { name: "București", county: "București" },
    { name: "Cluj-Napoca", county: "Cluj" },
    { name: "Iași", county: "Iași" }
  ];

  for (const city of cities) {
    await prisma.product.upsert({
      where: { name: `Session ${city.name}` },
      update: {},
      create: {
        name: `Session ${city.name}`,
        description: `Home visit session in ${city.name}`,
        price: 25000,
        currency: "RON",
        vatRate: 19
      }
    });
  }

  const therapists = await Promise.all(
    Array.from({ length: 10 }).map((_, index) =>
      prisma.user.upsert({
        where: { email: `therapist${index}@example.com` },
        update: {},
        create: {
          email: `therapist${index}@example.com`,
          passwordHash,
          role: "THERAPIST",
          therapist: {
            create: {
              gender: index % 2 === 0 ? "M" : "F",
              kycStatus: "Approved"
            }
          }
        },
        include: { therapist: true }
      })
    )
  );

  const patients = await Promise.all(
    Array.from({ length: 15 }).map((_, index) =>
      prisma.user.upsert({
        where: { email: `patient${index}@example.com` },
        update: {},
        create: {
          email: `patient${index}@example.com`,
          passwordHash,
          role: "PATIENT",
          patient: {
            create: {
              qualification: { goals: "Post-surgery" },
              addresses: {
                create: {
                  label: "Acasă",
                  line1: `Strada Exemplu ${index}`,
                  city: cities[index % cities.length].name,
                  county: cities[index % cities.length].county,
                  lat: 44.43 + index * 0.01,
                  lng: 26.10 + index * 0.01
                }
              }
            }
          }
        },
        include: { patient: { include: { addresses: true } } }
      })
    )
  );

  const futureDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
  };

  const bookings = await Promise.all(
    Array.from({ length: 10 }).map((_, index) =>
      prisma.booking.create({
        data: {
          patientId: patients[index % patients.length].patient!.id,
          therapistId: therapists[index % therapists.length].therapist!.id,
          addressId: patients[index % patients.length].patient!.addresses[0].id,
          status: index % 3 === 0 ? "Assigned" : "Pending",
          therapistGenderPreference: "Any",
          scheduledStart: futureDate(index + 1),
          scheduledEnd: futureDate(index + 1),
          notes: "Seed booking"
        }
      })
    )
  );

  await Promise.all(
    Array.from({ length: 5 }).map((_, index) =>
      prisma.booking.create({
        data: {
          patientId: patients[index].patient!.id,
          therapistId: therapists[index].therapist!.id,
          addressId: patients[index].patient!.addresses[0].id,
          status: "Completed",
          therapistGenderPreference: "Any",
          scheduledStart: futureDate(-(index + 2)),
          scheduledEnd: futureDate(-(index + 2)),
          notes: "Completed booking",
          payment: {
            create: {
              amount: 25000,
              currency: "RON",
              status: "succeeded"
            }
          }
        }
      })
    )
  );

  for (const booking of bookings.slice(0, 5)) {
    const product = await prisma.product.findFirst({ where: { name: { contains: "Session" } } });
    if (!product) continue;
    await prisma.order.create({
      data: {
        patientId: booking.patientId,
        total: 25000,
        currency: "RON",
        status: "Paid",
        items: {
          create: {
            productId: product.id,
            quantity: 1,
            price: 25000
          }
        }
      }
    });
  }

  console.info("Seed completed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
