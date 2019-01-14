import React from 'react';
import Menu from './Menu'
import css from '../../assets/stylesheets/index.scss';
import { renderRoutes } from '../helpers'

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render () {
    const { route } = this.props;
    const children = renderRoutes(route.routes);
    return (
      <div className={css.content}>
        <div className={css["content-left"]}>
          <Menu />
        </div>
        <div className={css["content-right"]}>
          { children }
        </div>
      </div>
    )
  }
}

export default App;
