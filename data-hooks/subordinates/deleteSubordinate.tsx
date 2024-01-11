/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type DeleteDataTypes = {
  subordinateEmployeeNos: string[]
  from: "edit" | "list"
}

export const useDeleteSubordinate = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation(
    async (data: DeleteDataTypes) =>
      axios.delete(`/subordinates/me`, {
        data: { subordinateEmployeeNos: data.subordinateEmployeeNos },
      }),
    {
      onSuccess: (data, variables) => {
        if (variables.from === "list") {
          queryClient.invalidateQueries("subordinates")
        } else if (variables.from === "edit") {
          if (data.data.error) {
            throw Error(data.data.error.message)
          } else if (!data.data.error) {
            router.push("/employee/subordinates")
          }
        }
      },
    }
  )
}
