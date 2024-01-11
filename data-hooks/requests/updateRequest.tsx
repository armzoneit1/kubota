/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation } from "react-query"
import { UpdateRequestDataTyeps } from "./types"
import router from "next/router"

export const useUpdateBooking = () => {
  const axios = useAxios()

  return useMutation(
    async (data: UpdateRequestDataTyeps) =>
      axios.put(`/requests/requestId/${data.requestId}`, data.data),
    {
      onSuccess: (data, variables) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push("/employee/requests")
        }
      },
    }
  )
}
