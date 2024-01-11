/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import React, { useMemo, useState } from "react"
import Head from "next/head"
import {
  Box,
  Flex,
  Button,
  useDisclosure,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Link,
} from "@chakra-ui/react"
import Table from "../../../Table"
import { useForm } from "react-hook-form"
import { AddIcon, SearchIcon } from "@chakra-ui/icons"
import Status from "../../../TableComponent/Status"
import TableLoading from "../../../TableLoading"
import { VehicleDataTypes } from "../../../../data-hooks/transportationProviders/vehicles/types"
import NextLink from "next/link"
import ConfirmDialog from "../../../ConfirmDialog"

type VehicleProviderListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  search?: string
  pageCount?: number
  data: VehicleDataTypes[] | undefined
  isLoading: boolean
  sortBy: { id: string; desc: boolean | undefined } | undefined
  currentPage?: number
  id: string | string[] | undefined
  isLoadingDelete: boolean
  onDelete: (values: any) => void
}

const VehicleProviderList = ({
  setPage,
  data,
  pageCount,
  setSearch,
  search,
  isLoading,
  setSort,
  sortBy,
  currentPage,
  id,
  isLoadingDelete,
  onDelete,
}: VehicleProviderListProps) => {
  const [selected, setSelected] = useState<{
    vehicleId: string
    licencePlate: string
    providerId: string
  }>({ vehicleId: "", licencePlate: "", providerId: "" })
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm({ mode: "onBlur" })

  const { isOpen, onClose, onOpen } = useDisclosure()

  const columns = useMemo(
    () => [
      {
        Header: "ทะเบียนรถ",
        accessor: "licencePlate",
      },
      {
        Header: "ประเภทรถ",
        accessor: "vehicleTypeName",
      },

      {
        Header: "อายุรถในปัจจุบัน",
        accessor: "vehicleAgeYear",
        Cell: ({ value, row }: any) => {
          return (
            <Text>{`${value > 0 ? `${value} ปี` : `0 ปี`} ${
              row.original.vehicleAgeMonth > 0
                ? `${row.original.vehicleAgeMonth} เดือน`
                : `0 เดือน`
            } `}</Text>
          )
        },
      },
      {
        Header: "ชื่อคนขับ",
        accessor: "driverFirstName",
        Cell: (props: any) => {
          return (
            <Flex flexDirection="column">
              <Text>{props.row.original.driverName}</Text>
            </Flex>
          )
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }: any) => <Status value={value} />,
      },
    ],
    []
  )

  function onSubmit(values: any) {
    if (setSearch) setSearch(`${values.query}`)
  }

  const handleDelete = (field: any) => {
    setSelected({
      vehicleId: `${field?.original?.id}`,
      licencePlate: `${field?.original?.licencePlate}`,
      providerId: `${field?.original?.transportationProviderId}`,
    })
    onOpen()
  }

  return (
    <Box>
      <Head>
        <title>รถ</title>
        <meta name="description" content="vehicle" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title="ลบข้อมูลรถ"
        content={`คุณต้องการลบข้อมูลรถทะเบียน ${selected?.licencePlate} ใช่หรือไม่ ?`}
        type="error"
        acceptLabel="ลบ"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDelete({
            vehicleId: selected.vehicleId,
            providerId: selected.providerId,
            from: "list",
            onClose: onClose,
          })
        }}
      />
      <Box>
        <Flex
          justifyContent="space-between"
          mb={{ base: "20px", md: "40px" }}
          width="100%"
          flexDirection={{ base: "column", md: "row" }}
        >
          <Flex mb={{ base: 6, md: 0 }}>
            <NextLink
              href={`/admin/transportationProviders/${id}/vehicles/create`}
              passHref
            >
              <Link _hover={{}} _focus={{}}>
                <Button leftIcon={<AddIcon />} colorScheme="primary" mr={4}>
                  เพิ่มรถ
                </Button>
              </Link>
            </NextLink>
          </Flex>
          <form onBlur={handleSubmit(onSubmit)}>
            <Flex alignItems="center" width={{ base: "100%", md: "inherit" }}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="gray.300" />}
                />
                <Input
                  id="query"
                  placeholder="Search"
                  {...register("query")}
                  w={{ base: "100%", md: "80" }}
                  borderColor="#B2CCCC"
                  _focus={{
                    borderColor: "#B2CCCC",
                    boxShadow: "0 0 0 1px #00A5A8",
                  }}
                />
              </InputGroup>
            </Flex>
          </form>
        </Flex>
        <Box>
          {isLoading || !data ? (
            <TableLoading columnsLength={columns.length + 1} />
          ) : (
            <Table
              resources={`transportationProviders/${id}/vehicles`}
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

export default React.memo(VehicleProviderList)
