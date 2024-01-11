/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { RegisterDataTtype } from "./types"
import { useRouter } from "next/router"

export const useRegister = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: RegisterDataTtype) =>
      axios.post("/bookingBusAccount/register", data),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push("/employee/registration/update")
          queryClient.invalidateQueries("me_routeGuard", {
            refetchActive: true,
          })
          queryClient.invalidateQueries("me")
        }
      },
    }
  )
}
