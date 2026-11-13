"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { styled } from "@mui/material/styles";
import { apiFetch } from "@/lib/api/client";
import GameCard, { type GameCardGame } from "../../components/GameCard";

type Game = GameCardGame & {
  sellers: { seller: { id: string; username: string } }[];
};

type GamesResponse = {
  items: Game[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  platforms: string[];
  regions: string[];
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
const Filters = styled("form")(({ theme }) => ({
  alignItems: "flex-end",
  backgroundColor: "var(--background-dark)",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexWrap: "wrap",
  gap: theme.spacing(1.5),
  marginBottom: "2rem",
  padding: theme.spacing(2),
}));
const FilterField = styled("label")({
  color: "var(--text-subtle)",
  display: "flex",
  flexDirection: "column",
  fontSize: "0.75rem",
  fontWeight: 700,
  gap: "0.35rem",
});
const FilterInput = styled("input")({
  border: "1px solid #cbd5e1",
  minWidth: "8rem",
  padding: "0.6rem",
});
const FilterSelect = styled("select")({
  background: "var(--background-dark)",
  border: "1px solid #cbd5e1",
  minWidth: "9rem",
  padding: "0.6rem",
});
const FilterButton = styled("button")({
  backgroundColor: "#4618ac",
  border: 0,
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600,
  padding: "0.7rem 1rem",
});
const GameGrid = styled("div")(({ theme }) => ({
  padding: "0 5rem 0 5rem",
  display: "grid",
  gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
  [theme.breakpoints.up("sm")]: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  [theme.breakpoints.up("md")]: { gridTemplateColumns: "repeat(3, minmax(0, 1fr))" },
  [theme.breakpoints.up("lg")]: { gridTemplateColumns: "repeat(5, minmax(0, 1fr))" },
  gap: "1rem",
  overflowX: "auto",
  paddingBottom: "0.5rem",
}));
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

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";
  const platformQuery = searchParams.get("platform") ?? "";
  const regionQuery = searchParams.get("region") ?? "";
  const minPriceQuery = searchParams.get("minPrice") ?? "";
  const maxPriceQuery = searchParams.get("maxPrice") ?? "";
  const sortQuery = searchParams.get("sort") ?? "newest";
  const [games, setGames] = useState<GamesResponse | null>(null);
  const page = Number(searchParams.get("page") ?? "1");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const query = new URLSearchParams({
      page: String(page),
      pageSize: "10",
      ...(searchQuery ? { search: searchQuery } : {}),
      ...(platformQuery ? { platform: platformQuery } : {}),
      ...(regionQuery ? { region: regionQuery } : {}),
      ...(minPriceQuery ? { minPrice: minPriceQuery } : {}),
      ...(maxPriceQuery ? { maxPrice: maxPriceQuery } : {}),
      ...(sortQuery !== "newest" ? { sort: sortQuery } : {}),
    });
    apiFetch<GamesResponse>(`/games?${query.toString()}`)
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
  }, [page, searchQuery, platformQuery, regionQuery, minPriceQuery, maxPriceQuery, sortQuery]);

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = new URLSearchParams(searchQuery ? { search: searchQuery } : {});
    for (const field of ["platform", "region", "minPrice", "maxPrice", "sort"]) {
      const value = String(formData.get(field) ?? "");
      if (value && (field !== "sort" || value !== "newest")) query.set(field, value);
    }
    router.push(`/games?${query.toString()}`);
  }

  function clearFilters() {
    router.push("/games");
  }

  function changePage(nextPage: number) {
    const query = new URLSearchParams(searchParams.toString());
    if (nextPage === 1) query.delete("page");
    else query.set("page", String(nextPage));
    router.push(`/games?${query.toString()}`);
  }

  return (
    <Page>
      <Content>
        <Intro>
          <Title>Find your next game.</Title>
          <Subtitle>
            Browse all games listed by sellers.
            {searchQuery ? ` Showing results for "${searchQuery}".` : ""}
          </Subtitle>
        </Intro>
        <Filters key={`${platformQuery}-${regionQuery}-${minPriceQuery}-${maxPriceQuery}-${sortQuery}`} onSubmit={applyFilters}>
          <FilterField>
            Platform
            <FilterSelect defaultValue={platformQuery} name="platform">
              <option value="">All platforms</option>
              {games?.platforms.map((option) => <option key={option} value={option}>{option}</option>)}
            </FilterSelect>
          </FilterField>
          <FilterField>
            Region
            <FilterSelect defaultValue={regionQuery} name="region">
              <option value="">All regions</option>
              {games?.regions.map((option) => <option key={option} value={option}>{option}</option>)}
            </FilterSelect>
          </FilterField>
          <FilterField>
            Min price
            <FilterInput defaultValue={minPriceQuery} min="0" name="minPrice" placeholder="€0" type="number" />
          </FilterField>
          <FilterField>
            Max price
            <FilterInput defaultValue={maxPriceQuery} min="0" name="maxPrice" placeholder="No limit" type="number" />
          </FilterField>
          <FilterField>
            Sort by
            <FilterSelect defaultValue={sortQuery} name="sort">
              <option value="newest">Newest</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (low to high)</option>
              <option value="price-desc">Price (high to low)</option>
            </FilterSelect>
          </FilterField>
          <FilterButton type="submit">Apply filters</FilterButton>
          <FilterButton onClick={clearFilters} type="button">Clear</FilterButton>
        </Filters>
        {error && <Status>{error}</Status>}
        {!error && !games && <Status>Loading games...</Status>}
        {games && games.items.length === 0 && <Status>No games are listed yet.</Status>}
        {games && games.items.length > 0 && (
          <>
            <GameGrid>
              {games.items.map((game) => (
                <GameCard game={game} key={game.id} />
              ))}
            </GameGrid>
            {games.totalPages > 1 && (
              <Pagination aria-label="Game pages">
                <PageButton disabled={page === 1} onClick={() => changePage(page - 1)} type="button">
                  Previous
                </PageButton>
                {Array.from({ length: games.totalPages }, (_, index) => index + 1).map((pageNumber) => (
                  <PageButton key={pageNumber} disabled={pageNumber === page} onClick={() => changePage(pageNumber)} type="button">
                    {pageNumber}
                  </PageButton>
                ))}
                <PageButton disabled={page === games.totalPages} onClick={() => changePage(page + 1)} type="button">
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

export default function Home() {
  return (
    <Suspense fallback={<Page><Status>Loading games...</Status></Page>}>
      <HomeContent />
    </Suspense>
  );
}
