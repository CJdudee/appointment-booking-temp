'use client'

import { OPENING_HOURS_INTERVAL, STORE_CLOSING_TIME, STORE_OPENING_TIME, now } from '@/app/constants/config'
import { getOpeningTimes, roundToNearestMinutes } from '@/utils/helpers'
import { DateType, Day } from '@/utils/types'
import { add, format, formatISO, isBefore, parse } from 'date-fns'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import ReactCalendar from 'react-calendar'
import './Calendar.css'

interface CalendarProps {
    days: Day[]
    closedDaysISO: string[]
}





const index: FC<CalendarProps> = ({ days , closedDaysISO }) => {

    const router = useRouter()
    
    console.log(days)

    const today = days.find((d: any) => d.dayOfWeek === now.getDay())

    const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL)
    const closing = parse(today!.closeTime, 'kk-mm', now)
    const tooLate = !isBefore(rounded, closing)

    if(tooLate) closedDaysISO.push(formatISO(new Date().setHours(0,0,0,0)))

    const [ date, setDate ] = useState<DateType>({
        justDate: null, 
        dateTime: null
    })

    useEffect(() => {

        if (date.dateTime) {
            localStorage.setItem('selectedTime', date.dateTime.toISOString())

            router.push('/menu')

        }

    }, [date.dateTime])

    // const getTimes = () => {
    //     if(!date.justDate) return 

    //     const { justDate } = date

    //     const beginning = add(justDate, {hours: STORE_OPENING_TIME})
    //     const end = add(justDate, {hours: STORE_CLOSING_TIME})
    //     const interval = OPENING_HOURS_INTERVAL // in minutes

    //     const times = [] 
    //     for (let i = beginning; i <= end; i = add(i, {minutes: interval})) {
    //         times.push(i)
    //     }

    //     return times 
    // }

    const times = date.justDate && getOpeningTimes(date.justDate, days)

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
        { date.justDate ? (
        <div className='flex gap-4'>
            {times?.map((time, i) => (
                <div key={`time-${i}`} className='rounded-sm bg-gray-100 p-2'>
                    <button type='button' onClick={() => setDate((prev) => ({...prev, dateTime: time}))}>
                        {format(time, 'kk:mm')}
                    </button>
                </div>
            ))}
        </div>
        ) : 
        ( 
        <ReactCalendar  minDate={new Date()}
        //tileDisabled={({ date }) => closedDaysISO.includes(formatISO(date))}
        className='REACT_CALENDAR p-2' 
        view='month' 
        onClickDay={(date) => setDate((prev) => ({...prev , justDate: date})) }/>
        )}
    </div>
  )
}


export default index