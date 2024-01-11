/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { VehicleTypes } from "./types"
import { useRouter } from "next/router"

export const useCreate = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(async (data: VehicleTypes) =>
    axios.post("/vehicleTypes", data)
  )
}
