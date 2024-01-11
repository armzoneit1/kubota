/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import { SummaryTotalPassengerDataTypes } from "./types"
import download from "downloadjs"

export const useExport = () => {
  const axios = useAxios()

  return useMutation(
    async (data: {
      startDate: string
      endDate: string
      typeOfTotalPassenger: string
      time: string
      busLineName: string
      data: SummaryTotalPassengerDataTypes
    }) => {
      return axios
        .post(
          `/downloadReports/summaryTotalPassenger?startDate=${
            data.startDate
          }&endDate=${data.endDate}&typeOfTotalPassenger=${
            data.typeOfTotalPassenger
          }${data.time ? `&time=${data.time}` : ""}${
            data.busLineName ? `&busLineName=${data.busLineName}` : ""
          }`,
          data.data,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          return download(
            res.data,
            `summary-total-passenger-${data?.startDate}-${data?.endDate}.xlsx`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        })
    }
  )
}
