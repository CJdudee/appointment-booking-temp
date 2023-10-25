import { categories } from "@/app/constants/config"

interface DateType {
    justDate: Date | null
    dateTime: Date | null
  }

type Categories = typeof categories[number]

interface Day {
  _id: string
  name: string
  dayOfWeek: number
  openTime: string
  closeTime: string
}