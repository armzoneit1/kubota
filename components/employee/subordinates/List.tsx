/* eslint-disable react/display-name */
import {
  Container,
  Box,
  Text,
  Button,
  Flex,
  IconButton,
  Link,
  Center,
  useBreakpointValue,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import { useState, useMemo } from "react"
import Head from "next/head"
import { MdEdit, MdMoreVert } from "react-icons/md"
import NextLink from "next/link"
import Table from "../Table"
import Status from "../../TableComponent/Status"
import { SubordinateDataTypes } from "../../../data-hooks/subordinates/types"
import ConfirmDialog from "../../ConfirmDialog"

const EditButton = ({
  resources,
  id,
  data,
}: {
  resources: string | null
  id: number | null
  data: any | null
}) => {
  return data?.isRegisterToBookingBusSystem ? (
    <NextLink
      href={`/employee/subordinates/${data?.employeeNo}/registration/update`}
      passHref
    >
      <Link _focus={{}} _hover={{}}>
        <IconButton
          variant="unstyled"
          color="#00A5A8"
          aria-label="edit"
          fontSize="24px"
          icon={<MdEdit />}
          _focus={{ boxShadow: "none" }}
        />
      </Link>
    </NextLink>
  ) : (
    <NextLink
      href={`/employee/subordinates/${data?.employeeNo}/registration/register`}
      passHref
    >
      <Link _focus={{}} _hover={{}}>
        <IconButton
          variant="unstyled"
          color="#00A5A8"
          aria-label="view"
          fontSize="24px"
          icon={
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 2C4.89 2 4 2.89 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H10V20.09L12.09 18H6V16H14.09L16.09 14H6V12H18.09L20 10.09V8L14 2H6ZM13 3.5L18.5 9H13V3.5ZM20.15 13C20.076 12.9984 20.0024 13.0117 19.9337 13.0392C19.8649 13.0667 19.8025 13.1078 19.75 13.16L18.73 14.18L20.82 16.26L21.84 15.25C22.05 15.03 22.05 14.67 21.84 14.46L20.54 13.16C20.4889 13.1087 20.4281 13.0682 20.3611 13.0407C20.2942 13.0132 20.2224 12.9994 20.15 13ZM18.14 14.77L12 20.92V23H14.08L20.23 16.85L18.14 14.77Z"
                fill="#00A5A8"
              />
            </svg>
          }
          _focus={{ boxShadow: "none" }}
        />
      </Link>
    </NextLink>
  )
}

const DeleteButton = ({ row, onDelete }: any) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<MdMoreVert />}
        variant="ghost"
        fontSize="24px"
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
          isDisabled={row?.original?.subordinateChannel !== "manual"}
        >
          ลบข้อมูล
        </MenuItem>
      </MenuList>
      {/* </Portal> */}
    </Menu>
  )
}

type SubordinateListProps = {
  data: SubordinateDataTypes[]
  isLoading: boolean
  onDeleteSubordinate: (values: any) => void
  isLoadingDelete: boolean
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  sortBy: { id: string; desc: boolean | undefined } | undefined
}

