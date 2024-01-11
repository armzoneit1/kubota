/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../../providers/http-client"
import { useMutation } from "react-query"
import { NotUserServiceDataTypes } from "./types"
import download from "downloadjs"

export const useExport = () => {
  const axios = useAxios()

  return useMutation(
    async (data: {
      startDate: string
      endDate: string
      data: NotUserServiceDataTypes
    }) => {
      return axios
        .post(
          `/downloadReports/notUseService?startDate=${data.startDate}&endDate=${data.endDate}`,
          data.data,
          {
            responseType: "blob",
          }
        )
        .then((res) => {
          return download(
            res.data,
            `not-use-service-${data?.startDate}-${data?.endDate}.xlsx`,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        })
    }
  )
}
