/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

export const useAddSubordinate = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: {
      subordinateEmployeeNos: string[]
      employeeNo: string
      onClose: () => void
    }) => axios.post(`/subordinates/admin/${data.employeeNo}`, data),
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
