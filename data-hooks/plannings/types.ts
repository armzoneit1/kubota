export type TimeTable = {
  timeTableId: number
  name: string
  status: string
  totalBooking: number
}

export type PlanningDataTypes = {
  id: number
  plantId: number
  scheduleId: number
  date: string
  dayType: "workday" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
  dayTypeId?: { value: string; label: string }
  detail: string
  timeTableMorning: TimeTable
  timeTableEvening: TimeTable
  timeTableMorningId?: number
  timeTableEveningId?: number
  isMorningOpenForBooking: boolean
  isEveningOpenForBooking: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type Passenger = {
  id: string
  firstName: string
  lastName: string
  desireBusStop: {
    id: string
    name: string
  }
}

export type BusLineArrangedVehicle = {
  vehicleId: string
  vehicleType: string
  occupied: number
  capacity: number
  passengers: Passenger[]
}

export type ArrangementBusLine = {
  id: string
  name: string
  arrangedVehicles: BusLineArrangedVehicle[]
}

export type CloseReservationRoundArrangementRound = {
  id: string
  time: string
  busLines: ArrangementBusLine[]
}

export type CloseReservationRoundArrangement = {
  rounds: CloseReservationRoundArrangementRound[]
}

export type CloseReservationRound = {
  status: string
  isBookable: string
  arrangements: CloseReservationRoundArrangement
}

export type CloseReservationDataTypes = {
  date: string
  dayType: "workday" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
  morning?: CloseReservationRound
  evening?: CloseReservationRound
}
