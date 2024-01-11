/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useQuery } from "react-query"
import get from "lodash/get"

export const getList = (
  date: string,
  time: string,
  busLineName: string,
  bookingVehicleId: string,
  request: boolean,
  setRequest: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const axios = useAxios()

  return useQuery(
    ["employeeAttendance", date, time, busLineName, bookingVehicleId, request],
    async () => {
      const { data } = await axios.get(
        `/reports/employeeAttendance?date=${date}&time=${time}${
          bookingVehicleId ? `&bookingVehicleId=${bookingVehicleId}` : ""
        }${busLineName ? `&busLineName=${busLineName}` : ""}`
      )

      const dataForDownload = get(data, "data")

      return { ...data, dataForDownload }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!date && !!time && request,
      onSuccess: (data) => {
        setRequest(false)
      },
      refetchOnWindowFocus: false,
    }
  )
}
