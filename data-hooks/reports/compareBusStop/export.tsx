/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import { CompareBusStopDataTypes } from "./types"
import download from "downloadjs"

export const useExport = () => {
  const axios = useAxios()

  return useMutation(
    async (data: {
      startDate: string
      endDate: string
      time: string
      display: string
      data: CompareBusStopDataTypes
    }) => {
      return axios
        .post(
          `/downloadReports/compareBusStop?startDate=${
            data.startDate
          }&endDate=${data.endDate}${data.time ? `&time=${data.time}` : ""}${
            data.display ? `&display=${data.display}` : ""
          }`,
          data.data,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          return download(
            res.data,
            `compare-bus-stop-${data?.startDate}-${data?.endDate}.xlsx`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        })
    }
  )
}
