import Webgl from '../component/Content/Webgl/webgl';
import Webgl02 from '../component/Content/Webgl/webgl02';
import Webgl03 from '../component/Content/Webgl/webgl03';
import Webgl04 from '../component/Content/Webgl/webgl04';
import App from '../component/App.jsx'

const routes = [
  {
    component: App,
    routes: [
      { path: '/webgl', exact: true, component: Webgl },
      { path: '/webgl02', exact: true, component: Webgl02 },
      { path: '/webgl03', exact: true, component: Webgl03 },
      { path: '/webgl04', exact: true, component: Webgl04 }
    ]
  }
];

export default routes;