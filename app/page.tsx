

import Calendar from '../app/components/Calendar/index'
import { formatISO } from 'date-fns'



export default async function Home() {

    const daysJson = await fetch('http://localhost:3000/api/frontend/days', {cache: 'no-cache'})

    const closedDaysJson = await fetch('http://localhost:3000/api/frontend/closedday', {cache: 'no-cache'})

    const days = await daysJson.json()

    const closedDays = await closedDaysJson.json()

    const closedDaysISO = closedDays?.map((d: any) => formatISO(new Date(d.date)))


  

    // const loadingDone = loadingClosedDays && loadingDays === false

    // if(loadingDone) return <p>loading</p>
    
  


//   const [ date, setDate ] = useState<DateType>({
//     justDate: null, 
//     dateTime: null
// })

// const { trigger: mutate, data: menuItems, error } = useSWRMutation('/api/frontend/checkdate' , fetcher)
// const { data: menuItems, isLoading, mutate } = useSWR(date.dateTime ? '/api/frontend/checkdate' : null, fetcher)

  //console.log(days, closedDaysISO)

  return (
    <main className="">
      
      {/* {loadingDone && <Calendar days={days} closedDaysISO={closedDaysISO} />} */}
      <Calendar days={days} closedDaysISO={closedDaysISO} />

      
    </main>
  )
}