const SubordinateList = ({
  data,
  isLoading,
  onDeleteSubordinate,
  isLoadingDelete,
  setSort,
  sortBy,
}: SubordinateListProps) => {
  const [isOpenConfirmDelete, setOpenConfirmDelete] = useState<boolean>(false)
  const [selected, setSelected] = useState<{
    employeeNo: string
    name: string
  }>({ employeeNo: "", name: "" })
  const jobNameMinWidth = useBreakpointValue({ base: 200, xl: 350 })
  const employeeNameWidth = useBreakpointValue({ base: 185, xl: 250 })

  const onOpen = () => {
    setOpenConfirmDelete(true)
  }

  const onClose = () => {
    setOpenConfirmDelete(false)
  }

  const handleDelete = (field: any) => {
    setSelected({
      employeeNo: `${field?.original?.employeeNo}`,
      name: `${field?.original?.title}${field?.original?.firstName} ${field?.original?.lastName}`,
    })
    onOpen()
  }

  const columns = useMemo(
    () => [
      {
        Header: "รหัสพนักงาน",
        accessor: "employeeNo",
        minWidth: { base: 140, lg: "unset" },
        width: "15%",
      },
      {
        Header: "ชื่อพนักงาน",
        accessor: "firstName",
        minWidth: { base: 180, lg: "unset" },
        disableSortBy: true,
        Cell: ({ row }: any) =>
          `${row?.original?.title}${row?.original?.firstName} ${row?.original?.lastName}`,
        width: "20%",
      },
      {
        Header: "หน่วยงาน/ส่วน",
        accessor: "jobName",
        disableSortBy: true,
        minWidth: { base: 180, lg: "unset" },
        width: "18%",
        Cell: ({ row }: { row: any }) =>
          `${row?.original?.jobName ?? "-"} / ${
            row?.original?.positionName ?? "-"
          }`,
      },
      {
        Header: "เบอร์ภายใน",
        accessor: "phoneNo",
        disableSortBy: true,
        minWidth: { base: 175, lg: "unset" },
        width: "10%",
      },
      {
        Header: "ที่มา",
        accessor: "subordinateChannel",
        disableSortBy: true,
        minWidth: { base: 120, lg: "unset" },
        width: "10%",
        Cell: ({ value }: any) => (
          <Text textTransform="capitalize">{value}</Text>
        ),
      },
      {
        Header: "Defaultจองรถ",
        accessor:
          "registerBookingBusInfo.isDisplayDefaultForSubordinateBooking",
        disableSortBy: true,
        minWidth: { base: 130, lg: "unset" },
        width: "15%",
        Cell: ({ row }: any) =>
          row?.original?.registerBookingBusInfo != null
            ? row?.original?.registerBookingBusInfo
                ?.isDisplayDefaultForSubordinateBooking
              ? "Default"
              : "No"
            : "Default",
      },
      {
        Header: "สถานะการจอง",
        accessor: "status",
        disableSortBy: true,
        minWidth: { base: 125, lg: "unset" },
        width: "12%",
        Cell: ({ value, row }: any) => (
          <Status
            value={
              row.original?.registerBookingBusInfo?.status
                ? row.original?.registerBookingBusInfo?.status
                : value
            }
          />
        ),
      },
    ],
    []
  )

  return (
    <>
      <Head>
        <title>พนักงานในความดูแล</title>
        <meta name="description" content="subordinates" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfirmDialog
        title="ลบออกจากความดูแล"
        content={`ยืนยันที่จะลบ ${selected.name} ออกจากความดูแล`}
        onSubmit={() => {
          onDeleteSubordinate({
            subordinateEmployeeNos: [selected.employeeNo],
            from: "list",
          })
          onClose()
        }}
        isLoading={isLoadingDelete}
        isOpen={isOpenConfirmDelete}
        onClose={onClose}
        type="error"
      />
      <Container
        minW="100%"
        minHeight="100%"
        paddingInlineStart={{ base: 2, md: 0 }}
        paddingInlineEnd={{ base: 2, md: 0 }}
      >
        <Flex w="100%" justifyContent="space-between" mb={10}>
          <Text fontSize="32px" fontWeight={600}>
            พนักงานในความดูแล
          </Text>
          <NextLink href="/employee/subordinates/create" passHref>
            <Link _focus={{}} _hover={{}}>
              <Button _focus={{ boxShadow: "none" }}>เพิ่มพนักงาน</Button>
            </Link>
          </NextLink>
        </Flex>
        <Box mt={10}>
          {isLoading ? (
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
          ) : (
            <Table
              resources="subordinates"
              columns={columns}
              data={data}
              pageSize={0}
              editButton={<EditButton resources={null} id={null} data={null} />}
              deleteButton={<DeleteButton row={null} onDelete={null} />}
              nullText="คุณยังไม่มีพนักงานในความดูแล"
              hasDelete
              onDelete={handleDelete}
              sortBy={sortBy}
              setSort={setSort}
            />
          )}
        </Box>
      </Container>
    </>
  )
}

export default SubordinateList
