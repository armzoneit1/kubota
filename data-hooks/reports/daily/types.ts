export type TimeTableToundDisplayDataTypes = {
  timeTableRoundId: number
  time: string
  periodOfDay: string
  busStops: BusStopDisplayDataTypes[]
}

export type BusStopDisplayDataTypes = {
  busLineId: number
  busLineName: string
  busLineRank: number
  busStopId: number
  busStopName: string
  rank: number
  totalPassenger: number
  driver: string[]
  order: number
}

export type DailyDataTypes = {
  date: string
  scheduleId: number
  plantId: number
  timeTableRounds: TimeTableRoundDataTypes[]
}

export type TimeTableRoundDataTypes = {
  timeTableRoundId: number
  time: string
  periodOfDay: string
  busLines: BusLineDataTypes[]
}

export type BusLineDataTypes = {
  busLineId: number
  busLineName: string
  busLineRank: number
  busStops: BusStopDataTypes[]
  bookingVehicles: BookingVehicleDataTypes[]
}

export type BusStopDataTypes = {
  busStopId: number
  busStopName: string
  rank: number
  totalPassenger: number
}

export type BookingVehicleDataTypes = {
  bookingVehicleId: number
  licensePlate: string
  driverFirstName: string
  driverLastName: string
  driverMobileNo: string
}
