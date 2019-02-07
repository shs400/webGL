import Webgl from '../component/Content/Webgl/webgl';
import Webgl02 from '../component/Content/Webgl/webgl02';
import Webgl03 from '../component/Content/Webgl/webgl03';
import Webgl04 from '../component/Content/Webgl/webgl04';
import Webgl05 from '../component/Content/Webgl/webgl05';
import Webgl06 from '../component/Content/Webgl/webgl06';
import App from '../component/App.jsx'

const routes = [
  {
    component: App,
    routes: [
      { path: '/webgl', exact: true, component: Webgl },
      { path: '/webgl02', exact: true, component: Webgl02 },
      { path: '/webgl03', exact: true, component: Webgl03 },
      { path: '/webgl04', exact: true, component: Webgl04 },
      { path: '/webgl05', exact: true, component: Webgl05 },
      { path: '/webgl06', exact: true, component: Webgl06 }
    ]
  }
];

export default routes;