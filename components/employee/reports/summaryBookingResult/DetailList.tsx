/* eslint-disable react/display-name */
import React, { useMemo } from "react"
import {
  Button,
  Container,
  Flex,
  Box,
  Text,
  HStack,
  Link,
} from "@chakra-ui/react"
import ReportTable from "../ReportTable"
import NextLink from "next/link"
import {
  SummaryBookingDetailDataTypes,
  BusStopDetailTypes,
} from "../../../../data-hooks/reports/summaryBookingResult/types"
import { DateTime } from "luxon"
import Head from "next/head"

type DetailListProps = {
  data: SummaryBookingDetailDataTypes
  dataForDownload: SummaryBookingDetailDataTypes | undefined
  download: (values: any) => void
  busStops: BusStopDetailTypes[] | undefined
  isLoadingDownload: boolean
}

const DetailList = ({
  data,
  dataForDownload,
  download,
  busStops,
  isLoadingDownload,
}: DetailListProps) => {
  const columns = useMemo(
    () => [
      {
        Header: "ลำดับ",
        accessor: "rank",
        disableSortBy: true,
        Cell: ({ value }: any) => value,
      },
      {
        Header: "จุดจอดรถ",
        accessor: "busStopName",
        disableSortBy: true,
        Cell: ({ value, row }: any) =>
          value ? (
            <>
              {!row?.original?.isNormalBusStopBySetting && (
                <span style={{ color: "#D61212" }}>* </span>
              )}
              {value}
            </>
          ) : (
            ""
          ),
      },
      {
        Header: "ชื่อผู้โดยสาร",
        accessor: "passengers",
        disableSortBy: true,
        Cell: ({ value }: any) =>
          `${value.title}${value.firstName} ${value.lastName}`,
      },
    ],
    []
  )

  return (
    <>
      <Head>
        <title>สรุปการจัดรถ</title>
        <meta name="description" content="summaryBookingResult" />
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
                รายละเอียด
              </Text>
              <HStack>
                <NextLink href={"/employee/reports"} passHref>
                  <Link _hover={{}} _focus={{}}>
                    <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                      รายงาน
                    </Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <NextLink
                  href={`/employee/reports/summaryBookingResult?date=${data?.date}&round=${data?.periodOfDay}`}
                  passHref
                >
                  <Link _hover={{}} _focus={{}}>
                    <Text fontStyle="italic" color="#00A5A8" cursor="pointer">
                      สรุปการจัดรถ
                    </Text>
                  </Link>
                </NextLink>
                <Text>{">"}</Text>
                <Text fontStyle="italic">รายละเอียด</Text>
              </HStack>
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Text fontWeight={600}>
              วันที่ :{" "}
              {data?.date
                ? DateTime.fromJSDate(new Date(data?.date)).toFormat("dd/MM/y")
                : "-"}
            </Text>
            <Text fontWeight={600}>
              รอบเวลา : {data?.periodOfDay === "morning" ? "รอบไป" : "รอบกลับ"}{" "}
              ({`${data?.time ? `${data?.time} น.` : "-"}`})
            </Text>
            <Text fontWeight={600}>
              สายรถ : {data?.busLineName ? data?.busLineName : "-"}
            </Text>
            <Text fontWeight={600}>
              ประเภทรถ : {data?.vehicleTypeName && data?.vehicleTypeName} (
              {data?.totalPassenger && data?.totalPassenger}/
              {data?.seatCapacity && data?.seatCapacity})
            </Text>
            <Text fontWeight={600}>
              ทะเบียนรถ : {data?.licensePlate ? data?.licensePlate : "-"}
            </Text>
          </Flex>
          <Flex justifyContent="flex-end" mb={6}>
            <Button
              leftIcon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.85902 2.87722L15.429 1.08222C15.5 1.07204 15.5723 1.07723 15.641 1.09744C15.7098 1.11765 15.7734 1.1524 15.8275 1.19935C15.8817 1.24629 15.9251 1.30433 15.9549 1.36952C15.9846 1.43472 16 1.50555 16 1.57722V22.4232C16 22.4948 15.9846 22.5655 15.9549 22.6306C15.9252 22.6957 15.8819 22.7537 15.8279 22.8007C15.7738 22.8476 15.7103 22.8824 15.6417 22.9026C15.5731 22.9229 15.5009 22.9282 15.43 22.9182L2.85802 21.1232C2.61964 21.0893 2.40152 20.9704 2.24371 20.7886C2.08591 20.6067 1.99903 20.374 1.99902 20.1332V3.86722C1.99903 3.62643 2.08591 3.39373 2.24371 3.21186C2.40152 3.02999 2.61964 2.91117 2.85802 2.87722H2.85902ZM17 3.00022H21C21.2652 3.00022 21.5196 3.10557 21.7071 3.29311C21.8947 3.48064 22 3.735 22 4.00022V20.0002C22 20.2654 21.8947 20.5198 21.7071 20.7073C21.5196 20.8949 21.2652 21.0002 21 21.0002H17V3.00022ZM10.2 12.0002L13 8.00022H10.6L9.00002 10.2862L7.40002 8.00022H5.00002L7.80002 12.0002L5.00002 16.0002H7.40002L9.00002 13.7142L10.6 16.0002H13L10.2 12.0002Z"
                    fill="#F9F9F9"
                  />
                </svg>
              }
              _focus={{ boxShadow: "none" }}
              isDisabled={
                !(
                  dataForDownload &&
                  data &&
                  data?.busStops &&
                  data?.busStops.length > 0
                )
              }
              onClick={() => {
                download(dataForDownload)
              }}
              isLoading={isLoadingDownload}
            >
              ดาวน์โหลดเป็น Excel
            </Button>
          </Flex>
          {data && (
            <Box w="100%">
              <ReportTable columns={columns} data={busStops ? busStops : []} />
            </Box>
          )}
        </Flex>
      </Container>
    </>
  )
}

export default DetailList
