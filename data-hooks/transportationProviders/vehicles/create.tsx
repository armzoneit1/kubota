/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { VehicleDataTypes } from "./types"
import { useRouter } from "next/router"

type Create = {
  transportationProviderId: number
  data: VehicleDataTypes
}

export const useCreate = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: Create) =>
      axios.post(
        `/transportationProviders/${data.transportationProviderId}/vehicles`,
        data.data
      ),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push(
            `/admin/transportationProviders/${data.data.data.transportationProviderId}/vehicles`
          )
        }
      },
    }
  )
}
