"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { authenticatedApiFetch } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/auth";

type WishlistItem = {
  game: {
    id: string;
    name: string;
    platform: string;
    region: string;
    lowestPrice: string | null;
  };
};

const Page = styled("main")({
  minHeight: "100%",
  padding: "3.5rem 1.25rem 5rem",
});
const Content = styled("div")({
  margin: "0 auto",
  maxWidth: "72rem",
});
const Title = styled("h1")({
  fontSize: "clamp(2rem, 5vw, 3rem)",
  margin: "0 0 2rem",
});
const Grid = styled("div")(({ theme }) => ({
  display: "grid",
  gap: theme.spacing(2),
  gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
  [theme.breakpoints.up("sm")]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  [theme.breakpoints.up("md")]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
}));
const Card = styled("article")({
  backgroundColor: "var(--background-dark)",
  border: "1px solid #63e3c2",
  display: "flex",
  flexDirection: "column",
  minHeight: "15rem",
});
const Artwork = styled("div")({
  alignItems: "flex-end",
  background: "linear-gradient(135deg, #4618ac, #e10d66)",
  color: "#fff",
  display: "flex",
  fontWeight: 700,
  height: "9rem",
  padding: "1rem",
});
const CardBody = styled("div")({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "0.5rem",
  padding: "1rem",
});
const GameLink = styled(Link)({
  color: "var(--foreground)",
  fontSize: "1rem",
  fontWeight: 700,
  textDecoration: "none",
});
const Meta = styled("span")({
  color: "var(--text-subtle)",
  fontSize: "0.75rem",
  textTransform: "uppercase",
});
const Price = styled("strong")({
  fontSize: "1.1rem",
  marginTop: "auto",
});
const RemoveButton = styled("button")({
  alignSelf: "flex-start",
  background: "transparent",
  border: 0,
  color: "var(--text-subtle)",
  cursor: "pointer",
  padding: 0,
  textDecoration: "underline",
});
const Status = styled("p")({ color: "var(--text-subtle)" });
const ActionLink = styled(Link)({
  color: "#4618ac",
  fontWeight: 700,
});

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[] | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void getCurrentUser().then(async (user) => {
      if (!active) return;
      setSignedIn(Boolean(user));
      if (!user) return;

      try {
        const wishlist = await authenticatedApiFetch<WishlistItem[]>("/wishlist");
        if (active) setItems(wishlist);
      } catch (requestError) {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load favourites");
      }
    });

    return () => {
      active = false;
    };
  }, []);

  async function removeItem(gameId: string) {
    try {
      await authenticatedApiFetch(`/wishlist/${gameId}`, { method: "DELETE" });
      setItems((current) => current?.filter((item) => item.game.id !== gameId) ?? null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to remove favourite");
    }
  }

  return (
    <Page>
      <Content>
        <Title>Favourites</Title>
        {signedIn === null && <Status>Loading favourites...</Status>}
        {signedIn === false && (
          <Status>
            Sign in to save and view your favourite games. <ActionLink href="/login">Sign in</ActionLink>
          </Status>
        )}
        {error && <Status>{error}</Status>}
        {signedIn && items?.length === 0 && (
          <Status>
            You have no favourite games yet. <ActionLink href="/games">Browse games</ActionLink>
          </Status>
        )}
        {signedIn && items && items.length > 0 && (
          <Grid>
            {items.map((item) => (
              <Card key={item.game.id}>
                <Artwork>{item.game.platform}</Artwork>
                <CardBody>
                  <GameLink href={`/games/${item.game.id}`}>{item.game.name}</GameLink>
                  <Meta>{item.game.region}</Meta>
                  <Price>{item.game.lowestPrice ? `€${item.game.lowestPrice}` : "No offers"}</Price>
                  <RemoveButton onClick={() => void removeItem(item.game.id)} type="button">
                    Remove from favourites
                  </RemoveButton>
                </CardBody>
              </Card>
            ))}
          </Grid>
        )}
      </Content>
    </Page>
  );
}
