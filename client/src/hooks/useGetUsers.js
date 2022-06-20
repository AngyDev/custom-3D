import { useCallback, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { UserContext } from "../context/UserContext";
import { dispatchError } from "../features/error/errorSlice";
import { getUsers } from "../utils/api";

export default function useGetUsers() {
  const dispatch = useDispatch();
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);

  const fetchGetUsers = useCallback(() => {
    getUsers()
      .then((res) => {
        // remove the logged user from the list
        const resUsers = res.data.filter((item) => item.id !== user.id);
        setUsers(resUsers);
      })
      .catch((error) => {
        dispatch(dispatchError(error.message));
      });
  }, []);

  return { users, fetchGetUsers };
}
