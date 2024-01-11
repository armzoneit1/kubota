import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useDisclosure,
  IconButton,
  Link,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useState, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { DataSheetGrid } from "../../react-datagrid-sheet/DataSheetGrid"
import { textColumn } from "../../react-datagrid-sheet/textColumn"
import { vehicleTypeTextColumn } from "../../react-datagrid-sheet/vehicleTypeTextColumn"
import { keyColumn } from "../../react-datagrid-sheet/keyColumnMoreInformation"
import groupBy from "lodash/groupBy"
import { Row } from "../../react-datagrid-sheet/RowMoreInformation"
import { selectVehicleColumn } from "../../react-datagrid-sheet/selectVehicleColumn"
import { selectDriverColumn } from "../../react-datagrid-sheet/selectDriverColumn"
import NextLink from "next/link"
import Head from "next/head"
import {
  BusArrangementDataTypes,
  TimeTableRoundMoreInformationDataTypes,
  ListVehicle,
  DriverList,
  ArrangedVehicleDataTypes,
} from "../../../data-hooks/busArrangements/types"
import { DateTime } from "luxon"
import filter from "lodash/filter"
import get from "lodash/get"
import without from "lodash/without"
import isArray from "lodash/isArray"

type MoreInformationProps = {
  data: BusArrangementDataTypes | undefined
  isLoading: boolean
  periodOfDay: "morning" | "evening"
  timeTableRounds: TimeTableRoundMoreInformationDataTypes[]
  vehicleList: ListVehicle[] | null
  driverList: DriverList[] | null
  updateInformation: (values: any) => void
  isLoadingUpdateInformation: boolean
  addDriver: (values: any) => void
  isLoadingAddDriver: boolean
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
}

