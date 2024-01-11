/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import { DailyDataTypes } from "./types"
import download from "downloadjs"

export const useExport = () => {
  const axios = useAxios()

  return useMutation(
    async (data: { date: string; time: string; data: DailyDataTypes }) => {
      return axios
        .post(`/downloadReports/daily`, data.data, {
          responseType: "blob",
        })
        .then((res) => {
          return download(
            res.data,
            `daily-${data?.date}${data?.time ? "-" + data?.time : ""}.xlsx`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        })
    }
  )
}
