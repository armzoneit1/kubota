/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useMutation } from "react-query"
import { useRouter } from "next/router"

export const useAddSubordinate = () => {
  const axios = useAxios()
  const router = useRouter()

  return useMutation(
    async (data: { subordinateEmployeeNos: string[] }) =>
      axios.post("/subordinates/me", data),
    {
      onSuccess: (data) => {
        if (data.data.error) {
          throw Error(data.data.error.message)
        } else if (!data.data.error) {
          router.push("/employee/subordinates")
        }
      },
    }
  )
}
