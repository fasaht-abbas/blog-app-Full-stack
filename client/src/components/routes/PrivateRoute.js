import React from "react";
import { useAuth } from "../../Context/AuthContext";
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import CreatePrivateInstance from "../AxiosInstance";
import toast from "react-hot-toast";
import Spinner from "../Spinners/Spinner";
import Unauthorized from "../Spinners/Unauthorized";

export const Privates = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = CreatePrivateInstance();

  const checkUser = async () => {
    setLoading(true);
    try {
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
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Your need to login first");
    }
  };

  useEffect(() => {
    auth?.accessToken ? checkUser() : console.log("No user logged in");
  }, [auth?.accessToken]);
  return loading ? (
    <Spinner />
  ) : ok ? (
    auth?.user?.verified === true ? (
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
