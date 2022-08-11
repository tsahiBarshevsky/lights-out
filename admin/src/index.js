import React from 'react';
import ReactDom from 'react-dom';
import App from './App';
import { ModalProvider } from 'styled-react-modal';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux/reducers';
import { ModalBackground } from './components/Modal Background';

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDom.render(
    <Provider store={store}>
        <ModalProvider backgroundComponent={ModalBackground}>
            <App />
        </ModalProvider>
    </Provider>,
    document.getElementById('root')
);