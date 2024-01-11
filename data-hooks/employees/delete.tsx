/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type DeleteDataTypes = {
  employeeNo: string
  from: "list" | "edit"
}

export const useDelete = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation(
    async (data: DeleteDataTypes) =>
      axios.delete(`employees/${data.employeeNo}`),
    {
      onSuccess: (data, variables) => {
        if (variables.from === "list") {
          queryClient.invalidateQueries("employees")
        } else if (variables.from === "edit") {
          if (data.data.error) {
            throw Error(data.data.error.message)
          } else if (!data.data.error) {
            router.push(`/admin/employees`)
          }
        }
      },
    }
  )
}
