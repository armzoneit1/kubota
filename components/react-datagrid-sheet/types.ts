import React from "react"
import { ListChildComponentProps } from "react-window"

export type ColumnWidth = string | number

export type Cell = {
  col: number
  row: number
}

export type Selection = { min: Cell; max: Cell }

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
}

export type CellComponent<T, C> = (props: CellProps<T, C>) => JSX.Element

export type Column<T, C> = {
  title?: React.ReactNode
  width: ColumnWidth
  minWidth: number
  maxWidth?: number
  renderWhenScrolling: boolean
  component: CellComponent<T, C>
  columnData?: C
  disableKeys: boolean
  disabled: boolean | (({ rowData }: { rowData: T }) => boolean)
  keepFocus: boolean
  deleteValue: ({ rowData }: { rowData: T }) => T
  copyValue: ({ rowData }: { rowData: T }) => number | string | null
  pasteValue: ({ rowData, value }: { rowData: T; value: string }) => T
}

export type ListItemData<T> = {
  data: T[]
  contentWidth?: number
  columns: Column<T, any>[]
  hasStickyRightColumn: boolean
  activeCell: Cell | null
  selectionMinRow?: number
  selectionMaxRow?: number
  editing: boolean
  setRowData: (rowIndex: number, item: T) => void
  deleteRows: (rowMin: number, rowMax?: number) => void
  duplicateRows: (rowMin: number, rowMax?: number) => void
  insertRowAfter: (row: number, count?: number) => void
  stopEditing: (opts?: { nextRow?: boolean }) => void
  getContextMenuItems: () => ContextMenuItem[]
  counter?: object[] | null
}

export type HeaderContextType<T> = {
  columns: Column<T, any>[]
  contentWidth?: number
  hasStickyRightColumn: boolean
  height: number
  activeColMin?: number
  activeColMax?: number
}

export type SelectionContextType = {
  columnRights?: number[]
  columnWidths?: number[]
  activeCell: Cell | null
  selection: Selection | null
  dataLength: number
  rowHeight: number
  hasStickyRightColumn: boolean
  editing: boolean
  isCellDisabled: (cell: Cell) => boolean
  headerRowHeight: number
  viewWidth?: number
  viewHeight?: number
  contentWidth?: number
  edges: { top: boolean; right: boolean; bottom: boolean; left: boolean }
  counter?: object[] | null
}

export type RowProps<T> = {
  index: number
  data: T
  style: React.CSSProperties
  isScrolling?: boolean
  columns: Column<T, any>[]
  hasStickyRightColumn: boolean
  active: boolean
  activeColIndex: number | null
  editing: boolean
  setRowData: (rowIndex: number, item: T) => void
  deleteRows: (rowMin: number, rowMax?: number) => void
  duplicateRows: (rowMin: number, rowMax?: number) => void
  insertRowAfter: (row: number, count?: number) => void
  stopEditing?: (opts?: { nextRow?: boolean }) => void
  getContextMenuItems: () => ContextMenuItem[]
  hide?: boolean
  counter?: object[] | null
  activeCell: Cell | null
}

export type SimpleColumn<T, C> = Partial<
  Pick<
    Column<T, C>,
    "title" | "maxWidth" | "minWidth" | "width" | "component" | "columnData"
  >
>

export type AddRowsComponentProps = {
  addRows: (count?: number) => void
}

export type ContextMenuItem =
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

export type ContextMenuComponentProps = {
  clientX: number
  clientY: number
  items: ContextMenuItem[]
  close: () => void
}

export type DataSheetGridProps<T> = {
  data?: T[]
  onChange?: (value: T[]) => void
  columns?: Partial<Column<T, any>>[]
  gutterColumn?: SimpleColumn<T, any>
  stickyRightColumn?: SimpleColumn<T, any>
  height?: number
  rowHeight?: number
  headerRowHeight?: number
  addRowsComponent?: (props: AddRowsComponentProps) => JSX.Element
  createRow?: () => T
  duplicateRow?: ({ rowData }: { rowData: T }) => T
  isRowEmpty?: ({ rowData }: { rowData: T }) => boolean
  autoAddRow?: boolean
  lockRows?: boolean
  disableContextMenu?: boolean
  contextMenuComponent?: (props: ContextMenuComponentProps) => JSX.Element
  row?: React.ComponentType<ListChildComponentProps<ListItemData<T>>> &
    React.ReactNode
  counter?: object[] | null
}
