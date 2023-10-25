import mongoRoute from "@/app/context/mongoroute"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from 'bcrypt'
import { SignJWT } from "jose"
import { nanoid } from "nanoid"
import { getJwtSecretKey } from "@/lib/auth"
import cookie from 'cookie'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest, res: NextResponse) {
    const requestHeaders = new Headers(request.headers)

    //const client = await mongoRoute()

    const data = await request.json()

    const {email, password } = data

    if (!email || !password) {
        return NextResponse.json('hey there no name')


     }


     if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        

        const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256'}).setJti(nanoid()).setIssuedAt().setExpirationTime('1d').sign(new TextEncoder().encode(getJwtSecretKey()))

        //const response = NextResponse.next()


        //user-token has to be the name we used to delete and see if auth but i have to see if the cookie.serialize name changes anything or i just name it when i do set
        cookies().set('user-token', cookie.serialize('user-token', token, {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production'
        } )
         )

         return NextResponse.json({success: true})
     }



    throw new Error('problem with making token')


   



}