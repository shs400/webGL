import React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

export function renderRoutes(routes, extraProps = {}, switchProps = {}) {
  return React.createElement(Switch, switchProps, routes.map((route, i) => (
    React.createElement(Route, {
      key: route.key || i,
      path: route.path,
      exact: route.exact,
      strict: route.strict,
      render: (props) => {
        if (route.redirect) {
          return React.createElement(Redirect, { key: route.key, to: route.redirect });
        }
        return React.createElement(route.component, { ...props, ...extraProps, route });
      }
    })
  )));
}