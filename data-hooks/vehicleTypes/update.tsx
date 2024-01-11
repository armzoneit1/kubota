/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { VehicleTypes } from "./types"
import { useRouter } from "next/router"

type Update = {
  id: number
  data: VehicleTypes
}

export const useUpdate = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(async (data: Update) =>
    axios.put(`/vehicleTypes/${data.id}`, data.data)
  )
}
