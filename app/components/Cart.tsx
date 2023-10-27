'use client'

import { capitalize, fetcher } from '@/utils/helpers'
import { Spinner } from '@chakra-ui/react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import React, { Dispatch, Fragment, SetStateAction, useEffect, useState } from 'react'
import { HiX } from 'react-icons/hi'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {BsCart} from 'react-icons/bs'

interface cartProps { 
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    products: { id: string; quantity: number}[]
    removeFromCart: (id: string) => void
}

async function sendRequest(url: any, { arg }: { arg: { products: any }}) {
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify({products: arg.products})
    }).then(res => res.json())
  }
async function fetchCartItem(url: any, { arg }: { arg: { products: any }}) {
    return await fetch(url, {
      method: 'POST',
      body: JSON.stringify({products: arg.products})
    }).then(res => res.json())
  }

//   open, setOpen, products, removeFromCart

export default function Cart({open, setOpen, products, removeFromCart}: cartProps) {
    const [subtotal, setSubTotal ] = useState(0)
    const router = useRouter()


    // const {data: itemsInCart , isLoading: loadingClosedDaysFerch, mutate: fetchClosedDays }  = useSWR(products ? ['/api/frontend/getcartitem', products] : null, fetcher)

    const {data: itemsInCart, trigger: fetchItem,} = useSWRMutation(products ? '/api/frontend/getcartitem' : null, fetchCartItem)

    const {data:stripURL, trigger: checkout, isMutating:isLoading } = useSWRMutation('/api/frontend/checkout', sendRequest, { onSuccess: onSuccess})


    useEffect(() => {
      if(!products.length) return
      fetchItem({products})
    }, [products])
  

    

    function onSuccess({url, key, config}: any) {
      console.log(url)
      
      // console.log(stripURL)
      // console.log(data)
      // router.push(data.url)

        // localStorage.setItem('products', JSON.stringify(products))
    }

    useEffect(() => {
      if(!stripURL?.url) return

      localStorage.setItem('products', JSON.stringify(products))
      
      router.push(stripURL.url)
    }, [stripURL])

    useEffect(() => {
      
    }, [isLoading])
  

    //get cart items
    //const {data: }
    
    
    //might have to be put into a useEffect 

    useEffect(() => {
      if(!itemsInCart) return
        const subtotal = (
          itemsInCart.reduce(
          (acc:any, item:any) => acc + item._doc.price * itemsInCart.find((i:any) => i._doc._id === item._doc._id)!.quantity!,
          0
        ) ?? 0
      ).toFixed(2)
          console.log(itemsInCart)
      console.log(subtotal)

      setSubTotal(subtotal)
    }, [itemsInCart])
   


  return (
    

  <Transition.Root show={open} as={Fragment}>
    <Dialog as='div' className='relative z-10' onClose={setOpen}>
      <Transition.Child
        as={Fragment}
        enter='ease-in-out duration-500'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='ease-in-out duration-500'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'>
        <div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
      </Transition.Child>

      <div className='fixed inset-0 overflow-hidden'>
        <div className='absolute inset-0 overflow-hidden'>
          <div className='pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10'>
            <Transition.Child
              as={Fragment}
              enter='transform transition ease-in-out duration-500 sm:duration-700'
              enterFrom='translate-x-full'
              enterTo='translate-x-0'
              leave='transform transition ease-in-out duration-500 sm:duration-700'
              leaveFrom='translate-x-0'
              leaveTo='translate-x-full'>
              <Dialog.Panel className='pointer-events-auto w-screen max-w-md'>
                <div className='flex h-full flex-col overflow-y-scroll bg-white shadow-xl'>
                  <div className='flex-1 overflow-y-auto py-6 px-4 sm:px-6'>
                    <div className='flex items-start justify-between'>
                      <Dialog.Title className='text-lg font-medium text-gray-900'>
                        Shopping cart
                      </Dialog.Title>
                      <div className='ml-3 flex h-7 items-center'>
                        <button
                          type='button'
                          className='-m-2 p-2 text-gray-400 hover:text-gray-500'
                          onClick={() => setOpen(false)}>
                          <span className='sr-only'>Close panel</span>
                          <HiX className='h-6 w-6' aria-hidden='true' />
                        </button>
                      </div>
                    </div>

                    <div className='mt-8'>
                      <div className='flow-root'>
                        <ul role='list' className='-my-6 divide-y divide-gray-200'>
                          {itemsInCart?.map((item:any) => {
                            const thisItem = products.find((product) => product.id === item._doc._id)
                            return (
                              <li key={item._doc.id} className='flex py-6'>
                                <div className='h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200'>
                                  <img
                                    src={item.url}
                                    alt={item._doc.name}
                                    className='h-full w-full object-cover object-center'
                                  />
                                </div>

                                <div className='ml-4 flex flex-1 flex-col'>
                                  <div>
                                    <div className='flex justify-between text-base font-medium text-gray-900'>
                                      <h3>
                                        <p>{item._doc.name}</p>
                                      </h3>
                                      <p className='ml-4'>${item._doc.price.toFixed(2)}</p>
                                    </div>
                                    <p className='mt-1 text-sm text-gray-500'>
                                      {item._doc.categories.map((c: string) => capitalize(c)).join(', ')}
                                    </p>
                                  </div>
                                  <div className='flex flex-1 items-end justify-between text-sm'>
                                    <p className='text-gray-500'>Qty {thisItem?.quantity}</p>

                                    <div className='flex'>
                                      <button
                                        type='button'
                                        onClick={() =>{
                                          if (!thisItem) return
                                           removeFromCart(thisItem.id)
                                        }}
                                        className='font-medium text-indigo-600 hover:text-indigo-500'>
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className='border-t border-gray-200 py-6 px-4 sm:px-6'>
                    <div className='flex justify-between text-base font-medium text-gray-900'>
                      <p>Subtotal</p>
                      <p>${subtotal}</p>
                    </div>
                    <p className='mt-0.5 text-sm text-gray-500'>
                      Shipping and taxes calculated at checkout.
                    </p>
                    <div className='mt-6'>
                      <button
                        onClick={() => checkout({ products })}
                        className='flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700'>
                        {isLoading ? <Spinner /> : 'Checkout'}
                      </button>
                    </div>
                    <div className='mt-6 flex justify-center text-center text-sm text-gray-500'>
                      <p>
                        or
                        <button
                          type='button'
                          className='ml-1 font-medium text-indigo-600 hover:text-indigo-500'
                          onClick={() => setOpen(false)}>
                          Continue Shopping
                          <span aria-hidden='true'> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </div>
    </Dialog>
  </Transition.Root>

    

  )
}
