/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import React, { useMemo, useState } from "react"
import Head from "next/head"
import { Box, Flex, Button, Text, Link } from "@chakra-ui/react"
import Table from "../../Table"
import { AddIcon } from "@chakra-ui/icons"
import Toolbar from "../../Toolbar"
import Status from "../../TableComponent/Status"
import VehicleTypeModal from "./VehicleTypeModal"
import TableLoading from "../../TableLoading"
import { TransportationProviderDataTypes } from "../../../data-hooks/transportationProviders/types"
import { VehicleTypes } from "../../../data-hooks/vehicleTypes/types"
import NextLink from "next/link"
import ConfirmDialog from "../../ConfirmDialog"

type TransportationProviderListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  search?: string
  pageCount?: number
  data: TransportationProviderDataTypes[] | undefined
  vehicleTypes: VehicleTypes[]
  isLoading: boolean
  sortBy: { id: string; desc: boolean | undefined } | undefined
  currentPage?: number
  vehicleTypesIsLoading: boolean
  isSubmitLoading: boolean
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onCreate: (values: any) => void
  onUpdate: (values: any) => void
  onDelete: (values: any) => void
  onDeleteProvider: (values: any) => void
  isLoadingDelete: boolean
}

const TransportationProviderList = ({
  setPage,
  data,
  pageCount,
  setSearch,
  search,
  isLoading,
  setSort,
  sortBy,
  currentPage,
  vehicleTypes,
  vehicleTypesIsLoading,
  isOpen,
  onClose,
  onOpen,
  isSubmitLoading,
  onCreate,
  onDelete,
  onUpdate,
  onDeleteProvider,
  isLoadingDelete,
}: TransportationProviderListProps) => {
  const [isOpenDeleteProvider, setOpenDeleteProvider] = useState(false)
  const [selected, setSelected] = useState<{
    providerId: string
    companyName: string
  }>({ providerId: "", companyName: "" })
  const columns = useMemo(
    () => [
      {
        Header: "ชื่อบริษัท",
        accessor: "companyName",
      },
      {
        Header: "ชื่อผู้ติดต่อ",
        accessor: "firstName",
        Cell: (props: any) => {
          return (
            <Flex flexDirection="column">
              <Text>{props.row.original.name}</Text>
              <Text fontSize="14px" fontWeight={400} color="gray.500">
                {props.row.original.email}
              </Text>
            </Flex>
          )
        },
      },

      {
        Header: "เบอร์ผู้ติดต่อ",
        accessor: "mobileNo",
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }: any) => <Status value={value} />,
      },
    ],
    []
  )

  const handleDelete = (field: any) => {
    setSelected({
      providerId: `${field?.original?.id}`,
      companyName: `${field?.original?.companyName}`,
    })
    setOpenDeleteProvider(true)
  }

  return (
    <Box>
      <VehicleTypeModal
        isOpen={isOpen}
        onClose={onClose}
        vehicleTypes={vehicleTypes}
        isLoading={vehicleTypesIsLoading}
        isSubmitLoading={isSubmitLoading}
        onCreate={onCreate}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
      <ConfirmDialog
        title="ลบบัญชีผู้ให้บริการ"
        content={`คุณต้องการลบบัญชีผู้ให้บริการ ${selected.companyName} ใช่หรือไม่ ?`}
        type="error"
        acceptLabel="ลบ"
        isOpen={isOpenDeleteProvider}
        onClose={() => {
          setOpenDeleteProvider(false)
        }}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDeleteProvider({
            providerId: selected.providerId,
            from: "list",
            onClose: () => {
              setOpenDeleteProvider(false)
            },
          })
        }}
      />
      <Head>
        <title>ผู้ให้บริการรถ</title>
        <meta name="description" content="transportationProviders" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Flex flexDirection="column" p="2">
          <Toolbar
            title="ผู้ให้บริการรถ"
            setSearch={setSearch}
            search={search}
          />
          <Flex justifyContent="flex-start" mb={{ base: "16px", md: "32px" }}>
            <NextLink href={"/admin/transportationProviders/create"} passHref>
              <Link _hover={{}} _focus={{}}>
                <Button
                  leftIcon={<AddIcon />}
                  mr={4}
                  _focus={{ boxShadow: "none" }}
                >
                  เพิ่มผู้ให้บริการ
                </Button>
              </Link>
            </NextLink>
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
                    d="M13.5 8.25H4.5V4.5H13.5V8.25ZM12.375 12.75C12.0766 12.75 11.7905 12.6315 11.5795 12.4205C11.3685 12.2095 11.25 11.9234 11.25 11.625C11.25 11.3266 11.3685 11.0405 11.5795 10.8295C11.7905 10.6185 12.0766 10.5 12.375 10.5C12.6734 10.5 12.9595 10.6185 13.1705 10.8295C13.3815 11.0405 13.5 11.3266 13.5 11.625C13.5 11.9234 13.3815 12.2095 13.1705 12.4205C12.9595 12.6315 12.6734 12.75 12.375 12.75ZM5.625 12.75C5.32663 12.75 5.04048 12.6315 4.8295 12.4205C4.61853 12.2095 4.5 11.9234 4.5 11.625C4.5 11.3266 4.61853 11.0405 4.8295 10.8295C5.04048 10.6185 5.32663 10.5 5.625 10.5C5.92337 10.5 6.20952 10.6185 6.4205 10.8295C6.63147 11.0405 6.75 11.3266 6.75 11.625C6.75 11.9234 6.63147 12.2095 6.4205 12.4205C6.20952 12.6315 5.92337 12.75 5.625 12.75ZM3 12C3 12.66 3.2925 13.2525 3.75 13.665V15C3.75 15.1989 3.82902 15.3897 3.96967 15.5303C4.11032 15.671 4.30109 15.75 4.5 15.75H5.25C5.44891 15.75 5.63968 15.671 5.78033 15.5303C5.92098 15.3897 6 15.1989 6 15V14.25H12V15C12 15.1989 12.079 15.3897 12.2197 15.5303C12.3603 15.671 12.5511 15.75 12.75 15.75H13.5C13.6989 15.75 13.8897 15.671 14.0303 15.5303C14.171 15.3897 14.25 15.1989 14.25 15V13.665C14.7075 13.2525 15 12.66 15 12V4.5C15 1.875 12.315 1.5 9 1.5C5.685 1.5 3 1.875 3 4.5V12Z"
                    fill="#00A5A8"
                  />
                </svg>
              }
              variant="outline"
              mr={4}
              onClick={onOpen}
              _focus={{ boxShadow: "none" }}
            >
              จัดการประเภทรถ
            </Button>
          </Flex>
        </Flex>
        <Box p="2">
          {isLoading || !data ? (
            <TableLoading columnsLength={columns.length + 1} />
          ) : (
            <Table
              resources="transportationProviders"
              data={data ? data : []}
              columns={columns}
              setPage={setPage}
              setSort={setSort}
              pageCount={pageCount}
              sortBy={sortBy}
              currentPage={currentPage}
              onDelete={handleDelete}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default React.memo(TransportationProviderList)
