import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Dashboard from "../../components/Dashboard/Dashboard";
import LayoutEditor from "../../components/Layout/LayoutEditor";
import { AppWrapper } from "../../context/AppContext";

export default function App() {
  return (
    <AppWrapper>
      <div className="font-app">
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route path="/editor/:id">
              <LayoutEditor />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </AppWrapper>
  );
}
