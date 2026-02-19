import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { start, end, guests } = req.body;

    const pricePerNight = 180;
    const cleaningFee = 120;
    const taxPerPerson = 1.5;
    const minNights = 4;

    const nights = (new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24);

    if (nights < minNights) {
      return res.status(400).json({ error: `Séjour minimum ${minNights} nuits` });
    }

    const total =
      nights * pricePerNight +
      nights * guests * taxPerPerson +
      cleaningFee;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Villa CABOUA (${start} → ${end})`,
            },
            unit_amount: Math.round(total * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    return res.status(200).json({ id: session.id });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
