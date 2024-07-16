import { PrismaClient } from '@prisma/client';
import { Auction, Prisma } from '@prisma/client';
import { createUserByEmailAndPassword } from '../src/api/users/user.services';
import { createAuction } from '../src/api/auction/auction.services';

const prisma = new PrismaClient();

const adminData = {
  email: 'admin@test.com',
  password: '1234',
};

const usersData = [
  {
    email: 'user1@test.com',
    password: 'user1',
  },
];

const auctionsData = [
  {
    title: 'Car',
    description:
      'A car is a vehicle that has wheels, carries a small number of passengers, and is moved by an engine or a motor. Cars are also called automobiles or motor vehicles. Trucks and buses are motor vehicles as well. However, trucks and buses are larger than cars, and they carry heavier loads.',
    startingPrice: '32000',
    endTime: new Date('2025-05-25'),
  },
  {
    title: 'Table',
    description:
      'A table is an item of furniture with a raised flat top and is supported most commonly by 1 to 4 legs (although some can have more). It is used as a surface for working at, eating from or on which to place things.',
    startingPrice: 55,
    endTime: new Date('2025-02-12'),
  },
  {
    title: 'Phone',
    description:
      'a device that uses either a system of wires along which electrical signals are sent or a system of radio signals to make it possible for you to speak to someone in another place who has a similar device: Just then, his phone rang.',
    startingPrice: 1500,
    endTime: new Date('2025-12-30'),
  },
  {
    title: 'Watch',
    description:
      "A watch is a portable timepiece intended to be carried or worn by a person. It is designed to keep a consistent movement despite the motions caused by the person's activities",
    startingPrice: 3200,
    endTime: new Date('2025-03-15'),
  },
];

const main = async () => {
  console.log('start seeding …');
  const admin = await createUserByEmailAndPassword(adminData);
  console.log(`Created admin with id: ${admin.id}`);

  for (const _user of usersData) {
    const user = await createUserByEmailAndPassword(_user);
    console.log(`Created user with id: ${user.id}`);
  }

  for (const _auction of auctionsData) {
    const auction = await createAuction(admin.id, _auction);
    console.log(`Auction user with id: ${auction.id}, for user id: ${admin.id}`);
  }

  console.log('seeding done');
};

main()
  .catch((e) => {
    console.error('foo', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
