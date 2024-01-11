/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
import React, { useEffect, RefObject } from "react"
import {
  useTable,
  usePagination,
  useRowSelect,
  Column,
  useSortBy,
} from "react-table"
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
  Checkbox,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  Center,
  Portal,
} from "@chakra-ui/react"
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons"
import NextLink from "next/link"
import { MdEdit, MdMoreVert } from "react-icons/md"
import styles from "./layout/layout.module.css"

const DeleteButton = ({ row, onDelete, total }: any) => {
  return (
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
  )
}

const EditButton = ({
  resources,
  id,
}: {
  resources: string | null
  id: number | null
}) => {
  return (
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
  )
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }: any, ref: any) => {
    const { checked, borderColor } = rest
    const defaultRef = React.useRef<RefObject<HTMLInputElement>>(null)
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <Checkbox
          isChecked={checked}
          isIndeterminate={indeterminate}
          ref={resolvedRef}
          {...rest}
        />
      </>
    )
  }
)

type TableComponentProps = {
  columns: Column[]
  data: any[]
  resources: string
  hasEdit?: boolean
  hasDelete?: boolean
  hasCheckbox?: boolean
  editButton?: React.ReactElement
  deleteButton?: React.ReactElement
  setSelected?: (selected: any[]) => void
  onDelete?: (field: any) => void
  setPage?: React.Dispatch<React.SetStateAction<number>>
  setSort?: React.Dispatch<
    React.SetStateAction<{ id: string; desc: boolean | undefined } | undefined>
  >
  pageCount?: number
  currentPage?: number
  sortBy?: { id: string; desc: boolean | undefined }
}

const TableComponent = ({
  columns,
  data,
  resources,
  hasEdit = true,
  hasDelete = true,
  hasCheckbox = false,
  editButton = <EditButton resources={null} id={null} />,
  deleteButton = <DeleteButton row={null} onDelete={null} />,
  setSelected,
  onDelete,
  setPage,
  setSort,
  pageCount: controlledPageCount,
  sortBy: controlledSortBy,
  currentPage,
}: TableComponentProps) => {
  const [controlledPageIndex, setControlledPage] = React.useState(0)

  useEffect(() => {
    setControlledPage(
      currentPage !== undefined && currentPage - 1 >= 0 ? currentPage - 1 : 0
    )
  }, [currentPage])
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
      initialState: {
        pageSize: 30,
        sortBy: controlledSortBy ? [controlledSortBy] : [],
      },
      defaultColumn: { minWidth: 150, maxWidth: 250 },
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
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) =>
        hasCheckbox
          ? [
              {
                id: "selection",
                minWidth: 70,
                maxWidth: 100,
                Header: ({ getToggleAllPageRowsSelectedProps }) => (
                  <div>
                    <IndeterminateCheckbox
                      borderColor="#ffffff"
                      {...getToggleAllPageRowsSelectedProps()}
                    />
                  </div>
                ),

                Cell: ({ row }: any) => {
                  return (
                    <div>
                      {resources.includes("schedules/") ? (
                        row.original?.isShowCheckbox ? (
                          <IndeterminateCheckbox
                            borderColor="#333333"
                            {...row.getToggleRowSelectedProps()}
                          />
                        ) : null
                      ) : (
                        <IndeterminateCheckbox
                          borderColor="#333333"
                          {...row.getToggleRowSelectedProps()}
                        />
                      )}
                    </div>
                  )
                },
              },
              ...columns,
            ]
          : [...columns]
      )
    }
  )

  useEffect(() => {
    if (hasCheckbox && setSelected) {
      if (resources.match("schedules/")) {
        const selected = selectedFlatRows
          .map((d) => d.original)
          .filter((value: any) => value?.isShowCheckbox)
        setSelected(selected)
      } else {
        const selected = selectedFlatRows.map((d) => d.original)
        setSelected(selected)
      }
    }
  }, [selectedFlatRows])

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

  // if (page.length === 0) return null

  return (
    <Box
      border="1px solid #00A5A8"
      borderTopLeftRadius="10px"
      borderTopRightRadius="10px"
      borderBottomLeftRadius="10px"
      borderBottomRightRadius="10px"
      overflowX="auto"
      className={styles.scroll}
      position="relative"
    >
      <Table variant="simple" size="md" bgColor="#ffffff" {...getTableProps()}>
        {page && page.length > 0 && (
          <Thead border="none">
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps([{ key: index }])}>
                {headerGroup.headers.map((column) => {
                  return (
                    <Th
                      bgColor="#00A5A8"
                      color="#FFFFFF"
                      fontSize="16px"
                      fontWeight={700}
                      textTransform="none"
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      minWidth={column.minWidth}
                      maxWidth={column.maxWidth}
                    >
                      <Flex alignItems="center">
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
                                fill="#FAFAFA"
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
                                fill="#FAFAFA"
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
                    bgColor="#00A5A8"
                    color="#FFFFFF"
                    maxWidth={150}
                    minWidth={100}
                  ></Th>
                )}
              </Tr>
            ))}
          </Thead>
        )}
        <Tbody {...getTableBodyProps()}>
          {page && page.length > 0 ? (
            page.map((row: any, i) => {
              prepareRow(row)
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell: any) => {
                    return (
                      <Td
                        borderBottomWidth={
                          i === page.length - 1 && controlledPageCount === 1
                            ? "0px"
                            : "1px"
                        }
                        borderBottomColor="#B2CCCC"
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
                      borderBottomColor="#B2CCCC"
                    >
                      <Flex justifyContent="flex-end">
                        {hasEdit &&
                          React.cloneElement(editButton, {
                            resources: resources,
                            id:
                              resources === "users" || resources === "employees"
                                ? row.original.employeeNo
                                : row.original.id,
                          })}
                        {hasDelete &&
                          React.cloneElement(deleteButton, {
                            row: row,
                            onDelete: onDelete,
                            total: page.length,
                          })}
                      </Flex>
                    </Td>
                  )}
                </Tr>
              )
            })
          ) : (
            <Td
              colspan={columns.length}
              minWidth="100%"
              align="center"
              borderBottomWidth="0px"
            >
              <Center height="250px">
                <Text color="#33333399" fontStyle="italic" fontWeight={400}>
                  ยังไม่พบข้อมูล
                </Text>
              </Center>
            </Td>
          )}
        </Tbody>
        {pageOptions.length > 1 && (
          <Tfoot>
            <Tr>
              <Td colSpan={columns.length + 1} border="none" py={0}>
                <Flex justifyContent="flex-end" m={4} alignItems="center">
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
                      mr={5}
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
                    <Text flexShrink={0} mr={2}>
                      of{" "}
                      <Text fontWeight="bold" as="span">
                        {pageOptions.length}
                      </Text>
                    </Text>
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
                </Flex>
              </Td>
            </Tr>
          </Tfoot>
        )}
      </Table>
    </Box>
  )
}

export default React.memo(TableComponent)
