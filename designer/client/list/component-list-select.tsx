import { ListActions } from "../reducers/listActions";
import { DataContext } from "../context";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  ComponentActions,
  ComponentContext,
} from "../reducers/componentReducer";
import { Label } from "@govuk-jsx/label";
import { withI18n } from "../i18n";
import { ListContext } from "../reducers/listReducer";
import {
  ListsEditorContext,
  ListsEditorStateActions,
} from "../reducers/list/listsEditorReducer";

export function ComponentListSelect(props) {
  const { i18n } = props;
  const { data, save } = useContext(DataContext);
  const [_, listsEditorDispatch]: any = useContext(ListsEditorContext);

  const [state, dispatch]: any = useContext(ComponentContext);

  const { selectedListName, selectedComponent, isNew } = state;

  const [{ selectedList }, listDispatch]: any = useContext(ListContext);

  const [selectedListTitle, setSelectedListTitle] = useState(
    selectedList?.title
  );

  useEffect(() => {
    const isStatic = selectedListName === "static";
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_STATIC, isStatic]);
    const list = data.lists.find((list) => list?.name === selectedListName);
    listDispatch({ type: ListActions.SET_SELECTED_LIST, payload: list });
    setSelectedListTitle(list?.title ?? "component list");
  }, [selectedListName]);

  const editList = (e) => {
    dispatch({
      type: ListActions.SET_SELECTED_LIST,
      payload: e.target.value,
    });
  };

  const values = selectedComponent?.values;

  const createStaticList = async (e) => {
    e.preventDefault();
    dispatch({
      type: ComponentActions.ADD_STATIC_LIST,
      payload: true,
    });
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_STATIC, true]);
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, true]);
  };

  return (
    <div className="govuk-form-group">
      <Label htmlFor="field-options-list">{i18n("list.select")}</Label>
      <select
        className="govuk-select govuk-input--width-10"
        id="field-options-list"
        name="options.list"
        value={selectedListName}
        onChange={editList}
      >
        <option />
        {values?.type === "static" && (
          <option value="static">{selectedComponent.title}</option>
        )}
        {data.lists.map((list, index) => {
          return (
            <option key={`${list.name}-${index}`} value={list.name}>
              {list.title}
            </option>
          );
        })}
      </select>

      {!!selectedListName && (
        <a
          href="#"
          className="govuk-link govuk-!-display-block"
          onClick={(e) => {
            e.preventDefault();
            listsEditorDispatch([
              ListsEditorStateActions.IS_EDITING_LIST,
              true,
            ]);
          }}
        >
          {i18n("list.edit", { title: selectedListTitle })}
        </a>
      )}

      {isNew && !selectedListName && (
        <div className="govuk-inset-text govuk-!-margin-top-1">
          <p>{i18n("list.static.saveFirst")}</p>
        </div>
      )}

      {(!isNew || !!values) && !selectedListName && (
        <a
          href="#"
          className="govuk-link govuk-!-display-block"
          onClick={createStaticList}
        >
          {i18n("list.static.newTitle")}
        </a>
      )}
    </div>
  );
}

export default withI18n(ComponentListSelect);