const MoreInformation = ({
  data: busArrangement,
  isLoading,
  periodOfDay,
  timeTableRounds,
  vehicleList,
  driverList,
  updateInformation,
  isLoadingUpdateInformation,
  addDriver,
  isLoadingAddDriver,
  setIsUpdating,
}: MoreInformationProps) => {
  const router = useRouter()
  const scheduleId = router?.query?.id

  const vehicleOptions = useMemo(
    () =>
      vehicleList
        ? vehicleList.map((v) => ({
            value: v.id,
            label: v.licencePlate,
            transportationProviderVehicleTypeMappingId:
              v.transportationProviderVehicleTypeMappingId,
            driverId: v.driverId,
            transportationProviderId: v.transportationProviderId,
          }))
        : [],
    [vehicleList]
  )

  const driverOptions = useMemo(
    () =>
      driverList
        ? driverList.map((d) => ({
            value: d.id,
            label: `${d.firstName} ${d.lastName}`,
            transportationProviderId: d.transportationProviderId,
          }))
        : [],
    [driverList]
  )

  const [data, setData] = useState<TimeTableRoundMoreInformationDataTypes[]>([])
  const [validationVehicle, setValidationVehicle] = useState<any[] | null>(null)
  const [validationDriver, setValidationDriver] = useState<any[] | null>(null)

  useEffect(() => {
    setData(timeTableRounds)
  }, [timeTableRounds])

  const counter = useMemo(
    () =>
      timeTableRounds
        ? timeTableRounds.map((timeTableRound) => {
            const counter: any = groupBy(timeTableRound.busLines, "keyBusLine")

            let lastMax = 0

            Object.keys(counter).map((key, index) => {
              const max = index === 0 ? counter[key].length - 1 : lastMax + 1

              counter[key] = {
                numOfChild: counter[key].length,
                start: { col: 0, row: index === 0 ? index : max },
                end: {
                  col: 0,
                  row: index === 0 ? max : max + counter[key].length - 1,
                },
              }

              lastMax = counter[key]?.end.row
            })
            return counter
          })
        : [],
    [timeTableRounds]
  )

  const handleSetDriver = (
    driver: any,
    timeTableRoundId: number,
    bookingVehicleId: number
  ) => {
    const oldData = [...data]

    const update = oldData.map((data) => {
      if (data.timeTableRoundId === timeTableRoundId) {
        data.busLines = [...data.busLines].map((busLine: any) => {
          if (busLine.bookingVehicleId === bookingVehicleId) {
            busLine.driverIdMapping = driver
            return busLine
          }
          return busLine
        })
      }
      return data
    })
    setData(update)
  }

  const columns = [
    {
      ...keyColumn(
        "busLineName",
        textColumn({ placeholder: "", disabled: true })
      ),
      title: "สายรถ",
    },
    {
      ...keyColumn(
        "vehicleTypeNameMapping",
        vehicleTypeTextColumn({ placeholder: "", disabled: true })
      ),
      title: "ประเภทรถ",
      minWidth: 325,
    },
    {
      ...keyColumn(
        "vehicleIdMapping",
        selectVehicleColumn({
          choices: vehicleOptions,
          validationVehicle: validationVehicle,
        })
      ),
      title: "ทะเบียนรถ",
    },
    {
      ...keyColumn(
        "driverIdMapping",
        selectDriverColumn({
          choices: driverOptions,
          addDriver: addDriver,
          isLoading: isLoadingAddDriver,
          handleSetDriver,
          validationDriver: validationDriver,
        })
      ),
      title: "ชื่อคนขับ",
    },
    {
      ...keyColumn(
        "passengerHeadCount",
        textColumn({ placeholder: "กรุณาใส่จำนวนคน", unit: "คน" })
      ),
      title: "จำนวนคนขึ้นจริง",
    },
  ]

  function onSubmit() {
    const update = [...data].reduce(
      (
        acc: {
          bookingVehicleId: number
          vehicleId: number | null
          driverId: number | null
          passengerHeadCount: number | null
        }[],
        curr
      ) => {
        const bookings: {
          bookingVehicleId: number
          vehicleId: number | null
          driverId: number | null
          passengerHeadCount: number | null
        }[] = curr.busLines.map((busLine: any) => {
          const vehicleId = get(busLine, "vehicleIdMapping")
          const driverId = get(busLine, "driverIdMapping")
          return {
            bookingVehicleId: busLine.bookingVehicleId,
            vehicleId: vehicleId ? vehicleId?.value : null,
            driverId: driverId ? driverId?.value : null,
            passengerHeadCount: busLine.passengerHeadCount
              ? +busLine.passengerHeadCount
              : null,
          }
        })
        acc.push(...bookings)
        return acc
      },
      []
    )
    setIsUpdating(true)

    updateInformation({ scheduleId, periodOfDay, data: update, setIsUpdating })
  }

  const handleSetData = (updateData: any) => {
    const mappingUpdateData = [...updateData].map((ud) => {
      const currentData: any = data
        ?.find((d) => ud.timeTableRoundId === d.timeTableRoundId)
        ?.busLines?.find(
          (b: any) => b?.bookingVehicleId === ud?.bookingVehicleId
        )
      return {
        ...ud,
        driverIdMapping: ud?.vehicleIdMapping
          ? ud?.driverIdMapping == null
            ? driverOptions.find(
                (d) => d.value === ud?.vehicleIdMapping?.driverId
              )
            : currentData?.vehicleIdMapping?.value !==
              ud?.vehicleIdMapping?.value
            ? driverOptions.find(
                (d) => d.value === ud?.vehicleIdMapping?.driverId
              )
            : ud?.driverIdMapping
          : null,
      }
    })

    const vehicleIdMappingUpdatedata = [...mappingUpdateData].map(
      (data) => data.vehicleIdMapping
    )

    const driverIdMappingUpdatedata = [...mappingUpdateData].map(
      (data) => data.driverIdMapping
    )

    const groupingVehicleIdMapping = groupBy(
      without(vehicleIdMappingUpdatedata, null),
      "value"
    )

    const groupingDriverIdMapping = groupBy(
      without(driverIdMappingUpdatedata, null),
      "value"
    )

    const validationVehicle: any[] = []
    const validationDriver: any[] = []
    Object.keys(groupingVehicleIdMapping).map((key) => {
      if (
        groupingVehicleIdMapping[key] &&
        isArray(groupingVehicleIdMapping[key])
      ) {
        if (groupingVehicleIdMapping[key]?.length > 1) {
          validationVehicle.push(groupingVehicleIdMapping[key][0])
        }
      }
    })
    Object.keys(groupingDriverIdMapping).map((key) => {
      if (
        groupingDriverIdMapping[key] &&
        isArray(groupingDriverIdMapping[key])
      ) {
        if (groupingDriverIdMapping[key]?.length > 1) {
          validationDriver.push(groupingDriverIdMapping[key][0])
        }
      }
    })

    setValidationVehicle(validationVehicle)
    setValidationDriver(validationDriver)

    const oldData = [...data]

    const update = oldData.map((data) => {
      if (data.timeTableRoundId === mappingUpdateData[0]?.timeTableRoundId) {
        data.busLines = [...mappingUpdateData]
      }
      return data
    })

    setData(update)
  }

  return (
    <>
      <Head>
        <title>การจัดรถ</title>
        <meta name="description" content="planning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        minHeight="80vh"
        minW="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <Flex flexDirection="column">
          <Flex width="100%" justifyContent="space-between" my={5}>
            <Flex justifyContent="center" flexDirection="column">
              <Text mb={3} fontSize="32px">
                ข้อมูลเพิ่มเติม
              </Text>
              <HStack>
                <NextLink href="/admin/plannings" passHref>
                  <Link _hover={{}} _focus={{}}>
                    <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                      การจัดรถ
                    </Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <NextLink
                  href={`/admin/plannings/${scheduleId}/${periodOfDay}`}
                  passHref
                >
                  <Link _focus={{}} _hover={{}}>
                    <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                      จัดรถ
                    </Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <Text fontStyle="italic">ข้อมูลเพิ่มเติม</Text>
              </HStack>
            </Flex>
            <Flex alignItems="center">
              <Button
                leftIcon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 2V16H16V4.828L13.172 2H2ZM1 0H14L17.707 3.707C17.8946 3.89449 17.9999 4.14881 18 4.414V17C18 17.2652 17.8946 17.5196 17.7071 17.7071C17.5196 17.8946 17.2652 18 17 18H1C0.734784 18 0.48043 17.8946 0.292893 17.7071C0.105357 17.5196 0 17.2652 0 17V1C0 0.734784 0.105357 0.48043 0.292893 0.292893C0.48043 0.105357 0.734784 0 1 0ZM9 15C8.20435 15 7.44129 14.6839 6.87868 14.1213C6.31607 13.5587 6 12.7956 6 12C6 11.2044 6.31607 10.4413 6.87868 9.87868C7.44129 9.31607 8.20435 9 9 9C9.79565 9 10.5587 9.31607 11.1213 9.87868C11.6839 10.4413 12 11.2044 12 12C12 12.7956 11.6839 13.5587 11.1213 14.1213C10.5587 14.6839 9.79565 15 9 15ZM3 3H12V7H3V3Z"
                      fill="#F9F9F9"
                    />
                  </svg>
                }
                colorScheme="primary"
                _focus={{ boxShadow: "none" }}
                isLoading={isLoadingUpdateInformation}
                type="submit"
                mr={4}
                onClick={onSubmit}
                isDisabled={Boolean(
                  (validationDriver && validationDriver?.length > 0) ||
                    (validationVehicle && validationVehicle?.length > 0)
                )}
              >
                บันทึก
              </Button>
            </Flex>
          </Flex>
          {data &&
            data.length > 0 &&
            data.map((timeTableRound, index) => (
              <Flex
                flexDirection="column"
                my={5}
                key={timeTableRound.timeTableRoundId}
              >
                <Text fontWeight={600} fontSize="26px" mb={6}>
                  วันที่{" "}
                  {DateTime.fromJSDate(
                    new Date(`${timeTableRound?.date}`)
                  ).toFormat("dd/MM/y")}{" "}
                  {periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"} เวลา{" "}
                  {timeTableRound.time} น.
                </Text>
                <DataSheetGrid
                  data={timeTableRound.busLines}
                  onChange={handleSetData}
                  columns={columns}
                  lockRows
                  rowHeight={72}
                  headerRowHeight={40}
                  counter={counter[index]}
                  row={Row}
                />
              </Flex>
            ))}
        </Flex>
      </Container>
    </>
  )
}

export default MoreInformation
