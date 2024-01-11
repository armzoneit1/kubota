/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation } from "react-query"
import { TimeTableDataTypes } from "./types"
import { useRouter } from "next/router"

type Create = {
  data: TimeTableDataTypes
  periodOfDay: "morning" | "evening"
}

export const useCreate = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: Create) =>
      axios.post(`/timeTables/${data.periodOfDay}`, data.data),
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
