import React, { useLayoutEffect, useRef, useState } from "react"
import { components } from "react-select"
import Select from "../input/react-select/Select"
import { CellProps, Column, CellComponent } from "./types"
import filter from "lodash/filter"
import styles from "../input/select.module.css"
import { Text } from "@chakra-ui/react"

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
  transportationProviderVehicleTypeMappingId?: number
  validationVehicle: any[] | null
}

const MenuList = (props: any) => {
  return (
    <components.MenuList {...props} className={styles.scroll}>
      {props.children}
    </components.MenuList>
  )
}

const ControlComponent = (props: any) => (
  <div
    style={{
      height: props?.isValid ? "inherit" : "49px",
    }}
  >
    <components.Control {...props} />
    {!props?.isValid && (
      <Text fontSize="14px" color="#e53e3e" px="8px" pt="0px">
        ทะเบียนรถซ้ำ
      </Text>
    )}
  </div>
)

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
    const isValid = columnData?.validationVehicle
      ? filter(
          columnData?.validationVehicle,
          (v) => v?.value === rowData?.value
        ).length > 0
        ? false
        : true
      : true

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
            height: "100%",
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
        components={{
          MenuList,
          // eslint-disable-next-line react/display-name
          Control: (props) => <ControlComponent {...props} isValid={isValid} />,
        }}
        isDisabled={Boolean(columnData.disabled)}
        value={rowData}
        menuIsOpen={focus}
        onChange={(value) => {
          setRowData(value)
          setTimeout(stopEditing, 0)
        }}
        onMenuClose={() => stopEditing({ nextRow: false })}
        options={filter([...columnData.choices], {
          transportationProviderVehicleTypeMappingId:
            columnData?.transportationProviderVehicleTypeMappingId,
        })}
        backspaceRemovesValue={false}
        placeholder=""
        menuPortalTarget={document.body}
        isSearchable={false}
        isClearable
        alwaysFocusFirstMenuOption={false}
        onInputChange={(value) => null}
        inputValue={""}
        onMenuOpen={() => null}
      />
    )
  }
)

{
  /* <Text fontSize="12px">{!isValid && "ทะเบียนรถซ้ำ"}</Text> */
}

SelectComponent.displayName = "SelectComponent"

export const selectVehicleColumn = (
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
