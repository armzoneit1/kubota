export type TimeTableRound = {
  timeTableRoundId: number
  time: string
}

export type TimeTable = {
  timeTableId: number
  name: string
  status: string
  totalBooking: number
  timeTableRound: TimeTableRound[]
}

export type ScheduleDataTypes = {
  id: number
  plantId: number
  date: string
  dayType: "workday" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
  dayTypeId: { value: string; label: string }
  detail: string
  timeTableMorning: TimeTable
  timeTableEvening: TimeTable
  timeTableMorningId?: number
  timeTableEveningId?: number
  isMorningOpenForBooking: boolean
  isEveningOpenForBooking: boolean
  remarkMorning: string | null
  remarkEvening: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string
  isShowCheckbox?: boolean
}

export enum DayTypes {
  workday = "วันทำงาน",
  saturdayWorkday = "วันเสาร์ทำงาน",
  publicHoliday = "วันหยุด",
  other = "อื่นๆ",
  weekend = "วันเสาร์-อาทิตย์",
}

export const weekDay = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"]

export const dayTypeOptions = [
  { value: `workday`, label: DayTypes.workday },
  { value: `saturdayWorkday`, label: DayTypes.saturdayWorkday },
  { value: `publicHoliday`, label: DayTypes.publicHoliday },
  { value: `other`, label: DayTypes.other },
  { value: `weekend`, label: DayTypes.weekend },
]

export type ManageScheduleTypes = {
  startDate: string
  endDate: string
  periodOfDay: "all" | "morning" | "evening"
  status: boolean
  remark: string | null
}
