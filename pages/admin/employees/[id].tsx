import { useEffect } from "react"
import { Flex, Center, Spinner, useToast } from "@chakra-ui/react"
import { getOne } from "../../../data-hooks/employees/getOne"
import { useRouter } from "next/router"
import Edit from "../../../components/admin/employees/Edit"
import { useUpdate } from "../../../data-hooks/employees/update"
import { getEmpList } from "../../../data-hooks/employees/getEmpList"
import { getSubordinateList } from "../../../data-hooks/employees/getSubordinateList"
import { useAddSubordinate } from "../../../data-hooks/employees/addSubordinate"
import { useDeleteSubordinate } from "../../../data-hooks/employees/deleteSubordinate"
import { useDelete } from "../../../data-hooks/employees/delete"
import { useDeleteSupervisor } from "../../../data-hooks/employees/deleteSupervisor"
import get from "lodash/get"

const EmployeeEdit = () => {
  const router = useRouter()
  const id = router?.query?.id
  const employee = getOne(id)
  const toast = useToast()
  const update = useUpdate()
  const employeeList = getEmpList()
  const subordinateList = getSubordinateList(id)
  const addSubordinate = useAddSubordinate()
  const deleteSubordinate = useDeleteSubordinate()
  const deleteSupervisor = useDeleteSupervisor()
  const onDelete = useDelete()
  const toastId1 = "error"
  const toastId2 = "error_update"
  const toastId3 = "success_update"
  const toastId4 = "error_myHrEmployee"
  const toastId5 = "error_subordinateList"
  const toastId6 = "success_addSubordinate"
  const toastId7 = "error_addSubordinate"
  const toastId8 = "success_deleteSubordinate"
  const toastId9 = "error_deleteSubordinate"
  const toastId10 = "success_deleteSubordinate"
  const toastId11 = "error_deleteSubordinate"
  const toastId12 = "success_deleteSupervisor"
  const toastId13 = "error_deleteSupervisor"

  useEffect(() => {
    if (deleteSubordinate.isSuccess) {
      if (!toast.isActive(toastId8)) {
        toast({
          id: toastId8,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [deleteSubordinate.isSuccess, toast])

  useEffect(() => {
    if (deleteSubordinate.isError) {
      if (
        !toast.isActive(toastId9) &&
        get(deleteSubordinate, "error.status") !== 401
      ) {
        toast({
          id: toastId9,
          description: `${get(deleteSubordinate, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [deleteSubordinate.isError, deleteSubordinate.error, toast])

  useEffect(() => {
    if (deleteSupervisor.isSuccess) {
      if (!toast.isActive(toastId12)) {
        toast({
          id: toastId12,
          description: `ลบสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [deleteSupervisor.isSuccess, toast])

  useEffect(() => {
    if (deleteSupervisor.isError) {
      if (
        !toast.isActive(toastId11) &&
        get(deleteSupervisor, "error.status") !== 401
      ) {
        toast({
          id: toastId11,
          description: `${get(deleteSupervisor, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [deleteSupervisor.isError, deleteSupervisor.error, toast])

  useEffect(() => {
    if (onDelete.isSuccess) {
      if (!toast.isActive(toastId10)) {
        toast({
          id: toastId10,
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
      if (!toast.isActive(toastId11) && get(onDelete, "error.status") !== 401) {
        toast({
          id: toastId11,
          description: `${get(onDelete, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [onDelete.isError, onDelete.error, toast])

  useEffect(() => {
    if (addSubordinate.isSuccess) {
      if (!toast.isActive(toastId6)) {
        toast({
          id: toastId6,
          description: `เพิ่มสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [addSubordinate.isSuccess, toast])

  useEffect(() => {
    if (addSubordinate.isError) {
      if (
        !toast.isActive(toastId7) &&
        get(addSubordinate, "error.status") !== 401
      ) {
        toast({
          id: toastId7,
          description: `${get(addSubordinate, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [addSubordinate.isError, addSubordinate.error, toast])

  useEffect(() => {
    if (update.isSuccess) {
      if (!toast.isActive(toastId3)) {
        toast({
          id: toastId3,
          description: `บันทึกสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isSuccess, toast])

  useEffect(() => {
    if (update.isError) {
      if (!toast.isActive(toastId2) && get(update, "error.status") !== 401) {
        toast({
          id: toastId2,
          description: `${get(update, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [update.isError, update.error, toast])

  useEffect(() => {
    if (employee.error || employee.data?.error) {
      if (!toast.isActive(toastId1) && get(employee, "error.status") !== 401) {
        toast({
          id: toastId1,
          description: employee.data?.error?.message
            ? employee.data?.error?.message
            : `${get(employee, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (employeeList.error || employeeList.data?.error) {
      if (
        !toast.isActive(toastId4) &&
        get(employeeList, "error.status") !== 401
      ) {
        toast({
          id: toastId4,
          title: "EmployeeList",
          description: employeeList.data?.error?.message
            ? employeeList.data?.error?.message
            : `${get(employeeList, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
    if (subordinateList.error || subordinateList.data?.error) {
      if (
        !toast.isActive(toastId5) &&
        get(subordinateList, "error.status") !== 401
      ) {
        toast({
          id: toastId5,
          title: "SubordinateList",
          description: subordinateList.data?.error?.message
            ? subordinateList.data?.error?.message
            : `${get(subordinateList, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [
    employee.error,
    employee.data?.error,
    employeeList.error,
    employeeList?.data?.error,
    subordinateList.error,
    subordinateList?.data?.error,
    toast,
  ])

  if (
    (employee.isLoading ||
      employee.isFetching ||
      employeeList.isLoading ||
      employeeList.isFetching ||
      subordinateList.isLoading) &&
    !employee.error &&
    !employeeList.error &&
    !subordinateList.error
  )
    return (
      <Flex
        alignItems="center"
        width="100%"
        height="100vh"
        justifyContent="center"
      >
        <Center>
          <Spinner size="xl" color="primary.500" />
        </Center>
      </Flex>
    )

  return (
    <Edit
      data={employee.data?.data}
      onSubmit={update.mutate}
      isLoading={update.isLoading}
      employeeList={employeeList?.data?.data}
      subordinateList={subordinateList?.data?.data}
      onAdd={addSubordinate.mutate}
      isLoadingAdd={addSubordinate.isLoading}
      onDeleteSubordinate={deleteSubordinate.mutate}
      isLoadingDeleteSubordinate={deleteSubordinate.isLoading}
      isFetchingSubordinateList={subordinateList.isFetching}
      isLoadingDelete={onDelete.isLoading}
      onDelete={onDelete.mutate}
      onDeleteSupervisor={deleteSupervisor.mutate}
      isLoadingDeleteSupervisor={deleteSupervisor.isLoading}
    />
  )
}

export default EmployeeEdit
