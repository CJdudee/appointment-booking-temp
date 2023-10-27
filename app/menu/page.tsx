'use client'
import { fetcher } from '@/utils/helpers'
import { formatISO, parseISO } from 'date-fns'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { now } from '../constants/config'
import FrontendMenu from '../components/FrontendMenu'
import Spinner from '../components/Spinner'
import { BsCart } from 'react-icons/bs'
import Cart from '../components/Cart'
import useSWRMutation from 'swr/mutation'

interface menuProps {}

export default function page({}: menuProps) {

    const router = useRouter()

    const [ selectedTime, setSelectedTime ] = useState<string | null>(null)

    const [showCart, setShowCart] = useState(false)

    const [productsInCart, setProductsInCart] = useState<any>([])

    const addToCart = (id: string, quantity: number) => {
        //console.log(id, quantity)
        setProductsInCart((prev: any) => {
            //if(!prev) return 
            //console.log(prev)
            const existing = prev.find((item: any) => item.id === id)
            

            if(existing) {
                return prev.map((item: any) => {
                    if(item.id === id) return {...item, quantity: item.quantity + quantity }
                    else
                    return item
                })
            }

            return [...prev, {id, quantity}]
        })
        
        console.log(productsInCart)
    }

    const removeFromCart = (id: string) => {
        setProductsInCart((prev: any) => prev.filter((item: any) => item.id !== id))
    }

    //have to find a route where i see if the appointment has been taken by comparing dates or maybe can do better by see if the appointment will still be in process 
    const { data: checkDateMenu, isLoading, mutate, error } = useSWR(selectedTime ? '/api/frontend/checkdate' : null, fetcher)

    //if checkDateMenu api fails user will get pushed to '/'

    // if(error) {
    //     router.push('/')
    // }

    // function onSuccess({data, key, config}: any) {
    //     router.push(data.url)

    //     localStorage.setItem('products', JSON.stringify(products))
    // }

    
    // const { trigger: checkout, isMutating: isLoadingCheckout } = useSWRMutation('/api/frontend/getcartitem', sendRequest, { onSuccess: onSuccess})

    

    useEffect(() => {
        const selectedTime = localStorage.getItem('selectedTime')
        if (!selectedTime) router.push('/')
        else {
        const date = parseISO(selectedTime)
        if(date < now) router.push('/')

        setSelectedTime(selectedTime)

        mutate()

    }
    }, [])

  return (
      <>
      <Cart open={showCart} setOpen={setShowCart} removeFromCart={removeFromCart} products={productsInCart} />
    {checkDateMenu && selectedTime ? (
        <div className='mx-auto mt-12 max-w-7xl sm:px-6 lg:px-8'>
            {/* cart icon */}
            <div className='flex w-full justify-end'>
            <button type='button' onClick={() => setShowCart((prev:any) => !prev)}
            className='flex items-center justify-center rounded-lg bg-gray-200 p-3'
            >
                <BsCart className='mr-2 text-lg' />
                {productsInCart.reduce((acc:any, item:any) => acc + item.quantity, 0)}
            </button>
            </div>
        
        <FrontendMenu selectedTime={selectedTime} addToCart={addToCart} />
        </div>
    ): 
    (
        <div className='flex h-screen items-center justify-center'>
            <Spinner />
        </div>
    )}
    </>
  )
}
