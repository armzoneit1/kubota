/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { DriverDataTypes } from "./types"
import { useRouter } from "next/router"

type Update = {
  id: number
  transportationProviderId: number
  data: DriverDataTypes
}

export const useUpdate = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Update) =>
      axios.put(
        `/transportationProviders/${data.transportationProviderId}/drivers/${data.id}`,
        data.data
      ),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push(
            `/admin/transportationProviders/${data.data.data.transportationProviderId}/drivers`
          )
        }
      },
    }
  )
}
