

import Calendar from '../app/components/Calendar/index'

import { Day } from '@/utils/types'
import { formatISO } from 'date-fns'
import useSWR from 'swr'

// @ts-ignore
const fetcher = (...args: any) => fetch(...args).then(res => res.json())

// async function sendRequest(url, { arg }: { arg: { username: string }}) {
//   return fetch(url, {
//     method: 'POST',
//     body: JSON.stringify(arg)
//   }).then(res => res.json())
// }

interface HomePageProps {
  days: Day[]
  closedDaysISO: string[]
}

export default async function Home(    ) {

  
    // const { data: days, isLoading: loadingDays } =  useSWR('/api/frontend/days', fetcher)
    // const { data: closedDays, isLoading: loadingClosedDays } = useSWR('/api/frontend/closedday', fetcher)
    // const closedDaysISO = closedDays?.map((d: any) => formatISO(d.date))

    const daysJson = await fetch('http://localhost:3000/api/frontend/days')

    const closedDaysJson = await fetch('http://localhost:3000/api/frontend/closedday')

    const days = await daysJson.json()

    const closedDays = await closedDaysJson.json()

    const closedDaysISO = closedDays?.map((d: any) => formatISO(d.date))


  

    // const loadingDone = loadingClosedDays && loadingDays === false

    // if(loadingDone) return <p>loading</p>
    
  


//   const [ date, setDate ] = useState<DateType>({
//     justDate: null, 
//     dateTime: null
// })

// const { trigger: mutate, data: menuItems, error } = useSWRMutation('/api/frontend/checkdate' , fetcher)
// const { data: menuItems, isLoading, mutate } = useSWR(date.dateTime ? '/api/frontend/checkdate' : null, fetcher)

  console.log(days, closedDaysISO)

  return (
    <main className="">

      {/* {loadingDone && <Calendar days={days} closedDaysISO={closedDaysISO} />} */}
      <Calendar days={days} closedDaysISO={closedDaysISO} />

      
    </main>
  )
}

// export async function getStaticProps() {
//   const { data: days } =  useSWR('/api/frontend/days', fetcher)
//   const { data: closedDays } = useSWR('/api/frontend/closedday')
//   const closedDaysISO = closedDays.map((d: any) => formatISO(d.date))

//   return { props: { days, closedDaysISO}}
// }
