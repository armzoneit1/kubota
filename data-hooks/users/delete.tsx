/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type Delete = {
  employeeNo: number
  from: "edit" | "list"
}

export const useDelete = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation(
    async (data: Delete) => axios.delete(`/users/${data.employeeNo}`),
    {
      onSuccess: (data, variables) => {
        if (variables.from === "list") {
          queryClient.invalidateQueries("users")
        } else if (variables.from === "edit") {
          if (data.data.error) {
            throw Error(data.data.error.message)
          } else if (!data.data.error) {
            router.push(`/admin/users`)
          }
        }
      },
    }
  )
}
