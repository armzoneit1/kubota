/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type Delete = {
  providerId: number
  vehicleId: number
  from: "edit" | "list"
  onClose: () => void
}

export const useDelete = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation(
    async (data: Delete) =>
      axios.delete(
        `/transportationProviders/${data.providerId}/vehicles/${data.vehicleId}`
      ),
    {
      onSuccess: (data, variables) => {
        if (variables.from === "list") {
          queryClient.invalidateQueries("vehicleProviders").then(() => {
            variables.onClose()
          })
        } else if (variables.from === "edit") {
          if (data.data.error) {
            throw Error(data.data.error.message)
          } else if (!data.data.error) {
            variables.onClose()
            router.push(
              `/admin/transportationProviders/${variables.providerId}/vehicles`
            )
          }
        }
      },
    }
  )
}
