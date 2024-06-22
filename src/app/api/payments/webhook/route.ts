import { getPayloadClient } from "@/get-payload";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from 'resend'
import { ReceiptEmailHtml } from "@/components/emails/ReceiptEmail";

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
    const reqText = await req.text();


    return webhooksHandler(reqText, req);
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

) {
    const payload = await getPayloadClient()
    const subscription = event.data.object as Stripe.Subscription;
    const customerEmail = await getCustomerEmail(subscription.customer as string);

    if (!customerEmail) {
        return NextResponse.json({
            status: 500,
            error: 'Customer email could not be fetched',
        });
    }

    const subscriptionData = {
        stripeSubscriptionID: subscription.id,
        stripeCustomerID: subscription.customer,
        status: subscription.status,
        startDate: new Date(subscription.created * 1000).toISOString(),
        planId: subscription.items.data[0]?.price.id,
        ownedBy: subscription.metadata?.userId || '',
        email: customerEmail,
    };
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
        //   ({ data, error } = await supabase
        //     .from('subscriptions')
        //     .update({ status: 'cancelled', email: customerEmail })
        //     .match({ subscription_id: subscription.id })
        //     .select());
        //   if (!error) {
        //     const { error: userError } = await supabase
        //       .from('user')
        //       .update({ subscription: null })
        //       .eq('email', customerEmail);
        //     if (userError) {
        //       console.error('Error updating user subscription status:', userError);
        //       return NextResponse.json({
        //         status: 500,
        //         error: 'Error updating user subscription status',
        //       });
        //     }
        //   }
    }
    if (type === 'created') {
        subscriptionDoc = await payload.create({
            collection: 'subscriptions',
            data: subscriptionData,
        } as any)
    }
    // @ts-ignore
    if (type === 'insert' || type === 'update') {
        subscriptionDoc = await payload.update({
            collection: 'subscriptions',
            data: subscriptionData,
            where: {
                stripeCustomerID: subscriptionData.stripeCustomerID
            }
        } as any)
    }

    if (!subscriptionDoc) {
        console.error(`Error during subscription ${type}:`, subscriptionDoc);
        return NextResponse.json({
            status: 500,
            error: `Error during subscription ${type}`,
        });
    }


    // else {
    //     if()

    //   ({ data, error } = await supabase
    //     .from('subscriptions')
    //     [type === 'created' ? 'insert' : 'update'](
    //       type === 'created' ? [subscriptionData] : subscriptionData
    //     )
    //     .match({ subscription_id: subscription.id })
    //     .select());
    // }
    // if (error) {
    //     console.error(`Error during subscription ${type}:`, error);
    //     return NextResponse.json({
    //         status: 500,
    //         error: `Error during subscription ${type}`,
    //     });
    // }

    return NextResponse.json({
        status: 200,
        message: `Subscription ${type} success`,
        data: subscriptionDoc,
    });
}

async function handleInvoiceEvent(
    event: Stripe.Event,
    status: 'succeeded' | 'failed',
) {
    const payload = await getPayloadClient()
    const invoice = event.data.object as Stripe.Invoice;
    const customerEmail = await getCustomerEmail(invoice.customer as string);

    if (!customerEmail) {
        return NextResponse.json({
            status: 500,
            error: 'Customer email could not be fetched',
        });
    }

    const invoiceData = {
        invoiceId: invoice.id,
        subscriptionId: invoice.subscription as string,
        amountPaid: status === 'succeeded' ? invoice.amount_paid / 100 : undefined,
        amountDue: status === 'failed' ? invoice.amount_due / 100 : undefined,
        currency: invoice.currency,
        status,
        ownedBy: invoice.metadata?.userId,
        email: customerEmail,
    };


    const invoiceDoc = await payload.create({
        collection: 'invoices',
        data: invoiceData,
    } as any)

    if (!invoiceDoc) {
        console.error(`Error inserting invoice (payment ${status}):`, invoiceDoc);
        return NextResponse.json({
            status: 500,
            error: `Error inserting invoice (payment ${status})`,
        });
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
        NextResponse.json({
            status: 200,
            message: `Invoice payment ${status}`,
            data: invoiceDoc,
        });
    } catch (error) {
        return NextResponse.json({
            status: 500,
            // TODO: MAYBE CHANGE ERROR MESSAGE
            error: `Error inserting invoice (payment ${status})`,
        });
    }

    return NextResponse.json({
        status: 200,
        message: `Invoice payment ${status}`,
        data: invoiceDoc,
    });
}


async function handleCheckoutSessionCompleted(
    event: Stripe.Event,
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
                where: {
                    subscriptionId: subscriptionId,
                },
                data: {
                    subscription: session.id
                }
            } as any)

            if (!userDoc) throw new Error('Error updating user subscription');

            return NextResponse.json({
                status: 200,
                message: 'Subscription metadata updated successfully',
            });
        } catch (error) {
            console.error('Error updating subscription metadata:', error);
            return NextResponse.json({
                status: 500,
                error: 'Error updating subscription metadata',
            });
        }
    } else {
        const dateTime = new Date(session.created * 1000).toISOString();
        try {
            const userDoc = await payload.find({
                collection: 'users',
                where: {
                    id: metadata?.userId,
                },
            } as any)

            if (!userDoc) throw new Error('Error fetching user');

            const paymentData = {
                user_id: metadata?.userId,
                stripe_id: session.id,
                email: metadata?.email,
                amount: session.amount_total! / 100,
                customer_details: JSON.stringify(session.customer_details),
                payment_intent: session.payment_intent,
                payment_time: dateTime,
                currency: session.currency,
            };

            // const { data: paymentsData, error: paymentsError } = await supabase
            //     .from('payments')
            //     .insert([paymentData]);
            // if (paymentsError) throw new Error('Error inserting payment');

            // const updatedCredits =
            //     Number(user?.[0]?.credits || 0) + (session.amount_total || 0) / 100;
            // const { data: updatedUser, error: userUpdateError } = await supabase
            //     .from('user')
            //     .update({ credits: updatedCredits })
            //     .eq('user_id', metadata?.userId);
            // if (userUpdateError) throw new Error('Error updating user credits');

            return NextResponse.json({
                status: 200,
                message: 'OK',
                // message: 'Payment and credits updated successfully',
                // updatedUser,
            });
        } catch (error) {
            console.error('Error handling checkout session:', error);
            return NextResponse.json({
                status: 500,
                error,
            });
        }
    }
}
async function webhooksHandler(
    reqText: string,
    request: NextRequest,
): Promise<NextResponse> {

    const sig = request.headers.get('Stripe-Signature');

    try {
        const event = await stripe.webhooks.constructEventAsync(
            reqText,
            sig!,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        switch (event.type) {
            case 'customer.subscription.created':
                return handleSubscriptionEvent(event, 'created');
            case 'customer.subscription.updated':
                return handleSubscriptionEvent(event, 'updated');
            case 'customer.subscription.deleted':
                return handleSubscriptionEvent(event, 'deleted');
            case 'invoice.payment_succeeded':
                return handleInvoiceEvent(event, 'succeeded');
            case 'invoice.payment_failed':
                return handleInvoiceEvent(event, 'failed');
            case 'checkout.session.completed':
                return handleCheckoutSessionCompleted(event);
            default:
                return NextResponse.json({
                    status: 400,
                    error: 'Unhandled event type',
                });
        }
    } catch (err) {
        console.error('Error constructing Stripe event:', err);
        return NextResponse.json({
            status: 500,
            error: 'Webhook Error: Invalid Signature',
        });
    }

}