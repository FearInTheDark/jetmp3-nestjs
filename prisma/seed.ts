import { faker } from '@faker-js/faker';
import { argon2id, hash } from 'argon2';
import * as process from 'node:process';
import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Database...');
  
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async () => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(faker.internet.password(), { type: argon2id }),
    }))
  )
  
  const artists: Prisma.ArtistCreateInput[] = Array.from({length: 10}).map(() => ({
    name: faker.person.fullName(),
    artistId: faker.string.nanoid(20),
    uri: faker.internet.url(),
    popularity: faker.number.int({min: 1, max: 100}),
    images: {
      create: {
        url: faker.image.url(),
      }
    }
  }))
  await prisma.user.createMany({
    data: users,
  });
  
  await prisma.artist.createMany({data: artists})
  
  console.log('Seeding Database Completed');
}

main().catch(e => {
	console.error(e)
	process.exit(1)
}).finally(async () => {
	await prisma.$disconnect()
})