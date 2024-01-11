import {
  Container,
  Box,
  Text,
  Button,
  Flex,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  HStack,
  Link,
  Center,
} from "@chakra-ui/react"
import Head from "next/head"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import TextInput from "../../input/TextInput"
import SelectInput from "../../input/SelectInput"
import Datepicker from "../../input/Datepicker"
import { MdMoreVert } from "react-icons/md"
import NextLink from "next/link"
import { useState, useEffect, useMemo } from "react"
import { AddIcon } from "@chakra-ui/icons"
import { useRouter } from "next/router"
import { DateTime } from "luxon"
import filter from "lodash/filter"
import { OneRequestIdDataTypes } from "../../../data-hooks/requests/types"
import { useAccountMe } from "../../../providers/account-me-provider"
import { BusLineDataTypes } from "../../../data-hooks/busLines/types"
import { SubordinateDataTypes } from "../../../data-hooks/subordinates/types"
import RequestSelectInput from "./RequestSelectInput"
import get from "lodash/get"
import ConfirmDialog from "../../ConfirmDialog"
import { AreaDataTypes } from "../../../data-hooks/requests/types"
import uniq from "lodash/uniq"
import sortBy from "lodash/sortBy"
import isEqual from "lodash/isEqual"
import { useAxios } from "../../../providers/http-client"
import { rest } from "lodash"

type RequestEditProps = {
  data: { me: OneRequestIdDataTypes[]; subordinates: OneRequestIdDataTypes[] }
  busLine: BusLineDataTypes<boolean>[]
  onSubmit: (values: any) => void
  isLoading: boolean
  subordinates: SubordinateDataTypes[]
  periodOfDay: "morning" | "evening"
  onCancel: (values: any) => void
  isLoadingCancel: boolean
  areas: AreaDataTypes[]
}

