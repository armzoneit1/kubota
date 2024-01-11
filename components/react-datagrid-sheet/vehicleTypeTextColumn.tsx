import React, { useLayoutEffect, useRef } from "react"
import { CellComponent, CellProps, Column } from "./types"
import { useBreakpointValue, Text } from "@chakra-ui/react"

type TextComponentProps = {
  placeholder?: string
  unit?: string
  disabled?: boolean
  transportationProviderName?: string
}

const TextComponent = React.memo(
  ({
    focus,
    rowData,
    setRowData,
    disabled,
    columnData,
  }: CellProps<string | any, TextComponentProps>) => {
    const ref = useRef<HTMLInputElement>(null)
    const width = useBreakpointValue({
      base: { input: "40%", unit: "60%" },
      md: { input: "30%", unit: "70%" },
      lg: { input: "20%", unit: "80%" },
    })

    useLayoutEffect(() => {
      // When the cell gains focus we make sure to immediately select the text in the input:
      // - If the user gains focus by typing, it will replace the existing text, as expected
      // - If the user gains focus by clicking or pressing Enter, the text will be preserved and selected
      if (focus) {
        ref.current?.select()
      }
      // When the cell looses focus (by pressing Esc or Enter) we make sure to blur the input
      // Otherwise the user would still see its cursor blinking
      else {
        ref.current?.blur()
      }
    }, [focus])

    return (
      <div>
        <input
          className="dsg-input"
          // Important to prevent any undesired "tabbing"
          tabIndex={-1}
          ref={ref}
          // Make sure that while the cell is not focus, the user cannot interact with the input
          // The cursor will not change to "I", the style of the input will not change,
          // and the user cannot click and edit the input (this part should be handled by DataSheetGrid itself)
          // This "|| ''" trick makes sure that we do not pass `null` as a value to the input, if we would pass null
          // the input would display the previous value it receives instead of being empty
          value={rowData || ""}
          // This "|| null" trick allows us to not have empty strings as value, we either have a non-empty string or null
          // Of course depending on your application this might not be desirable
          onChange={(e) => setRowData(e.target.value || null)}
          disabled={disabled || columnData.disabled}
          placeholder={columnData?.placeholder ? columnData.placeholder : ""}
          style={
            columnData?.unit && rowData
              ? {
                  width: width?.input,
                  pointerEvents: focus ? "auto" : "none",
                }
              : { pointerEvents: focus ? "auto" : "none" }
          }
        />
        {columnData?.unit && rowData ? (
          <span style={{ width: width?.unit }}>{columnData?.unit}</span>
        ) : null}
        <Text px="10px">
          (
          {columnData?.transportationProviderName
            ? columnData?.transportationProviderName
            : "-"}
          )
        </Text>
      </div>
    )
  }
)

TextComponent.displayName = "TextComponent"

export const vehicleTypeTextColumn = (
  textProps?: TextComponentProps
): Partial<Column<string | any, TextComponentProps>> => ({
  component: TextComponent as CellComponent<
    string | any,
    TextComponentProps | null
  >,
  // We decided to have null instead of empty strings, but we could also have chosen to do "() => ''"
  deleteValue: () => null,
  copyValue: ({ rowData }) => rowData,
  // Same thing here, replace empty strings by null
  pasteValue: ({ value }) =>
    value ? value.replace(/[\n\r]+/g, " ").trim() : null,
  columnData: textProps,
})
