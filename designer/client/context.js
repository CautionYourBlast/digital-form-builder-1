import React, { createContext } from "react";

export const FlyoutContext = createContext({
  count: 0,
  increment: () => {},
  decrement: () => {},
});

export const DataContext = createContext({
  data: {},
  save: async () => {},
});

export const PageContext = createContext({
  page: {},
  update: () => {},
});
