import { MAX_FILE_SIZE } from "@/app/constants/config";
import mongoRoute from "@/app/context/mongoroute";
import { s3 } from "@/lib/s3";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest, res: NextResponse) {

    const id = nanoid()

    //const client = await mongoRoute()

    const data = await req.json()

    const { fileType } = data

    const ex = fileType.split('/')[1] // /jpeg 

    const key = `${id}-${ex}`

    const { url, fields } = await new Promise(( resolve, reject) => {

        s3.createPresignedPost({
            Bucket: 'cj-s3-training',
            Fields: {key},
            Expires: 120,
            Conditions: [
                ['content-length-range', 0, MAX_FILE_SIZE],
                ['starts-with', '$Content-type', 'image/'],
            ]
        },
        (err, data) => {
            if(err) return reject(err)

            resolve(data)
        }
        )

    }) as any as { url: string; fields: any}
    
    return NextResponse.json({ url, fields, key }) 

}