import { createEffect, createEvent, createStore } from 'effector';
import { debounce } from '../src/utils';

interface Todo {
    id: string;
    title: string;
    description: string;
    deadline: string;
}

interface ExternalTodo {
    completed: boolean;
    id: number;
    title: string;
    userId: number;
}

interface Store {
    todos: Todo[];
    api: {
        loading: boolean;
        failed: boolean;
    };
    filter: string;
}

function createTodos(quantity: number = 10): Todo[] {
    const todos: Todo[] = [];

    for (let i = 0; i < quantity; i++) {
        todos.push({
            id: String(i),
            title: `title ${i}`,
            description: `description ${i}`,
            deadline: '23.03.2024',
        });
    }

    return todos;
}

const removeTodoEvent = createEvent<string>();
const resetTodosEvent = createEvent();
const addTodoEvent = createEvent();
const updateFilter = createEvent<string>();

const updateFilterPrepended = updateFilter.prepend(
    (event: React.ChangeEvent<HTMLInputElement>) => event.target.value,
);

const updateFilterPrependedDebounced = debounce(updateFilterPrepended);

async function asyncTimeout(timeout = 3000): Promise<void> {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, timeout);
    });
}

const getTodosFx = createEffect(async (): Promise<ExternalTodo[]> => {
    const todos = (await fetch('https://jsonplaceholder.typicode.com/todos')).json();

    await asyncTimeout();

    return todos;
});

const $store = createStore<Store>({ todos: [], api: { loading: false, failed: false }, filter: '' })
    .on(removeTodoEvent, (state, id) => {
        return { ...state, todos: state.todos.filter((todo) => todo.id !== id) };
    })
    .on(addTodoEvent, (state) => {
        const id = crypto.randomUUID();

        return {
            ...state,
            todos: [
                {
                    id,
                    title: `title ${id}`,
                    description: `description ${id}`,
                    deadline: `24.04.2024`,
                },
                ...state.todos,
            ],
        };
    })
    .on(getTodosFx.pending, (state) => {
        return {
            ...state,
            api: { failed: false, loading: getTodosFx.pending.getState() },
        };
    })
    .on(getTodosFx.doneData, (state, todos) => {
        return {
            ...state,

            todos: [
                ...state.todos,
                ...todos
                    .map((todo) => ({
                        title: todo.title,
                        description: `description ${todo.id}`,
                        id: String(todo.id),
                        deadline: '25.04.2024',
                    }))
                    .slice(0, 20),
            ],
        };
    })
    .on(getTodosFx.finally, (state) => {
        return {
            ...state,
            api: { failed: false, loading: getTodosFx.pending.getState() },
        };
    })
    .on(updateFilter, (state, filter) => {
        return {
            ...state,
            filter,
        };
    })
    .reset(resetTodosEvent);

const $todosFiltered = $store.map((state) => {
    return state.todos.filter((todo) => todo.description.includes(state.filter));
});

export {
    $store,
    $todosFiltered,
    removeTodoEvent,
    addTodoEvent,
    resetTodosEvent,
    updateFilter,
    updateFilterPrepended,
    updateFilterPrependedDebounced,
    getTodosFx,
};
