import { ComponentList } from "./types";

const initStaticItem = () => {
  return {
    isNew: true,
    label: "",
    hint: "",
    condition: "",
  };
};

export function componentListReducer(
  state,
  action: {
    type: ComponentList;
    payload: any;
  }
) {
  const { type, payload } = action;
  const { selectedComponent } = state;
  let staticListItems = selectedComponent.values?.items;
  const { selectedListItem = {}, selectedListItemIndex } = selectedComponent;

  switch (type) {
    case ComponentList.EDIT_LIST_ITEM_CONDITION:
      break;
    case ComponentList.SUBMIT_LIST_ITEM:
      return { ...state, selectedComponent };
    case ComponentList.ADD_LIST_ITEM:
      return { ...state, selectedItem: initStaticItem() };

    case ComponentList.EDIT_LIST_ITEM:
      let selectedItem, selectedItemIndex;
      if (typeof payload === "number") {
        selectedItem = staticListItems[payload];
      } else {
        selectedItem = payload;
        selectedItemIndex = staticListItems.findIndex(
          (item) => item === payload
        );
      }
      return {
        ...state,
        selectedItem,
        selectedItemIndex,
      };
    case ComponentList.EDIT_LIST:
      return {
        ...state,
        isEditingList: payload,
      };
    case ComponentList.SET_SELECTED_LIST:
      if (state.isNew) {
        return {
          ...state,
          selectedComponent: {
            values: {
              type: "listRef",
              list: payload,
            },
            ...selectedComponent,
          },
          selectedListName: payload,
          listItemErrors: {},
        };
      } else {
        // this is not changing component.values right now, since we don't want to "lose" static values.
        return {
          ...state,
          selectedListName: payload,
          listItemErrors: {},
        };
      }

    case ComponentList.LIST_ITEM_VALIDATION_ERRORS: {
      return {
        ...state,
        listItemErrors: payload,
      };
    }
  }
}
