export type EmployeeUsageInfo = {
  id: number
  plantId: number
  employeeNo: string
  dayOfWeek: string
  periodOfDay: string
  busLineStopMappingId: number
  busStopId: number
  busStopName: string
  busLineId: number
  busLineName: string
  areaId: number
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type EmployeeDataTypes = {
  employeeNo: string
  plantId: number
  title: string
  firstName: string
  lastName: string
  name?: string
  email: string
  mobileNo: string
  phoneNo: string
  workAreaId: string
  workAreaName: string
  positionName: string
  jobName: string
  employeeGroupName: string
  employeeUsageInfos: EmployeeUsageInfo[]
  supervisorEmployeeNo: string
  supervisorEmployeeNoFromApproval: string
  status: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type EmployeeUsageInfoDataTypes = {
  id: number
  plantId: number
  employeeNo: string
  dayOfWeek: string
  periodOfDay: "morning" | "evening"
  busLineStopMappingId: number
  busStopId: number
  busStopName: string
  busLineId: number
  busLineName: string
  areaId: number
  createdAt: string
  updatedAt: string
  deletedAt: null
}

export type RegisterBookingBusInfoDataTypes = {
  employeeNo: string
  plantId: number
  title: string
  firstName: string
  lastName: string
  email: string
  mobileNo: string
  phoneNo: string
  workAreaId: string
  workAreaName: string
  positionName: string
  jobName: string
  employeeGroupName: string
  status: boolean
  employeeUsageInfos: EmployeeUsageInfoDataTypes[]
  employeeUsageInfo: {
    morning: {
      dayOfWeek: string
      busLineId: any
      busStopLineMappingId: any
      areaId: any
    }[]
    evening: {
      dayOfWeek: string
      busLineId: any
      busStopLineMappingId: any
      areaId: any
    }[]
  }
  createdAt: string
  updatedAt: string
  deletedAt: string
  supervisorEmployeeNo: string
}

export type SubordinateDataTypes = {
  employeeNo: string
  empRunId: number
  plantId: number
  title: string
  firstName: string
  lastName: string
  email: string
  mobileNo: string
  phoneNo: string
  workAreaId: string
  workAreaName: string
  positionName: string
  jobName: string
  employeeGroupName: string
  workingStatus: string
  supervisorEmployeeNo: string
  supervisorEmployeeNoFromApproval: string
  isRegisterToBookingBusSystem: boolean
  registerBookingBusInfo: RegisterBookingBusInfoDataTypes
  subordinateChannel: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}
