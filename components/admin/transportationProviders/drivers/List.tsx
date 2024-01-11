/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import React, { useMemo, useState } from "react"
import Head from "next/head"
import {
  Box,
  Flex,
  Button,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Image,
  Link,
  useDisclosure,
} from "@chakra-ui/react"
import Table from "../../../Table"
import { useForm } from "react-hook-form"
import { AddIcon, SearchIcon } from "@chakra-ui/icons"
import Status from "../../../TableComponent/Status"
import TableLoading from "../../../TableLoading"
import { DriverDataTypes } from "../../../../data-hooks/transportationProviders/drivers/types"
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
  data: DriverDataTypes[] | undefined
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
    driverId: string
    driverName: string
    providerId: string
  }>({ driverId: "", driverName: "", providerId: "" })
  const { isOpen, onClose, onOpen } = useDisclosure()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
  } = useForm({ mode: "onBlur" })

  const columns = useMemo(
    () => [
      {
        Header: "ขื่อ-นามสกุล",
        accessor: "name",
        Cell: ({ value, row }: any) => (
          <Flex alignItems="center">
            {row.original.profileImageUrl ? (
              <Image
                borderRadius="full"
                boxSize="40px"
                src={row.original.profileImageUrl}
                alt={value}
                mr={2}
              />
            ) : (
              <Box
                borderRadius="full"
                boxSize="40px"
                backgroundColor="#F5F5F5"
                mr={2}
              />
            )}
            <Text>{value}</Text>
          </Flex>
        ),
      },
      {
        Header: "อายุ",
        accessor: "ageYear",
        Cell: ({ value, row }: any) => {
          return (
            <Text>{`${value > 0 ? `${value} ปี` : ``} ${
              row.original.ageMonth > 0 ? `${row.original.ageMonth} เดือน` : ``
            } `}</Text>
          )
        },
      },

      {
        Header: "เบอร์โทรศัพท์",
        accessor: "mobileNo",
      },
      {
        Header: "ทะเบียนรถ",
        accessor: "licencePlate",
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
      driverId: `${field?.original?.id}`,
      driverName: `${field?.original?.name}`,
      providerId: `${field?.original?.transportationProviderId}`,
    })
    onOpen()
  }

  return (
    <Box>
      <Head>
        <title>คนขับรถ</title>
        <meta name="description" content="driver" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title="ลบข้อมูลคนขับรถ"
        content={`คุณต้องการลบข้อมูลคนขับรถ ${selected?.driverName} ใช่หรือไม่ ?`}
        type="error"
        acceptLabel="ลบ"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDelete({
            driverId: selected.driverId,
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
              href={`/admin/transportationProviders/${id}/drivers/create`}
              passHref
            >
              <Link _hover={{}} _focus={{}}>
                <Button leftIcon={<AddIcon />} colorScheme="primary" mr={4}>
                  เพิ่มคนขับ
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
              resources={`transportationProviders/${id}/drivers`}
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
