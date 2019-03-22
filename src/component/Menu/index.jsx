import React from 'react';
import { Link } from 'react-router-dom';
import css from './index.pcss'

class Menu extends React.Component{
  render() {
    return (
      <div className={css.menu}>
        <ul>
          <li className={css.item}><Link to="/webgl">WebGL 01</Link></li>
          <li className={css.item}><Link to="/webgl02">WebGL 02</Link></li>
          <li className={css.item}><Link to="/webgl03">WebGL 03</Link></li>
          <li className={css.item}><Link to="/webgl04">WebGL 04</Link></li>
          <li className={css.item}><Link to="/webgl05">WebGL 05</Link></li>
          <li className={css.item}><Link to="/webgl06">WebGL 06</Link></li>
          <li className={css.item}><Link to="/webgl07">WebGL 07</Link></li>
          <li className={css.item}><Link to="/webgl08">WebGL 08</Link></li>
          <li className={css.item}><Link to="/webgl09">WebGL 09</Link></li>
        </ul>
      </div>
    )
  }
}

export default Menu;