import mongoRoute from "@/app/context/mongoroute"
import { s3 } from "@/lib/s3"
import MenuItem from "@/model/MenuItem"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest, res: NextResponse) {

    //const client = await mongoRoute()

    await mongoose.connect(`${process.env.MONGODB_URI}`)

    
    const menuItem = await MenuItem.find().exec()

    if (!menuItem) return NextResponse.json({ empty: 'No Menu Item was found'})

    const withUrls = await Promise.all(
        menuItem.map(async (menuItem: any) => {

            return {
                ...menuItem,
                url: await s3.getSignedUrlPromise('getObject', {
                Bucket: 'cj-s3-training',
                Key: menuItem.imageKey,
                })
            }

        }
    )
    )
    

    return NextResponse.json(withUrls)

}