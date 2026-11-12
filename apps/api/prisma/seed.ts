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
  sellerTwo: {
    id: "00000000-0000-4000-8000-000000000003",
    email: "pixel.market@example.com",
    username: "pixelmarket",
    password: "SellerPass123!",
    isSeller: true,
  },
  sellerThree: {
    id: "00000000-0000-4000-8000-000000000004",
    email: "digital.games@example.com",
    username: "digitalgames",
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
  {
    id: "00000000-0000-4000-8000-000000000105",
    name: "Baldur's Gate 3",
    price: "54.99",
    region: "Worldwide",
    platform: "PC",
  },
  {
    id: "00000000-0000-4000-8000-000000000106",
    name: "Elden Ring",
    price: "49.99",
    region: "Europe",
    platform: "PS5",
  },
  {
    id: "00000000-0000-4000-8000-000000000107",
    name: "Hades",
    price: "24.99",
    region: "Worldwide",
    platform: "Nintendo Switch",
  },
  {
    id: "00000000-0000-4000-8000-000000000108",
    name: "Cyberpunk 2077",
    price: "34.99",
    region: "Europe",
    platform: "Xbox",
  },
  {
    id: "00000000-0000-4000-8000-000000000109",
    name: "Hogwarts Legacy",
    price: "39.99",
    region: "Worldwide",
    platform: "PC",
  },
  {
    id: "00000000-0000-4000-8000-000000000110",
    name: "Starfield",
    price: "44.99",
    region: "Europe",
    platform: "Xbox",
  },
  {
    id: "00000000-0000-4000-8000-000000000111",
    name: "Resident Evil 4",
    price: "42.99",
    region: "Worldwide",
    platform: "PS5",
  },
  {
    id: "00000000-0000-4000-8000-000000000112",
    name: "Animal Crossing: New Horizons",
    price: "39.99",
    region: "Europe",
    platform: "Nintendo Switch",
  },
  {
    id: "00000000-0000-4000-8000-000000000113",
    name: "Stardew Valley",
    price: "13.99",
    region: "Worldwide",
    platform: "PC",
  },
  {
    id: "00000000-0000-4000-8000-000000000114",
    name: "Final Fantasy VII Rebirth",
    price: "59.99",
    region: "Europe",
    platform: "PS5",
  },
  {
    id: "00000000-0000-4000-8000-000000000115",
    name: "Halo Infinite",
    price: "29.99",
    region: "Worldwide",
    platform: "Xbox",
  },
  {
    id: "00000000-0000-4000-8000-000000000116",
    name: "It Takes Two",
    price: "19.99",
    region: "Europe",
    platform: "PC",
  },
  {
    id: "00000000-0000-4000-8000-000000000117",
    name: "Metroid Dread",
    price: "44.99",
    region: "Worldwide",
    platform: "Nintendo Switch",
  },
  {
    id: "00000000-0000-4000-8000-000000000118",
    name: "Spider-Man 2",
    price: "49.99",
    region: "Europe",
    platform: "PS5",
  },
  {
    id: "00000000-0000-4000-8000-000000000119",
    name: "Sea of Thieves",
    price: "27.99",
    region: "Worldwide",
    platform: "Xbox",
  },
  {
    id: "00000000-0000-4000-8000-000000000120",
    name: "Disco Elysium",
    price: "17.99",
    region: "Europe",
    platform: "PC",
  },
  {
    id: "00000000-0000-4000-8000-000000000121",
    name: "Pokémon Legends: Arceus",
    price: "39.99",
    region: "Worldwide",
    platform: "Nintendo Switch",
  },
  {
    id: "00000000-0000-4000-8000-000000000122",
    name: "The Last of Us Part I",
    price: "44.99",
    region: "Europe",
    platform: "PS5",
  },
  {
    id: "00000000-0000-4000-8000-000000000123",
    name: "Doom Eternal",
    price: "22.99",
    region: "Worldwide",
    platform: "Xbox",
  },
  {
    id: "00000000-0000-4000-8000-000000000124",
    name: "Terraria",
    price: "9.99",
    region: "Europe",
    platform: "PC",
  },
];

const sellers = [users.seller, users.sellerTwo, users.sellerThree];

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

  for (const seller of [users.sellerTwo, users.sellerThree]) {
    const passwordHash = await bcrypt.hash(seller.password, 12);
    await prisma.user.upsert({
      where: { id: seller.id },
      update: {
        email: seller.email,
        username: seller.username,
        passwordHash,
        isSeller: seller.isSeller,
      },
      create: {
        id: seller.id,
        email: seller.email,
        username: seller.username,
        passwordHash,
        isSeller: seller.isSeller,
      },
    });
  }

  for (const game of games) {
    await prisma.game.upsert({
      where: { id: game.id },
      update: {
        name: game.name,
        region: game.region,
        platform: game.platform,
      },
      create: {
        id: game.id,
        name: game.name,
        region: game.region,
        platform: game.platform,
      },
    });
    for (const [sellerIndex, seller] of sellers.entries()) {
      const listingPrice = (Number(game.price) + sellerIndex * 1.75).toFixed(2);
      await prisma.gameSeller.upsert({
        where: { gameId_sellerId: { gameId: game.id, sellerId: seller.id } },
        update: { price: listingPrice },
        create: { gameId: game.id, sellerId: seller.id, price: listingPrice },
      });
    }
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

  const listingCounts = await prisma.gameSeller.groupBy({
    by: ["gameId"],
    where: { gameId: { in: games.map((game) => game.id) } },
    _count: { gameId: true },
  });
  if (listingCounts.some((listing) => listing._count.gameId < sellers.length)) {
    throw new Error("Every seeded game must have at least three sellers");
  }
  console.log(
    `Seeded ${Object.keys(users).length} users, ${games.length} games, and ${listingCounts.length * sellers.length} seller listings.`,
  );
}

seed()
  .catch((error) => {
    console.error("Database seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
