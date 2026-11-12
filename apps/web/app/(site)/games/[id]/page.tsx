"use client";

import { useEffect, useState } from "react";
import { Suspense } from "react";
import { useParams } from "next/navigation";
import { styled } from "@mui/material/styles";
import { apiFetch, authenticatedApiFetch } from "@/lib/api/client";
import { addToGuestCart } from "@/lib/guest-cart";
import { getAccessToken } from "@/lib/auth";

type SellerOffer = {
  price: string;
  seller: { id: string; username: string };
};

type Game = {
  id: string;
  name: string;
  region: string;
  platform: string;
  lowestPrice: string | null;
  sellers: SellerOffer[];
};

const Page = styled("main")({
  minHeight: "100%",
  padding: "3.5rem 1.25rem 5rem",
});
const Content = styled("div")({ margin: "0 auto", maxWidth: "80rem" });
const Hero = styled("section")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(4),
  [theme.breakpoints.up("md")]: { gridTemplateColumns: "minmax(280px, 0.3fr) 1fr" },
}));
const Artwork = styled("div")({
  alignItems: "flex-end",
  background: "linear-gradient(135deg, #4618ac, #e10d66)",
  color: "#fff",
  display: "flex",
  width: "200px",
  fontWeight: 700,
  minHeight: "22rem",
  padding: "2rem",
});
const Details = styled("div")({ alignSelf: "normal" });
const Title = styled("h1")({
  fontSize: "clamp(2rem, 5vw, 3rem)",
  letterSpacing: "-0.04em",
  lineHeight: 1.05,
  margin: 0,
  fontWeight: 600,
});
const Meta = styled("dl")({
  display: "grid",
  gap: "0.75rem",
  gridTemplateColumns: "auto 1fr",
  margin: "2rem 0 0",
});
const MetaLabel = styled("dt")({ fontWeight: 700, textTransform: "uppercase" });
const MetaValue = styled("dd")({ margin: 0 });
const Offers = styled("section")({ marginTop: "3.5rem" });
const OffersTitle = styled("h2")({ fontSize: "1.5rem", margin: "0 0 1rem" });
const OfferList = styled("div")({ display: "grid", gap: "0.75rem" });
const Offer = styled("article")({
  alignItems: "center",
  backgroundColor: "var(--background-dark)",
  border: "1px solid #63e3c2",
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "1fr auto auto",
  padding: "1rem 1.25rem",
});
const SellerName = styled("span")({ fontWeight: 600 });
const Price = styled("strong")({ fontSize: "1.25rem" });
const CartButton = styled("button")({
  "&:disabled": { cursor: "not-allowed", opacity: 0.55 },
  "&:hover:not(:disabled)": { backgroundColor: "#351184" },
  backgroundColor: "#4618ac",
  border: 0,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  padding: "0.75rem 1rem",
});
const Status = styled("p")({ color: "var(--text-subtle)", textAlign: "center" });

function GameDetailsContent() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [addingSeller, setAddingSeller] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiFetch<Game>(`/games/${id}`)
      .then((response) => {
        if (active) {
          setGame(response);
          const viewed = JSON.parse(localStorage.getItem("recently-viewed-games") ?? "[]") as string[];
          localStorage.setItem(
            "recently-viewed-games",
            JSON.stringify([id, ...viewed.filter((gameId) => gameId !== id)].slice(0, 10)),
          );
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load game");
      });

    return () => {
      active = false;
    };
  }, [id]);

  async function addToCart(sellerId: string) {
    setAddingSeller(sellerId);
    setCartMessage("");
    try {
      if (getAccessToken()) {
        await authenticatedApiFetch(`/cart/${id}`, {
          method: "POST",
          body: JSON.stringify({ sellerId, quantity: 1 }),
        });
      } else {
        addToGuestCart(id, sellerId);
      }
      setCartMessage("Added to cart");
    } catch (requestError) {
      setCartMessage(requestError instanceof Error ? requestError.message : "Unable to add to cart");
    } finally {
      setAddingSeller(null);
    }
  }

  if (error) return <Page><Status>{error}</Status></Page>;
  if (!game) return <Page><Status>Loading game...</Status></Page>;

  return (
    <Page>
      <Content>
        <Hero>
          <Artwork aria-label={`${game.name} artwork`} role="img">{game.platform}</Artwork>
          <Details>
            <Title>{game.name}</Title>
            <Meta>
              <MetaLabel>Platform</MetaLabel>
              <MetaValue>{game.platform}</MetaValue>
              <MetaLabel>Region</MetaLabel>
              <MetaValue>{game.region}</MetaValue>
              <MetaLabel>Lowest price</MetaLabel>
              <MetaValue>{game.lowestPrice ? `€${game.lowestPrice}` : "No offers"}</MetaValue>
            </Meta>
          </Details>
        </Hero>
        <Offers>
          <OffersTitle>Available offers</OffersTitle>
          {cartMessage && <Status>{cartMessage}</Status>}
          <OfferList>
            {game.sellers.map((offer) => (
              <Offer key={offer.seller.id}>
                <SellerName>{offer.seller.username}</SellerName>
                <Price>€{offer.price}</Price>
                <CartButton
                  disabled={addingSeller !== null}
                  onClick={() => void addToCart(offer.seller.id)}
                  type="button"
                >
                  {addingSeller === offer.seller.id ? "Adding..." : "Add to cart"}
                </CartButton>
              </Offer>
            ))}
          </OfferList>
        </Offers>
      </Content>
    </Page>
  );
}

export default function GameDetailsPage() {
  return (
    <Suspense fallback={<Page><Status>Loading game...</Status></Page>}>
      <GameDetailsContent />
    </Suspense>
  );
}

