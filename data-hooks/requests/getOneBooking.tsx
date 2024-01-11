/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { BookingDataTypes } from "./types"

export const getOneBooking = (
  bookingId: string | string[] | undefined,
  isOpen: boolean
) => {
  const axios = useAxios()

  return useQuery(
    ["requests_booking", bookingId],
    async () => {
      const { data } = await axios.get(`/requests/me/bookingId/${bookingId}`)

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!bookingId && isOpen,
      refetchOnWindowFocus: false,
    }
  )
}
