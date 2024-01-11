import React, { useRef, useLayoutEffect } from "react"
import { CellProps, Column, CellComponent } from "./types"
import { components } from "react-select"
import Select from "../input/react-select/Select"
import { OverlayScrollbarsComponent } from "overlayscrollbars-react"
import styles from "../layout/layout.module.css"

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
  value?: string
}

type SelectOptions = {
  choices: ChoiceAndGroup[]
  disabled?: boolean | (({ rowData }: { rowData: string | null }) => boolean)
}

const MultiValueRemove = (props: any) => {
  return (
    <components.MultiValueRemove {...props}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 1C4.1 1 1 4.1 1 8C1 11.9 4.1 15 8 15C11.9 15 15 11.9 15 8C15 4.1 11.9 1 8 1ZM10.7 11.5L8 8.8L5.3 11.5L4.5 10.7L7.2 8L4.5 5.3L5.3 4.5L8 7.2L10.7 4.5L11.5 5.3L8.8 8L11.5 10.7L10.7 11.5Z"
          fill="#333333"
          fillOpacity="0.6"
        />
      </svg>
    </components.MultiValueRemove>
  )
}

const MultiValueContainer = (props: any) => {
  return <components.MultiValueContainer {...props} />
}

const ValueContainer = ({ children, ...props }: any) => {
  return (
    <OverlayScrollbarsComponent
      options={{
        scrollbars: {
          autoHide: "leave",
        },
      }}
      style={{ width: "90%", height: 70, overflowY: "scroll" }}
    >
      <components.ValueContainer {...props}>
        {children}
      </components.ValueContainer>
    </OverlayScrollbarsComponent>
  )
}

const MenuList = (props: any) => {
  return (
    <components.MenuList {...props} className={styles.scroll}>
      {props.children}
    </components.MenuList>
  )
}

const SelectMultipleComponent = React.memo(
  ({
    active,
    rowData,
    setRowData,
    focus,
    stopEditing,
    columnData,
  }: CellProps<string | any, SelectOptions>) => {
    const ref = useRef<any>(null)

    useLayoutEffect(() => {
      if (focus) {
        ref.current?.focus()
      } else {
        ref.current?.blur()
      }
    }, [focus])

    return (
      <>
        <Select
          ref={ref && ref}
          components={{
            MultiValueRemove,
            ClearIndicator: undefined,
            MultiValueContainer,
            ValueContainer,
            MenuList,
          }}
          styles={{
            option: (provider, { isDisabled, isFocused, isSelected }) => ({
              ...provider,
              backgroundColor: isDisabled
                ? "#ffffff"
                : isSelected
                ? "#D4E3E3"
                : isFocused
                ? "#D4E3E3"
                : "#ffffff",
              color: "#333333",
              fontWeight: isSelected ? 600 : "normal",
              cursor: isDisabled ? "not-allowed" : "default",
              borderRadius: "6px",
            }),
            container: (provided) => ({
              ...provided,
              flex: 1,
              alignSelf: "stretch",
              pointerEvents: focus ? undefined : "none",
              maxWidth: "500px",
              height: "100%",
              borderColor: "#B2CCCC",
              "&:hover": { borderColor: "#00A5A8" },
            }),
            control: (provided) => ({
              ...provided,
              height: "100%",
              border: "none",
              boxShadow: "none",
              background: "none",
              width: "100%",
            }),
            valueContainer: (provided, state) => {
              return {
                ...provided,
                width: "100%",
              }
            },
            menuPortal: (provided, state) => ({
              ...provided,
              borderColor: "#B2CCCC",
            }),
            menu: (provided, state) => ({
              ...provided,
              padding: "10px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #B2CCCC",
              boxShadow: "none",
            }),
            menuList: (provided) => ({
              ...provided,
              maxHeight: "200px",
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
            multiValue: (provided, state) => ({
              ...provided,
              backgroundColor: "#D4E3E3",
              borderRadius: "14.5px",
              padding: "0px 4px",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: "#333333",
              fontSize: "16px",
              padding: "1px",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              ":hover": {
                backgroundColor: "none",
                cursor: "pointer",
              },
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
          isMulti={true}
          backspaceRemovesValue={false}
          placeholder=""
          alwaysFocusFirstMenuOption={false}
          onInputChange={(value) => null}
          inputValue={""}
          onMenuOpen={() => null}
        />
      </>
    )
  }
)

SelectMultipleComponent.displayName = "SelectMultipleComponent"

export const selectMultipleComponent = (
  options: SelectOptions
): Partial<Column<string | null, SelectOptions>> => ({
  component: SelectMultipleComponent as CellComponent<
    string | null,
    SelectOptions
  >,
  columnData: options,
  disableKeys: true,
  keepFocus: true,
  disabled: options.disabled,
  deleteValue: () => null,
  copyValue: ({ rowData }) => JSON.stringify(rowData),
  pasteValue: ({ rowData, value }) => JSON.parse(value),
})
