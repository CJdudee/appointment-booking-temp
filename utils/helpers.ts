import { OPENING_HOURS_INTERVAL, categories, now } from "@/app/constants/config";
import { add, addMinutes, getHours, getMinutes, isBefore, isEqual, parse } from "date-fns";
import { Day } from "./types";

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

export const selectOptions = categories.map((c) => ({ value: c, label: capitalize(c) }))

//@ts-ignore
export const fetcher = (...args: any) => fetch(...args).then(res => res.json())


export const weedayIndexToName = (index: number) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', "thursday", 'friday', 'saturday']

    return days[index]
}

export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

// function to round to the nearest half hour

export const roundToNearestMinutes = (date: Date, interval: number) => {
    const minutesLeftUntilNextInterval = interval - (getMinutes(date) % interval)

    return addMinutes(date, minutesLeftUntilNextInterval)
}


export const getOpeningTimes = (startDate: Date, dbDays: Day[]) => {

    const dayOfWeek = startDate.getDay()
    const isToday = isEqual(startDate, new Date())

    //edge case
    const today = dbDays.find((d: any) => d.dayOfWeek === dayOfWeek)

    if(!today) throw new Error('this day does not exist on the DB')
    //

    const opening = parse(today.openTime, 'kk:mm', startDate)
    const closing = parse(today.closeTime, 'kk:mm', startDate)

    let hours: number
    let minutes: number

    if (isToday) {

        const rounded = roundToNearestMinutes(now, OPENING_HOURS_INTERVAL)

        const tooLate = !isBefore(rounded, closing)

        if(tooLate) throw new Error("no more bookings today")

        console.log('round', rounded)

        const isBeforeOpening = isBefore(rounded, opening)

        hours = getHours(isBeforeOpening ? opening : rounded)
        minutes = getMinutes(isBeforeOpening ? opening : rounded)




    } else {
        hours = getHours(opening)
        minutes = getMinutes(opening)
    }

    const beginning = add(startDate, { hours, minutes})
    const end = add(startDate, { hours: getHours(closing), minutes: getMinutes(closing)})
    const interval = OPENING_HOURS_INTERVAL

    const times = []

    for (let i = beginning; i <= end; i = add(i, { minutes: interval })) {
        times.push(i)
    }

    return times
}