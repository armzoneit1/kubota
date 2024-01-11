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
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Portal,
} from "@chakra-ui/react"
import Table from "../../Table"
import { AddIcon } from "@chakra-ui/icons"
import Toolbar from "../../Toolbar"
import Status from "../../TableComponent/Status"
import TableLoading from "../../TableLoading"
import { UserDataTypes } from "../../../data-hooks/users/types"
import NextLink from "next/link"
import ConfirmDialog from "../../ConfirmDialog"
import { MdMoreVert, MdEdit } from "react-icons/md"
import { useAccountMe } from "../../../providers/account-me-provider"
import lowerCase from "lodash/lowerCase"

type UserListProps = {
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSearch?: React.Dispatch<React.SetStateAction<string>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  search?: string
  pageCount?: number
  data: UserDataTypes[] | undefined
  isLoading: boolean
  isLoadingDelete: boolean
  sortBy: { id: string; desc: boolean | undefined } | undefined
  currentPage?: number
  onDelete: (values: any) => void
}

const EditButton = ({
  resources,
  id,
}: {
  resources: string | null
  id: number | null
}) => {
  const accountMe = useAccountMe()

  return (
    <>
      {`${id}` != accountMe?.myHrEmployee?.employeeNo &&
        lowerCase(accountMe?.planningBusUser?.role) === "admin" && (
          <NextLink href={`/admin/${resources}/${id}`} passHref>
            <Link _hover={{}} _focus={{}}>
              <IconButton
                variant="unstyled"
                color="#00A5A8"
                aria-label="edit"
                fontSize="20px"
                icon={<MdEdit />}
                _focus={{ boxShadow: "none" }}
              />
            </Link>
          </NextLink>
        )}
    </>
  )
}

const DeleteButton = ({ row, onDelete, total }: any) => {
  const accountMe = useAccountMe()
  return (
    <>
      {row?.original?.employeeNo != accountMe?.myHrEmployee?.employeeNo &&
        lowerCase(accountMe?.planningBusUser?.role) === "admin" && (
          <Menu placement={total === 1 ? "top" : "bottom"}>
            <MenuButton
              as={IconButton}
              icon={<MdMoreVert />}
              variant="ghost"
              fontSize="20px"
              color="#333333"
              _focus={{ boxShadow: "none" }}
            />
            {/* <Portal> */}
            <MenuList
              borderColor="#B2CCCC"
              borderRadius="6px"
              p="8px"
              minWidth="150px"
            >
              <MenuItem
                _hover={{
                  bgColor: "#D4E3E3",
                  borderRadius: "6px",
                }}
                _active={{ background: "none" }}
                _focus={{ background: "none" }}
                onClick={() => {
                  if (onDelete) onDelete(row)
                }}
              >
                ลบ
              </MenuItem>
            </MenuList>
            {/* </Portal> */}
          </Menu>
        )}
    </>
  )
}

const UserList = ({
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
}: UserListProps) => {
  const accountMe = useAccountMe()
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
        Header: "Role",
        accessor: "role",
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
    <>
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
          onClose()
        }}
      />

      <Box>
        <Head>
          <title>บัญชีผู้ใช้</title>
          <meta name="description" content="users" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Box>
          <Flex flexDirection="column" p="2">
            <Toolbar
              title="บัญชีผู้ใช้"
              setSearch={setSearch}
              search={search}
            />
            {lowerCase(accountMe?.planningBusUser?.role) === "admin" && (
              <Flex
                justifyContent="flex-start"
                mb={{ base: "16px", md: "32px" }}
              >
                <NextLink href={"/admin/users/create"} passHref>
                  <Link _hover={{}} _focus={{}}>
                    <Button
                      leftIcon={<AddIcon />}
                      mr={4}
                      _focus={{ boxShadow: "none" }}
                    >
                      เพิ่มบัญชี
                    </Button>
                  </Link>
                </NextLink>
              </Flex>
            )}
          </Flex>
          <Box p="2">
            {isLoading || !data ? (
              <TableLoading columnsLength={columns.length + 1} />
            ) : (
              <Table
                resources="users"
                data={data ? data : []}
                columns={columns}
                hasDelete={true}
                setPage={setPage}
                setSort={setSort}
                pageCount={pageCount}
                sortBy={sortBy}
                currentPage={currentPage}
                onDelete={handleDelete}
                deleteButton={
                  <DeleteButton row={null} onDelete={null} total={null} />
                }
                editButton={<EditButton resources={null} id={null} />}
              />
            )}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default React.memo(UserList)
