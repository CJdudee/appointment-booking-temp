import mongoose from "mongoose"
import Day from '@/model/Day'
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest, res: NextResponse) {

    //const client = await mongoRoute()

    await mongoose.connect(`${process.env.MONGODB_URI}`)

    
    const Days = await Day.find().exec()

    if (!Days) return NextResponse.json({ empty: 'No Menu Item was found'})

    
    

    return NextResponse.json(Days)
}