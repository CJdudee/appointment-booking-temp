import { s3 } from "@/lib/s3"
import MenuItem from "@/model/MenuItem"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest, res: NextResponse) {

    //const client = await mongoRoute()

    const data = await req.json()

    const { products } = data
    // console.log(products)

    await mongoose.connect(`${process.env.MONGODB_URI}`)

    // try {
    //     // var menuItem = await MenuItem.findMany({
    //     //     _id: products.map((i: any) => i.id)
    //     // }).exec()
        
    // } catch (error) {
    //     console.log(error)
    // }

    const menuItem = await MenuItem.find({
        _id: products.map((i: any) => i.id)
    }).exec()
    

    if (!menuItem) return NextResponse.json({ empty: 'No Menu Item was found'}, {status: 200})

    const withUrls = await Promise.all(
        menuItem.map(async (menuItem: any) => {

            return {
                ...menuItem,
                url: await s3.getSignedUrlPromise('getObject', {
                Bucket: 'cj-s3-training',
                Key: menuItem.imageKey,
                }),
                quantity: products.find((item: any) => item.id == menuItem._doc._id)?.quantity
            }

        }
        )
        )
        

    return NextResponse.json(withUrls)

}