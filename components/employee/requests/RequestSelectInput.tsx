import React, { useState, useEffect } from "react"
import Select, { components } from "react-select"
import styles from "../../input/select.module.css"
import { useAxios } from "../../../providers/http-client"
import { DateTime } from "luxon"

const groupStyles = {
  borderBottom: "2px solid #33333360",
  background: "inherit",
}

const Group = (props: any) => {
  return (
    <div style={groupStyles}>
      <components.Group {...props} />
    </div>
  )
}

const MenuList = (props: any) => {
  return (
    <components.MenuList {...props} className={styles.scroll}>
      {props.children}
    </components.MenuList>
  )
}

const headerStyles = {
  color: "#00A5A8",
  fontWeight: 600,
}

const formatGroupLabel = (data: any) => (
  <div>
    <span style={headerStyles}>{data.label}</span>
  </div>
)

const RequestSelectInput = ({
  options,
  menuBackgroundColor = "#F5F5F5",
  invalid,
  error,
  isClearable = false,
  date,
  periodOfDay = "morning",
  handleSetAllWarning,
  handleSetWarning,
  fieldName,
  ...rest
}: any) => {
  const { value, onChange } = rest
  const axios = useAxios()
  const [timeOptions, setTimeOptions] = useState<any[] | null>(null)
  const [errorMessage, setErrorMessage] = useState<any>(null)

  useEffect(() => {
    if (value && timeOptions) {
      onChange(
        timeOptions && timeOptions.filter((v) => v?.value === value?.value)[0]
      )
    }
  }, [timeOptions])

  useEffect(() => {
    if (date) {
      axios
        .get(
          `/schedules/date/${DateTime.fromJSDate(new Date(date)).toFormat(
            "y-MM-dd"
          )}`
        )
        .then((res) => {
          const options =
            periodOfDay === "morning"
              ? res?.data?.data?.timeTableMorning?.timeTableRound
                ? res?.data?.data?.timeTableMorning?.timeTableRound.map(
                    (time: any) => ({
                      value: time.timeTableRoundId,
                      label: time.time,
                      status:
                        res.data.data.timeTableMorning.status === "open" &&
                        res.data.data.isMorningOpenForBooking,
                    })
                  )
                : []
              : res?.data?.data?.timeTableEvening?.timeTableRound
              ? res?.data?.data?.timeTableEvening?.timeTableRound.map(
                  (time: any) => ({
                    value: time.timeTableRoundId,
                    label: time.time,
                    status:
                      res.data.data.timeTableEvening.status === "open" &&
                      res.data.data.isEveningOpenForBooking,
                  })
                )
              : []
          if (handleSetAllWarning && fieldName) {
            handleSetAllWarning(res?.data?.data?.warning, fieldName)
          }

          if (handleSetWarning) {
            handleSetWarning(res?.data?.data?.warning)
          }
          setTimeOptions(options)
        })
        .catch((error) => {
          setErrorMessage(error)
        })
    }
  }, [date])

  return (
    <Select
      options={timeOptions ? timeOptions : []}
      value={
        value
          ? timeOptions &&
            timeOptions.filter((v) => v?.value === value?.value)[0]
          : undefined
      }
      isClearable={isClearable}
      onChange={onChange}
      {...rest}
      components={{ IndicatorSeparator: null, MenuList, Group }}
      styles={{
        menuPortal: (provided, state) => ({
          ...provided,
          borderColor: "#B2CCCC",
        }),
        menu: (provided, state) => ({
          ...provided,
          padding: "10px",
          backgroundColor: menuBackgroundColor,
          border: "1px solid #B2CCCC",
          boxShadow: "none",
          zIndex: 1000,
        }),
        container: (provided, state) => ({
          ...provided,
          borderRadius: "4px",
        }),
        control: (provided, state) => ({
          ...provided,

          borderColor: state.isFocused
            ? "#B2CCCC"
            : !error
            ? "#B2CCCC"
            : invalid
            ? "#E53E3E"
            : "#B2CCCC",
          backgroundColor: "inherit",
          boxShadow: state.isFocused
            ? "#00a5a8 0 0 0 1px"
            : !error
            ? "none"
            : invalid
            ? "#E53E3E 0 0 0 1px"
            : "none",
          "&:hover": {
            borderColor: state.isFocused
              ? "#B2CCCC"
              : !error
              ? "#B2CCCC"
              : invalid
              ? "#E53E3E"
              : "#B2CCCC",
            boxShadow: state.isFocused
              ? "#00a5a8 0 0 0 1px"
              : !error
              ? "none"
              : invalid
              ? "#E53E3E 0 0 0 1px"
              : "none",
          },
        }),
        option: (provider, { data, isDisabled, isFocused, isSelected }) => ({
          ...provider,
          backgroundColor: isDisabled
            ? null
            : isSelected
            ? "#D4E3E3"
            : isFocused
            ? "#D4E3E3"
            : null,
          color: "#333333",
          fontWeight: isSelected ? 600 : "normal",
          cursor: isDisabled ? "not-allowed" : "default",
          borderRadius: "6px",
          margin: "5px 0px",
        }),
      }}
      formatGroupLabel={formatGroupLabel}
    />
  )
}

export default RequestSelectInput
