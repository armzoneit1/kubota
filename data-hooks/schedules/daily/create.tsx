/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import { useRouter } from "next/router"

export type CreateDataType = {
  date: string
  detail: string | null
  timeTableMorningId: number
  timeTableEveningId: number
}

type Create = {
  day: "workday" | "saturdayWorkday" | "publicHoliday" | "other" | "weekend"
  data: CreateDataType[]
}

export const useCreate = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: Create) => axios.post(`/schedules/${data.day}`, data.data),
    {
      onSuccess: (data, create) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push(`/admin/schedules/${create.day}`)
        }
      },
    }
  )
}
