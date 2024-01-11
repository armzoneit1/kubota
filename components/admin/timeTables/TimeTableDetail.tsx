import React from "react"
import { useState, useEffect, useMemo } from "react"
import { keyColumn } from "../../react-datagrid-sheet/keyColumn"
import { keyColumnBusLine } from "../../react-datagrid-sheet/keyColumnBusLine"
import { textColumn } from "../../react-datagrid-sheet/textColumn"
import { selectBusLineColumn } from "../../react-datagrid-sheet/SelectBusLineColumn"
import { DataSheetGrid } from "../../react-datagrid-sheet/DataSheetGrid"
import groupBy from "lodash/groupBy"
import { Container, Flex, Text, Button, HStack, Link } from "@chakra-ui/react"
import { Row } from "../../react-datagrid-sheet/RowTimeTableDetail"
import {
  TimeTableCustomDetailDataTypes,
  TimeTableRoundCustomDetailTypes,
} from "../../../data-hooks/timeTables/types"
import { BusStopDataTypes } from "../../../data-hooks/busStops/types"
import { TimeTableDataTypes } from "../../../data-hooks/timeTables/types"
import { BusLineDataTypes } from "../../../data-hooks/busLines/types"
import Head from "next/head"
import NextLink from "next/link"

type TimeTableDetailProps = {
  data: TimeTableCustomDetailDataTypes
  busStops: BusStopDataTypes[]
  timeTable: TimeTableDataTypes
  busLines: BusLineDataTypes[]
  isLoading: boolean
  onSubmit: (values: any) => void
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>
}

