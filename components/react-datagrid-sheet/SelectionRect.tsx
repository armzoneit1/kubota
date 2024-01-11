import React, { useContext, useMemo } from "react"
import { SelectionContext } from "./SelectionContext"
import cx from "classnames"
import filter from "lodash/filter"
import isEmpty from "lodash/isEmpty"

const buildSquare = (
  top: number | string,
  right: number | string,
  bottom: number | string,
  left: number | string
) => {
  return [
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
    [left, top],
  ]
}

const buildClipPath = (
  top: number,
  right: number,
  bottom: number,
  left: number
) => {
  const values = [
    ...buildSquare(0, "100%", "100%", 0),
    ...buildSquare(top, right, bottom, left),
  ]

  return `polygon(evenodd, ${values
    .map((pair) =>
      pair
        .map((value) =>
          typeof value === "number" && value !== 0 ? value + "px" : value
        )
        .join(" ")
    )
    .join(",")})`
}

export const SelectionRect = React.memo(() => {
  const {
    columnWidths,
    columnRights,
    headerRowHeight,
    selection,
    rowHeight,
    activeCell,
    hasStickyRightColumn,
    dataLength,
    viewWidth,
    viewHeight,
    contentWidth,
    edges,
    isCellDisabled,
    editing,
    counter,
  } = useContext(SelectionContext)

  const merge: any =
    counter && !isEmpty(counter)
      ? filter(counter, (c: any) => {
          return (
            activeCell &&
            activeCell?.col >= c?.start?.col &&
            activeCell?.row >= c?.start?.row &&
            activeCell?.col <= c?.end?.col &&
            activeCell?.row <= c?.end?.row
          )
        })
      : null

  const activeCellIsDisabled = activeCell ? isCellDisabled(activeCell) : false

  const selectionIsDisabled = useMemo(() => {
    if (!selection) {
      return activeCellIsDisabled
    }

    for (let col = selection.min.col; col <= selection.max.col; ++col) {
      for (let row = selection.min.row; row <= selection.max.row; ++row) {
        if (!isCellDisabled({ col, row })) {
          return false
        }
      }
    }

    return true
  }, [activeCellIsDisabled, isCellDisabled, selection])

  if (!columnWidths || !columnRights) {
    return null
  }

  const extraPixelV = (rowI: number): number => {
    return rowI < dataLength - 1 ? 1 : 0
  }

  const extraPixelH = (colI: number): number => {
    return colI < columnWidths.length - (hasStickyRightColumn ? 3 : 2) ? 1 : 0
  }

  const activeCellRect = activeCell && {
    width: columnWidths[activeCell.col + 1] + extraPixelH(activeCell.col),
    height:
      merge && merge.length > 0
        ? rowHeight * (merge[0].end.row - merge[0].start.row + 1) +
          extraPixelV(merge[0].end.row)
        : rowHeight + extraPixelV(activeCell.row),
    left:
      merge && merge.length > 0
        ? columnRights[merge[0].start.col]
        : columnRights[activeCell.col],
    top:
      merge && merge.length > 0
        ? rowHeight * merge[0].start.row + headerRowHeight
        : rowHeight * activeCell.row + headerRowHeight,
  }

  const selectionRect = selection && {
    width:
      columnWidths
        .slice(selection.min.col + 1, selection.max.col + 2)
        .reduce((a, b) => a + b) + extraPixelH(selection.max.col),
    height:
      rowHeight * (selection.max.row - selection.min.row + 1) +
      extraPixelV(selection.max.row),
    left: columnRights[selection.min.col],
    top: rowHeight * selection.min.row + headerRowHeight,
  }

  return (
    <>
      <div
        className="dsg-scrollable-view-container"
        style={{
          height: dataLength * rowHeight + headerRowHeight,
          width: contentWidth ? contentWidth : "100%",
        }}
      >
        <div
          className={cx({
            "dsg-scrollable-view": true,
            "dsg-scrollable-view-t": !edges.top,
            "dsg-scrollable-view-r": !edges.right,
            "dsg-scrollable-view-b": !edges.bottom,
            "dsg-scrollable-view-l": !edges.left,
          })}
          style={{
            top: headerRowHeight,
            left: columnWidths[0],
            height: viewHeight ? viewHeight - headerRowHeight : 0,
            width:
              contentWidth && viewWidth
                ? viewWidth -
                  columnWidths[0] -
                  (hasStickyRightColumn
                    ? columnWidths[columnWidths.length - 1]
                    : 0)
                : `calc(100% - ${
                    columnWidths[0] +
                    (hasStickyRightColumn
                      ? columnWidths[columnWidths.length - 1]
                      : 0)
                  }px)`,
          }}
        />
      </div>
      {(selectionRect || activeCellRect) && (
        <div
          className="dsg-selection-col-marker-container"
          style={{
            left: selectionRect?.left ?? activeCellRect?.left,
            width: selectionRect?.width ?? activeCellRect?.width,
            height: dataLength * rowHeight + headerRowHeight,
          }}
        >
          <div
            className={cx(
              "dsg-selection-col-marker",
              selectionIsDisabled && "dsg-selection-col-marker-disabled"
            )}
            style={{ top: headerRowHeight }}
          />
        </div>
      )}
      {(selectionRect || activeCellRect) && (
        <div
          className="dsg-selection-row-marker-container"
          style={{
            top: selectionRect?.top ?? activeCellRect?.top,
            height: selectionRect?.height ?? activeCellRect?.height,
            width: contentWidth ? contentWidth : "100%",
          }}
        >
          <div
            className={cx(
              "dsg-selection-row-marker",
              selectionIsDisabled && "dsg-selection-row-marker-disabled"
            )}
            style={{ left: columnWidths[0] }}
          />
        </div>
      )}
      {activeCellRect && activeCell && (
        <div
          className={cx("dsg-active-cell", {
            "dsg-active-cell-focus": editing,
            "dsg-active-cell-disabled": activeCellIsDisabled,
          })}
          style={activeCellRect}
        />
      )}
      {selectionRect && activeCellRect && (
        <div
          className={cx(
            "dsg-selection-rect",
            selectionIsDisabled && "dsg-selection-rect-disabled"
          )}
          style={{
            ...selectionRect,
            clipPath: buildClipPath(
              activeCellRect.top - selectionRect.top,
              activeCellRect.left - selectionRect.left,
              activeCellRect.top + activeCellRect.height - selectionRect.top,
              activeCellRect.left + activeCellRect.width - selectionRect.left
            ),
          }}
        />
      )}
    </>
  )
})

SelectionRect.displayName = "SelectionRect"
