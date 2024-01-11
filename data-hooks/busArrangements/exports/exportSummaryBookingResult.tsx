/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import download from "downloadjs"

export const useExportSummaryBookingResult = () => {
  const axios = useAxios()

  return useMutation(
    async (data: {
      scheduleId: number
      periodOfDay: "morning" | "evening"
      date: string
    }) => {
      return axios
        .get(
          `/busArrangements/downloadReports/summaryBookingResult/${data.scheduleId}/${data.periodOfDay}`,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          return download(
            res.data,
            `summary-booking-result-${data.date}-${data.periodOfDay}.xlsx`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        })
    }
  )
}
