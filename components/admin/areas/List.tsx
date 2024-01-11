/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import React, { useMemo, useState } from "react"
import Head from "next/head"
import { Box, Flex, Button, useDisclosure, Link } from "@chakra-ui/react"
import TableDraggable from "../../TableDraggable"
import { AddIcon } from "@chakra-ui/icons"
import Toolbar from "../../Toolbar"
import Status from "../../TableComponent/Status"
import TableLoading from "../../TableLoading"
import { AreaDataTypes } from "../../../data-hooks/areas/types"
import NextLink from "next/link"
import ConfirmDialog from "../../ConfirmDialog"

type AreaListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setData: (data: any[]) => void
  search?: string
  pageCount?: number
  data: AreaDataTypes[] | undefined
  isLoading: boolean
  currentPage?: number
  isLoadingDelete: boolean
  onDelete: (values: any) => void
}

const AreaList = ({
  setPage,
  data,
  pageCount,
  setSearch,
  search,
  isLoading,
  currentPage,
  setData,
  isLoadingDelete,
  onDelete,
}: AreaListProps) => {
  const [selected, setSelected] = useState<{
    areaId: string
    areaName: string
  }>({ areaId: "", areaName: "" })
  const { isOpen, onClose, onOpen } = useDisclosure()

  const columns = useMemo(
    () => [
      {
        Header: "พื้นที่",
        accessor: "name",
      },
      {
        Header: "จำนวนจุดจอด",
        accessor: "totalBusStop",
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
      areaName: `${field?.original?.name}`,
      areaId: `${field?.original?.id}`,
    })
    onOpen()
  }

  return (
    <Box>
      <Head>
        <title>จุดจอดรถ</title>
        <meta name="description" content="areas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title="ลบพื้นที่"
        content={`หากยืนยันการลบพื้นที่ ${selected?.areaName} รายการจองในอนาคตทั้งหมดของพนักงานที่ลงจุดจอดในพื้นที่นี้จะถูกยกเลิก`}
        type="error"
        acceptLabel="ยืนยัน"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDelete({
            areaId: selected.areaId,
            from: "list",
            onClose: onClose,
          })
        }}
      />
      <Box>
        <Flex flexDirection="column" p="2">
          <Toolbar title="จุดจอดรถ" setSearch={setSearch} search={search} />
          <Flex justifyContent="flex-start" mb={{ base: "16px", md: "32px" }}>
            <NextLink href={"/admin/areas/create"} passHref>
              <Link _hover={{}} _focus={{}}>
                <Button leftIcon={<AddIcon />} colorScheme="primary" mr={4}>
                  เพิ่มพื้นที่
                </Button>
              </Link>
            </NextLink>
          </Flex>
        </Flex>
        <Box p="2">
          {isLoading || !data ? (
            <TableLoading columnsLength={columns.length + 2} />
          ) : (
            <TableDraggable
              resources="areas"
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
      </Box>
    </Box>
  )
}

export default React.memo(AreaList)
