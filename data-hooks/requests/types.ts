export type MeDataTypes = {
  date: string
  timeTableRoundId: number
  busStopLineMappingId: number
}

export type SubordinateDataTypes = {
  employeeNo: string
  date: string
  timeTableRoundId: number
  busStopLineMappingId: number
}

export type RequestDataTypes = {
  periodOfDay: "morning" | "evening"
  me: MeDataTypes[]
  subordinates: SubordinateDataTypes[]
}

export type ListOfRequestDataTypes = {
  id: number
  requestId: number
  plantId: number
  scheduleId: number
  date: string
  employeeNo: string
  prefixName: string
  firstName: string
  lastName: string
  bookedByEmployeeNo: string
  timeTableId: number
  timeTableRoundId: number
  time: string
  busStopLineMappingId: number
  busStopId: number
  busStopName: string
  busLineId: number
  busLineName: string
  status: string
  vehicleType: string
  licensePlate: string
  driverFirstName: string
  driverLastName: string
  driverMobileNo: string
  sentEmailAt: string
  cancelledAt: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type ListOfPeriodOfDayDataTypes = {
  label: string
  value: string
}

export type ListOfTimeDataTypes = {
  label: string
  value: string
}

export type ListOfPassengerDataTypes = {
  label: string
  value: string
}

export type ListOfBookingStatusDataTypes = {
  label: string
  value: string
}

export type ListOfBusLineDataTypes = {
  label: string
  value: string
}

export type ListOfBusStopDataTypes = {
  label: string
  value: string
}

export type BookingDataTypes = {
  bookedByEmployeeNo: string
  busLineId: number
  busLineName: string
  busStopId: number
  busStopLineMappingId: number
  busStopName: string
  cancelledAt: string
  createdAt: string
  date: string
  deletedAt: string
  driverFirstName: string
  driverLastName: string
  employeeNo: string
  firstName: string
  id: number
  lastName: string
  licensePlate: string
  plantId: number
  prefixName: string
  requestId: number
  scheduleId: number
  sentEmailAt: string
  status: string
  time: string
  timeTableId: number
  timeTableRoundId: number
  updatedAt: string
  vehicleType: string
  periodOfDay: "morning" | "evening"
}

export type UpdateBookingDataTypes = {
  bookingId: string
  data: {
    timeTableRoundId: number
    busStopLineMappingId: number
  }
  onClose: () => void
}

export type UpdateRequestDataTyeps = {
  data: {
    me: {
      bookingId: number | null
      date: string
      timeTableRoundId: number
      busStopLineMappingId: number
    }[]
    subordinates: {
      bookingId: number | null
      employeeNo: string
      date: string
      timeTableRoundId: number
      busStopLineMappingId: number
    }[]
  }
  requestId: string
}

export type CancelBookingDataTypes = {
  bookingId: string
  onClose: () => void
  from: "list" | "edit"
}

export type OneRequestIdDataTypes = {
  id: number
  requestId: number
  plantId: number
  scheduleId: number
  date: string
  employeeNo: string
  prefixName: string
  firstName: string
  lastName: string
  bookedByEmployeeNo: string
  periodOfDay: "morning" | "evening"
  timeTableId: number
  timeTableRoundId: number
  time: string
  busStopLineMappingId: number
  busStopId: number
  busStopName: string
  busLineId: string
  busLineName: string
  status: string
  vehicleType: string
  licensePlate: string
  driverFirstName: string
  driverLastName: string
  sentEmailAt: string
  cancelledAt: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type BusStopTypes = {
  busStopId: number | null
  busStopName: string
  status: boolean
  rank: number
}

export type AreaDataTypes<> = {
  id: number
  plantId: number
  rank: number
  name: string
  totalBusStop: number
  status: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
  busStops: BusStopTypes[]
}
