"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { apiFetch, authenticatedApiFetch } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/auth";
import { clearGuestCart, getGuestCart, removeFromGuestCart, type GuestCartItem } from "@/lib/guest-cart";

type Game = {
  id: string;
  name: string;
  platform: string;
  lowestPrice: string | null;
  sellers: { seller: { id: string; username: string }; price: string }[];
};
type CartItem = { game: Game; sellerId: string; price: string; quantity: number };

const Page = styled("main")({ minHeight: "100%", padding: "3.5rem 1.25rem 5rem" });
const Content = styled("div")({ margin: "0 auto", maxWidth: "72rem" });
const Layout = styled("div")(({ theme }) => ({ display: "grid", gap: theme.spacing(4), [theme.breakpoints.up("md")]: { gridTemplateColumns: "1fr 20rem" } }));
const Title = styled("h1")({ fontSize: "clamp(2rem, 5vw, 3rem)", margin: "0 0 2rem" });
const Items = styled("div")({ display: "grid", gap: "0.75rem" });
const Item = styled("article")({ alignItems: "center", backgroundColor: "var(--background-dark)", border: "1px solid #63e3c2", display: "grid", gap: "1rem", gridTemplateColumns: "1fr auto auto", padding: "1.25rem" });
const ItemName = styled("strong")({ display: "block", fontSize: "1rem" });
const ItemMeta = styled("span")({ color: "var(--text-subtle)", display: "block", fontSize: "0.8rem", marginTop: "0.35rem" });
const ItemPrice = styled("strong")({ fontSize: "1.1rem" });
const RemoveButton = styled("button")({ background: "transparent", border: 0, color: "var(--text-subtle)", cursor: "pointer", textDecoration: "underline" });
const Summary = styled("aside")({ alignSelf: "start", backgroundColor: "var(--background-dark)", border: "1px solid #63e3c2", padding: "1.5rem" });
const SummaryRow = styled("div")({ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" });
const CheckoutLink = styled(Link)({ backgroundColor: "#4618ac", color: "#fff", display: "block", fontWeight: 600, padding: "0.9rem", textAlign: "center", textDecoration: "none" });
const EmptyLink = styled(Link)({ color: "#4618ac", fontWeight: 600 });
const Status = styled("p")({ color: "var(--text-subtle)" });

export default function CartPage() {
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    getCurrentUser().then(async (user) => {
      if (!active) return;
      setSignedIn(Boolean(user));
      if (user) {
        const guestItems = getGuestCart();
        await Promise.all(guestItems.map((item) => authenticatedApiFetch(`/cart/${item.gameId}`, {
          method: "POST",
          body: JSON.stringify({ sellerId: item.sellerId, quantity: item.quantity }),
        })));
        clearGuestCart();
        setItems(await authenticatedApiFetch<CartItem[]>("/cart"));
        return;
      }
      const guestItems = getGuestCart();
      const loaded = await Promise.all(guestItems.map(async (item: GuestCartItem) => {
        const game = await apiFetch<Game>(`/games/${item.gameId}`);
        const offer = game.sellers.find((seller) => seller.seller.id === item.sellerId);
        return { game, sellerId: item.sellerId, price: offer?.price ?? "0.00", quantity: item.quantity };
      }));
      if (active) setItems(loaded);
    });
    return () => { active = false; };
  }, []);

  function removeItem(gameId: string, sellerId: string) {
    if (signedIn) {
      void authenticatedApiFetch(`/cart/${gameId}?sellerId=${sellerId}`, { method: "DELETE" }).then(() => setItems((current) => current?.filter((item) => item.game.id !== gameId || item.sellerId !== sellerId) ?? null));
    } else {
      removeFromGuestCart(gameId, sellerId);
      setItems((current) => current?.filter((item) => item.game.id !== gameId || item.sellerId !== sellerId) ?? null);
    }
  }

  if (!items) return <Page><Content><Status>Loading cart...</Status></Content></Page>;
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  return (
    <Page>
      <Content>
        <Title>Your cart</Title>
        {items.length === 0 ? (
          <Status>Your cart is empty. <EmptyLink href="/">Continue shopping</EmptyLink></Status>
        ) : (
          <Layout>
            <Items>
              {items.map((item) => (
                <Item key={`${item.game.id}-${item.sellerId}`}>
                  <div><ItemName>{item.game.name}</ItemName><ItemMeta>{item.game.platform} · Quantity: {item.quantity}</ItemMeta></div>
                  <ItemPrice>€{(Number(item.price) * item.quantity).toFixed(2)}</ItemPrice>
                  <RemoveButton onClick={() => removeItem(item.game.id, item.sellerId)} type="button">Remove</RemoveButton>
                </Item>
              ))}
            </Items>
            <Summary>
              <SummaryRow><span>Total</span><strong>€{total.toFixed(2)}</strong></SummaryRow>
              {signedIn ? <CheckoutLink href="/checkout">Proceed to checkout</CheckoutLink> : <CheckoutLink href="/login">Sign in to checkout</CheckoutLink>}
            </Summary>
          </Layout>
        )}
      </Content>
    </Page>
  );
}
