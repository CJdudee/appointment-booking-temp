'use client'

import { OPENING_HOURS_INTERVAL, STORE_CLOSING_TIME, STORE_OPENING_TIME, now } from '@/app/constants/config'
import { getOpeningTimes, roundToNearestMinutes } from '@/utils/helpers'
import { DateType, Day } from '@/utils/types'
import { add, format, formatISO, isBefore, parse, parseISO } from 'date-fns'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import ReactCalendar from 'react-calendar'
import './Calendar.css'

interface CalendarProps {
    days: Day[]
    closedDaysISO: String[]
}





const index: FC<CalendarProps> = ({ days , closedDaysISO }) => {

    const router = useRouter()
    
    //console.log(days)

    const today = days.find((d: any) => d.dayOfWeek === now.getDay())

    const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL)
    const closing = parse(today!.closeTime, 'kk-mm', now)
    const tooLate = !isBefore(rounded, closing)

    if(tooLate) closedDaysISO.push(formatISO(new Date()))

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

    
    const times = date.justDate && getOpeningTimes(date.justDate, days)

    //console.log(closedDaysISO, 'heyoo')

  return (
    <div className='h-screen flex flex-col justify-center items-center  px-4'>
        { date.justDate ? (
        <div className='flex gap-4 ' >
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
        tileDisabled={({ date }) => {
            //console.log(formatISO(date), 'Calendar')
            // console.log(new Date (closedDaysISO), 'closedDays')
            return closedDaysISO.includes(formatISO(date))
        }}
        className='REACT_CALENDAR p-2' 
        view='month' 
        onClickDay={(date) => setDate((prev) => ({...prev , justDate: date})) }/>
        )}
    </div>
  )
}


export default index