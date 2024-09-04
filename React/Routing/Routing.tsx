import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { StoreInterface } from "../Redux/Store";
import GuardedRoutes from "../components/Guards/GuardedRoutes";
import UnGuardedRoutes from "../components/Guards/UnGuardedRoutes";
import Header from "../components/Header/Header";
import Snackbar from "../components/snackbar/Snackbar";
import EnterCode from "./EnterCode/EnterCode";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import Home from "./Home/Home";
import Layout from "./Layout";
import { ListOfUsers } from "./ListOfUsers/ListOfUsers";
import Login from "./Login/Login";
import UserDetails from "./UserDetails/UserDetails";
import UserShoppingList from "./UserShoppingList/UserShoppingList";

export default function Routing(): JSX.Element {
  const isAuthenticated = useSelector(
    (store: StoreInterface) => store.profile.isAuthenticated
  );
  let router = createBrowserRouter(
    createRoutesFromElements(
      <Route element={<Layout />}>
        <Route path="/user" element={<Home />}>
          <Route index element={<Navigate to="list" replace />} />
          <Route
            path="list"
            element={
              <GuardedRoutes isAuthenticated={isAuthenticated}>
                <>
                  <Header />
                  <ListOfUsers />
                </>
              </GuardedRoutes>
            }
          />
          <Route
            path="shopping-list/:userId"
            element={
              <GuardedRoutes isAuthenticated={isAuthenticated}>
                <>
                  <Header />
                  <UserShoppingList />
                </>
              </GuardedRoutes>
            }
          />
          <Route
            path=":userId"
            element={
              <GuardedRoutes isAuthenticated={isAuthenticated}>
                <UserDetails />
              </GuardedRoutes>
            }
          />

          <Route path="*" element={<Navigate to="list" replace />} />
        </Route>
        <Route
          path="/forgot-password"
          element={
            <UnGuardedRoutes isAuthenticated={isAuthenticated}>
              <ForgotPassword />
            </UnGuardedRoutes>
          }
        />
        <Route
          path="/enter-code"
          element={
            <UnGuardedRoutes isAuthenticated={isAuthenticated}>
              <EnterCode />
            </UnGuardedRoutes>
          }
        />
        <Route
          path="/"
          index
          element={
            <UnGuardedRoutes isAuthenticated={isAuthenticated}>
              <Login />
            </UnGuardedRoutes>
          }
        />

        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "user/list" : "/"} replace />
          }
        />
      </Route>
    )
  );

  return (
    <>
      <Snackbar />
      <RouterProvider router={router} />
    </>
  );
}
