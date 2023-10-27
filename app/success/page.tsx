'use client'
import { capitalize, fetcher } from '@/utils/helpers'
import { Spinner } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'



async function fetchCartItem(url: any, { arg }: { arg: { products: any }}) {
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify({products: arg.products})
  }).then(res => res.json())
}

export default function page() {
    
    const [products, setProducts ] = useState<any>(null)
    const [total, setTotal ] = useState(0)

    // const {data: itemsInCart , isLoading: loadingClosedDaysFerch, mutate: fetchClosedDays }  = useSWR(products ? ['/api/frontend/getcartitem', products] : null, fetcher)
    

    const {data: itemsInCart, trigger: fetchItem,} = useSWRMutation(products ? '/api/frontend/getcartitem' : null, fetchCartItem)

    useEffect(() => {
      if (!itemsInCart) return

      const total = (
        itemsInCart?.reduce(
            (acc:any, item:any) => acc + item._doc.price * itemsInCart.find((i: any) => i._doc._id === item._doc._id)!.quantity, 0
        ) ?? 0
    ).toFixed(2)

    setTotal(total)


    }, [itemsInCart])

    

    useEffect(() => {
        const products = localStorage.getItem('products')
        
        if (!products) return setProducts(false)

        setProducts(JSON.parse(products)) 
        // console.log(products)


    }, [])

    useEffect(() => {
      if(products == null || false) return
      console.log(products)
      fetchItem({products})
    }, [products])

    if (products === null) {
        return (
            <div className='h-screen w-screen'>
                <Spinner color='indigo' size={'xl'} />
            </div>
        )
    }

    if (products === false) return <div className='flex justify-center gap-2'>
      <p className='text-xl font-bold'>you have no bussiness here partner</p>
      <Link className='text-xl font-bold text-purple-500 cursor-pointer' href={'/menu'}>Go Home</Link>
    </div>

  return (
    <main className='relative lg:min-h-full'>
      <div className='h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
        <img
          src='https://tailwindui.com/img/ecommerce-images/confirmation-page-06-hero.jpg'
          alt='TODO'
          className='h-full w-full object-cover object-center'
        />
      </div>

      <div>
        <div className='mx-auto max-w-2xl py-16 px-4 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
          <div className='lg:col-start-2'>
            <h1 className='text-sm font-medium text-indigo-600'>Payment successful</h1>
            <p className='mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl'>
              Thanks for ordering
            </p>
            <p className='mt-2 text-base text-gray-500'>
              We appreciate your order, we’re currently processing it. So hang tight and we’ll send you
              confirmation very soon!
            </p>

            <dl className='mt-16 text-sm font-medium'>
              <dt className='text-gray-900'>Your order summary</dt>
            </dl>

            <ul
              role='list'
              className='mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-gray-500'>
              {itemsInCart?.map((item: any) => (
                <li key={item._doc._id} className='flex space-x-6 py-6'>
                  <img
                    src={item.url}
                    alt={item._doc.name}
                    className='h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center'
                  />
                  <div className='flex-auto space-y-1'>
                    <h3 className='text-gray-900'>
                      <p>{item._doc.name}</p>
                    </h3>
                    <p>{item._doc.categories.map((c: string) => capitalize(c)).join(', ')}</p>
                  </div>
                  <p className='flex-none font-medium text-gray-900'>${item._doc.price.toFixed(2)}</p>
                </li>
              ))}
            </ul>

            <dl className='space-y-6 pt-6 text-sm font-medium text-gray-500'>
              <div className='flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900'>
                <dt className='text-base'>Total</dt>
                <dd className='text-base'>${total}</dd>
              </div>
            </dl>

            <div className='mt-16 border-t border-gray-200 py-6 text-right'>
              <Link href='/menu' className='text-sm font-medium text-indigo-600 hover:text-indigo-500'>
                Continue Shopping<span aria-hidden='true'> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
