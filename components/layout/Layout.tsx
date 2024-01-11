import React from "react"
import AdminDashboard from "./admin/Dashboard"
import EmpDashboard from "./employee/Dashboard"
import Emp2Dashboard from "./employee2/Dashboard"
import { useRouter } from "next/router"

const Layout = ({ children }: any) => {
  const router = useRouter()
  const path = `${router.pathname}`.split("/")

  const layout =
    router.pathname === "/login" || router.pathname === "/logout" ? (
      <>{children}</>
    ) : path[1] === "admin" ? (
      <AdminDashboard>{children}</AdminDashboard>
    ) : path[1] === "employee" ? (
      <EmpDashboard>{children}</EmpDashboard>
    ) : (<Emp2Dashboard>{children}</Emp2Dashboard>)

  return layout
}

export default Layout
