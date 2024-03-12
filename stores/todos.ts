import { createEffect, createEvent, createStore, sample } from 'effector';
import { toast } from 'react-toastify';
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

const $todos = createStore<Todo[]>([]);
const $search = createStore('');

const todoRemoved = createEvent<string>();
const todosReset = createEvent();
const todoAdded = createEvent();
const searchUpdated = createEvent<string>();

const searchUpdatedPrepend = searchUpdated.prepend(
    (event: React.ChangeEvent<HTMLInputElement>) => event.target.value,
);

const searchUpdatedDebounce = debounce(searchUpdatedPrepend);

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

todoRemoved.watch((value) => {
    toast(`Todo ${value} removed successfully`);
});

getTodosFx.done.watch(() => {
    toast('Todos loaded successfully', { type: 'success' });
});

getTodosFx.fail.watch(() => {
    toast('Todos loaded with error', { type: 'error' });
});

$todos
    .on(todoRemoved, (todos, id) => {
        return todos.filter((todo) => todo.id !== id);
    })
    .on(todoAdded, (todos) => {
        const id = crypto.randomUUID();

        return [
            {
                id,
                title: `title ${id}`,
                description: `description ${id}`,
                deadline: `24.04.2024`,
            },
            ...todos,
        ];
    })
    .on(getTodosFx.doneData, (todos, loadedTodos) => {
        return [
            ...todos,
            ...loadedTodos
                .map((todo) => ({
                    title: todo.title,
                    description: `description ${todo.id}`,
                    id: String(todo.id),
                    deadline: '25.04.2024',
                }))
                .slice(0, 20),
        ];
    })
    .reset(todosReset);

$search.on(searchUpdated, (_, search) => {
    return search;
});

const $searched = sample({
    source: { todos: $todos, search: $search },
    fn: ({ todos, search }) => {
        return todos.filter((todo) => todo.title.includes(search));
    },
});

export { $searched, todoRemoved, todoAdded, todosReset, searchUpdatedDebounce, getTodosFx };
