export type BookingVehicle = {
  bookingVehicleId: number
  vehicleTypeName: string
  totalPassenger: number
  isNormalBusStopBySetting: boolean
}

export type TimeTableRound = {
  time: string
  bookingVehicles: BookingVehicle[]
}

export type SummaryBookingResultDataTypes = {
  date: string
  scheduleId: number
  plantId: number
  periodOfDay: string
  busLineId: number
  busLineName: string
  busLineRank: number
  timeTableRounds: TimeTableRound[]
}

export type PassengerDetailTypes = {
  employeeNo: string
  title: string
  firstName: string
  lastName: string
}

export type BusStopDetailTypes = {
  busStopRank: number
  busStopId: number
  busStopName: string
  isNormalBusStopBySetting: boolean
  passengers: PassengerDetailTypes[]
}

export type SummaryBookingDetailDataTypes = {
  bookingVehicleId: number
  plantId: number
  date: string
  periodOfDay: string
  time: string
  busLineId: number
  busLineName: string
  vehicleTypeName: string
  licensePlate: string
  seatCapacity: number
  totalPassenger: number
  busStops: BusStopDetailTypes[]
}
