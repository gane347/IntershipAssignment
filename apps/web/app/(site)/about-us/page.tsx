import InfoPage from "../../components/InfoPage";

export default function AboutUsPage() {
  return (
    <InfoPage
      title="About us"
      intro="Eneba is a digital marketplace for discovering and buying games from trusted sellers."
      sections={[
        {
          heading: "Our mission",
          text: "We make digital gaming products easy to find, compare, and enjoy. Our marketplace brings games, platforms, regions, and seller offers together in one place.",
        },
        {
          heading: "A simple experience",
          text: "From browsing to checkout, we focus on clear information and a straightforward experience for every player.",
        },
      ]}
    />
  );
}
