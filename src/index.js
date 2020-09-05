import 'aframe';
import 'aframe-fps-counter-component';

import './aframe-components/camera-controls';

import { Scene } from './components/Scene';
import { store } from './state/store';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

ReactDOM.unstable_createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <Scene />
    </Provider>
);
