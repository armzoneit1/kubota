/* eslint-disable react-hooks/rules-of-hooks */
import { useAxios } from "../../providers/http-client"
import { useQuery } from "react-query"
import { TimeTableRoundDataTypes } from "./types"
import uniq from "lodash/uniq"
import filter from "lodash/filter"
import get from "lodash/get"
import { DateTime } from "luxon"

export const getOne = (
  scheduleId: string | string[] | undefined,
  periodOfDay: "morning" | "evening"
) => {
  const axios = useAxios()

  return useQuery(
    ["busArrangements", scheduleId, periodOfDay],
    async () => {
      const { data } = await axios.get(
        `/busArrangements/${scheduleId}/${periodOfDay}`
      )

      const isConfirm: string[] = []
      const sendEmails: string[] = []
      const statusEmails: string[] = []
      const scheduleEmails: string[] = []

      const rounds: string[] =
        data?.data?.arrangements &&
        get(data, "data.arrangements.timeTableRounds").map(
          (timeTableRound: TimeTableRoundDataTypes) => timeTableRound.time
        )

      const busLines: string[] =
        data?.data?.arrangements &&
        get(data, "data.arrangements.timeTableRounds").reduce(
          (acc: any[], curr: TimeTableRoundDataTypes) => {
            curr.busLines.map((busLine) => {
              const filtered = filter(acc, {
                id: busLine.id,
                name: busLine.name,
              })
              if (filtered && filtered.length > 0) {
                acc = [...acc].map((a) => {
                  if (a.id === busLine.id && a.name === busLine.name) {
                    return {
                      ...a,
                      [`${curr.time}`]: busLine.arrangedVehicles.map(
                        (vehicle) => {
                          const isNormalBusStopBySetting: boolean[] = []
                          vehicle.passengers.map((p) => {
                            isConfirm.push(p.bookingStatus)
                            sendEmails.push(p.sentEmailAt)
                            statusEmails.push(p.emailStatus)
                            scheduleEmails.push(p.scheduledEmailAt)
                            isNormalBusStopBySetting.push(
                              busLine.defaultSettingBusStopIds.includes(
                                p.busStopLineMapping.busStopId
                              )
                            )
                          })
                          return {
                            ...vehicle,
                            time: curr.time,
                            busLineName: busLine.name,
                            busLineId: busLine.id,
                            isNormalBusStopBySetting: !isNormalBusStopBySetting.includes(
                              false
                            ),
                            timeTableRoundId: curr.timeTableRoundId,
                          }
                        }
                      ),
                    }
                  }
                  return a
                })
              } else {
                acc.push({
                  id: busLine.id,
                  name: busLine.name,
                  [`${curr.time}`]: busLine.arrangedVehicles.map((vehicle) => {
                    const isNormalBusStopBySetting: boolean[] = []
                    vehicle.passengers.map((p) => {
                      isConfirm.push(p.bookingStatus)
                      sendEmails.push(p.sentEmailAt)
                      statusEmails.push(p.emailStatus)
                      scheduleEmails.push(p.scheduledEmailAt)
                      isNormalBusStopBySetting.push(
                        busLine.defaultSettingBusStopIds.includes(
                          p.busStopLineMapping.busStopId
                        )
                      )
                    })
                    return {
                      ...vehicle,
                      time: curr.time,
                      busLineName: busLine.name,
                      busLineId: busLine.id,
                      isNormalBusStopBySetting: !isNormalBusStopBySetting.includes(
                        false
                      ),
                      timeTableRoundId: curr.timeTableRoundId,
                    }
                  }),
                })
              }
            })
            return acc
          },
          []
        )

      // emailStatus == null                  >>  ไม่ต้องแสดงอะไรเลย
      // emailStatus == sending           >> ส่งอีเมลล่าสุดเมื่อ  {scheduledEmailAt}  สถานะกำลังส่ง
      // emailStatus == success           >> ส่งอีเมลสำเร็จล่าสุดเมื่อ {sentEmailAt}
      // emailStatus == fail                    >> ส่งอีเมลล่าสุดเมื่อ {scheudleEmailAt}  สถานะส่งล้มเหลว
      const sendEmailAt = filter(uniq(sendEmails), (v) => v)
      const emailStatus = filter(uniq(statusEmails), (v) => v)
      const scheduleEmailAt = filter(uniq(scheduleEmails), (v) => v)

      let timeDuration = ""
      if (
        (sendEmailAt.length > 0 || scheduleEmailAt.length > 0) &&
        emailStatus.length > 0
      ) {
        const today = DateTime.fromJSDate(new Date()).toISO()
        const end = DateTime.fromISO(today)
        const start = DateTime.fromISO(
          `${
            emailStatus[0] === "success" ? sendEmailAt[0] : scheduleEmailAt[0]
          }`
        )

        const prefix =
          emailStatus[0] === "success"
            ? "ส่งอีเมลสำเร็จล่าสุดเมื่อ"
            : "ส่งอีเมลล่าสุดเมื่อ"
        const suffix =
          emailStatus[0] === "sending"
            ? "สถานะกำลังส่ง"
            : emailStatus[0] === "fail"
            ? "สถานะส่งล้มเหลว"
            : ""

        const diff = end.diff(start, [
          "years",
          "months",
          "days",
          "hours",
          "minutes",
        ])

        const years = diff.toObject()?.years
        const months = diff.toObject()?.months
        const days = diff.toObject()?.days
        const hours = diff.toObject()?.hours
        const minutes = diff.toObject()?.minutes

        if (years && years > 0) {
          timeDuration = `${prefix} ${years} ปีที่เเล้ว ${suffix ? suffix : ""}`
        } else if (months && months > 0) {
          timeDuration = `${prefix} ${months} เดือนที่เเล้ว ${
            suffix ? suffix : ""
          }`
        } else if (days && days > 0) {
          timeDuration = `${prefix} ${days} วันที่เเล้ว ${suffix ? suffix : ""}`
        } else if (hours) {
          timeDuration = `${prefix} ${hours} ชั่วโมงที่ผ่านมา ${
            suffix ? suffix : ""
          }`
        } else if (minutes) {
          timeDuration = `${prefix} ${Math.floor(minutes)} นาทีที่ผ่านมา ${
            suffix ? suffix : ""
          }`
        }
      }

      return {
        ...data,
        rounds: rounds,
        busLines: busLines,
        bookingStatus: uniq(isConfirm)[0],
        displayEmail: timeDuration,
      }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!scheduleId && !!periodOfDay,
      refetchOnWindowFocus: false,
      refetchInterval: 30000,
    }
  )
}

export const getOneSchedule = (
  schedulesId: string | string[] | undefined,
  periodOfDay: "morning" | "evening"
) => {
  const axios = useAxios()

  return useQuery(
    ["schedule_busArrangement", schedulesId],
    async () => {
      const { data } = await axios.get(`/schedules/${schedulesId}`)

      const rounds =
        data?.data &&
        get(
          data?.data,
          `${
            periodOfDay === "morning" ? "timeTableMorning" : "timeTableEvening"
          }`
        )?.timeTableRound.map(
          (timeTableRound: { timeTableRoundId: number; time: string }) =>
            timeTableRound.time
        )

      return { ...data, rounds }
    },
    {
      keepPreviousData: true,
      staleTime: 0,
      retry: false,
      enabled: !!schedulesId,
      refetchOnWindowFocus: false,
    }
  )
}
