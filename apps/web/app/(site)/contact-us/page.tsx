import InfoPage from "../../components/InfoPage";

export default function ContactUsPage() {
  return (
    <InfoPage
      title="Contact us"
      intro="We are here to help with questions about your account, orders, or digital games."
      sections={[
        {
          heading: "Customer support",
          text: "For help with an order or account, contact our support team at support@example.com. Please include your order number when you are asking about a purchase.",
        },
        {
          heading: "Business enquiries",
          text: "For seller and partnership enquiries, email partnerships@example.com and our team will get back to you.",
        },
      ]}
    />
  );
}
