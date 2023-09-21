/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import { Button, Result } from "antd";
import { findItemByKey } from "components/main-menu";
import { useSession } from "./session-context";
import { Routes } from "./config";
import { useGlobalData } from "./global-context";

const ProtectedRoute = (props) => {
  const { session } = useSession();
  const [globalData, setGlobalData] = useGlobalData();

  useEffect(() => {
    const mGlobalData = {
      activeRoute: props.activeRoute,
      menuData: globalData.menuData,
      activeMenuItem: props.activeMenuItem,
    };
    if (globalData.menuData && props.activeMenuItem) {
      const item = findItemByKey(globalData.menuData, props.activeMenuItem);
      mGlobalData.activeMenu = item;
    }
    setGlobalData(mGlobalData);
  }, [
    setGlobalData,
    props.activeMenuItem,
    globalData.menuData,
    props.activeRoute,
  ]);

  if (!session.email) {
    return <Redirect to={Routes.signIn.path} />;
  }
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Route {...props} />;
};

ProtectedRoute.defaultProps = {
  activeRoute: undefined,
};

export const RootRoutes = () => {
  const history = useHistory();
  return (
    <Switch>
      <ProtectedRoute
        activeMenuItem={Routes.main.activeMenuItem}
        path="/"
        exact
      >
        <Redirect to={Routes.main.path} />
      </ProtectedRoute>
      <Route path={Routes.main.path} component={Routes.main.component} />
      <Route path={Routes.signIn.path} component={Routes.signIn.component} />
      <Route path={Routes.signUp.path} component={Routes.signUp.component} />
      <Route>
        <Result
          status="404"
          title="404"
          subTitle="对不起, 您访问的页面不存在."
          extra={
            <Button type="primary" onClick={() => history.push("/main")}>
              返回主页
            </Button>
          }
        />
      </Route>
    </Switch>
  );
};

export const MainRoutes = () => {
  const history = useHistory();
  // const { session } = useSession();
  // const authorities = session.authorities;
  const mapRoutes = () => {
    const routes = [];
    const routeRecord = Routes.main.routes;
    Object.keys(routeRecord).forEach((item) => {
      const route = routeRecord[item];
      routes.push(
        <ProtectedRoute
          activeRoute={route}
          activeMenuItem={route.activeMenuItem}
          key={item}
          path={route.path}
          component={route.component}
        />
      );
    });
    return routes;
  };
  return (
    <Switch>
      <ProtectedRoute
        activeMenuItem={Routes.main.activeMenuItem}
        path={Routes.main.path}
        exact
      >
        <Redirect to={Routes.main.routes.dashboard.path} />
      </ProtectedRoute>
      {mapRoutes()}
      <Route>
        <Result
          status="404"
          title="404"
          subTitle="对不起, 您访问的页面不存在."
          extra={
            <Button type="primary" onClick={() => history.push("/main")}>
              返回主页
            </Button>
          }
        />
      </Route>
    </Switch>
  );
};
