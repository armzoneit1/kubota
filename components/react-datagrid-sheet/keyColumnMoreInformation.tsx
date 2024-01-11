import React, { useCallback, useRef } from "react"
import { CellComponent, Column } from "./types"
import filter from "lodash/filter"

type ColumnData = { key: string; original: Partial<Column<any, any>> }

const KeyComponent: CellComponent<any, ColumnData> = ({
  columnData: { key, original },
  rowData,
  setRowData,
  ...rest
}) => {
  if (key === "vehicleIdMapping") {
    original.columnData.transportationProviderVehicleTypeMappingId =
      rowData?.transportationProviderVehicleTypeMappingId
    // original.columnData.isValid = false
  }

  if (key === "driverIdMapping") {
    original.columnData.vehicleId = rowData?.vehicleIdMapping
    original.columnData.transportationProviderId =
      rowData?.transportationProviderId
    original.columnData.transportationProviderName =
      rowData?.transportationProviderName
    original.columnData.transportationProviderName =
      rowData?.transportationProviderName
    original.columnData.bookingVehicleId = rowData?.bookingVehicleId
    original.columnData.timeTableRoundId = rowData?.timeTableRoundId
  }

  if (key === "vehicleTypeNameMapping") {
    original.columnData.transportationProviderName =
      rowData?.transportationProviderName
  }

  const rowDataRef = useRef(rowData)
  rowDataRef.current = rowData

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
      {...rest}
    />
  )
}

export const keyColumn = <
  T extends Record<string, any>,
  K extends keyof T = keyof T
>(
  key: K,
  column: Partial<Column<T[K], any>>
): Partial<Column<T, ColumnData>> => ({
  ...column,
  columnData: { key: key as string, original: column },
  component: KeyComponent,
  copyValue: ({ rowData }) =>
    column.copyValue?.({ rowData: rowData[key] }) ?? null,
  deleteValue:
    column.disabled || column.columnData?.disabled
      ? undefined
      : ({ rowData }) => ({
          ...rowData,
          [key]: column.deleteValue?.({ rowData: rowData[key] }) ?? null,
        }),
  pasteValue: ({ rowData, value }) => ({
    ...rowData,
    [key]: column.pasteValue?.({ rowData: rowData[key], value }) ?? null,
  }),
  disabled:
    typeof column.disabled === "function"
      ? ({ rowData }) => {
          return typeof column.disabled === "function"
            ? column.disabled({ rowData: rowData[key] })
            : column.disabled ?? false
        }
      : column.disabled,
})
