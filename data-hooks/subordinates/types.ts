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
      busStopId: any
      areaId: number
    }[]
    evening: {
      dayOfWeek: string
      busLineId: any
      busStopLineMappingId: any
      busStopId: any
      areaId: number
    }[]
  }
  createdAt: string
  updatedAt: string
  deletedAt: string
  supervisorEmployeeNo: string
  supervisorFirstName: string
  supervisorLastName: string
  supervisorTitle: string
  supervisorEmployeeNoFromApproval: string
  supervisorTitleFromApproval: string
  supervisorFirstNameFromApproval: string
  supervisorLastNameFromApproval: string
  isDisplayDefaultForSubordinateBooking: boolean
  subordinateChannel: string
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
  supervisorFirstName: string
  supervisorLastName: string
  supervisorTitle: string
  supervisorEmployeeNoFromApproval: string
  supervisorTitleFromApproval: string
  supervisorFirstNameFromApproval: string
  supervisorLastNameFromApproval: string
  isRegisterToBookingBusSystem: boolean
  registerBookingBusInfo: RegisterBookingBusInfoDataTypes
  createdAt: string
  updatedAt: string
  deletedAt: string
  subordinateChannel: string
}

export type EmpListTypes = {
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
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type RegisterDataTtype = {
  employeeNo: string
  status: boolean
  employeeUsageInfo: {
    morning: {
      dayOfWeek: string
      busLineId: { value: string | number; label: string | number } | null
      busStopLineMappingId: {
        value: string | number
        label: string | number
      }
    }[]
    evening: {
      dayOfWeek: string
      busLineId: { value: string | number; label: string | number } | null
      busStopLineMappingId: {
        value: string | number
        label: string | number
      }
    }[]
  }
  isDisplayDefaultForSubordinateBooking: boolean
}

export type UpdateDataTypes = {
  employeeNo: string
  data: {
    status: boolean
    employeeUsageInfo: {
      morning: {
        dayOfWeek: string
        busLineId: { value: string | number; label: string | number } | null
        busStopLineMappingId: {
          value: string | number
          label: string | number
        }
      }[]
      evening: {
        dayOfWeek: string
        busLineId: { value: string | number; label: string | number } | null
        busStopLineMappingId: {
          value: string | number
          label: string | number
        }
      }[]
    }
    isDisplayDefaultForSubordinateBooking: boolean
  }
}
