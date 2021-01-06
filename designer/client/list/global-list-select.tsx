import { ListActions } from "../reducers/listActions";
import { DataContext } from "../context";
import React, { useContext } from "react";
import { withI18n } from "../i18n";
import { ListContext } from "../reducers/listReducer";
import {
  ListsEditorContext,
  ListsEditorStateActions,
} from "../reducers/list/listsEditorReducer";

export function GlobalListSelect(props) {
  const { i18n } = props;
  const { data } = useContext(DataContext);
  const [_state, dispatch]: any = useContext(ListContext);
  const [_editorState, listsEditorDispatch]: any = useContext(
    ListsEditorContext
  );

  const editList = (e, list) => {
    e.preventDefault();
    dispatch({
      type: ListActions.SET_SELECTED_LIST,
      payload: list,
    });
    listsEditorDispatch([ListsEditorStateActions.IS_EDITING_LIST, true]);
  };

  return (
    <ul className="govuk-list">
      {data.lists.map((list) => (
        <li key={list.name}>
          <a href="#" onClick={(e) => editList(e, list)}>
            {list.title || list.name}
          </a>
        </li>
      ))}
      <li>
        <hr />
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: ListActions.ADD_NEW_LIST });
            listsEditorDispatch([
              ListsEditorStateActions.IS_EDITING_LIST,
              true,
            ]);
          }}
        >
          {i18n("list.newTitle")}
        </a>
      </li>
    </ul>
  );
}
export default withI18n(GlobalListSelect);
