import { useStore } from 'effector-react';

import './App.css';
import { $store, addTodoEvent, removeTodoEvent, resetTodosEvent, getTodosFx } from '../stores/todos';

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
    const todos = useStore($store);

    return (
        <div className="m-auto w-fit p-20 flex flex-col justify-between">
            <h1 className="text-3xl font-bold mb-8 text-cyan-900">Todos</h1>

            <div className="flex gap-5 mb-8">
                <button onClick={() => resetTodosEvent()} className="bg-rose-800 text-white p-2 rounded-xl">
                    <h2>Reset todos</h2>
                </button>

                <button onClick={() => addTodoEvent()} className="bg-emerald-800 text-white p-2 rounded-xl">
                    <h2>Add todo</h2>
                </button>

                <button onClick={() => getTodosFx()} className="bg-emerald-800 text-white p-2 rounded-xl">
                    <h2>Load todo</h2>
                </button>
            </div>

            <div className="flex flex-col gap-5">
                {todos.map((todo) => {
                    return (
                        <div className="bg-cyan-50 p-5 rounded-xl">
                            <h3>Title: {todo.title}</h3>
                            <div>Description: {todo.description}</div>
                            <div>Deadline: {todo.deadline}</div>
                            <button onClick={() => removeTodoEvent(todo.id)}>x</button>
                        </div>
                    );
                })}
            </div>
            {/* <div>Count: {store.count}</div> */}
            {/* <button onClick={() => incEvent()}>inc</button> */}
        </div>
    );
}

export default App;
