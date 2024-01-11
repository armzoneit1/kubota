/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation } from "react-query"
import { useRouter } from "next/router"

export type UpdateDataType = {
  status: boolean
  supervisorEmployeeNo: string
}

type Update = {
  id: number
  data: UpdateDataType
}

export const useUpdate = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: Update) => axios.put(`/employees/${data.id}`, data.data),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        }
        // else if (!data.data.error) {
        //   router.push(`/admin/employees`)
        // }
      },
    }
  )
}
