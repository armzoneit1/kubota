import React, { useCallback, useRef } from "react"
import { Column } from "./types"

type CellComponent<T, C> = (props: CellProps<T, C>) => JSX.Element

export type CellProps<T, C> = {
  rowData: T
  rowIndex: number
  columnIndex: number
  active: boolean
  focus: boolean
  disabled: boolean
  columnData: C
  setRowData: (rowData: T) => void
  stopEditing: (opts?: { nextRow: boolean }) => void
  insertRowBelow: () => void
  duplicateRow: () => void
  deleteRow: () => void
  getContextMenuItems: () => ContextMenuItem[]
  busStopId?: number
}

type ContextMenuItem =
  | {
      type: "INSERT_ROW_BELLOW" | "DELETE_ROW" | "DUPLICATE_ROW"
      action: () => void
    }
  | {
      type: "DELETE_ROWS" | "DUPLICATE_ROWS"
      action: () => void
      fromRow: number
      toRow: number
    }

type ColumnData = { key: string; original: Partial<Column<any, any>> }

const KeyComponentBusLine: CellComponent<any, ColumnData> = ({
  columnData: { key, original },
  rowData,
  setRowData,
  ...rest
}) => {
  // We use a ref so useCallback does not produce a new setKeyData function every time the rowData changes
  const rowDataRef = useRef(rowData)
  rowDataRef.current = rowData

  // We wrap the setRowData function to assign the value to the desired key
  const setKeyData = useCallback(
    (value) => {
      setRowData({ ...rowDataRef.current, [key]: value })
    },
    [key, setRowData]
  )

  if (!original.component) {
    return <></>
  }

  const Component = original.component

  return (
    <Component
      columnData={original.columnData}
      setRowData={setKeyData}
      rowData={rowData[key]}
      busStopId={rowData?.id}
      {...rest}
    />
  )
}

export const keyColumnBusLine = <
  T extends Record<string, any>,
  K extends keyof T = keyof T
>(
  key: K,
  column: Partial<Column<T[K], any>>
): Partial<Column<T, ColumnData>> => ({
  ...column,
  columnData: { key: key as string, original: column },
  component: KeyComponentBusLine,
  copyValue: ({ rowData }) => {
    return (
      column.copyValue?.({
        rowData: rowData[key],
      }) ?? null
    )
  },
  deleteValue: ({ rowData }) => ({
    ...rowData,
    [key]: column.deleteValue?.({ rowData: rowData[key] }) ?? null,
  }),
  pasteValue: ({ rowData, value }) => {
    return {
      ...rowData,
      [key]:
        column.pasteValue?.({
          rowData: rowData[key],
          value,
        }) ?? null,
    }
  },
  disabled:
    typeof column.disabled === "function"
      ? ({ rowData }) => {
          return typeof column.disabled === "function"
            ? column.disabled({ rowData: rowData[key] })
            : column.disabled ?? false
        }
      : column.disabled,
})
