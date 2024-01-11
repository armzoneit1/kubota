/* eslint-disable react-hooks/rules-of-hooks */

import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"

export const getBookingVehicle = (
  bookingVehicleId: string | string[] | undefined
) => {
  const axios = useAxios()

  return useQuery(
    ["bookingVehicle"],
    async () => {
      const { data } = await axios.get(
        `/reports/summaryBookingResult/${bookingVehicleId}`
      )

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
      enabled: !!bookingVehicleId,
    }
  )
}
