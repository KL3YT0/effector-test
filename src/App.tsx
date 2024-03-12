import { Todo } from './pages/Todo';
import './App.css';

// interface Store {
//     count: number;
// }

// const incEvent = createEvent();

// const $store = createStore<Store>({
//     count: 10,
// }).on(incEvent, (state) => {
//     return {
//         ...state,
//         count: state.count + 1,
//     };
// });

function App() {
    return <Todo />;
}

export default App;
