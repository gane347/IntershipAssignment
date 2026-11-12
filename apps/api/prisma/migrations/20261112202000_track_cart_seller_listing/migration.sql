ALTER TABLE "cart_items" ADD COLUMN "seller_id" UUID;

UPDATE "cart_items" AS cart_item
SET "seller_id" = (
  SELECT game_seller."seller_id"
  FROM "game_sellers" AS game_seller
  WHERE game_seller."game_id" = cart_item."game_id"
  ORDER BY game_seller."price" ASC
  LIMIT 1
);

ALTER TABLE "cart_items" ALTER COLUMN "seller_id" SET NOT NULL;
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_pkey";
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("user_id", "game_id", "seller_id");
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_game_id_seller_id_fkey"
  FOREIGN KEY ("game_id", "seller_id") REFERENCES "game_sellers"("game_id", "seller_id") ON DELETE CASCADE ON UPDATE CASCADE;
