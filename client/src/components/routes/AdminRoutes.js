import React from "react";
import { useAuth } from "../../Context/AuthContext";
import CreatePrivateInstance from "../AxiosInstance";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Spinner from "../Spinners/Spinner";
import Unauthorized from "../Spinners/Unauthorized";

export const AdminPrivate = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = CreatePrivateInstance();

  const checkUser = async () => {
    const { data } = await axiosPrivate.get(
      `${process.env.REACT_APP_API}/api/v1/user/private-auth`
    );
    if (data?.ok) {
      setOk(true);
      setLoading(false);
    } else {
      setOk(false);
      setLoading(false);
    }
  };
  // useffect for admin..
  useEffect(() => {
    setLoading(true);
    auth.accessToken ? checkUser() : console.log("Error in log");
  }, [auth?.accessToken]);
  return ok && auth?.user?.role === 1 ? (
    loading ? (
      <Spinner />
    ) : auth?.user?.verified === true ? (
      <Outlet />
    ) : (
      navigate("/verify-email")
    )
  ) : loading ? (
    <Spinner />
  ) : (
    <Unauthorized />
  );
};
