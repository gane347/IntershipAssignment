"use client";

import { styled } from "@mui/material/styles";

const Page = styled("main")({
  minHeight: "100%",
  padding: "3.5rem 1.25rem 5rem",
});
const Content = styled("article")({
  margin: "0 auto",
  maxWidth: "52rem",
});
const Title = styled("h1")({
  fontSize: "clamp(2rem, 5vw, 3rem)",
  letterSpacing: "-0.04em",
  margin: "0 0 1rem",
});
const Intro = styled("p")({
  color: "var(--text-subtle)",
  fontSize: "1.1rem",
  lineHeight: 1.6,
  margin: "0 0 2rem",
});
const Section = styled("section")({
  marginTop: "2rem",
});
const Heading = styled("h2")({
  fontSize: "1.35rem",
  margin: "0 0 0.75rem",
});
const Text = styled("p")({
  color: "var(--text-subtle)",
  lineHeight: 1.7,
  margin: 0,
});

export type InfoSection = {
  heading: string;
  text: string;
};

export default function InfoPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: InfoSection[];
}) {
  return (
    <Page>
      <Content>
        <Title>{title}</Title>
        <Intro>{intro}</Intro>
        {sections.map((section) => (
          <Section key={section.heading}>
            <Heading>{section.heading}</Heading>
            <Text>{section.text}</Text>
          </Section>
        ))}
      </Content>
    </Page>
  );
}
