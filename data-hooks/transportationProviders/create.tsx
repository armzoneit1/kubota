/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { TransportationProviderDataTypes } from "./types"
import { useRouter } from "next/router"

export const useCreate = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: TransportationProviderDataTypes) =>
      axios.post("/transportationProviders", data),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push("/admin/transportationProviders")
        }
      },
    }
  )
}
