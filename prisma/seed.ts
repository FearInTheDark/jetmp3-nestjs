import { faker } from '@faker-js/faker';
import { argon2id, hash } from 'argon2';
import * as process from 'node:process';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

async function main() {
	console.log("Seeding Database...")
	await prisma.user.createMany({
		data: [
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: await hash(faker.internet.password(), {type: argon2id}),
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: await hash(faker.internet.password(), {type: argon2id}),
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: await hash(faker.internet.password(), {type: argon2id}),
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: await hash(faker.internet.password(), {type: argon2id}),
			}
		]
		
	})
	
	console.log("Seeding Database Completed")
}

main().catch(e => {
	console.error(e)
	process.exit(1)
}).finally(async () => {
	await prisma.$disconnect()
})