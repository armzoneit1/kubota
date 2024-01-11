/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"
import { SummaryBookingResultDataTypes } from "./types"
import download from "downloadjs"

export const useExport = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(async (data: SummaryBookingResultDataTypes[]) => {
    return axios
      .post("/downloadReports/summaryBookingResult", data, {
        responseType: "blob",
      })
      .then((res) => {
        return download(
          res.data,
          `summary-booking-result-${data[0]?.date}.xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      })
  })
}
