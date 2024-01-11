import { useEffect } from "react"
import { useToast } from "@chakra-ui/react"
import Create from "../../../components/admin/users/Create"
import { useCreate } from "../../../data-hooks/users/create"
import { getEmpList } from "../../../data-hooks/users/getEmployeeList"
import get from "lodash/get"

const UserCreate = () => {
  const toast = useToast()
  const create = useCreate()
  const empList = getEmpList()
  const toastId1 = "error_create"
  const toastId2 = "success_create"
  const toastId3 = "errors_emp"

  useEffect(() => {
    if (empList.error || empList.data?.error) {
      if (!toast.isActive(toastId3) && get(empList, "error.status") !== 401) {
        toast({
          id: toastId3,
          title: "Employee List",
          description: empList.data?.error?.message
            ? empList.data?.error?.message
            : `${get(empList, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [empList.error, empList.data?.error, toast])

  useEffect(() => {
    if (create.isSuccess) {
      if (!toast.isActive(toastId2)) {
        toast({
          id: toastId2,
          description: `เพิ่มสำเร็จ`,
          status: "success",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isSuccess, toast])

  useEffect(() => {
    if (create.isError) {
      if (!toast.isActive(toastId1) && get(create, "error.status") !== 401) {
        toast({
          id: toastId1,
          description: `${get(create, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [create.isError, create.error, toast])

  return (
    <Create
      onSubmit={create.mutate}
      isLoading={create.isLoading}
      employeeList={empList?.data?.data}
    />
  )
}

export default UserCreate
