'use client'

import { capitalize, selectOptions } from '@/utils/helpers'
import Image from 'next/image'
import React, { useState } from 'react'

import { FC } from 'react'
import { HiArrowLeft } from 'react-icons/hi'
import ReactSelect from 'react-select'
import useSWR from 'swr'

interface MenuProps {
  selectedTime: string //ISODate string
}
//@ts-ignore
const fetcher = (...args: any) => fetch(...args).then(res => res.json())

const FrontendMenu: FC<MenuProps> = ({ selectedTime }) => {
    const { data: menuItems, isLoading, mutate } = useSWR('/api/menu', fetcher) 
    const [ filter, setFilter ] = useState<string | undefined>('')

    const filteredMenuItems = menuItems?.filter((menuItem: any) => {
        if (!filter) return true

        return menuItem._doc.categories.includes(filter)

    })

    


    return (
        <div className='bg-white'>
      <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 lg:max-w-full'>
        <div className='flex w-full justify-between'>
          <h2 className='flex items-center gap-4 text-2xl font-bold tracking-tight text-gray-900'>
            
          </h2>
          <ReactSelect
            onChange={(e) => {
              if (e?.value === 'all') setFilter(undefined)
              else setFilter(e?.value)
            }}
            className='border-none outline-none'
            placeholder='Filter by...'
            options={selectOptions}
          />
        </div>

        <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8'>
          {filteredMenuItems?.map((menuItem: any) => (
            <div key={menuItem._doc._id} className='group relative'>
              <div className='min-h-80 aspect-w-1 aspect-h-1 lg:aspect-none w-full overflow-hidden rounded-md bg-gray-200 hover:opacity-75 lg:h-80'>
                <div className='relative h-full w-full object-cover object-center lg:h-full lg:w-full'>
                  {/* <Image src={menuItem.url} alt={menuItem._doc.name} fill style={{ objectFit: 'cover' }} /> */}
                  <Image src={menuItem.url} alt={menuItem._doc.name}  style={{ objectFit: 'cover' }} width={200} height={200} />
                </div>
              </div>
              <div className='mt-4 flex justify-between'>
                <div>
                  <h3 className='text-sm text-gray-700'>
                    <p>{menuItem._doc.name}</p>
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    {menuItem._doc.categories.map((c: string) => capitalize(c)).join(', ')}
                  </p>
                </div>
                <p className='text-sm font-medium text-gray-900'>${menuItem._doc.price.toFixed(2)}</p>
              </div>

              <button onClick={() => console.log(menuItem)}>heylp</button>

              
            </div>
          ))}
        </div>
      </div>
    </div>
    )
}

export default FrontendMenu