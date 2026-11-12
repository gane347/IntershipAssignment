import InfoPage from "../../components/InfoPage";

export default function FaqPage() {
  return (
    <InfoPage
      title="Frequently asked questions"
      intro="Find quick answers to common questions about buying and using digital games."
      sections={[
        {
          heading: "How do I buy a game?",
          text: "Choose a game, select a seller offer, add it to your cart, and complete the simulated checkout. Your digital key is shown after successful payment.",
        },
        {
          heading: "Where can I find my digital key?",
          text: "The key is displayed on the payment confirmation screen after checkout is completed.",
        },
        {
          heading: "Can I shop without an account?",
          text: "Yes. Guest users can add games to a cart, but you need to sign in before completing checkout.",
        },
      ]}
    />
  );
}
