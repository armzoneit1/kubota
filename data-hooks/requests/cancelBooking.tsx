/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { CancelBookingDataTypes } from "./types"
import router from "next/router"

export const useCancelBooking = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: CancelBookingDataTypes) =>
      axios.delete(`/requests/cancel/${data.bookingId}`),
    {
      onSuccess: (data, variables) => {
        if (variables.from === "list") {
          if (data.data.error) {
            throw Error(data.data.error.message)
          } else if (!data.data.error) {
            setTimeout(() => {
              queryClient.invalidateQueries("listOfRequest")
              variables.onClose()
            }, 500)
          }
        } else {
          if (data.data.error) {
            throw Error(data.data.error.message)
          } else if (!data.data.error) {
            queryClient.invalidateQueries("requests_request")
          }
        }
      },
    }
  )
}
