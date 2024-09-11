import LuckySpin from "../pages/luckySpin/LuckySpin";
import { ROUTE_PATH } from "../constants/routePath.constant";
import Export from "../pages/Export/Export";

const routes = [
  {
    label: "Lucky Spin",
    path: ROUTE_PATH.ROOT.INDEX,
    element: <LuckySpin />,
  },
  {
    label: "Export",
    path: ROUTE_PATH.EXPORT.INDEX,
    element: <Export />,
  },
  {
    path: ROUTE_PATH.NOTFOUND.INDEX,
    element: <div>404 Page Not Found</div>,
  },
];

export default routes;
