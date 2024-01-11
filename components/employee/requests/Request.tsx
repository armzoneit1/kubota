import {
  Container,
  Box,
  Text,
  Button,
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  IconButton,
  HStack,
  Link,
  Center,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react"
import Head from "next/head"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import SelectInput from "../../input/SelectInput"
import Datepicker from "../../input/Datepicker"
import NextLink from "next/link"
import { useState, useMemo, useEffect } from "react"
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import { BusLineDataTypes } from "../../../data-hooks/busLines/types"
import { SubordinateDataTypes } from "../../../data-hooks/subordinates/types"
import filter from "lodash/filter"
import get from "lodash/get"
import RequestSelectInput from "./RequestSelectInput"
import { useAccountMe } from "../../../providers/account-me-provider"
import { DateTime } from "luxon"
import { AreaDataTypes } from "../../../data-hooks/requests/types"
import uniq from "lodash/uniq"
import sortBy from "lodash/sortBy"
import styles from "../../layout/layout.module.css"
import isEqual from "lodash/isEqual"
import { useAxios } from "../../../providers/http-client"

type RequestNewProps = {
  periodOfDay: "morning" | "evening"
  busLine: BusLineDataTypes<boolean>[]
  onSubmit: (values: any) => void
  isLoading: boolean
  subordinates: SubordinateDataTypes[]
  areas: AreaDataTypes[]
}

const mappingDayOfWeek = {
  0: 6,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
  6: 5,
}

const isValidDate = (d: any) => {
  return d instanceof Date && !isNaN(d.getTime())
}

const RequestNew = ({
  periodOfDay,
  busLine,
  onSubmit: submit,
  isLoading,
  subordinates,
  areas,
}: RequestNewProps) => {
  const me = useAccountMe()
  const axios = useAxios()
  const toast = useToast()

  const busLineOptions = useMemo(
    () =>
      busLine
        ? filter(busLine, { status: true }).map((busLine) => {
            const busStops = busLine.busStops.map((busStop) => ({
              value: busStop.busStopLineMappingId,
              label: busStop.name,
            }))
            return {
              value: busLine.id,
              label: busLine.name,
              busStops: busStops,
            }
          })
        : [],
    [busLine]
  )

  const SubordinateOptions = useMemo(
    () =>
      subordinates
        ? filter(
            subordinates,
            (value) => value?.registerBookingBusInfo?.status
          ).map((subordinate) => {
            const employeeUsageInfos = subordinate?.registerBookingBusInfo
              ?.employeeUsageInfos
              ? subordinate?.registerBookingBusInfo?.employeeUsageInfos.reduce(
                  (acc: any, curr) => {
                    acc[`${curr.periodOfDay}`] = [
                      ...acc[`${curr.periodOfDay}`],
                      {
                        dayOfWeek: curr.dayOfWeek,
                        busLineId: curr.busLineId,
                        busStopLineMappingId: curr.busLineStopMappingId,
                        busStopId: curr.busStopId,
                        areaId: curr.areaId,
                      },
                    ]
                    return acc
                  },
                  {
                    morning: [],
                    evening: [],
                  }
                )
              : []
            return {
              value: subordinate.employeeNo,
              label: `${subordinate.employeeNo} ${subordinate.title}${subordinate.firstName} ${subordinate.lastName}`,
              isRegisterToBookingBusSystem:
                subordinate.isRegisterToBookingBusSystem,
              registerBookingBusInfo: {
                ...subordinate.registerBookingBusInfo,
                employeeUsageInfos,
              },
            }
          })
        : [],
    [subordinates]
  )

  const employeeUsageInfos = useMemo(
    () =>
      me?.bookingBusUser?.employeeUsageInfos
        ? me?.bookingBusUser?.employeeUsageInfos.reduce(
            (acc: any, curr) => {
              acc[`${curr.periodOfDay}`] = [
                ...acc[`${curr.periodOfDay}`],
                {
                  dayOfWeek: curr.dayOfWeek,
                  busLineId: curr.busLineId,
                  busStopLineMappingId: curr.busLineStopMappingId,
                  busStopId: curr.busStopId,
                  areaId: curr.areaId,
                },
              ]
              return acc
            },
            {
              morning: [],
              evening: [],
            }
          )
        : [],

    [me.bookingBusUser]
  )

  const [timeTableRoundSelected, setTimeTableRoundSelected] = useState<any>({
    date: null,
    timeTableRoundId: null,
  })

  const [date, setDate] = useState<any>(new Date())
  const [warning, setWarning] = useState<any>(null)
  const [allDate, setAllDate] = useState<any>({})
  const [allWarning, setAllWarning] = useState<any>({})
  const [isAddSubordinate, setIsAddSubordinate] = useState(false)
  const [isSelectedTimeTableRound, setIsSelectedTimeTableRound] = useState(
    false
  )
  const [isCheckDuplicateMe, setIsCheckDuplicateMe] = useState(false)
  const [
    isCheckDuplicateSubordinate,
    setIsCheckDuplicateSubordinate,
  ] = useState(false)
  const [isLoadingAbleForBooking, setIsLoadingAbleForBooking] = useState(false)
  const [ableForBooking, setAbleForBooking] = useState<any>(null)
  const [ableForBookingList, setAbleForBookingList] = useState<any>({})
  const [
    isLoadingAbleForBookingList,
    setIsLoadingAbleForBookingList,
  ] = useState<any>({})

  const areaOptions = useMemo(
    () =>
      areas && busLine
        ? filter(areas, { status: true }).map((area) => {
            const busStopIds = filter(area.busStops, {
              status: true,
            }).map((busStop) => ({
              busStopId: busStop.busStopId,
              name: busStop.busStopName,
            }))

            let isAbleForBooking = null

            const busStops = uniq(busStopIds).reduce((acc: any[], curr) => {
              const findBusStop = filter(busLine, { status: true })
                .map((busLine) => {
                  if (curr.busStopId) {
                    let isAbleForBookingBusStop = null
                    const filteredBusStop = filter(busLine.busStops, {
                      busStopId: curr.busStopId,
                    })

                    if (filteredBusStop.length > 0) {
                      if (
                        ableForBooking != null &&
                        ableForBooking?.length > 0
                      ) {
                        const filteredAbleForBooking = filter(ableForBooking, {
                          id: filteredBusStop[0]?.busStopId,
                        })

                        isAbleForBookingBusStop =
                          filteredAbleForBooking.length > 0
                      }
                      return {
                        value: filteredBusStop[0]?.busStopLineMappingId,
                        label: filteredBusStop[0]?.name,
                        rank: filteredBusStop[0]?.rank,
                        busStopId: filteredBusStop[0]?.busStopId,
                        isAbleForBooking: isAbleForBookingBusStop,
                      }
                    }
                  }
                })
                .filter((v) => v)

              if (findBusStop.length > 0 && findBusStop[0]) {
                acc.push(findBusStop[0])
              }
              return acc
            }, [])

            if (ableForBooking != null && ableForBooking?.length > 0) {
              const filteredAbleForBooking = ableForBooking?.filter(
                (able: any) => {
                  return [...busStops].map((b) => b.busStopId).includes(able.id)
                }
              )

              isAbleForBooking = filteredAbleForBooking.length > 0
            }

            return {
              value: area.id,
              label: area.name,
              busStops: sortBy(busStops, ["rank"]),
              busStopIds: busStopIds.map((b) => b.busStopId),
              isAbleForBooking: isAbleForBooking,
            }
          })
        : [],
    [areas, busLine, ableForBooking]
  )

  const onSubmitSelectionTimeTableRound = async () => {
    const values = {
      date: watchDate,
      timeTableRoundId: watchTimeTableRoundId,
    }

    setIsLoadingAbleForBooking(true)

    await axios
      .get(
        `/busStops/ableForBooking/timeTableRound/${get(
          watchTimeTableRoundId,
          "value"
        )}`
      )
      .then((res) => {
        setAbleForBooking(res.data.data)
        setTimeTableRoundSelected({
          date: values?.date,
          timeTableRoundId: values?.timeTableRoundId,
        })
        setIsLoadingAbleForBooking(false)

        setValue("me", [])
        if (me?.bookingBusUser?.status) {
          const me: any = {
            date: values?.date,
            timeTableRoundId: values?.timeTableRoundId,
            busLineId: undefined,
            busStopLineMappingId: undefined,
          }
          const dayOfweek =
            values?.date != null ? new Date(`${values?.date}`).getDay() : null
          if (dayOfweek != null) {
            const filteredEmployeeUsageInfo = get(
              employeeUsageInfos,
              `${periodOfDay}.${get(mappingDayOfWeek, dayOfweek)}`
            )

            const filteredBusLine: any[] = filter(areaOptions, {
              value: filteredEmployeeUsageInfo?.areaId,
            })

            const filteredBusStopLineMapping = filter(
              filteredBusLine[0]?.busStops,
              {
                busStopId: filteredEmployeeUsageInfo?.busStopId,
              }
            )

            if (
              filteredBusLine.length > 0 &&
              filteredBusStopLineMapping.length > 0
            ) {
              const filteredAbleForBookingBusStop = filter(res.data.data, {
                id: filteredEmployeeUsageInfo.busStopId,
              })

              const filteredAbleForBookingArea = filter(
                res.data.data,
                (able) => {
                  return (
                    Array.isArray(filteredBusLine?.[0]?.busStops) &&
                    [...filteredBusLine?.[0]?.busStops]
                      .map((b) => b.busStopId)
                      .includes(able.id)
                  )
                }
              )

              if (filteredAbleForBookingArea.length > 0) {
                me.busLineId = filteredBusLine?.[0]
              }

              if (filteredAbleForBookingBusStop.length > 0) {
                me.busStopLineMappingId = filteredBusStopLineMapping?.[0]
              } else {
                setError(`me.0.busStopLineMappingId`, {
                  message:
                    "จุดลงรถที่ท่านลงทะเบียนไม่มีสายรถวิ่งผ่าน กรุณาเลือกจุดอื่นที่ใกล้เคียง",
                  type: "custom",
                })
              }
            }
          }

          appendMe(me)
          setValue("me.0", me)
          setValue("me.0.date", watchDate as any)
          setValue("me.0.timeTableRoundId", values.timeTableRoundId)
          handleSetAllDate(values.date, "dateMe[0]")
          setAbleForBookingList((prevState: any) => ({
            ...prevState,
            "me.0": res.data.data,
          }))
        }

        setIsSelectedTimeTableRound(true)
        setIsAddSubordinate(false)
      })
      .catch((err) => {})
  }

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    setValue,
    unregister,
    watch,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    mode: "onBlur",
    defaultValues: {
      date: new Date(),
      timeTableRoundId: null,
      subordinates: [
        {
          employeeNo: null,
          date: null,
          timeTableRoundId: null,
          busLineId: null,
          busStopLineMappingId: null,
        },
      ],
      me: [
        {
          date: null,
          timeTableRoundId: null,
          busLineId: null,
          busStopLineMappingId: null,
        },
      ],
    },
  })

  const watchDate = watch("date")
  const watchTimeTableRoundId = watch("timeTableRoundId")

  const {
    fields: fieldsMe,
    append: appendMe,
    remove: removeMe,
  } = useFieldArray({
    control,
    name: "me",
  })

  const watchMe = watch("me")

  useEffect(() => {
    if (
      (watchMe != null ||
        (Array.isArray(watchMe) &&
          Array(watchMe).filter((m) => m != null)?.length > 0)) &&
      !isCheckDuplicateMe
    ) {
      watchMe.map((me, index) => {
        trigger([`me.${index}.date`])
      })
      setIsCheckDuplicateMe(true)
    }
  }, [watchMe])

  const {
    fields: fieldsSubordinates,
    append: appendSubordinates,
    remove: removeSubordinates,
    insert: insertSubordinates,
  } = useFieldArray({
    control,
    name: "subordinates",
  })

  const watchSubordinates = watch("subordinates")

  useEffect(() => {
    if (
      (watchSubordinates != null ||
        (Array.isArray(watchSubordinates) &&
          Array(watchSubordinates).filter((m) => m != null)?.length > 0)) &&
      !isCheckDuplicateSubordinate
    ) {
      watchSubordinates.map((sub, index) => {
        trigger([
          `subordinates.${index}.date`,
          `subordinates.${index}.employeeNo`,
        ])
      })
      setIsCheckDuplicateSubordinate(true)
    } else {
      const subordinateErrors = errors?.subordinates
      if (subordinateErrors != null && subordinateErrors?.length > 0) {
        subordinateErrors.forEach((sub: any, index) => {
          if (
            sub?.employeeNo?.message === "เลือกวันที่จองซ้ำ" ||
            sub?.date?.message === "เลือกวันที่จองซ้ำ"
          ) {
            const filteredDuplicate = Array.isArray(watchSubordinates)
              ? [...watchSubordinates]?.filter(
                  (s: any, i: any) =>
                    isValidDate(get(watchSubordinates[index], "date")) &&
                    isValidDate(get(s, "date")) &&
                    get(watchSubordinates, `${index}.date`)?.getDate() &&
                    get(s, "date")?.getDate() &&
                    get(watchSubordinates, `${index}.date`)?.getDate() ===
                      get(s, "date")?.getDate() &&
                    isEqual(
                      get(watchSubordinates[index], "employeeNo"),
                      get(s, "employeeNo")
                    ) &&
                    index !== i
                )
              : []

            if (filteredDuplicate?.length === 0) {
              trigger([
                `subordinates.${index}.date`,
                `subordinates.${index}.employeeNo`,
              ])
            } else if (filteredDuplicate?.length > 0) {
              let findIndex: number[] = []
              filteredDuplicate.forEach((s, i) => {
                const find = watchSubordinates?.findIndex(
                  (watchSub: any) =>
                    isValidDate(get(watchSubordinates[index], "date")) &&
                    isValidDate(get(watchSub, "date")) &&
                    get(watchSubordinates, `${index}.date`)?.getDate() &&
                    get(watchSub, "date")?.getDate() &&
                    get(watchSubordinates, `${index}.date`)?.getDate() ===
                      get(watchSub, "date")?.getDate() &&
                    isEqual(
                      get(watchSubordinates[index], "employeeNo"),
                      get(watchSub, "employeeNo")
                    )
                )
                findIndex.push(find)
              })

              if (findIndex.length > 0) {
                findIndex?.forEach((fi) => {
                  if (
                    get(errors?.subordinates?.[fi]?.employeeNo, "message") ==
                    null
                  ) {
                    trigger([
                      `subordinates.${fi}.employeeNo`,
                      `subordinates.${index}.employeeNo`,
                    ])
                  }
                  if (
                    get(errors?.subordinates?.[fi]?.date, "message") == null
                  ) {
                    trigger([
                      `subordinates.${fi}.date`,
                      `subordinates.${index}.date`,
                    ])
                  }
                })
              }
            }
          }
        })
      }
    }
  }, [watchSubordinates])

  const handleSetAllDate = (date: any, field: any) => {
    setAllDate((prevState: any) => ({ ...prevState, [`${field}`]: date }))
  }

  const handleSetAllWarning = (warning: any, field: any) => {
    setAllWarning((prevState: any) => ({ ...prevState, [`${field}`]: warning }))
  }

  const handleSetDate = (date: any) => {
    setDate(date)
  }

  const handleSetWarning = (warning: any) => {
    setWarning(warning)
  }

  const handleSetSubordinateBusLineAndBusStopLineMapping = (
    date: any,
    index: number,
    resAbleForBooking: any
  ) => {
    const dayOfweek = date != null ? new Date(`${date}`).getDay() : null
    if (
      dayOfweek != null &&
      get(
        watchSubordinates[index],
        `employeeNo.registerBookingBusInfo.isDisplayDefaultForSubordinateBooking`
      )
    ) {
      unregister(`subordinates.${index}.busLineId`)
      unregister(`subordinates.${index}.busStopLineMappingId`)
      setValue(`subordinates.${index}.busLineId`, null)
      setValue(`subordinates.${index}.busStopLineMappingId`, null)

      const filteredEmployeeUsageInfo = get(
        watchSubordinates[index],
        `employeeNo.registerBookingBusInfo.employeeUsageInfos.${periodOfDay}.${get(
          mappingDayOfWeek,
          dayOfweek
        )}`
      )
      const filteredBusLine: any[] = filter(areaOptions, {
        value: filteredEmployeeUsageInfo?.areaId,
      })

      const filteredBusStopLineMapping = filter(filteredBusLine[0]?.busStops, {
        busStopId: filteredEmployeeUsageInfo?.busStopId,
      })

      if (filteredBusLine.length > 0 && filteredBusStopLineMapping.length > 0) {
        const filteredAbleForBookingBusStop = filter(resAbleForBooking, {
          id: filteredEmployeeUsageInfo.busStopId,
        })

        const filteredAbleForBookingArea = filter(resAbleForBooking, (able) => {
          return (
            Array.isArray(filteredBusLine?.[0]?.busStops) &&
            [...filteredBusLine?.[0]?.busStops]
              .map((b) => b.busStopId)
              .includes(able.id)
          )
        })

        if (filteredAbleForBookingArea.length > 0) {
          unregister(`subordinates.${index}.busLineId`)
          setValue(`subordinates.${index}.busLineId`, filteredBusLine?.[0])
        }

        if (filteredAbleForBookingBusStop.length > 0) {
          unregister(`subordinates.${index}.busStopLineMappingId`)
          setValue(
            `subordinates.${index}.busStopLineMappingId`,
            filteredBusStopLineMapping?.[0]
          )
        } else {
          setError(`subordinates.${index}.busStopLineMappingId`, {
            message:
              "จุดลงรถที่ท่านลงทะเบียนไม่มีสายรถวิ่งผ่าน กรุณาเลือกจุดอื่นที่ใกล้เคียง",
            type: "custom",
          })
        }
      } else {
        unregister(`subordinates.${index}.busLineId`)
        unregister(`subordinates.${index}.busStopLineMappingId`)
        setValue(`subordinates.${index}.busLineId`, null)
        setValue(`subordinates.${index}.busStopLineMappingId`, null)
      }
    } else {
      unregister(`subordinates.${index}.busLineId`)
      unregister(`subordinates.${index}.busStopLineMappingId`)
      setValue(`subordinates.${index}.busLineId`, null)
      setValue(`subordinates.${index}.busStopLineMappingId`, null)
    }
  }

  const handleSelectSubordinate = (index: number, value: any) => {
    const date = get(watchSubordinates[index], "date")
    const dayOfweek = date != null ? new Date(`${date}`).getDay() : null
    if (dayOfweek != null) {
      const filteredEmployeeUsageInfo = get(
        value,
        `registerBookingBusInfo.employeeUsageInfos.${periodOfDay}.${get(
          mappingDayOfWeek,
          dayOfweek
        )}`
      )
      const filteredBusLine: any[] = filter(areaOptions, {
        value: filteredEmployeeUsageInfo?.areaId,
      })

      const filteredBusStopLineMapping = filter(filteredBusLine[0]?.busStops, {
        busStopId: filteredEmployeeUsageInfo?.busStopId,
      })

      if (filteredBusLine.length > 0 && filteredBusStopLineMapping.length > 0) {
        setValue(`subordinates.${index}.busLineId`, filteredBusLine?.[0])
        setValue(
          `subordinates.${index}.busStopLineMappingId`,
          filteredBusStopLineMapping?.[0]
        )
      } else {
        setValue(`subordinates.${index}.busLineId`, null)
        setValue(`subordinates.${index}.busStopLineMappingId`, null)
      }
    } else {
      setValue(`subordinates.${index}.busLineId`, null)
      setValue(`subordinates.${index}.busStopLineMappingId`, null)
    }
  }

  const handleSetMeBusLineAndBusStopLineMapping = (
    date: any,
    index: number,
    resAbleForBooking: any
  ) => {
    const dayOfweek = date != null ? new Date(`${date}`).getDay() : null
    if (dayOfweek != null) {
      unregister(`me.${index}.busLineId`)
      unregister(`me.${index}.busStopLineMappingId`)
      setValue(`me.${index}.busLineId`, null)
      setValue(`me.${index}.busStopLineMappingId`, null)

      const filteredEmployeeUsageInfo = get(
        employeeUsageInfos,
        `${periodOfDay}.${get(mappingDayOfWeek, dayOfweek)}`
      )

      const filteredBusLine: any[] = filter(areaOptions, {
        value: filteredEmployeeUsageInfo?.areaId,
      })

      const filteredBusStopLineMapping = filter(filteredBusLine[0]?.busStops, {
        busStopId: filteredEmployeeUsageInfo?.busStopId,
      })

      if (filteredBusLine.length > 0 && filteredBusStopLineMapping.length > 0) {
        const filteredAbleForBookingBusStop = filter(resAbleForBooking, {
          id: filteredEmployeeUsageInfo.busStopId,
        })

        const filteredAbleForBookingArea = filter(resAbleForBooking, (able) => {
          return (
            Array.isArray(filteredBusLine?.[0]?.busStops) &&
            [...filteredBusLine?.[0]?.busStops]
              .map((b) => b.busStopId)
              .includes(able.id)
          )
        })

        if (filteredAbleForBookingArea.length > 0) {
          unregister(`me.${index}.busLineId`)
          setValue(`me.${index}.busLineId`, filteredBusLine?.[0])
        }

        if (filteredAbleForBookingBusStop.length > 0) {
          unregister(`me.${index}.busStopLineMappingId`)
          setValue(
            `me.${index}.busStopLineMappingId`,
            filteredBusStopLineMapping?.[0]
          )
        } else {
          setError(`me.${index}.busStopLineMappingId`, {
            message:
              "จุดลงรถที่ท่านลงทะเบียนไม่มีสายรถวิ่งผ่าน กรุณาเลือกจุดอื่นที่ใกล้เคียง",
            type: "custom",
          })
        }
      } else {
        unregister(`me.${index}.busLineId`)
        unregister(`me.${index}.busStopLineMappingId`)
        setValue(`me.${index}.busLineId`, null)
        setValue(`me.${index}.busStopLineMappingId`, null)
      }
    } else {
      unregister(`me.${index}.busLineId`)
      unregister(`me.${index}.busStopLineMappingId`)
      setValue(`me.${index}.busLineId`, null)
      setValue(`me.${index}.busStopLineMappingId`, null)
    }
  }

  const onSubmit = (values: any) => {
    const me = filter(get(values, "me"), "date")
    const subordinates = filter(get(values, "subordinates"), "date")
    values.me =
      me.length > 0
        ? me.map((me: any) => ({
            date: DateTime.fromJSDate(new Date(me?.date)).toFormat("y-MM-dd"),
            timeTableRoundId: me?.timeTableRoundId?.value,
            busStopLineMappingId: me?.busStopLineMappingId?.value,
          }))
        : []
    values.subordinates =
      subordinates.length > 0
        ? subordinates.map((subordinate: any) => ({
            employeeNo: subordinate?.employeeNo?.value,
            date: DateTime.fromJSDate(new Date(subordinate?.date)).toFormat(
              "y-MM-dd"
            ),
            timeTableRoundId: subordinate?.timeTableRoundId?.value,
            busStopLineMappingId: subordinate?.busStopLineMappingId?.value,
          }))
        : []
    delete values.timeTableRoundId
    delete values.date
    submit({ ...values, periodOfDay: periodOfDay })
  }

  useEffect(() => {
    if (fieldsSubordinates.length === 0) {
      setIsAddSubordinate(false)
    }
  }, [fieldsSubordinates])

  const handleAddSubordinate = () => {
    setIsAddSubordinate(true)
    if (SubordinateOptions.length > 0) {
      setValue("subordinates", [])
      const addedSubordinates: any[] = []
      if (
        filter(
          SubordinateOptions,
          (sub) =>
            sub?.registerBookingBusInfo?.isDisplayDefaultForSubordinateBooking
        )?.length > 0
      ) {
        let subIndex = 0
        SubordinateOptions.forEach((sub: any, index) => {
          if (
            sub?.registerBookingBusInfo?.isDisplayDefaultForSubordinateBooking
          ) {
            const subordinate = {
              employeeNo: sub,
              date: timeTableRoundSelected?.date,
              timeTableRoundId: timeTableRoundSelected?.timeTableRoundId,
              busLineId: undefined,
              busStopLineMappingId: undefined,
            }

            const dayOfweek =
              subordinate?.date != null
                ? new Date(`${subordinate?.date}`).getDay()
                : null

            if (dayOfweek != null) {
              const filteredEmployeeUsageInfo = get(
                sub,
                `registerBookingBusInfo.employeeUsageInfos.${periodOfDay}.${get(
                  mappingDayOfWeek,
                  dayOfweek
                )}`
              )
              const filteredBusLine: any[] = filter(areaOptions, {
                value: filteredEmployeeUsageInfo?.areaId,
              })

              const filteredBusStopLineMapping = filter(
                filteredBusLine[0]?.busStops,
                {
                  busStopId: filteredEmployeeUsageInfo?.busStopId,
                }
              )

              if (
                filteredBusLine.length > 0 &&
                filteredBusStopLineMapping.length > 0
              ) {
                const filteredAbleForBookingBusStop = filter(ableForBooking, {
                  id: filteredEmployeeUsageInfo.busStopId,
                })

                const filteredAbleForBookingArea = filter(
                  ableForBooking,
                  (able) => {
                    return (
                      Array.isArray(filteredBusLine?.[0]?.busStops) &&
                      [...filteredBusLine?.[0]?.busStops]
                        .map((b) => b.busStopId)
                        .includes(able.id)
                    )
                  }
                )

                if (filteredAbleForBookingArea.length > 0) {
                  subordinate.busLineId = filteredBusLine?.[0]
                }

                if (filteredAbleForBookingBusStop.length > 0) {
                  setValue(
                    `subordinates.${subIndex}.busStopLineMappingId`,
                    filteredBusStopLineMapping?.[0]
                  )
                  subordinate.busStopLineMappingId =
                    filteredBusStopLineMapping?.[0]
                } else {
                  setError(`subordinates.${subIndex}.busStopLineMappingId`, {
                    message:
                      "จุดลงรถที่ท่านลงทะเบียนไม่มีสายรถวิ่งผ่าน กรุณาเลือกจุดอื่นที่ใกล้เคียง",
                    type: "custom",
                  })
                }
              }
            }

            addedSubordinates.push(subordinate)
            subIndex++
          }
        })
      } else {
        const subordinate = {
          employeeNo: undefined,
          date: undefined,
          timeTableRoundId: undefined,
          busLineId: undefined,
          busStopLineMappingId: undefined,
        }
        addedSubordinates.push(subordinate)
      }

      appendSubordinates(addedSubordinates)
    }
  }

  const isDuplicateSubordinate = (index: any) => {
    const data: any = watchSubordinates[index]
    const allData = watchSubordinates.map((sub, index) => ({ ...sub, index }))
    const filteredData = allData.filter(
      (v: any) =>
        v?.employeeNo?.value === data?.employeeNo?.value &&
        v?.date?.getTime() === data?.date?.getTime()
    )

    if (filteredData?.length > 1) {
      return true
    }

    return false
  }

  const isDuplicateMe = (index: any) => {
    const data: any = watchMe[index]
    const allData = watchMe.map((me, index) => ({ ...me, index }))
    const filteredData = allData.filter(
      (v: any) => v?.date?.getTime() === data?.date?.getTime()
    )

    if (filteredData?.length > 1) {
      return true
    }

    return false
  }

  const getAbleForBooking = async (
    timeTableRoundId: number,
    field: string,
    callbackFn: (res: any) => void
  ) => {
    if (timeTableRoundId != null) {
      setIsLoadingAbleForBookingList((prevState: any) => ({
        ...prevState,
        [`${field}`]: true,
      }))

      if (
        +timeTableRoundId === +timeTableRoundSelected?.timeTableRoundId?.value
      ) {
        setAbleForBookingList((prevState: any) => ({
          ...prevState,
          [`${field}`]: ableForBooking,
        }))
        setIsLoadingAbleForBookingList((prevState: any) => ({
          ...prevState,
          [`${field}`]: false,
        }))
        callbackFn(ableForBooking)
      } else {
        await axios
          .get(`/busStops/ableForBooking/timeTableRound/${timeTableRoundId}`)
          .then((res) => {
            setAbleForBookingList((prevState: any) => ({
              ...prevState,
              [`${field}`]: res.data.data,
            }))
            setIsLoadingAbleForBookingList((prevState: any) => ({
              ...prevState,
              [`${field}`]: false,
            }))
            callbackFn(res.data.data)
          })
          .catch((err) => {})
      }
    } else {
      callbackFn(null)
    }
  }

  return (
    <>
      <Head>
        <title>จองรถ</title>
        <meta name="description" content="requests" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        minW="100%"
        minHeight="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
        mt={10}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex width="100%" justifyContent="space-between" my={5}>
            <Flex justifyContent="center" flexDirection="column">
              <HStack spacing={6}>
                <NextLink href={"/employee/requests"} passHref>
                  <Link _hover={{}} _focus={{}}>
                    <Text color="#00A5A8">จองรถ</Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <Text color="#00000080">
                  เพิ่มการจองรถ (
                  {periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"})
                </Text>
              </HStack>
            </Flex>
          </Flex>
          <Flex w="100%" justifyContent="space-between" mb={10}>
            <Text fontSize="32px" fontWeight={600}>
              จองรถ ({periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"})
            </Text>
            <Button
              isLoading={isSubmitting || isLoading}
              type="submit"
              isDisabled={
                !(
                  filter(watchMe, (v) => v?.busLineId || v?.date).length > 0 ||
                  filter(
                    watchSubordinates,
                    (v) => v?.busLineId || v?.date || v?.employeeNo
                  ).length > 0
                )
              }
            >
              บันทึกการจอง
            </Button>
          </Flex>

          <Stack spacing={{ base: 8, md: 12 }} mb={10}>
            <Flex w={{ base: "100%", md: "50%" }}>
              <Box w="50%" mr={{ base: 2, md: 4 }}>
                <FormLabel
                  htmlFor={`date`}
                  display="flex"
                  flexDirection={{ base: "column", md: "row" }}
                >
                  วัน/เดือน/ปี{" "}
                  <Text color="#E53E3E" ml={{ base: 0, md: 4 }}>
                    {warning ?? ""}
                  </Text>
                </FormLabel>
                <Controller
                  name={`date`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <Datepicker
                      date={date ?? null}
                      minDate={new Date()}
                      field={field}
                      fieldState={fieldState}
                      dateFormat="dd/MM/yyyy (ccc)"
                      customOnChange={true}
                      onChange={(date: any) => {
                        field.onChange(date)
                        handleSetDate(date)
                        if (date == null) {
                          setError("date", {
                            message: "กรุณาเลือกวันที่",
                            type: "required",
                          })
                        } else {
                          clearErrors("date")
                        }

                        if (!(date === watchDate)) {
                          setValue(`timeTableRoundId`, null)
                        }
                        unregister(`timeTableRoundId`)
                      }}
                    />
                  )}
                  rules={{
                    required: "กรุณาเลือกวันที่",
                  }}
                />
              </Box>
              <FormControl isInvalid={!!errors.timeTableRoundId} w={"50%"}>
                <FormLabel htmlFor={`timeTableRoundId`}>รอบเวลา</FormLabel>
                <Controller
                  name={`timeTableRoundId`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <RequestSelectInput
                      {...field}
                      {...fieldState}
                      placeholder=""
                      isDisabled={!watchDate}
                      date={watchDate ?? null}
                      handleSetWarning={handleSetWarning}
                      periodOfDay={periodOfDay}
                    />
                  )}
                  rules={{
                    required: !!watchDate && "กรุณาเลือกรอบเวลา",
                    validate: (value: any) => {
                      if (value) {
                        if (!value?.status) return "รอบเวลาที่เลือกปิดการจอง"
                      } else return
                    },
                  }}
                />
                <FormErrorMessage>
                  {errors.timeTableRoundId && errors?.timeTableRoundId?.message}
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <Box>
              <Button
                variant="outline"
                isLoading={isSubmitting || isLoadingAbleForBooking}
                onClick={onSubmitSelectionTimeTableRound}
                isDisabled={
                  !!errors.date ||
                  !!errors.timeTableRoundId ||
                  !watchTimeTableRoundId ||
                  !watchDate
                }
                _focus={{ boxShadow: "none" }}
              >
                ยืนยัน
              </Button>
            </Box>
          </Stack>

          {isSelectedTimeTableRound && (
            <Flex flexDirection="column">
              <Box mb={10}>
                <Text fontSize="20px" fontWeight={600} mb={4}>
                  จองให้ตัวเอง
                </Text>

                {me?.bookingBusUser && me?.bookingBusUser?.status ? (
                  <>
                    <Box
                      border="1px solid #B2CCCC"
                      borderRadius="6px"
                      width="100%"
                      mb={10}
                      p={{ base: 4, md: 10 }}
                      overflowX="auto"
                      overflowY="unset"
                      className={styles.scroll}
                    >
                      <Table variant="unstyled" width="100%" mb={10}>
                        <Thead>
                          <Tr>
                            <Th
                              w="5%"
                              p={{ base: "12px 8px", md: "12px 16px" }}
                            ></Th>
                            <Th
                              w="20%"
                              fontSize="18px"
                              p={{ base: "12px 8px", md: "12px 16px" }}
                              minWidth="200px"
                            >
                              วัน/เดือน/ปี
                            </Th>
                            <Th
                              w="15%"
                              fontSize="18px"
                              p={{ base: "12px 8px", md: "12px 16px" }}
                              minWidth="200px"
                            >
                              รอบเวลา
                            </Th>
                            <Th
                              w="25%"
                              fontSize="18px"
                              p={{ base: "12px 8px", md: "12px 16px" }}
                              minWidth="250px"
                            >
                              พื้นที่
                            </Th>
                            <Th
                              w="25%"
                              fontSize="18px"
                              p={{ base: "12px 8px", md: "12px 16px" }}
                              minWidth="250px"
                            >
                              จุดลงรถ{" "}
                              <span
                                style={{ fontSize: "14px", fontWeight: 300 }}
                              >
                                (สายรถแสดงหลังจากที่จัดรถสำเร็จ)
                              </span>
                            </Th>
                            <Th
                              w="10%"
                              p={{ base: "12px 8px", md: "12px 16px" }}
                            ></Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {fieldsMe.map((field, index) => (
                            <Tr key={field.id}>
                              <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                {index + 1}.
                              </Td>
                              <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                <Box>
                                  <Controller
                                    name={`me.${index}.date`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                      <Datepicker
                                        date={
                                          get(allDate, `dateMe[${index}]`)
                                            ? get(allDate, `dateMe[${index}]`)
                                            : null
                                        }
                                        minDate={new Date()}
                                        field={field}
                                        fieldState={fieldState}
                                        dateFormat="dd/MM/yyyy (ccc)"
                                        customOnChange={true}
                                        onChange={(date: any) => {
                                          field.onChange(date)
                                          handleSetAllDate(
                                            date,
                                            `dateMe[${index}]`
                                          )

                                          if (
                                            !(
                                              date ===
                                              get(watchMe, `${index}.date`)
                                            )
                                          ) {
                                            setValue(
                                              `me.${index}.timeTableRoundId`,
                                              null
                                            )
                                            setValue(
                                              `me.${index}.busLineId`,
                                              null
                                            )
                                            setValue(
                                              `me.${index}.busStopLineMappingId`,
                                              null
                                            )
                                          }
                                          unregister(
                                            `me.${index}.timeTableRoundId`
                                          )
                                          setIsCheckDuplicateMe(false)
                                        }}
                                      />
                                    )}
                                    rules={{
                                      validate: (value: any) => {
                                        if (value != null) {
                                          if (isDuplicateMe(index)) {
                                            return "เลือกวันที่จองซ้ำ"
                                          }
                                          return
                                        }
                                        return
                                      },
                                    }}
                                  />
                                </Box>
                              </Td>
                              <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                <FormControl
                                  isInvalid={
                                    !!(
                                      errors.me &&
                                      errors.me[index] &&
                                      errors.me[index]?.timeTableRoundId
                                    )
                                  }
                                >
                                  <Controller
                                    name={`me.${index}.timeTableRoundId`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                      <RequestSelectInput
                                        {...field}
                                        {...fieldState}
                                        placeholder=""
                                        isDisabled={
                                          !get(watchMe, `${index}.date`)
                                        }
                                        date={
                                          get(watchMe, `${index}.date`)
                                            ? get(watchMe, `${index}.date`)
                                            : null
                                        }
                                        handleSetAllWarning={
                                          handleSetAllWarning
                                        }
                                        periodOfDay={periodOfDay}
                                        fieldName={`warningMe[${index}]`}
                                        onChange={(v: any) => {
                                          field.onChange(v)
                                          getAbleForBooking(
                                            v?.value,
                                            `me.${index}`,
                                            (res) => {
                                              handleSetMeBusLineAndBusStopLineMapping(
                                                get(watchMe, `${index}.date`),
                                                index,
                                                res
                                              )
                                            }
                                          )
                                        }}
                                      />
                                    )}
                                    rules={{
                                      required:
                                        get(watchMe, `${index}.date`) &&
                                        "กรุณาเลือกรอบเวลา",
                                      validate: (value: any) => {
                                        if (value) {
                                          if (!value?.status)
                                            return "รอบเวลาที่เลือกปิดการจอง"
                                        } else return
                                      },
                                    }}
                                  />
                                  <FormErrorMessage>
                                    {errors.me &&
                                      errors.me[index] &&
                                      errors.me[index]?.timeTableRoundId &&
                                      errors.me[index]?.timeTableRoundId
                                        ?.message}
                                  </FormErrorMessage>
                                </FormControl>
                              </Td>
                              <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                <FormControl
                                  isInvalid={
                                    !!(
                                      errors.me &&
                                      errors.me[index] &&
                                      errors.me[index]?.busLineId
                                    )
                                  }
                                >
                                  <Controller
                                    name={`me.${index}.busLineId`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                      <SelectInput
                                        options={
                                          get(
                                            ableForBookingList,
                                            `me.${index}`
                                          ) != null
                                            ? filter(areaOptions, (area) => {
                                                return (
                                                  filter(
                                                    get(
                                                      ableForBookingList,
                                                      `me.${index}`
                                                    ),
                                                    (able) => {
                                                      return (
                                                        Array.isArray(
                                                          area?.busStops
                                                        ) &&
                                                        [...area?.busStops]
                                                          .map(
                                                            (b) => b.busStopId
                                                          )
                                                          .includes(able.id)
                                                      )
                                                    }
                                                  ).length > 0
                                                )
                                              })
                                            : areaOptions
                                        }
                                        isLoading={get(
                                          isLoadingAbleForBookingList,
                                          `me.${index}`
                                        )}
                                        menuPortalTarget={document.body}
                                        {...field}
                                        {...fieldState}
                                        placeholder=""
                                        onChange={(v: any) => {
                                          field.onChange(v)
                                          if (!v) {
                                            unregister(
                                              `me.${index}.busStopLineMappingId`
                                            )
                                            setValue(
                                              `me.${index}.busStopLineMappingId`,
                                              null
                                            )
                                          }
                                          if (v) {
                                            const busStopLineMappingId = get(
                                              watchMe,
                                              `me.${index}.busStopLineMappingId`
                                            )
                                            if (busStopLineMappingId) {
                                              const filteredBusStop = filter(
                                                v.busStops,
                                                {
                                                  busStopLineMappingId:
                                                    busStopLineMappingId.value,
                                                }
                                              )
                                              if (
                                                !filteredBusStop ||
                                                filteredBusStop.length === 0
                                              ) {
                                                unregister(
                                                  `me.${index}.busStopLineMappingId`
                                                )
                                                setValue(
                                                  `me.${index}.busStopLineMappingId`,
                                                  null
                                                )
                                              }
                                            } else {
                                              unregister(
                                                `me.${index}.busStopLineMappingId`
                                              )
                                              setValue(
                                                `me.${index}.busStopLineMappingId`,
                                                null
                                              )
                                            }
                                          }
                                        }}
                                        isDisabled={
                                          !get(watchMe, `${index}.date`) ||
                                          !get(
                                            watchMe,
                                            `${index}.timeTableRoundId.value`
                                          )
                                        }
                                      />
                                    )}
                                    rules={{
                                      required:
                                        get(watchMe, `${index}.date`) &&
                                        "กรุณาเลือกพื้นที่",
                                    }}
                                  />
                                  <FormErrorMessage>
                                    {errors.me &&
                                      errors.me[index] &&
                                      errors.me[index]?.busLineId &&
                                      "กรุณาเลือกพื้นที่"}
                                  </FormErrorMessage>
                                </FormControl>
                              </Td>
                              <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                <FormControl
                                  isInvalid={
                                    !!(
                                      errors.me &&
                                      errors.me[index] &&
                                      errors.me[index]?.busStopLineMappingId
                                    )
                                  }
                                >
                                  <Controller
                                    name={`me.${index}.busStopLineMappingId`}
                                    control={control}
                                    render={({ field, fieldState }) => (
                                      <>
                                        <SelectInput
                                          menuPortalTarget={document.body}
                                          options={
                                            get(
                                              watchMe,
                                              `${index}.busLineId.value`
                                            )
                                              ? filter(areaOptions, {
                                                  value: get(
                                                    watchMe,
                                                    `${index}.busLineId.value`
                                                  ),
                                                })[0]?.busStops &&
                                                get(
                                                  ableForBookingList,
                                                  `me.${index}`
                                                ) != null
                                                ? filter(areaOptions, {
                                                    value: get(
                                                      watchMe,
                                                      `${index}.busLineId.value`
                                                    ),
                                                  })[0]?.busStops?.filter(
                                                    (busStop) => {
                                                      return (
                                                        filter(
                                                          get(
                                                            ableForBookingList,
                                                            `me.${index}`
                                                          ),
                                                          {
                                                            id:
                                                              busStop?.busStopId,
                                                          }
                                                        ).length > 0
                                                      )
                                                    }
                                                  )
                                                : filter(areaOptions, {
                                                    value: get(
                                                      watchMe,
                                                      `${index}.busLineId.value`
                                                    ),
                                                  })[0]?.busStops
                                              : []
                                          }
                                          {...field}
                                          {...fieldState}
                                          placeholder=""
                                          isDisabled={
                                            !get(
                                              watchMe,
                                              `${index}.busLineId.value`
                                            )
                                          }
                                          isLoading={get(
                                            isLoadingAbleForBookingList,
                                            `me.${index}`
                                          )}
                                        />
                                      </>
                                    )}
                                    rules={{
                                      required:
                                        get(watchMe, `${index}.busLineId`) &&
                                        "กรุณาเลือกจุดจอด",
                                    }}
                                  />

                                  <FormErrorMessage>
                                    {errors.me &&
                                      errors.me[index] &&
                                      errors.me[index]?.busStopLineMappingId &&
                                      errors.me[index]?.busStopLineMappingId
                                        ?.message}
                                  </FormErrorMessage>
                                </FormControl>
                              </Td>
                              <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                <Flex
                                  justifyContent="flex-end"
                                  alignItems="center"
                                >
                                  <IconButton
                                    aria-label="delete"
                                    variant="unstyled"
                                    icon={
                                      <DeleteIcon
                                        color="error.500"
                                        fontSize="18px"
                                      />
                                    }
                                    onClick={() => {
                                      removeMe(index)
                                    }}
                                    _focus={{ boxShadow: "none" }}
                                    _active={{ boxShadow: "none" }}
                                  />
                                </Flex>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>

                      <Button
                        variant="text"
                        textDecoration="underline"
                        color="primary.500"
                        px={0}
                        leftIcon={<AddIcon fontSize="12px" />}
                        _focus={{ boxShadow: "none" }}
                        onClick={() => {
                          appendMe({
                            date: undefined,
                            timeTableRoundId: undefined,
                            busLineId: undefined,
                            busStopLineMappingId: undefined,
                          })
                        }}
                      >
                        เพิ่มวันจอง
                      </Button>
                    </Box>
                  </>
                ) : me?.bookingBusUser === null ? (
                  <Box
                    border="1px solid #B2CCCC"
                    borderRadius="6px"
                    width="100%"
                  >
                    <Center minHeight="300px">
                      <Flex flexDirection="column" alignItems="center">
                        <Text mb={4}>
                          คุณยังไม่ได้ลงทะเบียน
                          กรุณาสมัครใช้บริการก่อนจองรถให้ตัวเอง
                        </Text>
                        <NextLink
                          href="/employee/registration/register"
                          passHref
                        >
                          <Link _focus={{}} _hover={{}}>
                            <Text color="#00A5A8" textDecoration="underline">
                              สมัครใช้บริการ
                            </Text>
                          </Link>
                        </NextLink>
                      </Flex>
                    </Center>
                  </Box>
                ) : (
                  <Box
                    border="1px solid #B2CCCC"
                    borderRadius="6px"
                    width="100%"
                  >
                    <Center minHeight="300px">
                      <Flex flexDirection="column" alignItems="center">
                        <Text mb={4}>
                          สถานะบัญชีผู้ใช้เป็น Inactive เปลี่ยนแปลงสถานะ
                          <NextLink
                            href="/employee/registration/update"
                            passHref
                          >
                            <Link _focus={{}} _hover={{}}>
                              <Text
                                color="#00A5A8"
                                textDecoration="underline"
                                textAlign="center"
                              >
                                หน้าลงทะเบียน
                              </Text>
                            </Link>
                          </NextLink>
                        </Text>
                      </Flex>
                    </Center>
                  </Box>
                )}
              </Box>
              {SubordinateOptions.length > 0 && (
                <Box mb={10}>
                  <Text fontSize="20px" fontWeight={600} mb={4}>
                    จองให้พนักงานในความดูแล
                  </Text>
                  {!isAddSubordinate ? (
                    <Center>
                      <IconButton
                        variant="unstyled"
                        aria-label="add-subordinate"
                        icon={<AddIcon color="primary.500" fontSize="24px" />}
                        onClick={handleAddSubordinate}
                        _focus={{ boxShadow: "none" }}
                        _active={{ boxShadow: "none" }}
                      />
                    </Center>
                  ) : (
                    <>
                      <Box>
                        <Box
                          border="1px solid #B2CCCC"
                          borderRadius="6px"
                          width="100%"
                          mb={10}
                          p={{ base: 4, md: 10 }}
                          overflowX="auto"
                          overflowY="unset"
                          className={styles.scroll}
                        >
                          <Table variant="unstyled" width="100%" mb={10}>
                            <Thead>
                              <Tr>
                                <Th
                                  w="5%"
                                  p={{ base: "12px 8px", md: "12px 16px" }}
                                ></Th>
                                <Th
                                  w="20%"
                                  fontSize="18px"
                                  p={{ base: "12px 8px", md: "12px 16px" }}
                                  minWidth="250px"
                                >
                                  รหัส / ชื่อพนักงาน
                                </Th>
                                <Th
                                  w="15%"
                                  fontSize="18px"
                                  p={{ base: "12px 8px", md: "12px 16px" }}
                                  minWidth="200px"
                                >
                                  วัน/เดือน/ปี
                                </Th>
                                <Th
                                  w="10%"
                                  fontSize="18px"
                                  p={{ base: "12px 8px", md: "12px 16px" }}
                                  minWidth="200px"
                                >
                                  รอบเวลา
                                </Th>
                                <Th
                                  w="20%"
                                  fontSize="18px"
                                  p={{ base: "12px 8px", md: "12px 16px" }}
                                  minWidth="250px"
                                >
                                  พื้นที่
                                </Th>
                                <Th
                                  w="25%"
                                  fontSize="18px"
                                  p={{ base: "12px 8px", md: "12px 16px" }}
                                  minWidth="250px"
                                >
                                  จุดลงรถ{" "}
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      fontWeight: 300,
                                    }}
                                  >
                                    (สายรถแสดงหลังจากที่จัดรถสำเร็จ)
                                  </span>
                                </Th>
                                <Th
                                  w="5%"
                                  p={{ base: "12px 8px", md: "12px 16px" }}
                                ></Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {fieldsSubordinates.map((field, index) => (
                                <Tr key={field.id}>
                                  <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                    {index + 1}.
                                  </Td>
                                  <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                    <FormControl
                                      isInvalid={
                                        !!(
                                          errors.subordinates &&
                                          errors.subordinates[index] &&
                                          errors.subordinates[index]?.employeeNo
                                        )
                                      }
                                    >
                                      <Controller
                                        name={`subordinates.${index}.employeeNo`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                          <SelectInput
                                            options={SubordinateOptions}
                                            menuPortalTarget={document.body}
                                            {...field}
                                            {...fieldState}
                                            placeholder=""
                                            onChange={(value: any) => {
                                              field.onChange(value)
                                              handleSelectSubordinate(
                                                index,
                                                value
                                              )
                                            }}
                                          />
                                        )}
                                        rules={{
                                          required:
                                            (get(
                                              watchSubordinates,
                                              `${index}.date`
                                            ) ||
                                              get(
                                                watchSubordinates,
                                                `${index}.busLineId`
                                              )) &&
                                            "กรุณาเลือกพนักงาน",
                                          validate: (value: any) => {
                                            if (
                                              value != null &&
                                              !value?.isRegisterToBookingBusSystem
                                            ) {
                                              return "พนักงานที่เลือก ยังไม่ได้ลงทะเบียนใช้บริการรถรับส่ง"
                                            }

                                            if (value != null) {
                                              if (
                                                isDuplicateSubordinate(index)
                                              ) {
                                                return "เลือกวันที่จองซ้ำ"
                                              }
                                              return
                                            }
                                            return
                                          },
                                        }}
                                      />
                                      <FormErrorMessage>
                                        <FormErrorMessage>
                                          {errors.subordinates &&
                                            errors.subordinates[index] &&
                                            errors.subordinates[index]
                                              ?.employeeNo &&
                                            errors.subordinates[index]
                                              ?.employeeNo?.message}
                                        </FormErrorMessage>
                                      </FormErrorMessage>
                                    </FormControl>
                                  </Td>
                                  <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                    <Box>
                                      <Controller
                                        name={`subordinates.${index}.date`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                          <Datepicker
                                            date={
                                              get(
                                                allDate,
                                                `dateSubordinates[${index}]`
                                              )
                                                ? get(
                                                    allDate,
                                                    `dateSubordinates[${index}]`
                                                  )
                                                : null
                                            }
                                            minDate={new Date()}
                                            field={field}
                                            fieldState={fieldState}
                                            dateFormat="dd/MM/yyyy (ccc)"
                                            customOnChange={true}
                                            onChange={(date: any) => {
                                              handleSetAllDate(
                                                date,
                                                `dateSubordinates[${index}]`
                                              )
                                              field.onChange(date)

                                              if (
                                                !(
                                                  date ===
                                                  get(
                                                    watchSubordinates,
                                                    `${index}.date`
                                                  )
                                                )
                                              ) {
                                                setValue(
                                                  `subordinates.${index}.timeTableRoundId`,
                                                  null
                                                )
                                                setValue(
                                                  `subordinates.${index}.busLineId`,
                                                  null
                                                )
                                                setValue(
                                                  `subordinates.${index}.busStopLineMappingId`,
                                                  null
                                                )
                                              }
                                              unregister(
                                                `subordinates.${index}.timeTableRoundId`
                                              )
                                              setIsCheckDuplicateSubordinate(
                                                false
                                              )
                                            }}
                                          />
                                        )}
                                        rules={{
                                          required:
                                            (get(
                                              watchSubordinates,
                                              `${index}.employeeNo`
                                            ) ||
                                              get(
                                                watchSubordinates,
                                                `${index}.busLineId`
                                              )) &&
                                            "กรุณาเลือกวันที่",
                                          validate: (value: any) => {
                                            if (value != null) {
                                              if (
                                                isDuplicateSubordinate(index)
                                              ) {
                                                return "เลือกวันที่จองซ้ำ"
                                              }
                                              return
                                            }
                                            return
                                          },
                                        }}
                                      />
                                    </Box>
                                  </Td>
                                  <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                    <FormControl
                                      isInvalid={
                                        !!(
                                          errors.subordinates &&
                                          errors.subordinates[index] &&
                                          errors.subordinates[index]
                                            ?.timeTableRoundId
                                        )
                                      }
                                    >
                                      <Controller
                                        name={`subordinates.${index}.timeTableRoundId`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                          <RequestSelectInput
                                            {...field}
                                            {...fieldState}
                                            placeholder=""
                                            isDisabled={
                                              !get(
                                                watchSubordinates,
                                                `${index}.date`
                                              )
                                            }
                                            date={
                                              get(
                                                watchSubordinates,
                                                `${index}.date`
                                              )
                                                ? get(
                                                    watchSubordinates,
                                                    `${index}.date`
                                                  )
                                                : null
                                            }
                                            periodOfDay={periodOfDay}
                                            handleSetAllWarning={
                                              handleSetAllWarning
                                            }
                                            fieldName={`warningSubordinates[${index}]`}
                                            onChange={(v: any) => {
                                              field.onChange(v)
                                              getAbleForBooking(
                                                v?.value,
                                                `subordinates.${index}`,
                                                (res) => {
                                                  handleSetSubordinateBusLineAndBusStopLineMapping(
                                                    get(
                                                      watchSubordinates,
                                                      `${index}.date`
                                                    ),
                                                    index,
                                                    res
                                                  )
                                                }
                                              )
                                            }}
                                          />
                                        )}
                                        rules={{
                                          required:
                                            get(
                                              watchSubordinates,
                                              `${index}.date`
                                            ) && "กรุณาเลือกรอบเวลา",
                                          validate: (value: any) => {
                                            if (value) {
                                              if (!value?.status)
                                                return "รอบเวลาที่เลือกปิดการจอง"
                                            } else return
                                          },
                                        }}
                                      />
                                      <FormErrorMessage>
                                        {errors.subordinates &&
                                          errors.subordinates[index] &&
                                          errors.subordinates[index]
                                            ?.timeTableRoundId &&
                                          errors.subordinates[index]
                                            ?.timeTableRoundId?.message}
                                      </FormErrorMessage>
                                    </FormControl>
                                  </Td>
                                  <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                    <FormControl
                                      isInvalid={
                                        !!(
                                          errors.subordinates &&
                                          errors.subordinates[index] &&
                                          errors.subordinates[index]?.busLineId
                                        )
                                      }
                                    >
                                      <Controller
                                        name={`subordinates.${index}.busLineId`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                          <SelectInput
                                            options={
                                              get(
                                                ableForBookingList,
                                                `subordinates.${index}`
                                              ) != null
                                                ? filter(
                                                    areaOptions,
                                                    (area) => {
                                                      return (
                                                        filter(
                                                          get(
                                                            ableForBookingList,
                                                            `subordinates.${index}`
                                                          ),
                                                          (able) => {
                                                            return (
                                                              Array.isArray(
                                                                area?.busStops
                                                              ) &&
                                                              [
                                                                ...area?.busStops,
                                                              ]
                                                                .map(
                                                                  (b) =>
                                                                    b.busStopId
                                                                )
                                                                .includes(
                                                                  able.id
                                                                )
                                                            )
                                                          }
                                                        ).length > 0
                                                      )
                                                    }
                                                  )
                                                : areaOptions
                                            }
                                            menuPortalTarget={document.body}
                                            isLoading={get(
                                              isLoadingAbleForBookingList,
                                              `subordinates.${index}`
                                            )}
                                            {...field}
                                            {...fieldState}
                                            placeholder=""
                                            onChange={(v: any) => {
                                              field.onChange(v)
                                              if (!v) {
                                                unregister(
                                                  `subordinates.${index}.busStopLineMappingId`
                                                )
                                                setValue(
                                                  `subordinates.${index}.busStopLineMappingId`,
                                                  null
                                                )
                                              }
                                              if (v) {
                                                const busStopLineMappingId = get(
                                                  watchMe,
                                                  `subordinates.${index}.busStopLineMappingId`
                                                )
                                                if (busStopLineMappingId) {
                                                  const filteredBusStop = filter(
                                                    v.busStops,
                                                    {
                                                      busStopLineMappingId:
                                                        busStopLineMappingId.value,
                                                    }
                                                  )
                                                  if (
                                                    !filteredBusStop ||
                                                    filteredBusStop.length === 0
                                                  ) {
                                                    unregister(
                                                      `subordinates.${index}.busStopLineMappingId`
                                                    )
                                                    setValue(
                                                      `subordinates.${index}.busStopLineMappingId`,
                                                      null
                                                    )
                                                  }
                                                } else {
                                                  unregister(
                                                    `subordinates.${index}.busStopLineMappingId`
                                                  )
                                                  setValue(
                                                    `subordinates.${index}.busStopLineMappingId`,
                                                    null
                                                  )
                                                }
                                              }
                                            }}
                                            isDisabled={
                                              !get(
                                                watchSubordinates,
                                                `${index}.date`
                                              ) ||
                                              !get(
                                                watchSubordinates,
                                                `${index}.timeTableRoundId.value`
                                              )
                                            }
                                          />
                                        )}
                                        rules={{
                                          required:
                                            (get(
                                              watchSubordinates,
                                              `${index}.date`
                                            ) ||
                                              get(
                                                watchSubordinates,
                                                `${index}.employeeNo`
                                              )) &&
                                            "กรุณาเลือกพื้นที่",
                                        }}
                                      />
                                      <FormErrorMessage>
                                        {errors.subordinates &&
                                          errors.subordinates[index] &&
                                          errors.subordinates[index]
                                            ?.busLineId &&
                                          errors.subordinates[index]?.busLineId
                                            ?.message}
                                      </FormErrorMessage>
                                    </FormControl>
                                  </Td>
                                  <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                    <FormControl
                                      isInvalid={
                                        !!(
                                          errors.subordinates &&
                                          errors.subordinates[index] &&
                                          errors.subordinates[index]
                                            ?.busStopLineMappingId
                                        )
                                      }
                                    >
                                      <Controller
                                        name={`subordinates.${index}.busStopLineMappingId`}
                                        control={control}
                                        render={({ field, fieldState }) => (
                                          <>
                                            <SelectInput
                                              menuPortalTarget={document.body}
                                              options={
                                                get(
                                                  watchSubordinates,
                                                  `${index}.busLineId.value`
                                                )
                                                  ? filter(areaOptions, {
                                                      value: get(
                                                        watchSubordinates,
                                                        `${index}.busLineId.value`
                                                      ),
                                                    })[0]?.busStops &&
                                                    get(
                                                      ableForBookingList,
                                                      `subordinates.${index}`
                                                    ) != null
                                                    ? filter(areaOptions, {
                                                        value: get(
                                                          watchSubordinates,
                                                          `${index}.busLineId.value`
                                                        ),
                                                      })[0]?.busStops?.filter(
                                                        (busStop) => {
                                                          return (
                                                            filter(
                                                              get(
                                                                ableForBookingList,
                                                                `subordinates.${index}`
                                                              ),
                                                              {
                                                                id:
                                                                  busStop?.busStopId,
                                                              }
                                                            ).length > 0
                                                          )
                                                        }
                                                      )
                                                    : filter(areaOptions, {
                                                        value: get(
                                                          watchSubordinates,
                                                          `${index}.busLineId.value`
                                                        ),
                                                      })[0]?.busStops
                                                  : []
                                              }
                                              {...field}
                                              {...fieldState}
                                              placeholder=""
                                              isDisabled={
                                                !get(
                                                  watchSubordinates,
                                                  `${index}.busLineId.value`
                                                )
                                              }
                                              isLoading={get(
                                                isLoadingAbleForBookingList,
                                                `subordinates.${index}`
                                              )}
                                            />
                                          </>
                                        )}
                                        rules={{
                                          required:
                                            get(
                                              watchSubordinates,
                                              `${index}.busLineId`
                                            ) && "กรุณาเลือกจุดจอด",
                                        }}
                                      />

                                      <FormErrorMessage>
                                        {errors.subordinates &&
                                          errors.subordinates[index] &&
                                          errors.subordinates[index]
                                            ?.busStopLineMappingId &&
                                          errors.subordinates[index]
                                            ?.busStopLineMappingId?.message}
                                      </FormErrorMessage>
                                    </FormControl>
                                  </Td>
                                  <Td p={{ base: "12px 8px", md: "12px 16px" }}>
                                    <Flex
                                      justifyContent="flex-end"
                                      alignItems="center"
                                    >
                                      <IconButton
                                        aria-label="delete"
                                        variant="unstyled"
                                        icon={
                                          <DeleteIcon
                                            color="error.500"
                                            fontSize="18px"
                                          />
                                        }
                                        onClick={() => {
                                          removeSubordinates(index)
                                        }}
                                        _focus={{ boxShadow: "none" }}
                                        _active={{ boxShadow: "none" }}
                                      />
                                    </Flex>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>

                          <Button
                            variant="text"
                            textDecoration="underline"
                            color="primary.500"
                            px={0}
                            leftIcon={<AddIcon fontSize="12px" />}
                            _focus={{ boxShadow: "none" }}
                            onClick={() => {
                              appendSubordinates({
                                employeeNo: undefined,
                                date: undefined,
                                timeTableRoundId: undefined,
                                busLineId: undefined,
                                busStopLineMappingId: undefined,
                              })
                            }}
                          >
                            เพิ่มรายชื่อ
                          </Button>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Flex>
          )}
        </form>
      </Container>
    </>
  )
}

export default RequestNew
