// export default Table
/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
import React, { useEffect } from "react"
import { useTable, usePagination, Column, useSortBy } from "react-table"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tfoot,
  Flex,
  IconButton,
  Text,
  Tooltip,
  NumberInput,
  NumberInputField,
  Box,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  Portal,
} from "@chakra-ui/react"
import { ChevronRightIcon, ChevronLeftIcon, DeleteIcon } from "@chakra-ui/icons"
import styles from "../layout/layout.module.css"
import NextLink from "next/link"
import { MdEdit, MdMoreVert } from "react-icons/md"

const EditButton = ({
  resources,
  id,
  data,
}: {
  resources: string | null
  id: number | null
  data: any | null
}) => {
  return (
    <NextLink href={`/employee/${resources}/${id}`} passHref>
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
        >
          ลบข้อมูล
        </MenuItem>
      </MenuList>
      {/* </Portal> */}
    </Menu>
  )
}

type TableUserComponentProps = {
  columns: any[]
  data: any[]
  resources?: string
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  pageCount?: number
  currentPage?: number
  sortBy?: { id: string; desc: boolean | undefined }
  pageSize?: number
  hasEdit?: boolean
  hasDelete?: boolean
  hasCheckbox?: boolean
  editButton?: React.ReactElement
  onDelete?: (field: any) => void
  nullText?: string
  deleteButton?: React.ReactElement
  paddingEditAndDelete?: string
}

