import { s3 } from "@/lib/s3"
import Day from "@/model/Day"
import MenuItem from "@/model/MenuItem"
import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest, res: NextResponse) {

    //const client = await mongoRoute()

    await mongoose.connect(`${process.env.MONGODB_URI}`)

    const data = await req.json()

    const { days } = data

    // if (day.openTime || day.closeTime) {}

    // const result = await Promise.all(
        const result = days.map(async (day: any) => {
            // const foundDay = await Day.findOne({name: day.name}).exec()
            const foundDay = await Day.findOneAndUpdate({name: day.name}, { openTime: day.openTime, closeTime: day.closeTime})
    
            // await foundDay.openTime = day.openTime
            // await foundDay.closeTime = day.closeTime

            // console.log(foundDay)
            //console.log(day)
    
            // const savedUser = await foundDay.save()

            return foundDay
        })
    // )

    // const savedHours = days.map(async (day: any) => {
    //     const foundDay = await Day.find({name: day.name}).exec()

    //     foundDay.openingTime = day.openingTime
    //     foundDay.closingTime = day.closingTime

    //     await foundDay.save()

    // })

    // const menuItem = await MenuItem.find().exec()

    //  const result = await Promise.all(
    //     input.map(as)
    //  )

    return NextResponse.json([result])

}

//so i have to map over the day array im gettting from data to do a mongosoe search and update and if no day is found make a Day in mongodb