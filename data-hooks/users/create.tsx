/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { UserDataTypes } from "./types"
import { useRouter } from "next/router"

export const useCreate = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: UserDataTypes) => axios.post("/users", data),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push("/admin/users")
        }
      },
    }
  )
}