const TableUserComponent = ({
  columns,
  data,
  resources,
  setPage,
  setSort,
  pageCount: controlledPageCount,
  sortBy: controlledSortBy,
  pageSize: controlledPageSize = 30,
  currentPage,
  hasEdit = true,
  hasDelete = false,
  hasCheckbox = false,
  onDelete,
  editButton = <EditButton resources={null} id={null} data={null} />,
  nullText,
  deleteButton = <DeleteButton row={null} onDelete={null} />,
  paddingEditAndDelete = "16px 24px",
}: TableUserComponentProps) => {
  const [controlledPageIndex, setControlledPage] = React.useState(0)

  useEffect(() => {
    setControlledPage(
      currentPage !== undefined && currentPage - 1 >= 0 ? currentPage - 1 : 0
    )
  }, [currentPage])
  const defaultColumn = React.useMemo(
    () => ({
      width: 200,
      minWidth: 150,
      maxWidth: 250,
    }),
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    state: { pageIndex, pageSize, selectedRowIds, sortBy },
  } = useTable(
    {
      columns,
      data,
      defaultColumn: { minWidth: 150, maxWidth: 250 },
      initialState: {
        pageSize: controlledPageSize,
        sortBy: controlledSortBy ? [controlledSortBy] : [],
      },
      manualPagination: true,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      pageCount: controlledPageCount,
      useControlledState: (state) => {
        return React.useMemo(
          () => ({
            ...state,
            pageIndex: controlledPageIndex,
          }),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [state, controlledPageIndex]
        )
      },
    },
    useSortBy,
    usePagination
  )

  useEffect(() => {
    if (setPage) {
      setPage(pageIndex + 1)
    }
  }, [pageIndex, setPage])

  useEffect(() => {
    if (setSort) {
      setSort(
        sortBy.length > 0
          ? { id: sortBy[0].id, desc: sortBy[0].desc }
          : undefined
      )
    }
  }, [sortBy, setSort])

  return (
    <>
      <Box
        bgColor="#F5F5F5"
        p={8}
        borderRadius="8px"
        overflowX={{ base: "auto", lg: "unset" }}
        position="relative"
        className={styles.scroll}
      >
        <Table variant="unstyled" size="md" {...getTableProps()}>
          {page && page.length > 0 && (
            <Thead>
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps([{ key: index }])}>
                  {headerGroup.headers.map((column: any) => {
                    return (
                      <Th
                        fontSize="16px"
                        fontWeight={400}
                        textTransform="none"
                        borderBottom="2px solid #333333"
                        paddingLeft="0"
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                        width={column.width}
                        minWidth={column.minWidth}
                        maxWidth={column.maxWidth}
                        paddingRight="18px"
                      >
                        <Flex alignItems="center" wordBreak="break-all">
                          {column.render("Header")}

                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8 16H4L10 22V2H8V16ZM14 5V22H16V8H20L14 2V5Z"
                                  fill="#00A5A8"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8 16H4L10 22V2H8V16ZM14 5V22H16V8H20L14 2V5Z"
                                  fill="#00A5A8"
                                />
                              </svg>
                            )
                          ) : (
                            ""
                          )}
                        </Flex>
                      </Th>
                    )
                  })}
                  {(hasEdit || hasDelete) && (
                    <Th
                      fontSize="16px"
                      fontWeight={700}
                      textTransform="none"
                      borderBottom="2px solid #333333"
                      paddingLeft="0"
                      maxWidth={"120px"}
                      minWidth={hasEdit && hasDelete ? "100px" : "60px"}
                      paddingRight="18px"
                    ></Th>
                  )}
                </Tr>
              ))}
            </Thead>
          )}
          <Tbody {...getTableBodyProps()} maxHeight="250px" overflow="auto">
            {page && page.length > 0 ? (
              page.map((row: any, i) => {
                prepareRow(row)
                return (
                  <Tr
                    {...row.getRowProps()}
                    borderBottom={"1px solid rgba(51, 51, 51,0.6)"}
                  >
                    {row.cells.map((cell: any) => {
                      return (
                        <Td
                          paddingLeft="0"
                          paddingTop="32px"
                          paddingBottom="28px"
                          borderBottom="none"
                          borderTop="none"
                          paddingRight="18px"
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </Td>
                      )
                    })}
                    {(hasEdit || hasDelete) && (
                      <Td
                        borderBottomWidth={
                          i === page.length - 1 && controlledPageCount === 1
                            ? "0px"
                            : "1px"
                        }
                        textAlign="right"
                        borderBottomColor={"rgba(51, 51, 51,0.6)"}
                        padding={paddingEditAndDelete}
                      >
                        <Flex justifyContent="flex-end">
                          {hasEdit &&
                            React.cloneElement(editButton, {
                              resources: resources,
                              id: row.original.id,
                              data: row.original,
                            })}
                          {hasDelete &&
                            React.cloneElement(deleteButton, {
                              row: row,
                              onDelete: onDelete,
                            })}
                        </Flex>
                      </Td>
                    )}
                  </Tr>
                )
              })
            ) : (
              <Td colSpan={columns.length} minWidth="100%" align="center">
                <Center height="250px">
                  <Text color="#33333399" fontStyle="italic" fontWeight={400}>
                    {nullText ? nullText : "ยังไม่พบข้อมูล"}
                  </Text>
                </Center>
              </Td>
            )}
          </Tbody>
        </Table>
      </Box>
      {pageOptions.length > 1 && (
        <Flex justifyContent="flex-end" my={4} alignItems="center">
          <Text flexShrink={0} mr={2}>
            Page{" "}
          </Text>
          <Flex>
            <Tooltip label="Previous Page">
              <IconButton
                aria-label="previousPage"
                onClick={() => {
                  setControlledPage((prevState) => prevState - 1)
                }}
                isDisabled={!canPreviousPage}
                icon={<ChevronLeftIcon h={6} w={6} />}
                variant="unstyled"
                _focus={{ boxShadow: "none" }}
              />
            </Tooltip>
          </Flex>
          <Flex alignItems="center">
            <NumberInput
              ml={2}
              minW={14}
              maxW={18}
              min={1}
              max={pageOptions.length}
              onChange={(value: any) => {
                const page = value ? value - 1 : 0
                setControlledPage(page)
              }}
              value={pageIndex + 1}
              borderColor="primary.500"
            >
              <NumberInputField
                padding={0}
                textAlign="center"
                _focus={{
                  borderColor: "#B2CCCC",
                  boxShadow: "0 0 0 1px #00A5A8",
                }}
              />
            </NumberInput>
          </Flex>
          <Flex>
            <Tooltip label="Next Page">
              <IconButton
                aria-label="nextPage"
                onClick={() => {
                  setControlledPage((prevState) => prevState + 1)
                }}
                isDisabled={!canNextPage}
                icon={<ChevronRightIcon h={6} w={6} />}
                variant="unstyled"
                _focus={{ boxShadow: "none" }}
              />
            </Tooltip>
          </Flex>
          <Text flexShrink={0} mr={2}>
            of{" "}
            <Text fontWeight="bold" as="span">
              {pageOptions.length}
            </Text>
          </Text>
        </Flex>
      )}
    </>
  )
}

export default TableUserComponent
