import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { dispatchError } from "../features/error/errorSlice";
import { getUsers } from "../utils/api";

export default function useGetUsers() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);

  const fetchGetUsers = useCallback(() => {
    getUsers()
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        dispatch(dispatchError(error.message));
      });
  }, []);

  return { users, fetchGetUsers };
}
