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

// export async function getServerSideProps() {

//   const {data: days, mutate} = useSWR("/api/frontend/days", fetcher)

  

//   if (!(days.length === 7)) throw new Error('All days to the database')

//   return { props: { days }}

// }

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
    method: 'POST',
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

      // closedDays.map((c: any) => {
      //   console.log(new Date(c))
      // })
 }

    filteringDate()

    setClosedDays(dayisClosedArray)
    //console.log(dayisClosedArray)
    // console.log(closedDaysFetch)
    console.log(dayisClosedArray)

  }, [closedDaysFetch])

  useEffect(() => {
    if(!selectedDate && !closedDays) return 

    // async function workplz() {
    // if ( closedDays?.includes((selectedDate))) {
    if (  closedDays.map((c:any) => {return c}) == selectedDate) {
    // if ( closedDays?.map((C: any) => {return C}) == selectedDate) {
      setDayIsClosed(true)
    } else {
      setDayIsClosed(false)
      // console.log(closedDays.includes(formatISO(date)))
      // console.log(selectedDate)
      // console.log(await closedDays.includes((date)))
      console.log(closedDays?.includes((selectedDate)))
      closedDays.map((c: any) => {
        console.log(new Date(c))
      })
      // console.log(closedDays?.includes((selectedDate)))
      // console.log(closedDays)
      console.log(( selectedDate)?.toString())
    }
      
      
      //console.log( formatISO(selectedDate))
    // }

    // workplz()
  }, [selectedDate])

  //a useEffect to see if the selectedDate is part of the closedDays to change the mutation to Open the date back up 

  // useEffect(  () => {
  //   if(!selectedDate) return

  //   async function isDayClosed() {
  //     if(!selectedDate) return false

  //     //let dayIsClosed: any[] = []

  //     const dayIsClosedPush =  selectedDate &&   await closedDays?.map(async (c: any) => {
  //   //   // if(c.date == (formatISO(selectedDate))) return true 
      
  //   // //   else {
  //   // //     console.log(c.date)
  //   // //     console.log(formatISO(selectedDate))
  //   // //     return false
  //   // //   }
  //   // // })
  //       // if(c.date == (formatISO(selectedDate)))  return dayIsClosed.push(formatISO(selectedDate))
  //       return c.date
        
  //   //     console.log(c.date)
  //     })
  //     const dayIsClosed =  await dayIsClosedPush?.includes(formatISO(selectedDate).toString())

  //     console.log(closedDays)
  //     console.log(dayIsClosed)
  //      console.log( formatISO(selectedDate))

  //     setDayIsClosed(dayIsClosed)

  //     // if(!dayIsClosed.length) setDayIsClosed(false)

  //     // setDayIsClosed(true)
      
  //   }
    // const dayIsClosed =  selectedDate && closedDays?.map((c: any) => {
    //   if(c == (formatISO(selectedDate))) return true 
    //   else return false
    // })
  //   isDayClosed()
  //   // const dayIsClosed = isDayClosed()
    
    
  // }, [selectedDate])


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
        <span className=''>Use setting</span>
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
          <div>
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

          <div>
          
          {closedDays && <Calendar
          minDate={now}
          className={'REACT-CALENDAR p-2'}
          view='month'
          onClickDay={  (date: any) => {setSelectedDate(date)}}
          tileClassName={({ date }) => {
            //console.log(closedDays)

            //need fixing
            return closedDays?.includes(formatISO(date)) ? 'closed-day' : null
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

        </div>
        
      )}
    

  </div>
  
  )
}
