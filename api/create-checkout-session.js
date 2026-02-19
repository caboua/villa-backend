import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== 'POST') {
   
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res){
  if(req.method==="POST"){
    const {start,end,guests} = req.body;
    const nights=(new Date(end)-new Date(start))/(1000*60*60*24);
    const amount = nights*180 + guests*nights*1.5 + 120; // prix total en €
    const session = await stripe.checkout.sessions.create({
      payment_method_types:['card'],
      line_items:[{
        price_data:{
          currency:'eur',
          product_data:{name:`Séjour Villa CABOUA (${start} → ${end})`},
          unit_amount: Math.round(amount*100),
        },
        quantity:1
      }],
      mode:'payment',
      success_url:`${req.headers.origin}/success.html`,
      cancel_url:`${req.headers.origin}/cancel.html`
    });
    res.status(200).json({id:session.id});
  } else {res.setHeader('Allow','POST'); res.status(405).end('Method Not Allowed');}
}
