ALTER TABLE "game_sellers" ADD COLUMN "price" DECIMAL(10,2);

UPDATE "game_sellers" AS game_seller
SET "price" = game."price"
FROM "games" AS game
WHERE game."id" = game_seller."game_id";

ALTER TABLE "game_sellers" ALTER COLUMN "price" SET NOT NULL;
ALTER TABLE "games" DROP COLUMN "price";
