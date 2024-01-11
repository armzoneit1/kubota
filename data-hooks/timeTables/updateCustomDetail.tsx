/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { TimeTableCustomDetailDataTypes } from "./types"
import { useRouter } from "next/router"

type Update = {
  id: number
  data: TimeTableCustomDetailDataTypes
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
}

export const useUpdate = () => {
  const axios = useAxios()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Update) =>
      axios.put(`/timeTables/${data.id}/customDetails`, data.data),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries("timeTableCustomDetail").then(() => {
          variables.setIsUpdating(false)
        })
      },
    }
  )
}
