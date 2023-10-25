import mongoose from "mongoose"
import ClosedDay from '@/model/ClosedDay'
import { NextRequest, NextResponse } from "next/server"


export async function GET(req: NextRequest, res: NextResponse) {

    //const client = await mongoRoute()

    await mongoose.connect(`${process.env.MONGODB_URI}`)

    
    const ClosedDays = await ClosedDay.find().exec()

    if (!ClosedDays) return NextResponse.json({ empty: 'No Menu Item was found'})

    
    

    return NextResponse.json(ClosedDays)
}