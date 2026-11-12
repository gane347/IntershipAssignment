"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { authenticatedApiFetch } from "@/lib/api/client";
import { getCurrentUser } from "@/lib/auth";

type PaymentResult = {
  orderId: string;
  total: string;
  items: { name: string; quantity: number; digitalKey: string }[];
};

const Page = styled("main")({ minHeight: "100%", padding: "3.5rem 1.25rem 5rem" });
const Content = styled("div")({ margin: "0 auto", maxWidth: "32rem" });
const Card = styled("section")({ backgroundColor: "var(--background-dark)", border: "1px solid #63e3c2", padding: "2rem" });
const Title = styled("h1")({ fontSize: "2.25rem", margin: "0 0 2rem" });
const Form = styled("form")({ display: "grid", gap: "1rem" });
const Field = styled("label")({ display: "grid", gap: "0.4rem", fontWeight: 600 });
const Input = styled("input")({ background: "transparent", border: "1px solid #63e3c2", color: "inherit", padding: "0.75rem" });
const Button = styled("button")({ backgroundColor: "#4618ac", border: 0, color: "#fff", cursor: "pointer", fontWeight: 600, padding: "0.9rem", "&:disabled": { opacity: 0.6 } });
const Status = styled("p")({ color: "var(--text-subtle)" });
const KeyList = styled("div")({ display: "grid", gap: "0.75rem" });
const KeyItem = styled("div")({ border: "1px solid #63e3c2", padding: "1rem" });
const DigitalKey = styled("code")({ display: "block", marginTop: "0.5rem", wordBreak: "break-all" });
const BackLink = styled(Link)({ color: "#4618ac", fontWeight: 600 });

export default function CheckoutPage() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [payment, setPayment] = useState({ cardNumber: "", expiry: "", cvc: "" });
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => { getCurrentUser().then((user) => setSignedIn(Boolean(user))); }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      setResult(await authenticatedApiFetch<PaymentResult>("/checkout", { method: "POST" }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  if (signedIn === false) return <Page><Content><Status>Please <BackLink href="/login">sign in</BackLink> to continue to payment.</Status></Content></Page>;
  if (signedIn === null) return <Page><Content><Status>Checking your account...</Status></Content></Page>;
  if (result) {
    return <Page><Content><Card><Title>Payment successful</Title><Status>Order {result.orderId} <br/> Total €{result.total}</Status><KeyList>{result.items.map((item) => <KeyItem key={item.digitalKey}><strong>{item.name}</strong><DigitalKey>{item.digitalKey}</DigitalKey></KeyItem>)}</KeyList></Card></Content></Page>;
  }

  return (
    <Page>
      <Content>
        <Card>
          <Title>Payment</Title>
          <Form onSubmit={handleSubmit}>
            <Field>Card number<Input required inputMode="numeric" onChange={(event) => setPayment({ ...payment, cardNumber: event.target.value })} value={payment.cardNumber} /></Field>
            <Field>Expiry date<Input required onChange={(event) => setPayment({ ...payment, expiry: event.target.value })} placeholder="MM/YY" value={payment.expiry} /></Field>
            <Field>CVC<Input required inputMode="numeric" onChange={(event) => setPayment({ ...payment, cvc: event.target.value })} value={payment.cvc} /></Field>
            {error && <Status>{error}</Status>}
            <Button disabled={loading} type="submit">{loading ? "Processing..." : "Pay securely"}</Button>
          </Form>
          <Status>This is a simulated payment. No real charge will be made.</Status>
        </Card>
      </Content>
    </Page>
  );
}
