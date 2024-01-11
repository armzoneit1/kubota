// export default ReportTable
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
} from "@chakra-ui/react"
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons"

import styles from "../../layout/layout.module.css"

type ReportTableProps = {
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
  totalPassenger?: number
  totalVehicles?: number
}

const ReportTable = ({
  columns,
  data,
  resources,
  setPage,
  setSort,
  pageCount: controlledPageCount,
  sortBy: controlledSortBy,
  pageSize: controlledPageSize = 30,
  currentPage,
  totalPassenger,
  totalVehicles,
}: ReportTableProps) => {
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
      defaultColumn,
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
    if (setPage) setPage(pageIndex + 1)
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
        overflowX="auto"
        position="relative"
        className={styles.scroll}
      >
        <Table variant="unstyled" size="md" {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <Tr {...headerGroup.getHeaderGroupProps([{ key: index }])}>
                {headerGroup.headers.map((column) => {
                  return (
                    <Th
                      color="#00A5A8"
                      fontSize="16px"
                      fontWeight={700}
                      textTransform="none"
                      borderBottom="1px solid #00A5A8"
                      paddingLeft="0"
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      minWidth={column.minWidth}
                      maxWidth={column.maxWidth}
                      width={column.width}
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
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()} maxHeight="250px" overflow="auto">
            {page && page.length > 0 ? (
              page.map((row: any, i) => {
                prepareRow(row)
                return (
                  <Tr
                    {...row.getRowProps()}
                    borderBottom={
                      resources === "summaryTotalPassenger" ||
                      resources === "summaryTotalVehicle"
                        ? row.original?.isShowBorderBottom
                          ? "1px solid rgba(51, 51, 51,0.6)!important"
                          : "0.2px solid rgba(51, 51, 51,0.2)!important"
                        : "1px solid rgba(51, 51, 51,0.6)!important"
                    }
                  >
                    {row.cells.map((cell: any) => {
                      return (
                        <Td
                          paddingLeft="0"
                          paddingTop="32px"
                          paddingBottom="28px"
                          borderBottom="none"
                          borderTop="none"
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </Td>
                      )
                    })}
                  </Tr>
                )
              })
            ) : (
              <Td colSpan={columns.length} minWidth="100%" align="center">
                <Center height="250px">
                  <Text color="#33333399" fontStyle="italic" fontWeight={400}>
                    ยังไม่พบข้อมูล
                  </Text>
                </Center>
              </Td>
            )}
          </Tbody>
          {(resources === "summaryTotalPassenger" ||
            resources === "summaryTotalVehicle") &&
            page.length > 0 && (
              <Tfoot>
                <Tr>
                  <Td
                    colSpan={columns.length - 1}
                    border="none"
                    textAlign="center"
                    color="#00A5A8"
                    paddingLeft="0"
                  >
                    รวม
                  </Td>
                  <Td border="none" paddingLeft="0" color="#00A5A8">
                    {resources === "summaryTotalPassenger"
                      ? totalPassenger
                      : totalVehicles}
                  </Td>
                </Tr>
              </Tfoot>
            )}
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

export default ReportTable
