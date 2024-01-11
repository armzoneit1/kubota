/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type Delete = {
  scheduleId: string | string[] | undefined
  periodOfDay: "morning" | "evening"
  bookingVehicleIds: number[]
  from: "list" | "edit"
  onClose: () => void
}

export const useDeleteMultiEmptyBookingVehicle = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation(
    async (data: Delete) =>
      axios.delete(
        `/busArrangements/deleteEmptyBookingVehicle/${data.scheduleId}/${data.periodOfDay}`,
        { data: { bookingVehicleIds: data.bookingVehicleIds } }
      ),
    {
      onSuccess: (data, variables) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          if (variables.from === "list") {
            queryClient.invalidateQueries("busArrangements").then(() => {
              variables.onClose()
            })
          } else if (variables.from === "edit") {
            router.push(
              `/admin/plannings/${variables.scheduleId}/${variables.periodOfDay}`
            )
          }
        }
      },
    }
  )
}
