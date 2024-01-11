import React, { useLayoutEffect, useRef, useState } from "react"
import Select from "../input/react-select/Select"
import { CellProps, Column, CellComponent } from "./types"

type Choice = {
  label: string
  value: string | number
}

type GroupChoice = {
  label: string
  options: Choice[]
}

type ChoiceAndGroup = {
  label: string
  options?: Choice[]
  value?: string | number
}

type SelectOptions = {
  choices: Choice[] | GroupChoice[] | ChoiceAndGroup[]
  disabled?: boolean | (({ rowData }: { rowData: string | null }) => boolean)
}

const SelectComponent = React.memo(
  ({
    active,
    rowData,
    setRowData,
    focus,
    stopEditing,
    columnData,
  }: CellProps<string | any, SelectOptions>) => {
    const ref = useRef<Select>(null)

    useLayoutEffect(() => {
      if (focus) {
        ref.current?.focus()
      } else {
        ref.current?.blur()
      }
    }, [focus])

    return (
      <Select
        ref={ref}
        styles={{
          container: (provided) => ({
            ...provided,
            flex: 1,
            alignSelf: "stretch",
            pointerEvents: focus ? undefined : "none",
          }),
          control: (provided) => ({
            ...provided,
            height: "100%",
            border: "none",
            boxShadow: "none",
            background: "none",
          }),
          option: (provider, state) => ({
            ...provider,
            backgroundColor: state.isDisabled
              ? "#FFFFFF"
              : state.isSelected
              ? "#D4E3E3"
              : state.isFocused
              ? "#D4E3E3"
              : "#FFFFFF",
            color: "#333333",
            fontWeight: state.isSelected ? 600 : "normal",
            cursor: state.isDisabled ? "not-allowed" : "default",
            borderRadius: "6px",
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            opacity: 0,
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            opacity: active ? 1 : 0,
          }),
          placeholder: (provided) => ({
            ...provided,
            opacity: active ? 1 : 0,
          }),
          menu: (provided, state) => ({
            ...provided,
            padding: "10px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #B2CCCC",
            boxShadow: "none",
          }),
          menuPortal: (provided, state) => ({
            ...provided,
            borderColor: "#B2CCCC",
          }),
        }}
        isDisabled={Boolean(columnData.disabled)}
        value={rowData}
        menuIsOpen={focus}
        onChange={(value) => {
          setRowData(value)
          setTimeout(stopEditing, 0)
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
        options={columnData.choices}
        backspaceRemovesValue={false}
        menuPortalTarget={document.body}
        alwaysFocusFirstMenuOption={false}
        onInputChange={(value) => null}
        inputValue={""}
        onMenuOpen={() => null}
      />
    )
  }
)

SelectComponent.displayName = "SelectComponent"

export const selectColumn = (
  options: SelectOptions
): Partial<Column<string | null, SelectOptions>> => ({
  component: SelectComponent as CellComponent<string | null, SelectOptions>,
  columnData: options,
  disableKeys: true,
  keepFocus: true,
  disabled: options.disabled,
  deleteValue: () => null,
  copyValue: ({ rowData }) => JSON.stringify(rowData),
  pasteValue: ({ rowData, value }) => JSON.parse(value),
})
