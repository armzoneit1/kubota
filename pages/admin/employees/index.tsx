/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useToast } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { getList } from "../../../data-hooks/employees/getList"
import List from "../../../components/admin/employees/List"
import { useDelete } from "../../../data-hooks/employees/delete"
import get from "lodash/get"
import { useManualFetchApiApproval } from "../../../data-hooks/employees/manualFetchApiApproval"
import { useManualFetchApiMyHr } from "../../../data-hooks/employees/manualFetchApiMyHr"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const EmployeeList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const employees = getList(page, search, sortBy)
  const onDelete = useDelete()
  const manualFetchApiMyHr = useManualFetchApiMyHr()
  const manualFetchApiApproval = useManualFetchApiApproval()
  const toastId1 = "error_employees"
  const toastId2 = "error_delete"
  const toastId3 = "success_delete"
  const toastId4 = "error_manualFetchApiMyHr"
  const toastId5 = "success_manualFetchApiMyHr"
  const toastId6 = "error_manualFetchApiApproval"
  const toastId7 = "success_manualFetchApiApproval"

  useEffect(() => {
    if (onDelete.isSuccess) {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isSuccess, toast])

  useEffect(() => {
    if (onDelete.isError) {
      if (!toast.isActive(toastId3) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId3,
          title: "Delete",
          description: `${get(onDelete, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isError, onDelete.error, toast])

  useEffect(() => {
    if (manualFetchApiMyHr.isSuccess) {
      if (!toast.isActive(toastId4)) {
        toast({
          id: toastId4,
          description: `ดึงข้อมูลพนักงานสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [manualFetchApiMyHr.isSuccess, toast])

  useEffect(() => {
    if (manualFetchApiMyHr.isError) {
      if (
        !toast.isActive(toastId5) &&
        get(manualFetchApiMyHr, "error.status") !== 401
      ) {
        toast({
          id: toastId5,
          title: "Fetch",
          description: `${get(manualFetchApiMyHr, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [manualFetchApiMyHr.isError, manualFetchApiMyHr.error, toast])

  useEffect(() => {
    if (manualFetchApiApproval.isSuccess) {
      if (!toast.isActive(toastId6)) {
        toast({
          id: toastId6,
          description: `ดึงข้อมูลผู้ดูเเลสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [manualFetchApiApproval.isSuccess, toast])

  useEffect(() => {
    if (manualFetchApiApproval.isError) {
      if (
        !toast.isActive(toastId7) &&
        get(manualFetchApiApproval, "error.status") !== 401
      ) {
        toast({
          id: toastId7,
          title: "Fetch",
          description: `${get(manualFetchApiApproval, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [manualFetchApiMyHr.isError, manualFetchApiMyHr.error, toast])

  useEffect(() => {
    if (employees.error || employees.data?.error) {
      if (!toast.isActive(toastId1) && get(employees, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "Employee",
          description: employees.data?.error?.message
            ? employees.data?.error?.message
            : `${get(employees, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [employees.error, employees.data?.error, toast])

  return (
    <List
      data={employees.data?.data}
      setPage={setPage}
      pageCount={employees.data?.pageCount}
      setSearch={setSearch}
      search={search}
      isLoading={employees.isLoading && !employees.error}
      setSort={setSortBy}
      sortBy={sortBy}
      currentPage={employees.data?.page}
      isLoadingDelete={onDelete.isLoading}
      onDelete={onDelete.mutate}
      manualFetchApiMyHr={manualFetchApiMyHr.mutate}
      manualFetchApiApproval={manualFetchApiApproval.mutate}
      isLoadingManualFetchApiMyHr={manualFetchApiMyHr.isLoading}
      isLoadingManualFetchApiApproval={manualFetchApiApproval.isLoading}
    />
  )
}

export default EmployeeList
