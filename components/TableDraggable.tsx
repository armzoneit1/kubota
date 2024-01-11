/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
import React, { useEffect } from "react"
import { useTable, usePagination, Column } from "react-table"
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
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
} from "@chakra-ui/react"
import { ChevronRightIcon, ChevronLeftIcon } from "@chakra-ui/icons"
import NextLink from "next/link"
import { MdEdit, MdMoreVert } from "react-icons/md"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd"
import styles from "./layout/layout.module.css"

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

const DeleteButton = ({ row, onDelete }: any) => {
  return (
    <Menu>
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

const reorder = (list: any, startIndex: any, endIndex: any) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

type TableDraggableProps = {
  columns: Column[]
  data: any[]
  resources: string | string[]
  hasEdit?: boolean
  hasDelete?: boolean
  hasCheckbox?: boolean
  editButton?: React.ReactElement
  deleteButton?: React.ReactElement
  setSelected?: (selected: any[]) => void
  onDelete?: (field: any) => void
  setData: (data: any[]) => void
  setPage?: React.Dispatch<React.SetStateAction<number>>
  pageCount?: number
  currentPage?: number
}

const TableDraggable = ({
  columns,
  data,
  resources,
  hasEdit = true,
  hasDelete = true,
  setData,
  setPage,
  editButton = <EditButton resources={null} id={null} />,
  deleteButton = <DeleteButton row={null} onDelete={null} />,
  pageCount: controlledPageCount,
  onDelete,
}: TableDraggableProps) => {
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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 30 },
      defaultColumn: { minWidth: 150, maxWidth: 250 },
      manualPagination: true,
      autoResetPage: false,
      pageCount: controlledPageCount,
    },
    usePagination
  )

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    if (result.destination.index === result.source.index) {
      return
    }

    const newData = reorder(data, result.source.index, result.destination.index)
    setData(newData)
  }

  useEffect(() => {
    if (setPage) setPage(pageIndex + 1)
  }, [pageIndex, setPage])

  return (
    <>
      <Box
        border="1px solid #00A5A8"
        borderTopLeftRadius="10px"
        borderTopRightRadius="10px"
        borderBottomLeftRadius="10px"
        borderBottomRightRadius="10px"
        overflowY="hidden"
        overflowX="auto"
        className={styles.scroll}
      >
        <Table size="md" bgColor="#ffffff" {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps([{ key: index }])}>
                <Th w="5%" bgColor="#00A5A8" color="#FFFFFF"></Th>
                {headerGroup.headers.map((column) => (
                  <Th
                    bgColor="#00A5A8"
                    color="#FFFFFF"
                    fontSize="16px"
                    fontWeight={700}
                    textTransform="none"
                    {...column.getHeaderProps()}
                  >
                    {column.render("Header")}
                  </Th>
                ))}

                {hasEdit && <Th w="5%" bgColor="#00A5A8" color="#FFFFFF"></Th>}
              </tr>
            ))}
          </Thead>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <Tbody
                  {...getTableBodyProps()}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {page.map((row: any, i) => {
                    prepareRow(row)
                    return (
                      <Draggable draggableId={row.id} key={row.id} index={i}>
                        {(provided, snapshot) => (
                          <Tr
                            {...row.getRowProps()}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            isDragging={snapshot.isDragging}
                          >
                            <Td
                              w="5%"
                              borderBottomWidth={
                                i === page.length - 1 &&
                                controlledPageCount === 1
                                  ? "0px"
                                  : "1px"
                              }
                              borderBottomColor="#B2CCCC"
                              textAlign="right"
                            >
                              <IconButton
                                aria-label="move"
                                variant="ghost"
                                {...provided.dragHandleProps}
                                icon={
                                  <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M3.97461 8H19.9746M3.97461 12.5249H19.9746M3.97461 17.0249H19.9746"
                                      stroke="#333333"
                                      strokeOpacity="0.4"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                }
                                _focus={{ boxShadow: "none" }}
                              />
                            </Td>
                            {row.cells.map((cell: any) => {
                              return (
                                <Td
                                  borderBottomWidth={
                                    i === page.length - 1 &&
                                    controlledPageCount === 1
                                      ? "0px"
                                      : "1px"
                                  }
                                  borderBottomColor="#B2CCCC"
                                  {...cell.getCellProps()}
                                >
                                  {cell.render("Cell", {
                                    dragHandleProps: provided.dragHandleProps,
                                  })}
                                </Td>
                              )
                            })}
                            {(hasEdit || hasDelete) && (
                              <Td
                                borderBottomWidth={
                                  i === page.length - 1 &&
                                  controlledPageCount === 1
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
                                        resources === "users" ||
                                        resources === "employees"
                                          ? row.original.employeeNo
                                          : row.original.id,
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
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </Tbody>
              )}
            </Droppable>
          </DragDropContext>
          {pageOptions.length > 1 && (
            <Tfoot>
              <Tr>
                <Td colSpan={columns.length + 2} border="none" py={0}>
                  <Flex justifyContent="flex-end" m={4} alignItems="center">
                    <Text flexShrink={0} mr={2}>
                      Page{" "}
                    </Text>
                    <Flex>
                      <Tooltip label="Previous Page">
                        <IconButton
                          aria-label="previousPage"
                          onClick={previousPage}
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
                          gotoPage(page)
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
                          onClick={nextPage}
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
    </>
  )
}

export default TableDraggable
