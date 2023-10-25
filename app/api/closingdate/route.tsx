import ClosedDay from "@/model/ClosedDay"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, res: NextResponse) {

    //const client = await mongoRoute()

    await mongoose.connect(`${process.env.MONGODB_URI}`)

    

   

    
    const ClosedDays = await ClosedDay.find().select('date').exec()

    if(!ClosedDays) {
        return NextResponse.json('no items')
    }

    

     

    return NextResponse.json(ClosedDays)

}

export async function POST(req: NextRequest,  res: NextResponse) {

    await mongoose.connect(`${process.env.MONGODB_URI}`)


    const data = await req.json()

    const { date } = data

    if(!date) {
        return NextResponse.json('no date was found')
    }

    const closingDate = await ClosedDay.create({date})

    return NextResponse.json(closingDate)

}

export async function DELETE(req: NextRequest, res: NextResponse) {

    await mongoose.connect(`${process.env.MONGODB_URI}`)


    const data = await req.json()

    const { date } = data

    if (!date) throw new Error('no id')

    const deletedDate = await ClosedDay.findOneAndDelete({date})


    return NextResponse.json(deletedDate)

}