const TimeTableDetail = ({
  data: timeTableDetail,
  busStops,
  timeTable,
  busLines,
  isLoading,
  onSubmit: submit,
  setIsUpdating,
}: TimeTableDetailProps) => {
  const [data, setData] = useState<any[]>([])

  const mappingData = useMemo(
    () =>
      busStops && timeTableDetail
        ? busStops.map((busStop, index) => {
            let hide = false
            const timeTableRound = timeTableDetail?.timeTableRounds.reduce(
              (acc: any, curr) => {
                acc[`primary[${curr.timeTableRoundId}]`] = curr.primary.filter(
                  (p) => p.busStopId === busStop.id
                )
                acc[
                  `secondary[${curr.timeTableRoundId}]`
                ] = curr.secondary.filter((s) => s.busStopId === busStop.id)
                return acc
              },
              {}
            )

            if (index > 0) {
              const before: any = busStops[index - 1]
              if (before?.keyArea === busStop?.keyArea) hide = true
              else hide = false
            }

            return { ...busStop, hide, ...timeTableRound }
          })
        : [],
    [busStops, timeTableDetail]
  )

  useEffect(() => {
    setData(mappingData)
  }, [mappingData])

  const [viewHeight, setViewHeight] = useState(0)

  useEffect(() => {
    setViewHeight(window.innerHeight)
  }, [])

  const counter: any = groupBy(data, "keyArea")
  let lastMax = 0

  Object.keys(counter).map((key, index) => {
    const max = index === 0 ? counter[key].length - 1 : lastMax + 1

    counter[key] = {
      numOfChild: counter[key].length,
      start: { col: 0, row: index === 0 ? index : max },
      end: { col: 0, row: index === 0 ? max : max + counter[key].length - 1 },
    }

    lastMax = counter[key]?.end.row
  })

  const handleSetData = (data: any) => {
    const newData: any[] = []
    const filteredData = [...data].map((d, index): any => {
      if (index === 0) {
        newData.push({ ...d })
        return { ...d }
      } else {
        const before = newData[index - 1]
        newData.push({
          ...d,
          area: before.keyArea === d.keyArea ? before.areaName : d.areaName,
        })

        return {
          ...d,
          area: before.keyArea === d.keyArea ? before.areaName : d.areaName,
        }
      }
    })
    const changeKeyData = [...filteredData].map((d) => ({
      ...d,
      areaName: d.areaName,
    }))

    setData(changeKeyData)
  }

  const onSubmit = () => {
    const timeTableRounds: TimeTableRoundCustomDetailTypes[] = timeTableDetail.timeTableRounds.map(
      (time) => ({
        timeTableRoundId: time.timeTableRoundId,
        primary: [],
        secondary: [],
      })
    )
    const update = timeTableRounds.map((time) => {
      const lines = data.reduce(
        (acc, curr: any) => {
          const primary = curr[`primary[${time.timeTableRoundId}]`]
            ? curr[`primary[${time.timeTableRoundId}]`].map((v: any) => ({
                ...v,
                busStopId: curr.id,
              }))
            : []
          const secondary = curr[`secondary[${time.timeTableRoundId}]`]
            ? curr[`secondary[${time.timeTableRoundId}]`].map((v: any) => ({
                ...v,
                busStopId: curr.id,
              }))
            : []
          acc.primary = [...acc.primary, ...primary]
          acc.secondary = [...acc.secondary, ...secondary]
          return acc
        },
        {
          primary: [],
          secondary: [],
        }
      )
      return { timeTableRoundId: time.timeTableRoundId, ...lines }
    })
    setIsUpdating(true)
    submit({
      id: timeTableDetail.id,
      data: { timeTableRounds: update },
      setIsUpdating,
    })
  }

  const timeTableRoundColumns = useMemo(
    () =>
      timeTable
        ? timeTable.timeTableRounds.reduce((acc: any[], curr) => {
            const options = busLines
              ? busLines.map((line) => ({ value: line.id, label: line.name }))
              : []
            acc.push({
              ...keyColumnBusLine(
                `primary[${curr.timeTableRoundId}]`,
                selectBusLineColumn({
                  choices: [{ label: "ทั้งหมด", options: options }],
                  busLines: busLines,
                })
              ),
              title: `${curr.time}น. (สายหลัก)`,
              minWidth: 375,
            })
            acc.push({
              ...keyColumnBusLine(
                `secondary[${curr.timeTableRoundId}]`,
                selectBusLineColumn({
                  choices: [{ label: "ทั้งหมด", options: options }],
                  busLines: busLines,
                })
              ),
              title: `${curr.time}น. (สำรอง)`,
              minWidth: 375,
            })
            return acc
          }, [])
        : [],
    [busLines, timeTable]
  )

  const columns = useMemo(
    () => [
      {
        ...keyColumn(
          "areaName",
          textColumn({ placeholder: "", disabled: true })
        ),
        title: "พื้นที่",
        minWidth: 200,
      },
      {
        ...keyColumn("name", textColumn({ placeholder: "", disabled: true })),
        title: "จุดจอดรถ",
        minWidth: 200,
      },

      ...timeTableRoundColumns,
    ],
    [timeTableRoundColumns]
  )

  return (
    <>
      <Head>
        <title>รอบการจัดรถ</title>
        <meta name="description" content="timeTable" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container minHeight="80vh" minW="100%" width="100%">
        <Flex flexDirection="column" height="100%">
          <Flex width="100%" justifyContent="space-between" my={5} mb={10}>
            <Flex justifyContent="center" flexDirection="column">
              <Text mb={3} fontSize="32px">
                {timeTableDetail?.name}
              </Text>
              <HStack>
                <NextLink
                  href={`/admin/timeTables/${timeTableDetail?.periodOfDay}`}
                  passHref
                >
                  <Link _hover={{}} _focus={{}}>
                    <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                      รอบการจัดรถ
                    </Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <Text fontStyle="italic">{timeTableDetail?.name}</Text>
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
                onClick={onSubmit}
                mr={4}
                isLoading={isLoading}
              >
                บันทึก
              </Button>
            </Flex>
          </Flex>

          <DataSheetGrid
            data={data}
            onChange={handleSetData}
            columns={columns}
            lockRows
            rowHeight={72}
            headerRowHeight={40}
            counter={counter}
            height={viewHeight * 0.7}
            row={Row}
          />
        </Flex>
      </Container>
    </>
  )
}

export default TimeTableDetail
