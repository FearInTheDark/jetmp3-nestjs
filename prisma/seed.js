"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = require("@faker-js/faker");
const argon2_1 = require("argon2");
const process = require("node:process");
const prisma_1 = require("../generated/prisma/index.js");
const prisma = new prisma_1.PrismaClient();
async function main() {
    console.log("Seeding Database...");
    await prisma.user.createMany({
        data: [
            {
                name: faker_1.faker.person.fullName(),
                email: faker_1.faker.internet.email(),
                password: await (0, argon2_1.hash)(faker_1.faker.internet.password(), { type: argon2_1.argon2id }),
            },
            {
                name: faker_1.faker.person.fullName(),
                email: faker_1.faker.internet.email(),
                password: await (0, argon2_1.hash)(faker_1.faker.internet.password(), { type: argon2_1.argon2id }),
            },
            {
                name: faker_1.faker.person.fullName(),
                email: faker_1.faker.internet.email(),
                password: await (0, argon2_1.hash)(faker_1.faker.internet.password(), { type: argon2_1.argon2id }),
            },
            {
                name: faker_1.faker.person.fullName(),
                email: faker_1.faker.internet.email(),
                password: await (0, argon2_1.hash)(faker_1.faker.internet.password(), { type: argon2_1.argon2id }),
            }
        ]
    });
    console.log("Seeding Database Completed");
}
main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map