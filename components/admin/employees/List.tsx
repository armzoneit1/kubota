/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import React, { useMemo, useState } from "react"
import Head from "next/head"
import { Box, Flex, Text, Button } from "@chakra-ui/react"
import Table from "../../Table"
import Toolbar from "../../Toolbar"
import Status from "../../TableComponent/Status"
import TableLoading from "../../TableLoading"
import { UserDataTypes } from "../../../data-hooks/users/types"
import ConfirmDialog from "../../ConfirmDialog"
import { MdRefresh } from "react-icons/md"

type EmployeeListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  search?: string
  pageCount?: number
  data: UserDataTypes[] | undefined
  isLoading: boolean
  sortBy: { id: string; desc: boolean | undefined } | undefined
  currentPage?: number
  onDelete: (values: any) => void
  isLoadingDelete: boolean
  manualFetchApiMyHr: () => void
  manualFetchApiApproval: () => void
  isLoadingManualFetchApiMyHr: boolean
  isLoadingManualFetchApiApproval: boolean
}

const EmployeeList = ({
  setPage,
  data,
  pageCount,
  setSearch,
  search,
  isLoading,
  setSort,
  sortBy,
  currentPage,
  onDelete,
  isLoadingDelete,
  isLoadingManualFetchApiApproval,
  isLoadingManualFetchApiMyHr,
  manualFetchApiApproval,
  manualFetchApiMyHr,
}: EmployeeListProps) => {
  const [selected, setSelected] = useState<{
    employeeNo: string
    name: string
  }>({ employeeNo: "", name: "" })
  const [isOpen, setOpen] = useState<boolean>(false)

  const onOpen = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const columns = useMemo(
    () => [
      {
        Header: "รหัสพนักงาน",
        accessor: "employeeNo",
      },
      {
        Header: "ชื่อ-นามสกุล",
        accessor: "firstName",
        Cell: ({ value, row }: any) => (
          <Flex flexDirection="column">
            <Text>{row.original.name}</Text>
            <Text fontSize="14px" fontWeight={400} color="gray.500">
              {row.original.email}
            </Text>
          </Flex>
        ),
      },

      {
        Header: "ส่วนงาน",
        accessor: "positionName",
        Cell: ({ value }: any) => (
          <Text textTransform="capitalize">{value}</Text>
        ),
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
      employeeNo: `${field?.original?.employeeNo}`,
      name: `${field?.original?.firstName} ${field?.original?.lastName}`,
    })
    onOpen()
  }

  return (
    <Box>
      <Head>
        <title>พนักงาน</title>
        <meta name="description" content="employee" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title="ลบบัญชีผู้ใช้"
        content={`คุณต้องการลบบัญชีผู้ใช้ของ ${selected.name} ใช่หรือไม่ ?`}
        type="error"
        acceptLabel="ลบ"
        isOpen={isOpen}
        onClose={onClose}
        isLoading={isLoadingDelete}
        onSubmit={() => {
          onDelete({ employeeNo: selected.employeeNo, from: "list" })
          setTimeout(() => {
            onClose()
          }, 500)
        }}
      />
      <Box>
        <Flex flexDirection="column" p="2">
          <Toolbar title="พนักงาน" setSearch={setSearch} search={search} />
        </Flex>
        <Flex justifyContent="flex-end" style={{ gap: "20px" }} mb={6}>
          <Button
            variant="outline"
            leftIcon={<MdRefresh fontSize="20px" />}
            isLoading={isLoadingManualFetchApiMyHr}
            onClick={manualFetchApiMyHr}
          >
            ข้อมูลพนักงาน
          </Button>
          <Button
            variant="outline"
            leftIcon={<MdRefresh fontSize="20px" />}
            isLoading={isLoadingManualFetchApiApproval}
            onClick={manualFetchApiApproval}
          >
            ข้อมูลผู้ดูเเล
          </Button>
        </Flex>
        <Box p="2">
          {isLoading || !data ? (
            <TableLoading columnsLength={columns.length + 1} />
          ) : (
            <Table
              resources="employees"
              data={data ? data : []}
              columns={columns}
              hasDelete={true}
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

export default React.memo(EmployeeList)
