import sinon from "sinon";
import React, { useReducer } from "react";
import { mount } from "enzyme";
import * as Code from "@hapi/code";
import * as Lab from "@hapi/lab";

import { DataContext } from "../client/context";
import { Data } from "@xgovformbuilder/model";
import { GlobalListSelect } from "../client/list/global-list-select";
import { ComponentListSelect } from "../client/list/component-list-select";
import {
  ComponentContext,
  componentReducer,
  initComponentState,
} from "../client/reducers/component/componentReducer";
import { ListsEditorContextProvider } from "../client/reducers/list/listsEditorReducer";
import { ListContextProvider } from "../client/reducers/listReducer";

const { expect } = Code;
const lab = Lab.script();
exports.lab = lab;
const { test, suite, beforeEach } = lab;

suite("GlobalListSelect", () => {
  let i18n;

  let data = new Data({
    pages: [
      {
        title: "First page",
        path: "/first-page",
        components: [
          {
            name: "IDDQl4",
            title: "abc",
            schema: {},
            options: {
              required: true,
            },
            type: "RadiosField",
            values: {
              type: "static",
              valueType: "string",
              items: [
                { label: "My item", value: "12", children: [] },
                {
                  label: "Item 2",
                  hint: "My hint",
                  value: "11",
                  condition: "Abcewdad",
                  children: [],
                },
                {
                  label: "Item 3",
                  value: "13",
                  children: [{ type: "TextField" }],
                },
              ],
            },
          },
        ],
      },
    ],
    lists: [
      {
        name: "myList",
        title: "My list",
        type: "number",
        items: [{ text: "An item", description: "A hint", value: 12 }],
      },
      {
        name: "myOtherList",
        title: "",
        type: "string",
        items: [{ text: "An item", description: "A hint", value: 12 }],
      },
    ],
  });
  const dataValue = { data, save: sinon.spy() };

  beforeEach(() => {
    i18n = sinon.spy();
  });

  const TestComponentContextProvider = ({
    children,
    dataValue,
    componentValue,
  }) => {
    const initComponentValue = (initialState) => {
      return !!componentValue ? componentValue : initialState;
    };
    const [state, dispatch] = useReducer(
      componentReducer,
      initComponentState({ component: dataValue.data.pages[0].components[0] }),
      initComponentValue
    );
    return (
      <DataContext.Provider value={dataValue}>
        <ListsEditorContextProvider>
          <ComponentContext.Provider value={[state, dispatch]}>
            <ListContextProvider>{children}</ListContextProvider>
          </ComponentContext.Provider>
        </ListsEditorContextProvider>
      </DataContext.Provider>
    );
  };

  test("Lists all available lists and the static list", () => {
    const wrapper = mount(
      <TestComponentContextProvider dataValue={dataValue}>
        <ComponentListSelect i18n={i18n} />
      </TestComponentContextProvider>
    );
    const options = () => wrapper.find(ComponentListSelect).find("option");
    expect(options().length).to.equal(4);
    expect(options().get(0).props).to.equal({});
    expect(options().get(1).props).to.contain({
      value: "static",
      children: "abc",
    });
    expect(options().get(2).props).to.equal({
      value: "myList",
      children: "My list",
    });
    expect(options().get(3).props).to.equal({
      value: "myOtherList",
      children: "",
    });
  });

  test("Selecting a different list changes the edit link", () => {
    const wrapper = mount(
      <TestComponentContextProvider dataValue={dataValue}>
        <ComponentListSelect i18n={i18n} />
      </TestComponentContextProvider>
    );
    const select = () => wrapper.find("select");
    select().simulate("change", { target: { value: "myList" } });
    expect(select().props().value).to.equal("myList");
    expect(i18n.lastCall.args).to.equal(["list.edit", { title: "My list" }]);
  });

  test("Create new static list shows when values is empty", () => {
    const data = new Data({
      pages: [
        {
          title: "First page",
          path: "/first-page",
          components: [,],
        },
      ],
    });
    const dataValue = { data, save: sinon.spy() };
    const wrapper = mount(
      <TestComponentContextProvider dataValue={dataValue}>
        <ComponentListSelect i18n={i18n} />
      </TestComponentContextProvider>
    );
    expect(wrapper.find("list.static.newTitle")).to.exist();
  });

  test("Force user to save for new components before allowing to create a static list", () => {
    const componentValue = {
      selectedComponent: {
        name: "IDDQl4",
        title: "abc",
        schema: {},
        options: {
          required: true,
        },
        type: "RadiosField",
        isNew: true,
      },
    };
    const wrapper = mount(
      <TestComponentContextProvider
        dataValue={dataValue}
        componentValue={componentValue}
      >
        <ComponentListSelect i18n={i18n} />
      </TestComponentContextProvider>
    );

    expect(wrapper.find("list.static.saveFirst")).to.exist();
  });
});
