/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type DeleteDataTypes = {
  subordinateEmployeeNos: string[]
  employeeNo: string
  onClose: () => void
}

export const useDeleteSubordinate = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation(
    async (data: DeleteDataTypes) =>
      axios.delete(`/subordinates/admin/${data.employeeNo}`, {
        data: { subordinateEmployeeNos: data.subordinateEmployeeNos },
      }),
    {
      onSuccess: (data, variables) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          queryClient.invalidateQueries("subordinateList_admin")
          setTimeout(() => {
            variables.onClose()
          }, 500)
        }
      },
    }
  )
}
