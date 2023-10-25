import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function middleware(request: NextRequest){

    const token = cookies().get('user-token')?.value


    //validate if the user is authenticated

    const verifiedToken = token && (await verifyAuth(token).catch((err) => {
        console.log(err)
    }))
    

    if(request.nextUrl.pathname.startsWith('/login') && !verifiedToken) {
        return 
    }


    if(request.url.includes('/login') && verifiedToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }


    if(!verifiedToken) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if(request.nextUrl.pathname.startsWith('/api') && !verifiedToken) {

        throw new Error('Only the admin can make changes')

    }

}


export const config = {
    matcher: ['/dashboard/:path*', '/api/:path*']
}