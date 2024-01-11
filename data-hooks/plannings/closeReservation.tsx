/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { CloseReservationRoundArrangementRound } from "./types"
import uniq from "lodash/uniq"
import filter from "lodash/filter"

export const getOne = () => {
  const axios = useAxios()

  return useQuery(
    ["closeReservation"],
    async () => {
      const { data } = await axios.get(`/closeReservation`)

      const rounds: string[] = uniq(
        data?.data?.evening?.arrangements?.rounds.reduce(
          (acc: string[], curr: CloseReservationRoundArrangementRound) => {
            acc.push(curr.time)
            return acc
          },
          []
        )
      )

      const busLines = data?.data?.evening?.arrangements?.rounds.reduce(
        (acc: any[], curr: CloseReservationRoundArrangementRound) => {
          curr.busLines.map((busLine) => {
            const filtered = filter(acc, { id: busLine.id, name: busLine.name })
            if (filtered && filtered.length > 0) {
              acc = [...acc].map((a) => {
                if (a.id === busLine.id && a.name === busLine.name) {
                  return { ...a, [`${curr.time}`]: busLine.arrangedVehicles }
                }
                return a
              })
            } else {
              acc.push({
                id: busLine.id,
                name: busLine.name,
                [`${curr.time}`]: busLine.arrangedVehicles,
              })
            }
          })
          return acc
        },
        []
      )

      return { ...data, rounds: rounds, busLines: busLines }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
