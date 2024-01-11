/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation } from "react-query"
import { TimeTableDataTypes } from "./types"
import { useRouter } from "next/router"

type Update = {
  id: number
  data: TimeTableDataTypes
}

export const useUpdate = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: Update) => axios.put(`/timeTables/${data.id}`, data.data),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push(`/admin/timeTables/${data.data.data.periodOfDay}`)
        }
      },
    }
  )
}