enum Status {
  processing = "กำลังจัดรถ",
  pending = "รอการจัดรถ",
  cancelledByAdmin = "ถูกยกเลิก",
  cancelledByEmployee = "ยกเลิกโดยพนักงาน",
  completed = "สำเร็จ",
  deprecated = "เลิกใช้งาน",
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

const RequestEdit = ({
  data,
  busLine,
  subordinates,
  periodOfDay,
  onCancel,
  isLoadingCancel,
  isLoading,
  onSubmit: submit,
  areas,
}: RequestEditProps) => {
  const axios = useAxios()
  const [date, setDate] = useState<any>({})
  const [warning, setWarning] = useState<any>({})
  const [isOpenConfirm, setOpenConfirm] = useState<boolean>(false)
  const [selected, setSelected] = useState<{
    bookingId: number | null
    from: "me" | "subordinates"
    index: number | null
  }>({
    bookingId: null,
    from: "me",
    index: null,
  })
  const [isCheckDuplicateMe, setIsCheckDuplicateMe] = useState(false)
  const [
    isCheckDuplicateSubordinate,
    setIsCheckDuplicateSubordinate,
  ] = useState(false)
  const [ableForBooking, setAbleForBooking] = useState<any>({})
  const [isLoadingAbleForBooking, setIsLoadingAbleForBooking] = useState<any>(
    {}
  )

  const router = useRouter()
  const me = useAccountMe()
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

            const busStops = uniq(busStopIds).reduce((acc: any[], curr) => {
              const findBusStop = filter(busLine, { status: true })
                .map((busLine) => {
                  if (curr.busStopId) {
                    const filteredBusStop = filter(busLine.busStops, {
                      busStopId: curr.busStopId,
                    })

                    if (filteredBusStop.length > 0) {
                      return {
                        value: filteredBusStop[0]?.busStopLineMappingId,
                        label: filteredBusStop[0]?.name,
                        rank: filteredBusStop[0]?.rank,
                        busStopId: filteredBusStop[0]?.busStopId,
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

            return {
              value: area.id,
              label: area.name,
              busStops: sortBy(busStops, ["rank"]),
              busStopIds: busStopIds.map((b) => b.busStopId),
            }
          })
        : [],
    [areas, busLine]
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

  const getAbleForBooking = async (
    timeTableRoundId: number,
    field: string,
    callbackFn: (res: any) => void
  ) => {
    if (timeTableRoundId != null) {
      setIsLoadingAbleForBooking((prevState: any) => ({
        ...prevState,
        [`${field}`]: true,
      }))

      await axios
        .get(`/busStops/ableForBooking/timeTableRound/${timeTableRoundId}`)
        .then((res) => {
          setAbleForBooking((prevState: any) => ({
            ...prevState,
            [`${field}`]: res.data.data,
          }))
          setIsLoadingAbleForBooking((prevState: any) => ({
            ...prevState,
            [`${field}`]: false,
          }))
          callbackFn(res.data.data)
        })
        .catch((err) => {})
    } else {
      callbackFn(null)
    }
  }

  const requestId = router.query?.requestId

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    setValue,
    unregister,
    watch,
    trigger,
    setError,
  } = useForm({
    mode: "onBlur",
    defaultValues: data
      ? {
          subordinates: data?.subordinates
            ? data?.subordinates.map((subordinate) => ({
                bookingId: subordinate?.id,
                employeeNo:
                  SubordinateOptions && subordinate?.employeeNo
                    ? filter(SubordinateOptions, {
                        value: subordinate?.employeeNo,
                      }).length > 0
                      ? filter(SubordinateOptions, {
                          value: subordinate?.employeeNo,
                        })[0]
                      : {
                          value: subordinate.employeeNo,
                          label: `${subordinate.employeeNo} ${subordinate.prefixName}${subordinate.firstName} ${subordinate.lastName}`,
                        }
                    : null,
                date: subordinate?.date
                  ? subordinate?.status === "pending" &&
                    filter(SubordinateOptions, {
                      value: subordinate?.employeeNo,
                    }).length > 0
                    ? new Date(subordinate?.date)
                    : DateTime.fromJSDate(
                        new Date(subordinate?.date)
                      ).toFormat("dd/MM/yyyy (ccc)", { locale: "th" })
                  : null,
                timeTableRoundId: subordinate?.timeTableRoundId
                  ? {
                      value: subordinate?.timeTableRoundId,
                      label: subordinate?.time,
                    }
                  : null,
                busLineId:
                  areaOptions && subordinate?.busStopLineMappingId
                    ? filter(areaOptions, (value) => {
                        return (
                          filter(value.busStops, {
                            value: subordinate?.busStopLineMappingId,
                          }).length > 0
                        )
                      })[0]
                    : null,
                busStopLineMappingId:
                  areaOptions && subordinate?.busStopLineMappingId
                    ? filter(
                        filter(areaOptions, (value) => {
                          return (
                            filter(value.busStops, {
                              value: subordinate?.busStopLineMappingId,
                            }).length > 0
                          )
                        })[0]?.busStops,
                        {
                          value: subordinate?.busStopLineMappingId,
                        }
                      )[0]
                    : null,
                status: subordinate?.status,
                vehicleInfo: subordinate?.vehicleType
                  ? `${subordinate?.vehicleType} / ${
                      subordinate?.licensePlate
                        ? subordinate?.licensePlate
                        : "-"
                    }`
                  : "-",
                driverInfo: subordinate.driverFirstName
                  ? `${subordinate.driverFirstName} ${subordinate.driverLastName}`
                  : "-",
                statusText: get(Status, subordinate?.status)
                  ? get(Status, subordinate?.status)
                  : "-",
                readOnly:
                  subordinate?.status !== "pending" ||
                  !(
                    filter(SubordinateOptions, {
                      value: subordinate?.employeeNo,
                    }).length > 0
                  ),
              }))
            : [
                {
                  bookingId: null,
                  employeeNo: null,
                  date: null,
                  timeTableRoundId: null,
                  busLineId: null,
                  busStopLineMappingId: null,
                  status: null,
                  vehicleInfo: null,
                  driverInfo: null,
                  statusText: null,
                  readOnly: null,
                },
              ],
          me: data?.me
            ? data?.me.map((me) => ({
                bookingId: me?.id,
                date: me?.date
                  ? me?.status === "pending"
                    ? new Date(me?.date)
                    : DateTime.fromJSDate(
                        new Date(me?.date)
                      ).toFormat("dd/MM/yyyy (ccc)", { locale: "th" })
                  : null,
                timeTableRoundId: me?.timeTableRoundId
                  ? {
                      value: me?.timeTableRoundId,
                      label: me?.time,
                    }
                  : null,
                busLineId:
                  areaOptions && me?.busStopLineMappingId
                    ? filter(areaOptions, (value) => {
                        return (
                          filter(value.busStops, {
                            value: me?.busStopLineMappingId,
                          }).length > 0
                        )
                      })[0]
                    : null,
                busStopLineMappingId:
                  areaOptions && me?.busStopLineMappingId
                    ? filter(
                        filter(areaOptions, (value) => {
                          return (
                            filter(value.busStops, {
                              value: me?.busStopLineMappingId,
                            }).length > 0
                          )
                        })[0]?.busStops,
                        {
                          value: me?.busStopLineMappingId,
                        }
                      )[0]
                    : null,
                status: me?.status,
                vehicleInfo: me?.vehicleType
                  ? `${me?.vehicleType} / ${
                      me?.licensePlate ? me?.licensePlate : "-"
                    }`
                  : "-",
                driverInfo: me.driverFirstName
                  ? `${me.driverFirstName} ${me.driverLastName}`
                  : "-",
                statusText: get(Status, me?.status)
                  ? get(Status, me?.status)
                  : "-",
                readOnly: me?.status !== "pending",
              }))
            : [
                {
                  bookingId: null,
                  date: null,
                  timeTableRoundId: null,
                  busLineId: null,
                  busStopLineMappingId: null,
                  status: null,
                  vehicleInfo: null,
                  driverInfo: null,
                  statusText: null,
                  readOnly: null,
                },
              ],
        }
      : {
          subordinates: [
            {
              bookingId: null,
              employeeNo: null,
              date: null,
              timeTableRoundId: null,
              busLineId: null,
              busStopLineMappingId: null,
              status: null,
              vehicleInfo: null,
              driverInfo: null,
              statusText: null,
              readOnly: null,
            },
          ],
          me: [
            {
              bookingId: null,
              date: null,
              timeTableRoundId: null,
              busLineId: null,
              busStopLineMappingId: null,
              status: null,
              vehicleInfo: null,
              driverInfo: null,
              statusText: null,
              readOnly: null,
            },
          ],
        },
  })
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

  const onSubmit = (values: any) => {
    const me = filter(get(values, "me"), { status: "pending", readOnly: false })
    const subordinates = filter(get(values, "subordinates"), {
      status: "pending",
      readOnly: false,
    })

    values.me = me.map((me: any) => ({
      bookingId: me?.bookingId ? me?.bookingId : null,
      date: DateTime.fromJSDate(new Date(me?.date)).toFormat("y-MM-dd"),
      timeTableRoundId: me?.timeTableRoundId?.value,
      busStopLineMappingId: me?.busStopLineMappingId?.value,
    }))
    values.subordinates = subordinates.map((subordinate: any) => ({
      bookingId: subordinate?.bookingId ? subordinate?.bookingId : null,
      employeeNo: subordinate?.employeeNo?.value,
      date: DateTime.fromJSDate(new Date(subordinate?.date)).toFormat(
        "y-MM-dd"
      ),
      timeTableRoundId: subordinate?.timeTableRoundId?.value,
      busStopLineMappingId: subordinate?.busStopLineMappingId?.value,
    }))
    submit({ requestId: requestId, data: values })
  }

  const handleSetDate = (date: any, field: any) => {
    setDate((prevState: any) => ({ ...prevState, [`${field}`]: date }))
  }

  const handleSetWarning = (warning: any, field: any) => {
    setWarning((prevState: any) => ({ ...prevState, [`${field}`]: warning }))
  }

  const onClickCancel = (
    bookingId: number,
    from: "me" | "subordinates",
    index: number
  ) => {
    setSelected({ bookingId, from, index })
    setOpenConfirm(true)
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

  const isDuplicateMe = (index: any) => {
    const data: any = watchMe[index]
    const allData = watchMe.map((me, index) => ({ ...me, index }))

    const filteredData = allData.filter(
      (v: any) =>
        isValidDate(v?.date) &&
        isValidDate(data?.date) &&
        v?.date?.getDate() &&
        data?.date?.getDate() &&
        v?.date?.getDate() === data?.date?.getDate()
    )

    if (filteredData?.length > 1) {
      return true
    }

    return false
  }

  const isDuplicateSubordinate = (index: any) => {
    const data: any = watchSubordinates[index]
    const allData = watchSubordinates.map((sub, index) => ({ ...sub, index }))

    const filteredData = allData.filter(
      (v: any) =>
        v?.employeeNo?.value != null &&
        data?.employeeNo?.value != null &&
        v?.date != null &&
        data?.date != null &&
        isValidDate(v?.date) &&
        isValidDate(data?.date) &&
        v?.date?.getDate() &&
        data?.date?.getDate() &&
        v?.employeeNo?.value === data?.employeeNo?.value &&
        v?.date?.getDate() === data?.date?.getDate()
    )

    if (filteredData?.length > 1) {
      return true
    }

    return false
  }

  return (
    <>
      <Head>
        <title>จองรถ</title>
        <meta name="description" content="reservation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        isOpen={isOpenConfirm}
        onClose={() => {
          setOpenConfirm(false)
        }}
        title="ยกเลิกการจอง"
        content="คุณยืนยันที่จะยกเลิกการจอง ใช่หรือไม่ ?"
        type="error"
        isLoading={isLoadingCancel}
        onSubmit={() => {
          onCancel({
            bookingId: selected.bookingId,
            onClose: null,
            setRequest: null,
            from: "edit",
          })
        }}
      />
      <Container
        minW="100%"
        minHeight="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
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
                <Text color="#00000080">ID : {requestId}</Text>
              </HStack>
            </Flex>
          </Flex>
          <Flex w="100%" justifyContent="space-between" mb={10}>
            <Text fontSize="32px" fontWeight={600}>
              ID : {requestId}
            </Text>
            {(filter(fieldsMe, { status: "pending" }).length > 0 ||
              filter(fieldsSubordinates, { status: "pending" }).length > 0) && (
              <Button isLoading={isSubmitting || isLoading} type="submit">
                บันทึก
              </Button>
            )}
          </Flex>
          <Flex flexDirection="column">
            <Box mb={10}>
              <Text fontSize="20px" fontWeight={600} mb={4}>
                จองให้ตัวเอง
              </Text>
              {me?.bookingBusUser && me?.bookingBusUser?.status ? (
                <>
                  {fieldsMe.map((field, index) =>
                    !field?.readOnly ? (
                      <Box
                        border="1px solid #B2CCCC"
                        borderRadius="6px"
                        width="100%"
                        key={field.id}
                        mb={10}
                      >
                        <Flex px={{ base: 6, md: 12 }} py={12}>
                          <Flex width="10%" alignItems="flex-start">
                            {index + 1}.
                          </Flex>
                          <Flex width="80%" flexDirection="column">
                            <Flex
                              w={{ base: "100%", md: "80%" }}
                              mb={4}
                              alignItems={{ base: "flex-end", md: "inherit" }}
                            >
                              <Box w="50%" mr={{ base: 2, md: 4 }}>
                                <FormLabel
                                  htmlFor={`me.${index}.date`}
                                  display="flex"
                                  flexDirection={{ base: "column", md: "row" }}
                                >
                                  วัน/เดือน/ปี{" "}
                                  <Text color="#E53E3E" ml={{ base: 0, md: 4 }}>
                                    {get(warning, `warningMe[${index}]`)
                                      ? `(${get(
                                          warning,
                                          `warningMe[${index}]`
                                        )})`
                                      : ""}
                                  </Text>
                                </FormLabel>
                                <Controller
                                  name={`me.${index}.date`}
                                  control={control}
                                  render={({ field, fieldState }) => (
                                    <Datepicker
                                      date={
                                        get(date, `dateMe[${index}]`)
                                          ? get(date, `dateMe[${index}]`)
                                          : get(fieldsMe, `${index}.date`)
                                          ? get(fieldsMe, `${index}.date`)
                                          : null
                                      }
                                      minDate={new Date()}
                                      field={field}
                                      fieldState={fieldState}
                                      dateFormat="dd/MM/yyyy (ccc)"
                                      customOnChange={true}
                                      onChange={(date: any) => {
                                        field.onChange(date)
                                        handleSetDate(date, `dateMe[${index}]`)
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
                              <FormControl
                                isInvalid={
                                  !!(
                                    errors.me &&
                                    errors.me[index] &&
                                    errors.me[index]?.timeTableRoundId
                                  )
                                }
                                w={"50%"}
                              >
                                <FormLabel
                                  htmlFor={`me.${index}.timeTableRoundId`}
                                >
                                  รอบเวลา
                                </FormLabel>
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
                                      periodOfDay={periodOfDay}
                                      handleSetWarning={handleSetWarning}
                                      fieldName={`warningMe[${index}]`}
                                      onChange={(v: any) => {
                                        const timeTableRoundId =
                                          watchMe[index]?.timeTableRoundId

                                        field.onChange(v)
                                        if (
                                          !isEqual(
                                            {
                                              value: timeTableRoundId?.value,
                                              label: timeTableRoundId?.label,
                                            },
                                            {
                                              value: v?.value,
                                              label: v?.label,
                                            }
                                          ) &&
                                          v
                                        ) {
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
                                        }
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
                                    "กรุณาเลือกรอบเวลา"}
                                </FormErrorMessage>
                              </FormControl>
                            </Flex>
                            <Flex w={{ base: "100%", md: "80%" }} mb={4}>
                              <FormControl
                                isInvalid={
                                  !!(
                                    errors.me &&
                                    errors.me[index] &&
                                    errors.me[index]?.busLineId
                                  )
                                }
                                w={"50%"}
                                mr={{ base: 2, md: 4 }}
                              >
                                <FormLabel htmlFor={`me.${index}.busLineId`}>
                                  พื้นที่
                                </FormLabel>
                                <Controller
                                  name={`me.${index}.busLineId`}
                                  control={control}
                                  render={({ field, fieldState }) => (
                                    <SelectInput
                                      options={
                                        get(ableForBooking, `me.${index}`) !=
                                        null
                                          ? filter(areaOptions, (area) => {
                                              return (
                                                filter(
                                                  get(
                                                    ableForBooking,
                                                    `me.${index}`
                                                  ),
                                                  (able) => {
                                                    return (
                                                      Array.isArray(
                                                        area?.busStops
                                                      ) &&
                                                      [...area?.busStops]
                                                        .map((b) => b.busStopId)
                                                        .includes(able.id)
                                                    )
                                                  }
                                                ).length > 0
                                              )
                                            })
                                          : areaOptions
                                      }
                                      {...field}
                                      {...fieldState}
                                      isDisabled={
                                        !get(watchMe, `${index}.date`) ||
                                        !get(
                                          watchMe,
                                          `${index}.timeTableRoundId.value`
                                        )
                                      }
                                      placeholder=""
                                      isLoading={get(
                                        isLoadingAbleForBooking,
                                        `me.${index}`
                                      )}
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
                              <FormControl
                                isInvalid={
                                  !!(
                                    errors.me &&
                                    errors.me[index] &&
                                    errors.me[index]?.busStopLineMappingId
                                  )
                                }
                                w={"50%"}
                              >
                                <FormLabel htmlFor={`me.${index}.busStop`}>
                                  จุดลงรถ
                                </FormLabel>
                                <Controller
                                  name={`me.${index}.busStopLineMappingId`}
                                  control={control}
                                  render={({ field, fieldState }) => (
                                    <>
                                      <SelectInput
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
                                                ableForBooking,
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
                                                          ableForBooking,
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
                                          isLoadingAbleForBooking,
                                          `me.${index}`
                                        )}
                                      />
                                      <Text
                                        fontStyle="italic"
                                        fontWeight={300}
                                        color="#333333"
                                        mt={2}
                                        fontSize="14px"
                                      >
                                        (สายรถแสดงหลังจากที่จัดรถสำเร็จ)
                                      </Text>
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
                            </Flex>
                          </Flex>
                          <Flex width="10%" justifyContent="flex-end">
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                icon={<MdMoreVert />}
                                variant="ghost"
                                fontSize="20px"
                                color="#333333"
                                _focus={{ boxShadow: "none" }}
                                width="20%"
                              />
                              <MenuList
                                borderColor="#B2CCCC"
                                borderRadius="6px"
                                p="8px"
                                minWidth="150px"
                              >
                                <MenuItem
                                  _hover={{
                                    bgColor: "#D4E3E3",
                                    borderRadius: "6px",
                                  }}
                                  _active={{ background: "none" }}
                                  _focus={{ background: "none" }}
                                  onClick={() => {
                                    if (field?.bookingId) {
                                      onClickCancel(
                                        field.bookingId,
                                        "me",
                                        index
                                      )
                                    } else removeMe(index)
                                  }}
                                >
                                  {field?.bookingId
                                    ? "ยกเลิกการจอง"
                                    : "ลบข้อมูล"}
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Flex>
                        </Flex>
                      </Box>
                    ) : (
                      <Box
                        border="1px solid #B2CCCC"
                        borderRadius="6px"
                        width="100%"
                        key={field.id}
                        mb={10}
                      >
                        <Flex px={{ base: 6, md: 12 }} py={12}>
                          <Flex width="10%" alignItems="flex-start">
                            {index + 1}.
                          </Flex>
                          <Flex width="80%" flexDirection="column">
                            <Box w={{ base: "100%", md: "50%" }} mb={4}>
                              <TextInput
                                name={`me.${index}.statusText`}
                                label="สถานะการจอง"
                                errors={errors}
                                register={register}
                                variant="unstyled"
                                disabled={true}
                                autocomplete="off"
                                minWidth={250}
                                fontWeightLabel={600}
                              />
                            </Box>
                            <Flex w={{ base: "100%", md: "80%" }} mb={4}>
                              <Box w="50%" mr={{ base: 2, md: 4 }}>
                                <TextInput
                                  name={`me.${index}.date`}
                                  label="วัน/เดือน/ปี"
                                  errors={errors}
                                  register={register}
                                  variant="unstyled"
                                  disabled={true}
                                  autocomplete="off"
                                  minWidth={250}
                                  fontWeightLabel={600}
                                />
                              </Box>
                              <Box w={"50%"}>
                                <TextInput
                                  name={`me.${index}.timeTableRoundId.label`}
                                  label="รอบเวลา"
                                  errors={errors}
                                  register={register}
                                  variant="unstyled"
                                  disabled={true}
                                  autocomplete="off"
                                  minWidth={250}
                                  fontWeightLabel={600}
                                />
                              </Box>
                            </Flex>
                            <Flex w={{ base: "100%", md: "80%" }} mb={4}>
                              <Box w={"50%"} mr={{ base: 2, md: 4 }}>
                                <TextInput
                                  name={`me.${index}.busLineId.label`}
                                  label="พื้นที่"
                                  errors={errors}
                                  register={register}
                                  variant="unstyled"
                                  disabled={true}
                                  autocomplete="off"
                                  minWidth={250}
                                  fontWeightLabel={600}
                                />
                              </Box>
                              <Box w={"50%"}>
                                <TextInput
                                  name={`me.${index}.busStopLineMappingId.label`}
                                  label="จุดลงรถ"
                                  errors={errors}
                                  register={register}
                                  variant="unstyled"
                                  disabled={true}
                                  autocomplete="off"
                                  minWidth={250}
                                  fontWeightLabel={600}
                                />
                              </Box>
                            </Flex>
                            <Flex w={{ base: "100%", md: "80%" }} mb={4}>
                              <Box w={"50%"} mr={{ base: 2, md: 4 }}>
                                <TextInput
                                  name={`me.${index}.vehicleInfo`}
                                  label="ข้อมูลรถ"
                                  errors={errors}
                                  register={register}
                                  variant="unstyled"
                                  disabled={true}
                                  autocomplete="off"
                                  minWidth={250}
                                  fontWeightLabel={600}
                                />
                              </Box>
                              <Box w={"50%"}>
                                <TextInput
                                  name={`me.${index}.driverInfo`}
                                  label="ชื่อคนขับรถ"
                                  errors={errors}
                                  register={register}
                                  variant="unstyled"
                                  disabled={true}
                                  autocomplete="off"
                                  minWidth={250}
                                  fontWeightLabel={600}
                                />
                              </Box>
                            </Flex>
                          </Flex>
                          <Flex width="10%" justifyContent="flex-end"></Flex>
                        </Flex>
                      </Box>
                    )
                  )}
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
                        status: "pending",
                        readOnly: false,
                      })
                    }}
                  >
                    เพิ่มวันจอง
                  </Button>
                </>
              ) : me?.bookingBusUser === null ? (
                <Box border="1px solid #B2CCCC" borderRadius="6px" width="100%">
                  <Center minHeight="300px">
                    <Flex flexDirection="column" alignItems="center">
                      <Text mb={4}>
                        คุณยังไม่ได้ลงทะเบียน
                        กรุณาสมัครใช้บริการก่อนจองรถให้ตัวเอง
                      </Text>
                      <NextLink href="/employee/registration/register" passHref>
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
                <Box border="1px solid #B2CCCC" borderRadius="6px" width="100%">
                  <Center minHeight="300px">
                    <Flex flexDirection="column" alignItems="center">
                      <Text mb={4}>
                        บัญชีของคุณอยู่ในสถานะ Inactive
                        หากต้องการจองให้ตัวเองกรุณาเปลี่ยนสถานะเป็น Active
                      </Text>
                    </Flex>
                  </Center>
                </Box>
              )}
            </Box>
            {(SubordinateOptions.length > 0 ||
              fieldsSubordinates.length > 0) && (
              <Box mb={10}>
                <Text fontSize="20px" fontWeight={600} mb={4}>
                  จองให้พนักงานในความดูแล
                </Text>
                {fieldsSubordinates.map((field, index) =>
                  !field?.readOnly ? (
                    <Box
                      border="1px solid #B2CCCC"
                      borderRadius="6px"
                      width="100%"
                      key={field.id}
                      mb={10}
                    >
                      <Flex px={{ base: 6, md: 12 }} py={12}>
                        <Flex width="10%" alignItems="flex-start">
                          {index + 1}.
                        </Flex>
                        <Flex width="80%" flexDirection="column">
                          <FormControl
                            isInvalid={
                              !!(
                                errors.subordinates &&
                                errors.subordinates[index] &&
                                errors.subordinates[index]?.employeeNo
                              )
                            }
                            w={{ base: "100%", md: "80%" }}
                            mb={4}
                            mr={{ base: 2, md: 4 }}
                          >
                            <FormLabel
                              htmlFor={`subordinates.${index}.employeeNo`}
                            >
                              รหัส / ชื่อพนักงาน
                            </FormLabel>
                            <Controller
                              name={`subordinates.${index}.employeeNo`}
                              control={control}
                              render={({ field, fieldState }) => (
                                <SelectInput
                                  options={SubordinateOptions}
                                  {...field}
                                  {...fieldState}
                                  placeholder=""
                                  onChange={(value: any) => {
                                    field.onChange(value)
                                    handleSelectSubordinate(index, value)
                                  }}
                                />
                              )}
                              rules={{
                                required:
                                  (get(watchSubordinates, `${index}.date`) ||
                                    get(
                                      watchSubordinates,
                                      `${index}.busLineId`
                                    )) &&
                                  "กรุณาเลือกพนักงาน",
                                validate: (value: any) => {
                                  if (
                                    value &&
                                    !value?.isRegisterToBookingBusSystem
                                  ) {
                                    return "พนักงานที่เลือก ยังไม่ได้ลงทะเบียนใช้บริการรถรับส่ง"
                                  }

                                  if (value != null) {
                                    if (isDuplicateSubordinate(index)) {
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
                                  errors.subordinates[index]?.employeeNo &&
                                  get(
                                    errors.subordinates[index]?.employeeNo,
                                    "message"
                                  )}
                              </FormErrorMessage>
                            </FormErrorMessage>
                          </FormControl>
                          <Flex
                            w={{ base: "100%", md: "80%" }}
                            mb={4}
                            alignItems={{ base: "flex-end", md: "inherit" }}
                          >
                            <Box w="50%" mr={{ base: 2, md: 4 }}>
                              <FormLabel
                                htmlFor={`subordinates.${index}.date`}
                                display="flex"
                                flexDirection={{ base: "column", md: "row" }}
                              >
                                วัน/เดือน/ปี{" "}
                                <Text color="#E53E3E" ml={{ base: 0, md: 4 }}>
                                  {get(warning, `warningSubordinates[${index}]`)
                                    ? `(${get(
                                        warning,
                                        `warningSubordinates[${index}]`
                                      )})`
                                    : ""}
                                </Text>
                              </FormLabel>
                              <Controller
                                name={`subordinates.${index}.date`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <Datepicker
                                    date={
                                      get(date, `dateSubordinates[${index}]`)
                                        ? get(
                                            date,
                                            `dateSubordinates[${index}]`
                                          )
                                        : get(
                                            fieldsSubordinates,
                                            `${index}.date`
                                          )
                                        ? get(
                                            fieldsSubordinates,
                                            `${index}.date`
                                          )
                                        : null
                                    }
                                    minDate={new Date()}
                                    field={field}
                                    fieldState={fieldState}
                                    dateFormat="dd/MM/yyyy (ccc)"
                                    customOnChange={true}
                                    onChange={(date: any) => {
                                      field.onChange(date)
                                      handleSetDate(
                                        date,
                                        `dateSubordinates[${index}]`
                                      )
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
                                      setIsCheckDuplicateSubordinate(false)
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
                                      if (isDuplicateSubordinate(index)) {
                                        return "เลือกวันที่จองซ้ำ"
                                      }
                                      return
                                    }
                                    return
                                  },
                                }}
                              />
                            </Box>
                            <FormControl
                              isInvalid={
                                !!(
                                  errors.subordinates &&
                                  errors.subordinates[index] &&
                                  errors.subordinates[index]?.timeTableRoundId
                                )
                              }
                              w={"50%"}
                            >
                              <FormLabel
                                htmlFor={`subordinates.${index}.timeTableRoundId`}
                              >
                                รอบเวลา
                              </FormLabel>
                              <Controller
                                name={`subordinates.${index}.timeTableRoundId`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <RequestSelectInput
                                    {...field}
                                    {...fieldState}
                                    placeholder=""
                                    isDisabled={
                                      !get(watchSubordinates, `${index}.date`)
                                    }
                                    date={
                                      get(watchSubordinates, `${index}.date`)
                                        ? get(
                                            watchSubordinates,
                                            `${index}.date`
                                          )
                                        : null
                                    }
                                    periodOfDay={periodOfDay}
                                    handleSetWarning={handleSetWarning}
                                    fieldName={`warningSubordinates[${index}]`}
                                    onChange={(v: any) => {
                                      const timeTableRoundId =
                                        watchSubordinates[index]
                                          ?.timeTableRoundId

                                      field.onChange(v)
                                      if (
                                        !isEqual(
                                          {
                                            value: timeTableRoundId?.value,
                                            label: timeTableRoundId?.label,
                                          },
                                          {
                                            value: v?.value,
                                            label: v?.label,
                                          }
                                        ) &&
                                        v
                                      ) {
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
                                      }
                                    }}
                                  />
                                )}
                                rules={{
                                  required:
                                    get(watchSubordinates, `${index}.date`) &&
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
                                {errors.subordinates &&
                                  errors.subordinates[index] &&
                                  errors.subordinates[index]
                                    ?.timeTableRoundId &&
                                  get(
                                    errors.subordinates[index]
                                      ?.timeTableRoundId,
                                    "message"
                                  )}
                              </FormErrorMessage>
                            </FormControl>
                          </Flex>
                          <Flex w={{ base: "100%", md: "80%" }} mb={4}>
                            <FormControl
                              isInvalid={
                                !!(
                                  errors.subordinates &&
                                  errors.subordinates[index] &&
                                  errors.subordinates[index]?.busLineId
                                )
                              }
                              w={"50%"}
                              mr={{ base: 2, md: 4 }}
                            >
                              <FormLabel
                                htmlFor={`subordinates.${index}.busLineId`}
                              >
                                พื้นที่
                              </FormLabel>
                              <Controller
                                name={`subordinates.${index}.busLineId`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <SelectInput
                                    options={
                                      get(
                                        ableForBooking,
                                        `subordinates.${index}`
                                      ) != null
                                        ? filter(areaOptions, (area) => {
                                            return (
                                              filter(
                                                get(
                                                  ableForBooking,
                                                  `subordinates.${index}`
                                                ),
                                                (able) => {
                                                  return (
                                                    Array.isArray(
                                                      area?.busStops
                                                    ) &&
                                                    [...area?.busStops]
                                                      .map((b) => b.busStopId)
                                                      .includes(able.id)
                                                  )
                                                }
                                              ).length > 0
                                            )
                                          })
                                        : areaOptions
                                    }
                                    {...field}
                                    {...fieldState}
                                    placeholder=""
                                    isLoading={get(
                                      isLoadingAbleForBooking,
                                      `subordinates.${index}`
                                    )}
                                    onChange={(v: any) => {
                                      field.onChange(v)
                                      if (!v) {
                                        setValue(
                                          `subordinates.${index}.busStopLineMappingId`,
                                          null
                                        )
                                        unregister(
                                          `subordinates.${index}.busStopLineMappingId`
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
                                            setValue(
                                              `subordinates.${index}.busStopLineMappingId`,
                                              null
                                            )
                                            unregister(
                                              `subordinates.${index}.busStopLineMappingId`
                                            )
                                          }
                                        } else {
                                          setValue(
                                            `subordinates.${index}.busStopLineMappingId`,
                                            null
                                          )
                                          unregister(
                                            `subordinates.${index}.busStopLineMappingId`
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
                                    (get(watchSubordinates, `${index}.date`) ||
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
                                  errors.subordinates[index]?.busLineId &&
                                  "กรุณาเลือกพื้นที่"}
                              </FormErrorMessage>
                            </FormControl>
                            <FormControl
                              isInvalid={
                                !!(
                                  errors.subordinates &&
                                  errors.subordinates[index] &&
                                  errors.subordinates[index]
                                    ?.busStopLineMappingId
                                )
                              }
                              w={"50%"}
                            >
                              <FormLabel
                                htmlFor={`subordinates.${index}.busStopLineMappingId`}
                              >
                                จุดลงรถ
                              </FormLabel>
                              <Controller
                                name={`subordinates.${index}.busStopLineMappingId`}
                                control={control}
                                render={({ field, fieldState }) => (
                                  <>
                                    <SelectInput
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
                                              ableForBooking,
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
                                                        ableForBooking,
                                                        `subordinates.${index}`
                                                      ),
                                                      {
                                                        id: busStop?.busStopId,
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
                                        isLoadingAbleForBooking,
                                        `subordinates.${index}`
                                      )}
                                    />
                                    <Text
                                      fontStyle="italic"
                                      fontWeight={300}
                                      color="#333333"
                                      mt={2}
                                      fontSize="14px"
                                    >
                                      (สายรถแสดงหลังจากที่จัดรถสำเร็จ)
                                    </Text>
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
                          </Flex>
                        </Flex>
                        <Flex width="10%" justifyContent="flex-end">
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              icon={<MdMoreVert />}
                              variant="ghost"
                              fontSize="20px"
                              color="#333333"
                              _focus={{ boxShadow: "none" }}
                              width="20%"
                            />
                            <MenuList
                              borderColor="#B2CCCC"
                              borderRadius="6px"
                              p="8px"
                              minWidth="150px"
                            >
                              <MenuItem
                                _hover={{
                                  bgColor: "#D4E3E3",
                                  borderRadius: "6px",
                                }}
                                _active={{ background: "none" }}
                                _focus={{ background: "none" }}
                                onClick={() => {
                                  if (field?.bookingId) {
                                    onClickCancel(field.bookingId, "me", index)
                                  } else removeSubordinates(index)
                                }}
                              >
                                {field?.bookingId ? "ยกเลิกการจอง" : "ลบข้อมูล"}
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Flex>
                      </Flex>
                    </Box>
                  ) : (
                    <Box
                      border="1px solid #B2CCCC"
                      borderRadius="6px"
                      width="100%"
                      key={field.id}
                      mb={10}
                    >
                      <Flex px={{ base: 6, md: 12 }} py={12}>
                        <Flex width="10%" alignItems="flex-start">
                          {index + 1}.
                        </Flex>
                        <Flex width="80%" flexDirection="column">
                          <Flex
                            w={{ base: "100%", md: "80%" }}
                            mb={4}
                            flexDirection={{ base: "column", md: "row" }}
                          >
                            <Box
                              w={{ base: "100%", md: "50%" }}
                              mr={{ base: 0, md: 4 }}
                              mb={{ base: 4, md: 0 }}
                            >
                              <TextInput
                                name={`subordinates.${index}.employeeNo.label`}
                                label="รหัส / ชื่อพนักงาน"
                                errors={errors}
                                register={register}
                                variant="unstyled"
                                disabled={true}
                                autocomplete="off"
                                minWidth={250}
                                fontWeightLabel={600}
                              />
                            </Box>
                            <Box w={{ base: "100%", md: "50%" }}>
                              <TextInput
                                name={`subordinates.${index}.statusText`}
                                label="สถานะการจอง"
                                errors={errors}
                                register={register}
                                variant="unstyled"
                                disabled={true}
                                autocomplete="off"
                                minWidth={250}
                                fontWeightLabel={600}
                              />
                            </Box>
                          </Flex>
                          <Flex w={{ base: "100%", md: "80%" }} mb={4}>
                            <Box w="50%" mr={{ base: 2, md: 4 }}>
                              <TextInput
                                name={`subordinates.${index}.date`}
                                label="วัน/เดือน/ปี"
                                errors={errors}
                                register={register}
                                variant="unstyled"
                                disabled={true}
                                autocomplete="off"
                                minWidth={250}
                                fontWeightLabel={600}
                              />
                            </Box>
                            <Box w={"50%"}>
                              <TextInput
                                name={`subordinates.${index}.timeTableRoundId.label`}
                                label="รอบเวลา"
                                errors={errors}
                                register={register}
                                variant="unstyled"
                                disabled={true}
                                autocomplete="off"
                                minWidth={250}
                                fontWeightLabel={600}
                              />
                            </Box>
                          </Flex>
                          <Flex w={{ base: "100%", md: "80%" }} mb={4}>
                            <Box w={"50%"} mr={{ base: 2, md: 4 }}>
                              <TextInput
                                name={`subordinates.${index}.busLineId.label`}
                                label="พื้นที่"
                                errors={errors}
                                register={register}
                                variant="unstyled"
                                disabled={true}
                                autocomplete="off"
                                minWidth={250}
                                fontWeightLabel={600}
                              />
                            </Box>
                            <Box w={"50%"}>
                              <TextInput
                                name={`subordinates.${index}.busStopLineMappingId.label`}
                                label="จุดลงรถ"
                                errors={errors}
                                register={register}
                                variant="unstyled"
                                disabled={true}
                                autocomplete="off"
                                minWidth={250}
                                fontWeightLabel={600}
                              />
                            </Box>
                          </Flex>
                          <Flex w={{ base: "100%", md: "80%" }} mb={4}>
                            <Box w={"50%"} mr={{ base: 2, md: 4 }}>
                              <TextInput
                                name={`subordinates.${index}.vehicleInfo`}
                                label="ข้อมูลรถ"
                                errors={errors}
                                register={register}
                                variant="unstyled"
                                disabled={true}
                                autocomplete="off"
                                minWidth={250}
                                fontWeightLabel={600}
                              />
                            </Box>
                            <Box w={"50%"}>
                              <TextInput
                                name={`subordinates.${index}.driverInfo`}
                                label="ชื่อคนขับรถ"
                                errors={errors}
                                register={register}
                                variant="unstyled"
                                disabled={true}
                                autocomplete="off"
                                minWidth={250}
                                fontWeightLabel={600}
                              />
                            </Box>
                          </Flex>
                        </Flex>
                        <Flex width="10%" justifyContent="flex-end"></Flex>
                      </Flex>
                    </Box>
                  )
                )}
                {SubordinateOptions.length > 0 && (
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
                        status: "pending",
                        readOnly: false,
                      })
                    }}
                  >
                    เพิ่มรายชื่อ
                  </Button>
                )}
              </Box>
            )}
          </Flex>
        </form>
      </Container>
    </>
  )
}

export default RequestEdit
