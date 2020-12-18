import ListItems from "./list-items";
import { Input } from "@govuk-jsx/input";
import React, { useContext } from "react";
import { ListActions } from "../reducers/listActions";
import { withI18n } from "../i18n";
import {
  ListsEditorContext,
  ListsEditorStateActions,
  useSetListEditorContext,
} from "../reducers/list/listsEditorReducer";
import { StaticListItemActions } from "../reducers/component/componentReducer.listItem";
import { DataContext } from "../context";
import { clone } from "@xgovformbuilder/model";
import { hasValidationErrors, validateTitle } from "../validations";
import ErrorSummary from "../error-summary";

const useListItem = (state, dispatch) => {
  const [{ isEditingStatic }, listsEditorDispatch]: any = useContext(
    ListsEditorContext
  );

  function deleteItem(e) {
    e.preventDefault();
    console.log(state);
    dispatch({
      type: isEditingStatic
        ? StaticListItemActions.DELETE
        : ListActions.DELETE_LIST_ITEM,
    });
  }

  function createItem() {
    dispatch({ type: ListActions.ADD_LIST_ITEM });
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST_ITEM, true]);
  }

  return {
    deleteItem,
    createItem,
    selectedList: isEditingStatic
      ? state.selectedComponent.values
      : state.selectedList,
    isEditingStatic,
  };
};

function useListEdit(i18n) {
  const [state, dispatch] = useSetListEditorContext();
  const [
    { showWarning, isEditingStatic },
    listsEditorDispatch,
  ]: any = useContext(ListsEditorContext);
  const { data, save } = useContext(DataContext);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!showWarning) {
      listsEditorDispatch([ListsEditorStateActions.SHOW_WARNING, true]);
      return;
    }
  };

  const validate = () => {
    const { selectedList } = state;
    const errors = validateTitle("list-title", selectedList.title, i18n);
    if (selectedList.items.length <= 0) {
      errors.listItems = {
        children: ["list.errors.empty"],
      };
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const { selectedList, initialName } = state;
    const errors = validate();
    if (hasValidationErrors(errors)) {
      dispatch({
        type: ListActions.LIST_VALIDATION_ERRORS,
        payload: errors,
      });
      return;
    }
    const copy = clone(data);
    if (selectedList.isNew) {
      delete selectedList.isNew;
      copy.addList(selectedList);
    } else {
      const selectedListIndex = copy.lists.findIndex(
        (list) => list.name === initialName
      );
      copy.lists[selectedListIndex] = selectedList;
    }
    await save(copy.toJSON());

    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, false]);
    dispatch({
      type: ListActions.SUBMIT,
    });
  };

  return {
    handleDelete,
    handleSubmit,
    isEditingStatic,
  };
}

export function ListEdit(props) {
  const { i18n } = props;
  const { handleSubmit, handleDelete, isEditingStatic } = useListEdit(i18n);

  const [state, dispatch] = useSetListEditorContext();
  const { selectedList, createItem } = useListItem(state, dispatch);
  const { errors } = state;
  const validationErrors = hasValidationErrors(errors);
  return (
    <>
      {validationErrors && <ErrorSummary errorList={Object.values(errors)} />}
      <form onSubmit={handleSubmit} autoComplete="off">
        {!isEditingStatic && selectedList && (
          <Input
            id="list-title"
            hint={i18n("wontShow")}
            label={{
              className: "govuk-label--s",
              children: [i18n("list.title")],
            }}
            value={selectedList.title}
            onChange={(e) =>
              dispatch({
                type: ListActions.EDIT_TITLE,
                payload: e.target.value,
              })
            }
            errorMessage={
              errors?.title ? { children: errors?.title.children } : undefined
            }
          />
        )}

        <ListItems />
        <a
          className="govuk-link govuk-body govuk-!-display-block govuk-!-margin-bottom-1"
          href="#"
          onClick={createItem}
        >
          {i18n("list.createListItem")}
        </a>
        {!isEditingStatic && (
          <>
            <button
              className="govuk-button"
              type="submit"
              onClick={handleSubmit}
            >
              Save
            </button>
            <a
              href="#"
              className="govuk-link govuk-link--v-centre govuk-!-margin-left-2"
              onClick={handleDelete}
            >
              {i18n("delete")}
            </a>
          </>
        )}
      </form>
    </>
  );
}

export default withI18n(ListEdit);
