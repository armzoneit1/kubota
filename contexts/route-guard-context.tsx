import { createContext } from "react"

export type MyHrEmployeeDataTypes = {
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
  supervisorTitle: string
  supervisorFirstName: string
  supervisorLastName: string
  supervisorEmployeeNoFromApproval: string
  supervisorTitleFromApproval: string
  supervisorFirstNameFromApproval: string
  supervisorLastNameFromApproval: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type EmployeeUsageInfoDataTypes = {
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
  deletedAt: null
}

export type BookingBusUserDataTypes = {
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
  supervisorEmployeeNo: string
  supervisorEmployeeNoFromApproval: string
  employeeUsageInfos: EmployeeUsageInfoDataTypes[]
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type PlanningBusUserDataTypes = {
  employeeNo: string
  plantId: number
  role: string
  status: boolean
  title: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type RouteGuardContextType = {
  myHrEmployee: MyHrEmployeeDataTypes
  bookingBusUser: BookingBusUserDataTypes | null
  planningBusUser: PlanningBusUserDataTypes | null
}

export const RouteGuardContext = createContext<RouteGuardContextType>(
  {} as RouteGuardContextType
)
