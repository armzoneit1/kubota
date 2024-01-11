/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { CloseReservationRoundArrangementRound } from "./types"
import uniq from "lodash/uniq"
import filter from "lodash/filter"
import set from "lodash/set"
import get from "lodash/get"

export const getOneForTab = () => {
  const axios = useAxios()

  return useQuery(
    ["tab_planning"],
    async () => {
      const { data } = await axios.get(`/closeReservation`)

      return data
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}

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
                  const mappingArrangedVehicles = busLine.arrangedVehicles.map(
                    (vehicle, index) => {
                      return {
                        ...vehicle,
                        time: curr.time,
                        busLineName: busLine.name,
                        busLineId: busLine.id,
                      }
                    }
                  )
                  return { ...a, [`${curr.time}`]: mappingArrangedVehicles }
                }
                return a
              })
            } else {
              const mappingArrangedVehicles = busLine.arrangedVehicles.map(
                (vehicle, index) => {
                  return {
                    ...vehicle,
                    time: curr.time,
                    busLineName: busLine.name,
                    busLineId: busLine.id,
                  }
                }
              )
              acc.push({
                id: busLine.id,
                name: busLine.name,
                [`${curr.time}`]: [
                  ...mappingArrangedVehicles,
                  {
                    vehicleId: `${Math.floor(Math.random() * 10000)}`,
                    vehicleType: "van",
                    occupied: 0,
                    capacity: 15,
                    passengers: [],
                    time: curr.time,
                    busLineName: busLine.name,
                    busLineId: busLine.id,
                  },
                ],
              })
            }
          })
          return acc
        },
        []
      )

      const mappingData = set(data, "data.morning", { ...data.data.evening })
      set(mappingData.data, "evening.status", "close")
      set(mappingData.data, "evening.morning", "open")

      return {
        ...data,
        rounds: rounds,
        busLines: busLines,
        data: mappingData.data,
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
