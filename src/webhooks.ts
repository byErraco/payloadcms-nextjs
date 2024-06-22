import express from 'express'
import { WebhookRequest } from './server'
import { stripe } from './lib/stripe'
import type Stripe from 'stripe'
import { getPayloadClient } from './get-payload'
import { Product } from './payload-types'
import { Resend } from 'resend'
import { ReceiptEmailHtml } from './components/emails/ReceiptEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {

  const webhookRequest = req as any as WebhookRequest
  const body = webhookRequest.rawBody

  const signature = req.headers['stripe-signature'] || ''


  let event
  try {

    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )

    // console.log('event', event);
    const session = event.data
      .object as Stripe.Checkout.Session


    // if (
    //     !session?.metadata?.userId
    //     // !session?.metadata?.userId ||
    //     // !session?.metadata?.orderId
    // ) {
    //     console.log('NO METADATA');
    //     return res
    //         .status(400)
    //         .send(`Webhook Error: No user present in metadata`)
    // }

    console.log('event.type', event.type);
    switch (event.type) {
      case 'customer.subscription.created':
        return handleSubscriptionEvent(event, 'created', res);
      case 'customer.subscription.updated':
        return handleSubscriptionEvent(event, 'updated', res);
      case 'customer.subscription.deleted':
        return handleSubscriptionEvent(event, 'deleted', res);
      case 'invoice.payment_succeeded':
        return handleInvoiceEvent(event, 'succeeded', res);
      case 'invoice.payment_failed':
        return handleInvoiceEvent(event, 'failed', res);
      case 'checkout.session.completed':
        return handleCheckoutSessionCompleted(event, res);
      default:
        return res.status(400).json({ error: 'Unhandled event type', status: 400 })
    }
  } catch (err) {
    console.log('err', err);
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error
          ? err.message
          : 'Unknown Error'
        }`
      )
  }

}
async function getCustomerEmail(customerId: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);
    return (customer as Stripe.Customer).email;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: 'created' | 'updated' | 'deleted',
  res: express.Response

) {

  const payload = await getPayloadClient()
  const subscription = event.data.object as Stripe.Subscription;
  const customerEmail = await getCustomerEmail(subscription.customer as string);

  // console.log('subscription', subscription);
  if (!customerEmail) {

    return res.status(404).json({ error: 'Customer email could not be fetched' })
  }

  // current_period_end:
  // current_period_start
  const subscriptionData = {
    stripeSubscriptionID: subscription.id,
    stripeCustomerID: subscription.customer,
    status: subscription.status,
    startDate: new Date(subscription.created * 1000).toISOString(),
    planId: subscription.items.data[0]?.price.id,
    ownedBy: subscription.metadata?.userId || '',
    email: customerEmail,
  };
  // console.log('type', type);
  // console.log('subscriptionData', subscriptionData);

  let subscriptionDoc

  // let data, error;
  if (type === 'deleted') {
    subscriptionDoc = await payload.update({
      collection: 'subscriptions',
      where: {
        stripeCustomerID: subscriptionData.stripeCustomerID
      },
      data: {
        status: 'cancelled',
        email: customerEmail
      }

    } as any)
  }
  if (type === 'created') {
    subscriptionDoc = await payload.create({
      collection: 'subscriptions',
      data: subscriptionData,
    } as any)
  }
  // @ts-ignore
  if (type === 'insert' || type === 'updated') {
    subscriptionDoc = await payload.update({
      collection: 'subscriptions',
      data: subscriptionData,
      where: {
        stripeCustomerID: subscriptionData.stripeCustomerID
      }
    } as any)
    // console.log('subscriptionDoc updated', subscriptionDoc);
  }

  if (!subscriptionDoc) {
    console.error(`Error during subscription ${type}:`, subscriptionDoc);
    return res.status(500).json({ error: `Error during subscription ${type}` })
  }

  return res.status(200).json({ status: 200, message: `Subscription ${type} success`, data: subscriptionDoc, })
}

async function handleInvoiceEvent(
  event: Stripe.Event,
  status: 'succeeded' | 'failed',
  res: express.Response
) {
  const payload = await getPayloadClient()
  const invoice = event.data.object as Stripe.Invoice;
  const customerEmail = await getCustomerEmail(invoice.customer as string);

  if (!customerEmail) {
    return res.status(500).json({ error: 'Customer email could not be fetched', status: 500 })
  }

  // console.log('invoice', invoice);
  const invoiceData = {
    invoiceId: invoice.id,
    subscriptionId: invoice.subscription as string,
    amountPaid: status === 'succeeded' ? invoice.amount_paid / 100 : undefined,
    amountDue: status === 'failed' ? invoice.amount_due / 100 : undefined,
    currency: invoice.currency,
    status,
    ownedBy: invoice.subscription_details?.metadata?.userId,
    email: customerEmail,
    // maybe add total field
  };
  // amountDue and ownedBy are not present in the invoice object
  // console.log('invoiceData', invoiceData);


  const invoiceDoc = await payload.create({
    collection: 'invoices',
    data: invoiceData,
  } as any)

  if (!invoiceDoc) {
    console.error(`Error inserting invoice (payment ${status}):`, invoiceDoc);
    return res.status(500).json({ error: `Error inserting invoice (payment ${status})`, status: 500 })

  }

  try {
    const data = await resend.emails.send({
      from: 'DigitalHippo <hello@joshtriedcoding.com>',
      to: [customerEmail],
      subject:
        'Thanks for your order! This is your receipt.',
      html: ReceiptEmailHtml({
        date: new Date(),
        email: customerEmail,
        orderId: invoiceData.invoiceId,
        //   TODO: GET INVOICE INFO
        products: [],
      }),
    })
    return res.status(200).json({ status: 200, message: `Invoice payment ${status}`, data: invoiceDoc, })


  } catch (error) {
    return res.status(500).json({ error: `Error inserting invoice (payment ${status})`, status: 500 })

  }

  return res.status(200).json({
    status: 200, message: `Invoice payment ${status}`,
    data: invoiceDoc,
  })



}


async function handleCheckoutSessionCompleted(
  event: Stripe.Event,
  res: express.Response
) {
  const payload = await getPayloadClient()
  const session = event.data.object as Stripe.Checkout.Session;
  const metadata = session.metadata;

  if (metadata?.subscription === 'true') {
    const subscriptionId = session.subscription;
    try {
      await stripe.subscriptions.update(subscriptionId as string, { metadata });

      const invoiceDoc = await payload.update({
        collection: 'invoices',
        where: {
          subscriptionId: subscriptionId,
        },
        data: {
          ownedBy: metadata?.userId
        }
      } as any)

      if (!invoiceDoc) throw new Error('Error updating invoice');

      const userDoc = await payload.update({
        collection: 'users',
        id: metadata?.userId,
        data: {
          subscription: session.id
        }
      } as any)

      if (!userDoc) throw new Error('Error updating user subscription');

      return res.status(200).json({
        status: 200,
        message: 'Subscription metadata updated successfully',
      })

    } catch (error) {
      console.error('Error updating subscription metadata:', error);
      // return NextResponse.json({
      //     status: 500,
      //     error: 'Error updating subscription metadata',
      // });
      return res.status(500).json({ error: 'Error updating subscription metadata', status: 500 })

    }
  } else {

    // const dateTime = new Date(session.created * 1000).toISOString();
    try {
      const { docs: users } = await payload.find({
        collection: 'users',
        where: {
          id: metadata?.userId,
        },
      } as any)

      const [user] = users

      if (!user)
        return res
          .status(404)
          .json({ error: 'No such user exists.' })

      const { docs: orders } = await payload.find({
        collection: 'orders',
        depth: 2,
        where: {
          id: {
            equals: metadata?.orderId,
          },
        },
      })

      const [order] = orders

      if (!order)
        return res
          .status(404)
          .json({ error: 'No such order exists.' })

      await payload.update({
        collection: 'orders',
        data: {
          _isPaid: true,
        },
        where: {
          id: {
            equals: metadata?.orderId,
          },
        },
      })

      // send receipt
      try {
        const data = await resend.emails.send({
          from: 'AWSHCommerce <hello@awsh.net>',
          //   @ts-ignore
          to: [user.email],
          subject:
            'Thanks for your order! This is your receipt.',
          html: ReceiptEmailHtml({
            date: new Date(),
            //   @ts-ignore
            email: user.email,
            //   @ts-ignore
            orderId: metadata.orderId,
            products: order.products as Product[],
          }),
        })
        return res.status(200).json({ data })
      } catch (error) {
        return res.status(500).json({ error })
      }

      // const paymentData = {
      //     user_id: metadata?.userId,
      //     stripe_id: session.id,
      //     email: metadata?.email,
      //     amount: session.amount_total! / 100,
      //     customer_details: JSON.stringify(session.customer_details),
      //     payment_intent: session.payment_intent,
      //     payment_time: dateTime,
      //     currency: session.currency,
      // };

      return res.status(200).json({
        status: 200,
        message: 'OK',
      })
    } catch (error) {
      console.error('Error handling checkout session:', error);
      return res.status(500).json({ error, status: 500 })

    }
  }
}