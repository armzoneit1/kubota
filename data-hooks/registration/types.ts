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
}

export type UpdateDataTypes = {
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
}
