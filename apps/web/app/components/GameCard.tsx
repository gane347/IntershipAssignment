"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { authenticatedApiFetch } from "@/lib/api/client";
import { addToGuestCart } from "@/lib/guest-cart";
import { getAccessToken } from "@/lib/auth";

export type GameCardGame = {
  id: string;
  name: string;
  lowestPrice: string | null;
  region: string;
  platform: string;
  sellers: { price: string; seller: { id: string; username: string } }[];
};

const Card = styled("article")({
  backgroundColor: "var(--background-dark)",
  border: "1px solid #63e3c2",
  color: "var(--text-subtle)",
  display: "flex",
  flex: "0 0 12rem",
  flexDirection: "column",
  height: "22rem",
  overflow: "hidden",
  position: "relative",
  "&:hover .game-card-details": {
    transform: "translateY(0)",
  },
  "&:hover .add-to-cart-button": {
    maxHeight: "3rem",
    opacity: 1,
    padding: "0.5rem",
    transform: "translateY(0)",
  },
});
const Artwork = styled("div")({
  background: "linear-gradient(135deg, #4618ac, #e10d66)",
  height: "100%",
});
const CardDetails = styled("div")({
  backgroundColor: "var(--background-dark)",
  bottom: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  left: 0,
  padding: "0.8rem",
  position: "absolute",
  right: 0,
  transform: "translateY(calc(100% - 6.5rem))",
  transition: "transform 250ms ease",
});
const Platform = styled("span")({
  color: "var(--foreground)",
  fontSize: "0.7rem",
  fontWeight: 700,
  left: 0,
  padding: "0.35rem 0.8rem",
  position: "absolute",
  textTransform: "uppercase",
  top: "-1.5rem",  
});
const GameLink = styled(Link)({
  color: "inherit",
  textDecoration: "none",
});
const GameName = styled("h2")({
  color: "var(--foreground)",
  fontSize: "0.9rem",
  lineHeight: 1.3,
  margin: 0,
});
const Meta = styled("span")({
  fontSize: "0.7rem",
  textTransform: "uppercase",
});
const Price = styled("strong")({
  color: "var(--foreground)",
  fontSize: "1.1rem",
});
const AddToCartButton = styled("button")({
  backgroundColor: "var(--accent)",
  border: 0,
  color: "#000",
  cursor: "pointer",
  fontWeight: 600,
  marginTop: "auto",
  maxHeight: 0,
  opacity: 0,
  overflow: "hidden",
  padding: 0,
  transform: "translateY(100%)",
  transition: "background-color 150ms ease, max-height 180ms ease, opacity 180ms ease, padding 180ms ease, transform 180ms ease",
  "&:hover": {
    backgroundColor: "var(--accent-dark)",
  },
});
const Status = styled("span")({
  fontSize: "0.7rem",
});

export default function GameCard({ game }: { game: GameCardGame }) {
  const [message, setMessage] = useState("");
  const cheapestSeller = game.sellers.reduce<GameCardGame["sellers"][number] | null>(
    (cheapest, seller) => !cheapest || Number(seller.price) < Number(cheapest.price) ? seller : cheapest,
    null,
  );

  async function addToCart(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (!cheapestSeller) {
      setMessage("No offers");
      return;
    }

    try {
      if (getAccessToken()) {
        await authenticatedApiFetch(`/cart/${game.id}`, {
          method: "POST",
          body: JSON.stringify({ sellerId: cheapestSeller.seller.id, quantity: 1 }),
        });
      } else {
        addToGuestCart(game.id, cheapestSeller.seller.id);
      }
      setMessage("Added to cart");
    } catch (requestError) {
      setMessage(requestError instanceof Error ? requestError.message : "Unable to add to cart");
    }
  }

  return (
    <Card>
      <Artwork />
      <CardDetails className="game-card-details">
        <Platform>{game.platform}</Platform>
        <GameLink href={`/games/${game.id}`}>
          <GameName>{game.name}</GameName>
        </GameLink>
        <Meta>{game.region}</Meta>
        <Price>{game.lowestPrice ? `€${game.lowestPrice}` : "No offers"}</Price>
        <AddToCartButton className="add-to-cart-button" onClick={(event) => void addToCart(event)} type="button">
          Add to cart
        </AddToCartButton>
        {message && <Status>{message}</Status>}
      </CardDetails>
    </Card>
  );
}
