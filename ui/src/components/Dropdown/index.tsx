import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { CaretRightIcon, CheckIcon } from "@radix-ui/react-icons";
import cx from "classnames";
import React, { ReactNode, useEffect, useState } from "react";
import { Button } from "../Button";

interface RadixMenuItem {
  label: string;
  value?: string;
  shortcut?: string;
  icon?: ReactNode;
  children?: RadixMenuItem[];
  key?: string;
  type?: "check";
}

interface Menu {
  children: RadixMenuItem[];
  title?: string;
  type?: "check";
  key: string;
}

export type DropdownMenus = Menu[];

interface Props {
  menus: DropdownMenus;
  trigger?: React.ReactNode | React.ReactElement;
  placeholder?: string;
  onChange?: (data: any) => void;
}

export const DropdownMenu = (props: Props) => {
  const { menus = [], trigger, onChange, placeholder } = props;

  const [checkedFields, setCheckedFields] = useState<Record<string, any>>({});

  const menuElms: React.ReactNode[] = [];

  const renderCheckMenu = (
    key: string,
    keyIndex: string,
    label: string,
    value: any,
    onClick?: () => void,
    isChecked?: () => boolean
  ) => {
    return (
      <DropdownMenuPrimitive.CheckboxItem
        key={key}
        checked={isChecked ? isChecked() : checkedFields[keyIndex] === value}
        onClick={() => {
          onClick
            ? onClick()
            : setCheckedFields({ ...checkedFields, [keyIndex]: value });
        }}
        className={cx(
          "flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none",
          "text-gray-400 focus:bg-gray-50 "
        )}
      >
        <span className="flex-grow text-gray-700">{label}</span>
        <DropdownMenuPrimitive.ItemIndicator>
          <CheckIcon className="h-3.5 w-3.5" />
        </DropdownMenuPrimitive.ItemIndicator>
      </DropdownMenuPrimitive.CheckboxItem>
    );
  };

  menus.forEach((menu, menuIndex) => {
    const { title, children, type, key: menuKey } = menu;
    if (title) {
      menuElms.push(
        <DropdownMenuPrimitive.Separator
          key={`${title}-0`}
          className="my-1 h-px bg-gray-200"
        />,
        <DropdownMenuPrimitive.Label
          key={`${title}-1`}
          className="select-none px-2 py-2 text-xs text-gray-700"
        >
          {title}
        </DropdownMenuPrimitive.Label>
      );
    }
    children.forEach((sub, subIndex) => {
      const {
        label,
        icon,
        children: subChildren,
        type: subType,
        key: subKey,
        value: subValue,
      } = sub;
      // for checkgroup
      if (type === "check") {
        return menuElms.push(
          renderCheckMenu(
            `${label}-${menuIndex}-${subIndex}`,
            `${menuKey}`,
            label,
            subValue
          )
        );
      }
      if (subChildren) {
        menuElms.push(
          <DropdownMenuPrimitive.Sub key={`${label}-${menuIndex}-${subIndex}`}>
            <DropdownMenuPrimitive.SubTrigger
              className={cx(
                "flex w-full cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none",
                "text-gray-400 focus:bg-gray-50"
              )}
            >
              <span className="flex-grow text-gray-700">{label}</span>
              <CaretRightIcon className="h-3.5 w-3.5" />
            </DropdownMenuPrimitive.SubTrigger>
            <DropdownMenuPrimitive.Portal>
              <DropdownMenuPrimitive.SubContent
                className={cx(
                  "origin-radix-dropdown-menu radix-side-right:animate-scale-in",
                  "w-full rounded-md px-1 py-1 text-xs shadow-md",
                  "bg-white",
                  "z-20"
                )}
              >
                {subChildren.map(({ label, value }, i) =>
                  subType === "check" ? (
                    renderCheckMenu(
                      `${label}-${menuIndex}-${subIndex}-${i}`,
                      `${subKey}`,
                      label,
                      value,
                      () =>
                        setCheckedFields({
                          ...checkedFields,
                          [menuKey]: { value: subValue, [subKey || ""]: value },
                        }),
                      () => {
                        if (!checkedFields[menuKey]) {
                          return false;
                        }
                        if (
                          checkedFields[menuKey] &&
                          checkedFields[menuKey].hasOwnProperty(subKey || "")
                        ) {
                          return checkedFields[menuKey][subKey || ""] === value;
                        }
                        return false;
                      }
                    )
                  ) : (
                    <DropdownMenuPrimitive.Item
                      key={`${label}-${menuIndex}-${subIndex}-${i}`}
                      className={cx(
                        "flex w-28 cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none md:w-32",
                        "text-gray-400 focus:bg-gray-50"
                      )}
                    >
                      <span className="text-gray-700">{label}</span>
                    </DropdownMenuPrimitive.Item>
                  )
                )}
              </DropdownMenuPrimitive.SubContent>
            </DropdownMenuPrimitive.Portal>
          </DropdownMenuPrimitive.Sub>
        );
        return;
      }

      menuElms.push(
        <DropdownMenuPrimitive.Item
          key={`${label}-${menuIndex}-${subIndex}`}
          onClick={() =>
            setCheckedFields({
              ...checkedFields,
              [menuKey]: subValue,
            })
          }
          className={cx(
            "flex cursor-default select-none items-center rounded-md px-2 py-2 text-xs outline-none",
            "text-gray-400 focus:bg-gray-50"
          )}
        >
          {icon}
          <span className="flex-grow text-gray-700">{label}</span>
        </DropdownMenuPrimitive.Item>
      );
    });
  });

  useEffect(() => {
    onChange?.(checkedFields);
  }, [checkedFields, onChange]);

  return (
    <div className="relative inline-block text-left">
      <DropdownMenuPrimitive.Root>
        <DropdownMenuPrimitive.Trigger asChild>
          {trigger ? trigger : <Button>{placeholder || "Select"}</Button>}
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            align="end"
            sideOffset={5}
            className={cx(
              " radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down",
              "w-48 rounded-lg px-1.5 py-1 shadow-md md:w-56",
              "bg-white",
              "z-10"
            )}
          >
            {menuElms}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    </div>
  );
};

export default DropdownMenu;
