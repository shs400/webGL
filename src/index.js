import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import routes from './router/index.js'
import { renderRoutes } from './helpers'
import '../assets/stylesheets/index.scss';


const Root = () => (
  <BrowserRouter>
    {renderRoutes(routes)}
  </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));