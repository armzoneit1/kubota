export type TimeTableRoundTypes = {
  timeTableRoundId?: number
  time: string | null
  hours?: string
  minute?: string
}

export type TimeTableDataTypes = {
  id: number
  plantId: number
  periodOfDay: "morning" | "evening"
  name: string
  isDeletable: boolean
  timeTableRounds: TimeTableRoundTypes[]
  createdAt: string
  updatedAt: string
  deletedAt: string
}

export type Options = {
  value: number | string
  label: string
}

export type TimeTableRouteTypes = {
  customTimeTableDetailId: number
  busStopId: number
  busLineId: number
}

export type TimeTableRoundCustomDetailTypes = {
  timeTableRoundId?: number
  primary: TimeTableRouteTypes[]
  secondary: TimeTableRouteTypes[]
}

export type TimeTableCustomDetailDataTypes = {
  id: number
  plantId: number
  periodOfDay: "morning" | "evening"
  name: string
  timeTableRounds: TimeTableRoundCustomDetailTypes[]
}
