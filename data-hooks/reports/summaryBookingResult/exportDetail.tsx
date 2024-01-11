/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation, useQueryClient } from "react-query"
import { useRouter } from "next/router"
import { SummaryBookingDetailDataTypes } from "./types"
import download from "downloadjs"

export const useExport = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(async (data: SummaryBookingDetailDataTypes) => {
    return axios
      .post("/downloadReports/summaryBookingResult/detail", data, {
        responseType: "blob",
      })
      .then((res) => {
        return download(
          res.data,
          `summary-booking-result-detail-${data?.date}-${
            data?.periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"
          }(${data?.time ? `${data?.time} น.` : "-"}).xlsx`,
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
      })
  })
}
