/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { UpdateBookingDataTypes } from "./types"

export const useUpdateBooking = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: UpdateBookingDataTypes) =>
      axios.put(`/requests/bookingId/${data.bookingId}`, data.data),
    {
      onSuccess: (data, variables) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          setTimeout(() => {
            variables.onClose()
            queryClient.invalidateQueries("listOfRequest")
          }, 500)
        }
      },
    }
  )
}
