/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"

type Update = {
  transportationProviderId: number
  bookingVehicleId: number
  timeTableRoundId: number
  data: {
    firstName: string
    lastName: string
    mobileNo: string
  }
  onClose: () => void
  handleSetDriver: (
    driver: any,
    timeTableRoundId: number,
    bookingVehicleId: number
  ) => void
}

export const useAddDriver = () => {
  const axios = useAxios()
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation(
    async (data: Update) =>
      axios.post(`/drivers/${data.transportationProviderId}`, data.data),
    {
      onSuccess: (data, variables) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          const driverIdMapping = {
            value: data?.data?.data?.id,
            label: `${data?.data?.data?.firstName} ${data?.data?.data?.lastName}`,
          }
          queryClient
            .invalidateQueries(
              `listDriver_${variables.transportationProviderId}_busArrangement`
            )
            .then(() => {
              variables.handleSetDriver(
                driverIdMapping,
                variables.timeTableRoundId,
                variables.bookingVehicleId
              )
              setTimeout(() => {
                variables.onClose()
              }, 300)
            })
        }
      },
    }
  )
}
