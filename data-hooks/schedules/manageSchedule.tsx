/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation } from "react-query"
import { ManageScheduleTypes } from "./types"
import { useRouter } from "next/router"

export const useUpdate = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: ManageScheduleTypes) => axios.put(`schedules`, data),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push(`/admin/schedules`)
        }
      },
    }
  )
}
