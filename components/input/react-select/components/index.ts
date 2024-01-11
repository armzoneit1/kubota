import { ComponentType } from "react"
import {
  GroupBase,
  components,
  ClearIndicatorProps,
  ControlProps,
  GroupProps,
  GroupHeadingProps,
  DropdownIndicatorProps,
  IndicatorsContainerProps,
  IndicatorSeparatorProps,
  InputProps,
  LoadingIndicatorProps,
  MenuProps,
  MenuListProps,
  NoticeProps,
  MultiValueProps,
  MultiValueGenericProps,
  MultiValueRemoveProps,
  OptionProps,
  PlaceholderProps,
  ContainerProps,
  SingleValueProps,
  ValueContainerProps,
} from "react-select"
import { MenuPortalProps } from "./Menu"
import { CrossIconProps, DownChevronProps } from "./indicators"
export interface SelectComponents<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> {
  ClearIndicator: ComponentType<ClearIndicatorProps<Option, IsMulti, Group>>
  Control: ComponentType<ControlProps<Option, IsMulti, Group>>
  DropdownIndicator: ComponentType<
    DropdownIndicatorProps<Option, IsMulti, Group>
  > | null
  DownChevron: ComponentType<DownChevronProps>
  CrossIcon: ComponentType<CrossIconProps>
  Group: ComponentType<GroupProps<Option, IsMulti, Group>>
  GroupHeading: ComponentType<GroupHeadingProps<Option, IsMulti, Group>>
  IndicatorsContainer: ComponentType<
    IndicatorsContainerProps<Option, IsMulti, Group>
  >
  IndicatorSeparator: ComponentType<
    IndicatorSeparatorProps<Option, IsMulti, Group>
  > | null
  Input: ComponentType<InputProps<Option, IsMulti, Group>>
  LoadingIndicator: ComponentType<LoadingIndicatorProps<Option, IsMulti, Group>>
  Menu: ComponentType<MenuProps<Option, IsMulti, Group>>
  MenuList: ComponentType<MenuListProps<Option, IsMulti, Group>>
  MenuPortal: ComponentType<MenuPortalProps<Option, IsMulti, Group>>
  LoadingMessage: ComponentType<NoticeProps<Option, IsMulti, Group>>
  NoOptionsMessage: ComponentType<NoticeProps<Option, IsMulti, Group>>
  MultiValue: ComponentType<MultiValueProps<Option, IsMulti, Group>>
  MultiValueContainer: ComponentType<
    MultiValueGenericProps<Option, IsMulti, Group>
  >
  MultiValueLabel: ComponentType<MultiValueGenericProps<Option, IsMulti, Group>>
  MultiValueRemove: ComponentType<MultiValueRemoveProps<Option, IsMulti, Group>>
  Option: ComponentType<OptionProps<Option, IsMulti, Group>>
  Placeholder: ComponentType<PlaceholderProps<Option, IsMulti, Group>>
  SelectContainer: ComponentType<ContainerProps<Option, IsMulti, Group>>
  SingleValue: ComponentType<SingleValueProps<Option, IsMulti, Group>>
  ValueContainer: ComponentType<ValueContainerProps<Option, IsMulti, Group>>
}

export type SelectComponentsGeneric = typeof components

export type SelectComponentsConfig<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> = Partial<SelectComponents<Option, IsMulti, Group>>

interface Props<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
> {
  components: SelectComponentsConfig<Option, IsMulti, Group>
}

export const defaultComponents = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>
): SelectComponentsGeneric =>
  ({
    ...components,
    ...props.components,
  } as SelectComponentsGeneric)
