import bcrypt from "bcryptjs";
import { prisma } from "../src/core/db.js";

const users = {
  buyer: {
    id: "00000000-0000-4000-8000-000000000001",
    email: "alex.buyer@example.com",
    username: "alexbuyer",
    password: "BuyerPass123!",
    isSeller: false,
  },
  seller: {
    id: "00000000-0000-4000-8000-000000000002",
    email: "game.store@example.com",
    username: "gamestore",
    password: "SellerPass123!",
    isSeller: true,
  },
};

const games = [
  {
    id: "00000000-0000-4000-8000-000000000101",
    name: "The Witcher 3: Wild Hunt",
    price: "29.99",
    region: "Europe",
    platform: "PC",
  },
  {
    id: "00000000-0000-4000-8000-000000000102",
    name: "Forza Horizon 5",
    price: "39.99",
    region: "Worldwide",
    platform: "Xbox",
  },
  {
    id: "00000000-0000-4000-8000-000000000103",
    name: "Super Mario Bros. Wonder",
    price: "49.99",
    region: "Europe",
    platform: "Nintendo Switch",
  },
  {
    id: "00000000-0000-4000-8000-000000000104",
    name: "God of War Ragnarök",
    price: "44.99",
    region: "Europe",
    platform: "PS5",
  },
];

async function seed() {
  const buyerPasswordHash = await bcrypt.hash(users.buyer.password, 12);
  const sellerPasswordHash = await bcrypt.hash(users.seller.password, 12);

  await prisma.user.upsert({
    where: { id: users.buyer.id },
    update: {
      email: users.buyer.email,
      username: users.buyer.username,
      passwordHash: buyerPasswordHash,
      isSeller: users.buyer.isSeller,
    },
    create: {
      id: users.buyer.id,
      email: users.buyer.email,
      username: users.buyer.username,
      passwordHash: buyerPasswordHash,
      isSeller: users.buyer.isSeller,
    },
  });

  await prisma.user.upsert({
    where: { id: users.seller.id },
    update: {
      email: users.seller.email,
      username: users.seller.username,
      passwordHash: sellerPasswordHash,
      isSeller: users.seller.isSeller,
    },
    create: {
      id: users.seller.id,
      email: users.seller.email,
      username: users.seller.username,
      passwordHash: sellerPasswordHash,
      isSeller: users.seller.isSeller,
    },
  });

  for (const game of games) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: game,
      create: game,
    });
    await prisma.gameSeller.upsert({
      where: { gameId_sellerId: { gameId: game.id, sellerId: users.seller.id } },
      update: {},
      create: { gameId: game.id, sellerId: users.seller.id },
    });
  }

  await prisma.wishlistItem.upsert({
    where: { userId_gameId: { userId: users.buyer.id, gameId: games[2].id } },
    update: {},
    create: { userId: users.buyer.id, gameId: games[2].id },
  });

  await prisma.cartItem.upsert({
    where: { userId_gameId: { userId: users.buyer.id, gameId: games[0].id } },
    update: { quantity: 1 },
    create: { userId: users.buyer.id, gameId: games[0].id, quantity: 1 },
  });

  console.log(`Seeded ${Object.keys(users).length} users and ${games.length} games.`);
}

seed()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
