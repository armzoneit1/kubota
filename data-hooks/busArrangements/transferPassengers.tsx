/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type Update = {
  scheduleId: number
  periodOfDay: "morning" | "evening"
  timeTableRoundId: number
  data: {
    currentBookingVehicleId: number
    transferToBookingVehicleId: number
    passengerBookingIds: number[]
    transferToBusStopLineMappingId?: number
  }
}

export const useTransferPassenger = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Update) =>
      axios.put(
        `/busArrangements/transferPassengers/${data.scheduleId}/${data.periodOfDay}/${data.timeTableRoundId}`,
        data.data
      ),
    {
      onSuccess: (data, variables) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          if (variables.data.transferToBusStopLineMappingId != null) {
            queryClient.invalidateQueries("busArrangements_bookingVehicle")
            queryClient.invalidateQueries("listBookingPassenger_busArrangement")
            queryClient.invalidateQueries("differenceBusLine_busArrangement")
            queryClient.invalidateQueries("sameBusLine_busArrangement")
            queryClient.invalidateQueries("busStopLineMappings_busArrangement")
            queryClient.invalidateQueries("listVehicleType_busArrangement")
          } else {
            router.push(
              `/admin/plannings/${variables.scheduleId}/${variables.periodOfDay}`
            )
          }
        }
      },
    }
  )
}
