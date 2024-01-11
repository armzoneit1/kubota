/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type DeleteDataTypes = {
  employeeNo: string
}

export const useDeleteSupervisor = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation(
    async (data: DeleteDataTypes) =>
      axios.delete(`/employees/${data.employeeNo}/supervisor`),
    {
      onSuccess: (data, variables) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          queryClient.invalidateQueries("employee")
        }
      },
    }
  )
}
