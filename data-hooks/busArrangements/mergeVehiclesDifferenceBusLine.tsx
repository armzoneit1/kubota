/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type Update = {
  scheduleId: number
  periodOfDay: "morning" | "evening"
  timeTableRoundId: number
  data: {
    mergeToTransportationProviderBookingVehicleTypeMappingId: number
    mergeBookingVehicleIds: number[]
    mainBusLineId: number
  }
  onClose: () => void
}

export const useMergeVehiclesDifferenceBusLine = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Update) =>
      axios.post(
        `/busArrangements/mergeVehiclesDifferenceBusLine/${data.scheduleId}/${data.periodOfDay}/${data.timeTableRoundId}`,
        data.data
      ),
    {
      onSuccess: (data, variables) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          queryClient.invalidateQueries("busArrangements").then(() => {
            variables.onClose()
          })
        }
      },
    }
  )
}
