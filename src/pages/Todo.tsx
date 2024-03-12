import { useUnit } from 'effector-react';

import {
    $searched,
    todoAdded,
    todoRemoved,
    todosReset,
    searchUpdatedDebounce,
    getTodosFx,
} from '../../stores/todos';

function Todo() {
    const searched = useUnit($searched);
    const pending = useUnit(getTodosFx.pending);

    return (
        <div className="m-auto w-fit p-20 flex flex-col justify-between">
            {pending ? (
                <div className="text-3xl font-bold text-gray-600">Loading...</div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold mb-8 text-cyan-900">Todos</h1>

                    <input
                        onChange={searchUpdatedDebounce}
                        type="text"
                        className="w-full h-10 bg-cyan-100 rounded-mg mb-8 py-2 px-4"
                        placeholder="Enter your search term"
                    />

                    <div className="flex gap-5 mb-8">
                        <button
                            onClick={() => todosReset()}
                            className="bg-rose-800 text-white p-2 rounded-xl"
                        >
                            <h2>Reset todos</h2>
                        </button>

                        <button
                            onClick={() => todoAdded()}
                            className="bg-emerald-800 text-white p-2 rounded-xl"
                        >
                            <h2>Add todo</h2>
                        </button>

                        <button
                            onClick={() => getTodosFx()}
                            className="bg-emerald-800 text-white p-2 rounded-xl"
                        >
                            <h2>Load todo</h2>
                        </button>
                    </div>
                    <div className="flex flex-col gap-5">
                        {searched.map((todo) => {
                            return (
                                <div className="bg-cyan-50 p-5 rounded-xl">
                                    <h3>Title: {todo.title}</h3>
                                    <div>Description: {todo.description}</div>
                                    <div>Deadline: {todo.deadline}</div>
                                    <button onClick={() => todoRemoved(todo.id)}>x</button>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

export { Todo };
