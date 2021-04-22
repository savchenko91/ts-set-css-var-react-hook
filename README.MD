## Usage

This library is a frankenstein from [redux-auto-batched-actions](https://www.npmjs.com/package/redux-auto-batched-actions), redux-batched-action and redux-thunk

```js
import { createStore, applyMiddleware } from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { autoBatchingMiddleware } from 'redux-auto-batched-actions';

const setA = payload => ({type: 'SET_A', payload});
const setB = payload => ({type: 'SET_B', payload});

const reducer = (state={a:0, b:0}, action) => {
    switch (action.type) {
        case 'SET_A': return {...state, a: action.payload}
        case 'SET_B': return {...state, b: action.payload}
        default: return state
    }
}

const saySmthGreat() => console.log('great!')

// Handle bundled actions in reducer
const store = createStore(
    enableBatching(reducer),
    applyMiddleware(autoBatchingMiddleware(
        // thunkExtraArgs
        { saySmthGreat }
    ))
);

store.dispatch([setA(1), setA(2), setB(5)]);

store.getState();

```
