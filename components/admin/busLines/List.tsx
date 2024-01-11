/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useMemo, useState } from "react"
import Head from "next/head"
import {
  Box,
  Flex,
  Button,
  Text,
  Input,
  InputLeftElement,
  InputGroup,
  IconButton,
  Link,
  useDisclosure,
} from "@chakra-ui/react"
import TableDraggable from "../../TableDraggable"
import { useForm } from "react-hook-form"
import { AddIcon, SearchIcon } from "@chakra-ui/icons"
import { MdEdit } from "react-icons/md"
import Status from "../../TableComponent/Status"
import NextLink from "next/link"
import { BusLineDataTypes } from "../../../data-hooks/busLines/types"
import TableLoading from "../../TableLoading"
import { useDebouncedCallback } from "use-debounce"
import ConfirmDialog from "../../ConfirmDialog"

type BusLineListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setData: (data: any[]) => void
  search?: string
  pageCount?: number
  data: BusLineDataTypes[] | undefined
  isLoading: boolean
  currentPage?: number
  periodOfDay: "morning" | "evening"
  isLoadingDelete: boolean
  onDelete: (values: any) => void
}

const BusLineList = ({
  setPage,
  data,
  pageCount,
  setSearch,
  search,
  isLoading,
  currentPage,
  setData,
  periodOfDay,
  isLoadingDelete,
  onDelete,
}: BusLineListProps) => {
  const [selected, setSelected] = useState<{
    busLineId: string
    busLineName: string
  }>({ busLineId: "", busLineName: "" })
  const { isOpen, onClose, onOpen } = useDisclosure()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm()

  const columns = useMemo(
    () => [
      {
        Header: "ชื่อสาย",
        accessor: "name",
      },
      {
        Header: "จุดจอดรถ",
        accessor: "totalBusStop",
        Cell: ({ value }: any) => `${value} จุด`,
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
      busLineName: `${field?.original?.name}`,
      busLineId: `${field?.original?.id}`,
    })
    onOpen()
  }

  const debounced = useDebouncedCallback((value) => {
    if (setSearch) setSearch(value)
  }, 500)

  function onSubmit(values: any) {
    debounced(`${values.query}`)
  }

  return (
    <>
      <ConfirmDialog
        title="ลบสายรถ"
        content={`หากยืนยันการลบสายรถ ${selected?.busLineName} รายการจองในอนาคตทั้งหมดของพนักงานที่ลงจุดจอดในสายรถนี้จะถูกยกเลิก`}
        type="error"
        acceptLabel="ยืนยัน"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDelete({
            busLineId: selected.busLineId,
            from: "list",
            onClose: onClose,
            periodOfDay: periodOfDay,
          })
        }}
      />
      <Flex
        justifyContent="space-between"
        mb={{ base: "20px", md: "40px" }}
        flexDirection={{ base: "column", md: "row" }}
      >
        <Flex mb={{ base: 6, md: 0 }}>
          <NextLink href={`/admin/busLines/create/${periodOfDay}`} passHref>
            <Link _hover={{}} _focus={{}}>
              <Button leftIcon={<AddIcon />} colorScheme="primary" mr={4}>
                เพิ่มสายรถ
              </Button>
            </Link>
          </NextLink>
        </Flex>
        <form onChange={handleSubmit(onSubmit)}>
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
          <TableLoading columnsLength={columns.length + 2} />
        ) : (
          <TableDraggable
            resources="busLines"
            data={data ? data : []}
            columns={columns}
            onDelete={handleDelete}
            setPage={setPage}
            pageCount={pageCount}
            currentPage={currentPage}
            setData={setData}
          />
        )}
      </Box>
    </>
  )
}

export default BusLineList
