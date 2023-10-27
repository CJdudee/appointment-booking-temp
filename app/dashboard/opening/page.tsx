'use client'

import { capitalize, fetcher, weedayIndexToName } from '@/utils/helpers'
import { Day } from '@/utils/types'
import { Switch } from '@headlessui/react'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { Button } from '@chakra-ui/react'
import Calendar from 'react-calendar'
import { now } from '@/app/constants/config'
import { formatISO, parseISO } from 'date-fns'
import TimeSelector from '@/app/components/TimeSelector'


interface openingProps {
  days: Day[]
  mutate: any
}


async function sendRequest(url: any, { arg }: { arg: { days: any }}) {
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify({days: arg.days})
  }).then(res => res.json())
}
async function sendCloseDate(url: any, { arg }: { arg: { date: Date }}) {
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify({date: arg.date})
  }).then((res) =>  res.json())
}
async function sendDeleteDate(url: any, { arg }: { arg: { date: Date }}) {
  return await fetch(url, {
    method: 'DELETE',
    body: JSON.stringify({date: arg.date})
  }).then(res => res.json())
}



export default  function page( ) {
  
  const [ enabled, setEnabled ] = useState<boolean>(false)
  const [selectedDate, setSelectedDate ] = useState<Date  | null>(null)
  const [openingHrs, setOpeningHrs] = useState<any>([{}])
  const [closedDays, setClosedDays ] = useState<any>([])
  const [ dayIsClosed, setDayIsClosed] = useState(false)

  //fetching days to change opening and closing hours
  const {data: days, mutate, isLoading} = useSWR("/api/frontend/days", fetcher)

  //fetching dates where the shops is closed// i have to see what is returned from closedDaysFetch and then check in an array or object to see if the selected date is closed already so i could send a DELETE request instead of a POST
  const {data: closedDaysFetch ,isLoading: loadingClosedDaysFerch, mutate: fetchClosedDays }  = useSWR('/api/closingdate', fetcher)

// useEffect to set the days of the week to be able to change the opening and closing time 
useEffect(() => {
  if(!isLoading && days) {
    setOpeningHrs([
      { name: 'sunday', openTime: days[0]!.openTime, closeTime: days[0]!.closeTime },
      { name: 'monday', openTime: days[1]!.openTime, closeTime: days[1]!.closeTime },
      { name: 'tuesday', openTime: days[2]!.openTime, closeTime: days[2]!.closeTime },
      { name: 'wednesday', openTime: days[3]!.openTime, closeTime: days[3]!.closeTime },
      { name: 'thursday', openTime: days[4]!.openTime, closeTime: days[4]!.closeTime },
      { name: 'friday', openTime: days[5]!.openTime, closeTime: days[5]!.closeTime },
      { name: 'saturday', openTime: days[6]!.openTime, closeTime: days[6]!.closeTime },
    ])
  }
}, [days])

  //A userEffect to set the SWR to a state and maping over 

  useEffect( () => {
    if(!closedDaysFetch && !loadingClosedDaysFerch) return 

    let dayisClosedArray: any[] = []

    

    async function filteringDate() {
      await closedDaysFetch?.map((c: any) => {
        dayisClosedArray.push(new Date(c.date))
        // dayisClosedArray.push((c.date))
        //  console.log((new Date(c.date)))
      })

    }

    filteringDate()

    setClosedDays(dayisClosedArray)
    console.log(dayisClosedArray)

  }, [closedDaysFetch])

  // might have to make a array to see if selectedDate is in closedDays.map() then push it from there to a new array to check and if the array has length its true else false

  useEffect(() => {
    if(!selectedDate && !closedDays) return 

    //this is for the date that is returned and set from the calendar which doesn't match if the date isn't a string so the date has to be turned into a string //refactoring is very needed for this
    let closedDaysArray: any[] = []
    closedDays.map((c: any) => {if ( c == `${selectedDate}`) closedDaysArray.push(c); else null})

    console.log(( selectedDate ))
    // async function workplz() {
    if (closedDaysArray.length) {

    // if ( closedDays.includes(`${selectedDate}`)) {
    // if ( closedDays.indexOf(selectedDate) !== -1) {

    // if (  closedDays.map((c:Date) => { console.log(typeof c, typeof selectedDate, c == selectedDate, c == 'Tue Oct 31 2023 00:00:00 GMT-0700 (Pacific Daylight Time)'); return c }) == selectedDate) {
    // if ( closedDays.map((c:Date) => { if ( c == `${selectedDate}`) return c; else return console.log(c == `${selectedDate}`, 'wooooo') }) ) {

    // if ( closedDays.map(c => {return c}) == `${selectedDate}` ) {

    // if (  closedDays.map((c:Date) => { return c }) == new Date(`${selectedDate}`)) {
    // if ( closedDays?.map((C: any) => {return C}) == selectedDate) {
    
      setDayIsClosed(true)
      closedDaysArray = []
    } else {
      setDayIsClosed(false)
      closedDaysArray = []
      
      
      // closedDays.map((c: any) => {
      //   console.log(new Date(c))
      // })
     
      // console.log(( selectedDate?.toString()))
      // console.log(dayIsClosed, 'it work')
    }
      
      
      //console.log( formatISO(selectedDate))
    // }

    // workplz()
  }, [selectedDate])

  


  useEffect(  () => {
    if(!openingHrs) return
    console.log(openingHrs)
    
  }, [openingHrs])
  

  //opening is to set the hours 
  const { trigger, isMutating } = useSWRMutation('/api/opening', sendRequest)

  //this is for fetching the closed dates GET, closing a date POST, opening a date DELETE
  const { trigger: closeDay, isMutating: loadingClosedDay } = useSWRMutation('/api/closingdate', sendCloseDate )
  //A mutation to handle a DELETE closingdate.route
  const { trigger: openDay, isMutating: loadingOpenDay } = useSWRMutation('/api/closingdate', sendDeleteDate )

  
  // const dayIsClosed = selectedDate && closedDays?.includes(formatISO(selectedDate))

  function _changeTime(day: Day) {
    return function (time: string, type: 'openTime' | 'closeTime') {
      const index = openingHrs.findIndex((x: any) => x.name === weedayIndexToName(day.dayOfWeek) )
      const newOpeningHrs = [...openingHrs]
      newOpeningHrs[index]![type] = time
      setOpeningHrs(newOpeningHrs)
    }
  }

  return (
    <div>
       {/* <Toaster /> */}
       <div className='mt-6 flex justify-center gap-6'>
        <p className={`${!enabled ? 'text-lg' : ''}`}>Opening times</p>

        <Switch checked={enabled} onChange={setEnabled} className={`${enabled ? 'bg-indigo-500' : 'bg-gray-200'} 'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 `}>
        <span className='sr-only'>Use setting</span>
        <span
            aria-hidden='true'
            className={
              `${enabled ? 'translate-x-5' : 'translate-x-0'}
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`
              }
          />

          </Switch>

          <p className={`${enabled ? 'font-medium' : ''}`}>Opening days</p>

       </div>


        { !enabled ? (
          <div className='my-12 flex flex-col gap-8'>
            {days?.map((day: any) => {
              const changeTime = _changeTime(day) 
              
              return (
                <div className='grid grid-cols-3 place-items-center' key={day._id}>
                  <h3 className='font-semibold'>{capitalize(weedayIndexToName(day.dayOfWeek))}</h3>
                
                  <div className='mx-4'>
                    <TimeSelector type='openTime' changeTime={changeTime} selected={
                      openingHrs[openingHrs.findIndex((x: any) => x.name === weedayIndexToName(day.dayOfWeek))]?.openTime
                    } />
                  </div>

                  <div>
                  <TimeSelector type='closeTime' changeTime={changeTime} selected={
                      openingHrs[openingHrs.findIndex((x: any) => x.name === weedayIndexToName(day.dayOfWeek))]?.closeTime
                    } />
                  </div>

                </div>
              )
            })}

            <Button 
            onClick={ async () => {
              await trigger({days: openingHrs})
            }}
            isLoading={isMutating}
            colorScheme='green'
            variant='solid'
            >
              Save
            </Button>
          </div>
        ) : (
          // Opening days options
        <div className='mt-6 flex flex-col items-center gap-6'>

          
          
          {closedDays && <Calendar
          minDate={now}
          className={'REACT-CALENDAR p-2'}
          view='month'
          onClickDay={  (date: any) => {setSelectedDate(date)}}
          tileClassName={({ date }) => {
            //console.log(closedDays)
            let closedDaysArray: any[] = []
            closedDays.map((c: any) => {if ( c == `${date}`) closedDaysArray.push(c); else null})

            
            //console.log(closedDaysArray, 'for css')
          if (closedDaysArray.length) {

            //need fixing
            return 'closed-day' 
            // return closedDays?.includes(`${date}`) ? 'closed-day' : null
          } else null
          }}
          />}

          {closedDays && <Button
          onClick={() => {
            if (!selectedDate) return
            if (dayIsClosed) openDay({ date: selectedDate})
            else if (selectedDate) closeDay({ date: selectedDate})
          }}
          disabled={!selectedDate}
          isLoading={loadingClosedDay || loadingOpenDay }
          colorScheme='green'
          variant='solid'
          >
            {dayIsClosed ? 'Open shop this day' : 'Close shop this day'}
          </Button> }
          {/* <button onClick={() => setDayIsClosed(!dayIsClosed)}>Change true or false</button> */}

          

        </div>
        
      )}
    

  </div>
  
  )
}
