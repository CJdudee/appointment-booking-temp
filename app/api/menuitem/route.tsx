import { MAX_FILE_SIZE } from "@/app/constants/config";
import mongoRoute from "@/app/context/mongoroute";
import { s3 } from "@/lib/s3";
import { NextRequest, NextResponse } from "next/server";
import MenuItem from '@/model/MenuItem'
import mongoose from "mongoose";


export async function POST(req: NextRequest, res: NextResponse) {

    // const client = await mongoRoute()

    await mongoose.connect(`${process.env.MONGODB_URI}`)

    const data = await req.json()

    const { name, price, imageKey, categories } = data

    
    const NewMenuItem = await MenuItem.create({
        name, 
        price,
        imageKey,
        categories
    })

    

    return NextResponse.json(NewMenuItem)

}


export async function DELETE(req: NextRequest, res: NextResponse) {

    // const client = await mongoRoute()

    await mongoose.connect(`${process.env.MONGODB_URI}`)


    const data = await req.json()

    const { id, imageKey } = data

    //Delete the image from s3
    const Dels3 = await s3.deleteObject({ Bucket: 'cj-s3-training', Key: imageKey}).promise()

    const DelMenuItem = await MenuItem.findByIdAndDelete(id).exec()

    return NextResponse.json([Dels3, DelMenuItem])


}