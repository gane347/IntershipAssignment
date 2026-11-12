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
  sellers: { seller: { id: string; username: string } }[];
};

type GamesResponse = {
  items: Game[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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
  fontWeight: 600,
});
const Subtitle = styled("p")({
  color: "var(--text-subtle)",
  fontSize: "1.1rem",
  margin: "1rem 0 0",
});
const GameGrid = styled("div")(({ theme }) => ({
  padding: "0 5rem 0 5rem",
  display: "grid",
  gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
  [theme.breakpoints.up("sm")]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  [theme.breakpoints.up("md")]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
  [theme.breakpoints.up("lg")]: { gridTemplateColumns: "repeat(5, minmax(0, 1fr))" },
}));
const GameCard = styled(Link)({
  backgroundColor: "var(--background-dark)",
  boxShadow: "0 8px 20px rgba(70, 24, 172, 0.08)",
  display: "flex",
  flexDirection: "column",
  width: "200px",
  minHeight: "17rem",
  border: '1px solid #63e3c2',
  fontWeight: 600,
  color: 'var(--text-subtle)',
  fontSize: '0.7rem',
  margin: '1rem 0',
  textDecoration: "none",
});
const GameArtwork = styled("div")({
  alignItems: "flex-end",
  background: "linear-gradient(135deg, #4618ac, #e10d66)",
  color: "#fff",
  display: "flex",
  fontSize: "1.25rem",
  fontWeight: 700,
  height: "16rem",
  marginBottom: "1rem",
  padding: "1rem",
});
const GameName = styled("h2")({
  fontSize: "0.8rem", 
  lineHeight: 1.3,
  margin: 0,
  color: "var(--foreground)"
});
const Details = styled("p")({ fontSize: "0.75rem", margin: "0.5rem 0", textTransform: "uppercase", color: "var(--foreground)" });
const CardFooter = styled("div")({
  alignItems: "center",
  marginTop: "auto",
  padding: "0 1rem 1rem 1rem",
});
const Price = styled("strong")({ color: "var(--foreground)", fontSize: "1.25rem" });
const Pagination = styled("nav")({
  alignItems: "center",
  display: "flex",
  gap: "0.5rem",
  justifyContent: "center",
  marginTop: "2.5rem",
});
const PageButton = styled("button")({
  "&:disabled": { cursor: "not-allowed", opacity: 0.4 },
  "&:hover:not(:disabled)": { backgroundColor: "#351184" },
  backgroundColor: "#4618ac",
  border: 0,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  minWidth: "2.5rem",
  padding: "0.7rem 0.9rem",
});
const Status = styled("p")({ color: "#64748b", textAlign: "center" });

export default function Home() {
  const [games, setGames] = useState<GamesResponse | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetch<GamesResponse>(`/games?page=${page}&pageSize=10`)
      .then((response) => {
        if (active) {
          setGames(response);
          setError("");
        }
      })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : "Unable to load games");
      });

    return () => {
      active = false;
    };
  }, [page]);

  return (
    <Page>
      <Content>
        <Intro>
          <Title>Find your next game.</Title>
          <Subtitle>Browse all games listed by Eneba sellers.</Subtitle>
        </Intro>
        {error && <Status>{error}</Status>}
        {!error && !games && <Status>Loading games...</Status>}
        {games && games.items.length === 0 && <Status>No games are listed yet.</Status>}
        {games && games.items.length > 0 && (
          <>
            <GameGrid>
              {games.items.map((game) => (
                <GameCard href={`/games/${game.id}`} key={game.id}>
                  <GameArtwork>{game.platform}</GameArtwork>
                  <CardFooter>
                    <GameName>{game.name}</GameName>
                    <Details>
                      {game.region}
                    </Details>
                    {game.lowestPrice ? `From` : "No offers"}
                    <br/>
                    {game.lowestPrice && <Price>€{game.lowestPrice}</Price>}
                    
                  </CardFooter>
                </GameCard>
              ))}
            </GameGrid>
            {games.totalPages > 1 && (
              <Pagination aria-label="Game pages">
                <PageButton disabled={page === 1} onClick={() => setPage((current) => current - 1)} type="button">
                  Previous
                </PageButton>
                {Array.from({ length: games.totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <PageButton key={pageNumber} disabled={pageNumber === page} onClick={() => setPage(pageNumber)} type="button">
                    {pageNumber}
                  </PageButton>
                ))}
                <PageButton disabled={page === games.totalPages} onClick={() => setPage((current) => current + 1)} type="button">
                  Next
                </PageButton>
              </Pagination>
            )}
          </>
        )}
      </Content>
    </Page>
  );
}
