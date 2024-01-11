import React from "react"

export interface DataSheetGridProps<T> {
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
  row?: React.ElementType
}
