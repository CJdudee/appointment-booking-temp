import { s3 } from "@/lib/s3"
import MenuItem from "@/model/MenuItem"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import _stripe from 'stripe'

const stripe = new _stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16'
})


export async function POST(req: NextRequest, res: NextResponse) {

    //const client = await mongoRoute()

    const data = await req.json()

    const { products } = data

    console.log(products)

    try {
        
    

    await mongoose.connect(`${process.env.MONGODB_URI}`)

    
    const menuItem = await MenuItem.find({
        _id: products.map((i: any) => i.id)
    }).exec()

    if (!menuItem) return NextResponse.json({ empty: 'No Menu Item was found'})


    const mappedMenu = menuItem.map((p: any) => ( {
        ...p,
        quantity: products.find((product: any) => product.id == p._doc._id)?.quantity || 0
    }))

    //console.log(mappedMenu)


    if (mappedMenu.length !== products.length) return NextResponse.json('out of stock')

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],

        mode: 'payment',
        line_items: mappedMenu.map((product: any) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: product._doc.name
                },
                unit_amount: product._doc.price * 100,
            },
            quantity: product.quantity
        })),
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'usd',
                    },
                    display_name: 'pickup in store'
                },
            }
        ],
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/menu'
    })

    // const withUrls = await Promise.all(
    //     menuItem.map(async (menuItem: any) => {

    //         return {
    //             ...menuItem,
    //             url: await s3.getSignedUrlPromise('getObject', {
    //             Bucket: 'cj-s3-training',
    //             Key: menuItem.imageKey,
    //             }),
    //             quantity: products.find((item: any) => item._id === menuItem._id)
    //         }

    //     }
    // )
    // )

    return NextResponse.json({ url: session.url || ''})

} catch (error) {
        
    let msg = ''

    if (error instanceof Error) {
        msg = error.message
    }

    return NextResponse.json(msg)
}
    

    // return NextResponse.json(withUrls)

}