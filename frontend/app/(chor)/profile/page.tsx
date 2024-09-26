"use client";

import Profile from "./components/Profile";
import useGetUser from "./hooks/useGetUser";


export default function Page() {
  const { data: user } = useGetUser("0");


  return user && <Profile id={user.id} />;
}
