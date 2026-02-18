import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Réservation Villa CABOUA',
          },
          unit_amount: 50000, // 500€ exemple (on rendra dynamique après)
        },
        quantity: 1,
      }],
      success_url: 'https://TONSITE.github.io/success.html',
      cancel_url: 'https://TONSITE.github.io/',
    });

    res.status(200).json({ id: session.id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
