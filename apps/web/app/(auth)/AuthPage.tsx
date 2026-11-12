"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { login, register } from "@/lib/auth";
import LogoImage from "../assets/logoFull.svg";

type AuthMode = "login" | "register";

const Page = styled("main")({
  alignItems: "center",
  backgroundColor: "var(--background-dark)",
  display: "flex",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "3rem 1.25rem",
  position: "relative",
});

const LogoLink = styled(Link)({
  left: "1.25rem",
  position: "absolute",
  top: "1.5rem",
  "@media (min-width: 640px)": {
    left: "2.5rem",
    top: "2rem",
  },
});

const Content = styled("div")(({ theme }) => ({
  alignItems: "center",
  display: "grid",
  gap: theme.spacing(6),
  maxWidth: "72rem",
  width: "100%",
  [theme.breakpoints.up("lg")]: {
    gridTemplateColumns: "1fr 420px",
  },
}));

const Quote = styled("p")(({ theme }) => ({
  fontSize: "3rem",
  fontWeight: 700,
  letterSpacing: "-0.04em",
  lineHeight: 1.05,
  margin: 0,
  [theme.breakpoints.up("sm")]: {
    fontSize: "4.5rem",
  },
}));

const FormCard = styled("section")({
  backgroundColor: "var(--background)",
  boxShadow: "0 20px 40px rgba(70, 24, 172, 0.1)",
  padding: "2.5rem",
  width: "100%",
});

const Title = styled("h1")({
  fontSize: "1.875rem",
  fontWeight: 700,
});

const SwitchText = styled("p")({
  fontSize: "0.8rem",
  margin: "0 0 2rem",
  fontWeight: 800,
  color: "var(--text-subtle)",
});

const SwitchLink = styled(Link)({
  color: "var(--accent)",
  fontWeight: 600,
});

const Form = styled("form")({
  display: "grid",
  gap: "1rem",
});

const Field = styled("label")({
  display: "grid",
  fontSize: "0.875rem",
  fontWeight: 600,
  gap: "0.5rem",
});

const Input = styled("input")({
  "&:focus": {
    borderColor: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  backgroundColor: "rgba(0, 0, 0, 0.15)",
  outline: "none",
  padding: "0.75rem",
  fontWeight: 400,
});

const SellerOption = styled("label")({
  alignItems: "center",
  display: "flex",
  fontSize: "0.875rem",
  gap: "0.5rem",
});

const ErrorMessage = styled("p")({
  color: "#dc2626",
  fontSize: "0.875rem",
  margin: 0,
});

const SubmitButton = styled("button")({
  "&:hover": {
    backgroundColor: "var(--accent-dark)",
  },
  "&:disabled": {
    opacity: 0.6,
  },
  backgroundColor: "var(--accent)",
  border: 0,
  color: "#000",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: 800,
  marginTop: "0.5rem",
  padding: "0.75rem",
});

export default function AuthPage({ mode }: { mode: AuthMode }) {
  const isLogin = mode === "login";
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [form, setForm] = useState({ email: "", username: "", password: "", isSeller: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(identifier, form.password);
      } else {
        await register(form);
      }
      router.push("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page>
      <LogoLink href="/">
        <Image alt="Eneba" height={48} priority src={LogoImage} width={155} />
      </LogoLink>
      <Content>
        <Quote>
          Hi!
          <br />
          It&apos;s nice to see you!
        </Quote>
        <FormCard>
          <Title>{isLogin ? "Log in" : "Create an account"}</Title>
          <SwitchText>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <SwitchLink href={isLogin ? "/register" : "/login"}>{isLogin ? "Register" : "Log in"}</SwitchLink>
          </SwitchText>
          <Form onSubmit={handleSubmit}>
            {isLogin ? (
              <Field>
                <Input onChange={(event) => setIdentifier(event.target.value)} required value={identifier} placeholder="Email or username" />
              </Field>
            ) : (
              <>
                <Field>
                  <Input onChange={(event) => setForm({ ...form, email: event.target.value })} required type="email" value={form.email} placeholder="Email" />
                </Field>
                <Field>
                  <Input onChange={(event) => setForm({ ...form, username: event.target.value })} required value={form.username} placeholder="Username" />
                </Field>
              </>
            )}
            <Field>
              <Input minLength={8} onChange={(event) => isLogin ? setForm({ ...form, password: event.target.value }) : setForm({ ...form, password: event.target.value })} required type="password" value={form.password} placeholder="Password" />
            </Field>
            {!isLogin && (
              <SellerOption>
                <input checked={form.isSeller} onChange={(event) => setForm({ ...form, isSeller: event.target.checked })} type="checkbox" />
                Register as a seller
              </SellerOption>
            )}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <SubmitButton disabled={loading} type="submit">
              {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Log in" : "Register"}
            </SubmitButton>
          </Form>
        </FormCard>
      </Content>
    </Page>
  );
}
