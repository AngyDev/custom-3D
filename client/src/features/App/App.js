import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Alert from "../../components/Alert/Alert";
import Dashboard from "../../components/Dashboard/Dashboard";
import LayoutEditor from "../../components/Layout/LayoutEditor";
import { AppWrapper } from "../../context/AppContext";
import { dispatchError, getError } from "../../features/error/errorSlice";

export default function App() {
  const error = useSelector(getError);
  const isOpen = !!error && error.error !== "";
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(dispatchError(""));
  };

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
        <Alert text={error.error} open={isOpen} onClose={closeModal} />
      </div>
    </AppWrapper>
  );
}
