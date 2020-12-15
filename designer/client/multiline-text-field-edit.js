import React, { useContext } from "react";
import { ComponentContext } from "./reducers/component/componentReducer";
import { Actions } from "./reducers/component/types";

import { TextFieldEdit } from "./component-editors/text-field-edit";

export function MultilineTextFieldEdit({ context }) {
  const [{ selectedComponent }, dispatch] = useContext(
    !!context ? context : ComponentContext
  );
  const { schema = {} } = selectedComponent;
  return (
    <TextFieldEdit>
      <input
        className="govuk-input govuk-input--width-3"
        id="field-options-rows"
        name="options.rows"
        type="text"
        data-cast="number"
        value={schema.options.rows}
        onChange={(e) =>
          dispatch({
            type: Actions.EDIT_SCHEMA_ROWS,
            payload: e.target.value,
          })
        }
      />
    </TextFieldEdit>
  );
}
