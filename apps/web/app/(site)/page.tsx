"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { apiFetch } from "@/lib/api/client";

type Game = {
  id: string;
  name: string;
  lowestPrice: string | null;
  region: string;
  platform: string;
};

const Page = styled("main")({
  minHeight: "100%",
  padding: "3.5rem 1.25rem 5rem",
});
const Content = styled("div")({
  margin: "0 auto",
  maxWidth: "80rem",
});
const Intro = styled("div")({ marginBottom: "2.5rem" });
const Title = styled("h1")({
  fontSize: "clamp(2rem, 5vw, 3rem)",
  letterSpacing: "-0.04em",
  lineHeight: 1.05,
  margin: 0,
});
const Subtitle = styled("p")({
  color: "var(--text-subtle)",
  fontSize: "1.1rem",
  margin: "1rem 0 0",
});
const Section = styled("section")({ marginBottom: "2.5rem" });
const SectionTitle = styled("h2")({
  fontSize: "1.5rem",
  margin: "0 0 1rem",
});
const CardsRow = styled("div")({
  display: "flex",
  gap: "1rem",
  overflowX: "auto",
  paddingBottom: "0.5rem",
});
const GameCard = styled(Link)({
  backgroundColor: "var(--background-dark)",
  border: "1px solid #63e3c2",
  color: "var(--text-subtle)",
  display: "flex",
  flex: "0 0 12rem",
  flexDirection: "column",
  minHeight: "15rem",
  textDecoration: "none",
});
const Artwork = styled("div")({
  alignItems: "flex-end",
  background: "linear-gradient(135deg, #4618ac, #e10d66)",
  color: "#fff",
  display: "flex",
  fontWeight: 700,
  height: "10rem",
  padding: "1rem",
});
const CardDetails = styled("div")({
  display: "flex",
  flex: 1,
  flexDirection: "column",
  gap: "0.4rem",
  padding: "0.8rem",
});
const GameName = styled("h3")({
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
  marginTop: "auto",
});
const Status = styled("p")({ color: "var(--text-subtle)" });

function GameCards({ games }: { games: Game[] }) {
  if (games.length === 0) return <Status>No games to show yet.</Status>;

  return (
    <CardsRow>
      {games.slice(0, 5).map((game) => (
        <GameCard href={`/games/${game.id}`} key={game.id}>
          <Artwork>{game.platform}</Artwork>
          <CardDetails>
            <GameName>{game.name}</GameName>
            <Meta>{game.region}</Meta>
            <Price>{game.lowestPrice ? `€${game.lowestPrice}` : "No offers"}</Price>
          </CardDetails>
        </GameCard>
      ))}
    </CardsRow>
  );
}

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [deals, setDeals] = useState<Game[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Game[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const viewedIds = JSON.parse(localStorage.getItem("recently-viewed-games") ?? "[]") as string[];
    Promise.all([
      apiFetch<Game[]>("/bestsellers?limit=5"),
      apiFetch<Game[]>("/best-deals?limit=5"),
      Promise.allSettled(viewedIds.slice(0, 5).map((id) => apiFetch<Game>(`/games/${id}`))),
    ])
      .then(([bestSellerGames, dealGames, viewedResults]) => {
        if (!active) return;
        setGames(bestSellerGames);
        setDeals(dealGames);
        setRecentlyViewed(
          viewedResults
            .filter((result): result is PromiseFulfilledResult<Game> => result.status === "fulfilled")
            .map((result) => result.value),
        );
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load games");
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Page>
      <Content>
        <Intro>
          <Title>Find your next game.</Title>
          <Subtitle>Discover popular games, great deals, and your recently viewed products.</Subtitle>
        </Intro>
        {error ? (
          <Status>{error}</Status>
        ) : (
          <>
            <Section>
              <SectionTitle>Best sellers</SectionTitle>
              <GameCards games={games} />
            </Section>
            <Section>
              <SectionTitle>Best deals</SectionTitle>
              <GameCards games={deals} />
            </Section>
            <Section>
              <SectionTitle>Recently viewed</SectionTitle>
              <GameCards games={recentlyViewed} />
            </Section>
          </>
        )}
      </Content>
    </Page>
  );
}
