import { areEqual, ListChildComponentProps } from "react-window"
import { ListItemData, RowProps } from "./types"
import React, { useCallback } from "react"
import cx from "classnames"
import { Cell } from "./Cell"
import { useFirstRender } from "react-datasheet-grid/dist/hooks/useFirstRender"
import filter from "lodash/filter"
import isEmpty from "lodash/isEmpty"

const nullfunc = () => null

const RowComponent = React.memo(
  ({
    index,
    style,
    data,
    isScrolling,
    columns,
    hasStickyRightColumn,
    active,
    activeColIndex,
    editing,
    setRowData,
    deleteRows,
    insertRowAfter,
    duplicateRows,
    stopEditing,
    getContextMenuItems,
    hide = false,
    counter,
    activeCell,
  }: RowProps<any>) => {
    const firstRender = useFirstRender()

    const merge =
      data.counter && !isEmpty(data.counter)
        ? filter(data.counter, (c) => {
            return (
              data.activeCell &&
              data.activeCell?.col >= c?.start?.col &&
              data.activeCell?.row >= c?.start?.row &&
              data.activeCell?.col <= c?.end?.col &&
              data.activeCell?.row <= c?.end?.row
            )
          })
        : null

    // True when we should render the light version (when we are scrolling)
    const renderLight = isScrolling && firstRender

    const setGivenRowData = useCallback(
      (rowData: any) => {
        setRowData(index, rowData)
      },
      [index, setRowData]
    )

    const deleteGivenRow = useCallback(() => {
      deleteRows(index)
    }, [deleteRows, index])

    const duplicateGivenRow = useCallback(() => {
      duplicateRows(index)
    }, [duplicateRows, index])

    const insertAfterGivenRow = useCallback(() => {
      insertRowAfter(index)
    }, [insertRowAfter, index])

    return (
      <div className="dsg-row" style={style}>
        {columns.map((column, i) => {
          const Component = column.component

          const disabled =
            column.disabled === true ||
            (typeof column.disabled === "function" &&
              column.disabled({ rowData: data })) ||
            (column.columnData?.key === "areaName" && hide)

          let isFocus: boolean = false

          if (merge && merge.length > 0) {
            if (
              activeColIndex &&
              activeColIndex >= merge[0]?.start?.col &&
              activeColIndex <= merge[0]?.end?.col
            ) {
              isFocus = Boolean(activeColIndex === i - 1 && editing)
            }
            isFocus = Boolean(activeColIndex === i - 1 && editing)
          } else {
            isFocus = Boolean(activeColIndex === i - 1 && editing)
          }

          return (
            <Cell
              key={i}
              gutter={i === 0}
              disabled={disabled}
              stickyRight={hasStickyRightColumn && i === columns.length - 1}
              column={column}
              active={active}
              className={cx(
                !column.renderWhenScrolling && renderLight && "dsg-cell-light"
              )}
            >
              {(column.renderWhenScrolling || !renderLight) && (
                <Component
                  rowData={!disabled && data}
                  getContextMenuItems={getContextMenuItems}
                  disabled={
                    disabled ||
                    column.columnData?.key === "name" ||
                    column.columnData?.key === "areaName"
                  }
                  active={activeColIndex === i - 1}
                  columnIndex={i - 1}
                  rowIndex={index}
                  // focus={isFocus}
                  focus={Boolean(activeColIndex === i - 1 && editing)}
                  deleteRow={deleteGivenRow}
                  duplicateRow={duplicateGivenRow}
                  stopEditing={
                    activeColIndex === i - 1 && editing && stopEditing
                      ? stopEditing
                      : nullfunc
                  }
                  insertRowBelow={insertAfterGivenRow}
                  setRowData={setGivenRowData}
                  columnData={column.columnData}
                />
              )}
            </Cell>
          )
        })}
      </div>
    )
  },
  (prevProps, nextProps) => {
    const { isScrolling: prevIsScrolling, ...prevRest } = prevProps
    const { isScrolling: nextIsScrolling, ...nextRest } = nextProps

    // When we are scrolling always re-use previous render, otherwise check props
    return nextIsScrolling || (!prevIsScrolling && areEqual(prevRest, nextRest))
  }
)

RowComponent.displayName = "RowComponent"

export const Row = <T extends any>({
  index,
  style,
  isScrolling,
  data,
}: ListChildComponentProps<ListItemData<any>>) => {
  if (index === 0) {
    return null
  }

  const merge: any =
    data.counter && !isEmpty(data.counter)
      ? filter(data.counter, (c: any) => {
          return (
            data.activeCell &&
            data.activeCell?.col >= c?.start?.col &&
            data.activeCell?.row >= c?.start?.row &&
            data.activeCell?.col <= c?.end?.col &&
            data.activeCell?.row <= c?.end?.row
          )
        })
      : null

  let isEditting = false

  if (merge && merge.length > 0) {
    if (
      data?.activeCell &&
      data.activeCell?.row >= merge[0]?.start?.row &&
      data.activeCell?.row <= merge[0]?.end?.row
    ) {
      isEditting = Boolean(merge[0]?.start?.row === index - 1 && data.editing)
    } else
      isEditting = Boolean(data.activeCell?.row === index - 1 && data.editing)
  } else {
    isEditting = Boolean(data.activeCell?.row === index - 1 && data.editing)
  }

  return (
    <RowComponent
      index={index - 1}
      data={data.data[index - 1]}
      columns={data.columns}
      style={{
        ...style,
        width: data.contentWidth ? data.contentWidth : "100%",
      }}
      hasStickyRightColumn={data.hasStickyRightColumn}
      isScrolling={isScrolling}
      active={
        merge && merge.length > 0
          ? Boolean(
              index - 1 >= (merge[0].start.row ?? Infinity) &&
                index - 1 <= (merge[0].end.row ?? -Infinity) &&
                data.activeCell
            )
          : Boolean(
              index - 1 >= (data.selectionMinRow ?? Infinity) &&
                index - 1 <= (data.selectionMaxRow ?? -Infinity) &&
                data.activeCell
            )
      }
      activeColIndex={
        data.activeCell?.row === index - 1 ? data.activeCell.col : null
      }
      editing={Boolean(data.activeCell?.row === index - 1 && data.editing)}
      setRowData={data.setRowData}
      deleteRows={data.deleteRows}
      insertRowAfter={data.insertRowAfter}
      duplicateRows={data.duplicateRows}
      stopEditing={
        data.activeCell?.row === index - 1 && data.editing
          ? data.stopEditing
          : undefined
      }
      getContextMenuItems={data.getContextMenuItems}
      hide={data.data[index - 1]?.hide}
      activeCell={data.activeCell}
    />
  )
}
