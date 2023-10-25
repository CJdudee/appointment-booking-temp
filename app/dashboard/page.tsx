import Link from 'next/link'
import React, { FC } from 'react'

interface dashboardProps {

}

const dashboard: FC<dashboardProps> = async ({}) => {

  //const {data: days, mutate} = useSWR("/api/frontend/days", fetcher)

  // const daysJson = await fetch('http://localhost:3000/api/frontend/days')

  return (
    <div className='flex h-screen w-full items-center justify-center gap-8 font-medium'>
      <Link className='rounded-md bg-gray-100 p-2' href='/dashboard/opening'>Opening Hours</Link>
      <Link className='rounded-md bg-gray-100 p-2' href='/dashboard/menu'>Menu</Link>
    </div>
  )
}


export default dashboard