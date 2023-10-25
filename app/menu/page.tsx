'use client'
import { fetcher } from '@/utils/helpers'
import { formatISO, parseISO } from 'date-fns'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { now } from '../constants/config'
import FrontendMenu from '../components/FrontendMenu'
import Spinner from '../components/Spinner'

interface menuProps {}

export default function page({}: menuProps) {

    const router = useRouter()

    const [ selectedTime, setSelectedTime ] = useState<string | null>(null)

    const { data: checkDateMenu, isLoading, mutate, error } = useSWR(selectedTime ? '/api/frontend/checkdate' : null, fetcher)

    //if checkDateMenu api fails user will get pushed to '/'

    // if(error) {
    //     router.push('/')
    // }

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
    {checkDateMenu && selectedTime ? (
        <>
        <p className='flex justify-center text-xl'>{selectedTime}</p>
        <div className='flex justify-center'>
        <button className='hover:text-gray-300' onClick={() => router.push('/')}>Back to Time selection</button>
        </div>
        <FrontendMenu selectedTime={selectedTime} />
        </>
    ): 
    (
        <div className='flex h-screen items-center justify-center'>
            <Spinner />
        </div>
    )}
    </>
  )
}
