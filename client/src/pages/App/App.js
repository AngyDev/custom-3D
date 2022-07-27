import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Alert from "../../components/atoms/Alert/Alert";
import Dashboard from "../../components/Dashboard/Dashboard";
import LayoutEditor from "../../components/Layout/LayoutEditor";
import ProtectedRoute from "../../components/ProtectedRoute/ProtectedRoute";
import Spinner from "../../components/atoms/Spinner/Spinner";
import { AppWrapper } from "../../context/AppContext";
import { dispatchError, getError } from "../../features/error/errorSlice";
import { getLoading } from "../../features/loading/loadingSlice";
import Login from "../Login/Login";
import Register from "../Register/Register";

export default function App() {
  const error = useSelector(getError);
  const loading = useSelector(getLoading);
  const isOpen = !!error && error.error !== "";
  const dispatch = useDispatch();

  // add alert when user reload or leave the page
  useEffect(() => {
    window.addEventListener("beforeunload", alertLogout);
    return () => {
      window.removeEventListener("beforeunload", alertLogout);
    };
  }, []);

  const alertLogout = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const closeModal = () => {
    dispatch(dispatchError(""));
  };

  return (
    <AppWrapper>
      <div className="font-app container-app">
        {loading ? <Spinner /> : ""}
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              {/* <Dashboard /> */}
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/dashboard">
              <ProtectedRoute>
                <Dashboard archived={false} />
              </ProtectedRoute>
            </Route>
            <Route path="/editor/:id">
              <ProtectedRoute>
                <LayoutEditor />
              </ProtectedRoute>
            </Route>
            <Route path="/archived">
              <ProtectedRoute>
                <Dashboard archived={true} />
              </ProtectedRoute>
            </Route>
          </Switch>
        </BrowserRouter>
        <Alert text={error.error} open={isOpen} onClose={closeModal} />
      </div>
    </AppWrapper>
  );
}
