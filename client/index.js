import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';

if (module.hot) {
    module.hot.accept();
}

ReactDOM.render(<App/>, document.getElementById('root'));

