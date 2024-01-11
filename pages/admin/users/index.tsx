/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable react/no-children-prop */
import { useToast } from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { getList } from "../../../data-hooks/users/getList"
import { useDelete } from "../../../data-hooks/users/delete"
import List from "../../../components/admin/users/List"
import get from "lodash/get"

type SortByType = {
  id: string
  desc: boolean | undefined
}

const UserList = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState<string>("")
  const [sortBy, setSortBy] = useState<SortByType | undefined>(undefined)
  const toast = useToast()
  const onDelete = useDelete()
  const users = getList(page, search, sortBy)
  const toastId1 = "error_users"
  const toastId2 = "error_delete"
  const toastId3 = "success_delete"

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
    if (users.error || users.data?.error) {
      if (!toast.isActive(toastId1) && get(users, "error.status") !== 401) {
        toast({
          id: toastId1,
          title: "User",
          description: users.data?.error?.message
            ? users.data?.error?.message
            : `${get(users, "error.message")}`,
          status: "error",
          duration: 5000,
          isClosable: false,
        })
      }
    }
  }, [users.error, users.data?.error, toast])

  return (
    <List
      data={users.data?.data}
      setPage={setPage}
      pageCount={users.data?.pageCount}
      setSearch={setSearch}
      search={search}
      isLoading={users.isLoading && !users.error}
      setSort={setSortBy}
      sortBy={sortBy}
      currentPage={users.data?.page}
      isLoadingDelete={onDelete.isLoading}
      onDelete={onDelete.mutate}
    />
  )
}

export default UserList
