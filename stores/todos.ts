import { attach, combine, createEvent, createStore } from 'effector';
import { toast } from 'react-toastify';
import { debounce } from '../src/utils';
import * as api from '../src/api';
import { Todo } from '../src/types';

const $todos = createStore<Todo[]>([]);
const $search = createStore('');

const todoRemoved = createEvent<string>();
const todosReset = createEvent();
const todoAdded = createEvent();
const searchUpdated = createEvent<string>();

const getTodosFx = attach({ effect: api.getTodosFx });

const searchUpdatedPrepend = searchUpdated.prepend(
    (event: React.ChangeEvent<HTMLInputElement>) => event.target.value,
);

const searchUpdatedDebounce = debounce(searchUpdatedPrepend);

todoRemoved.watch((value) => {
    toast(`Todo ${value} removed successfully`);
});

api.getTodosFx.done.watch(() => {
    toast('Todos loaded successfully', { type: 'success' });
});

api.getTodosFx.fail.watch(() => {
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

const $searched = combine($todos, $search, (todos, search) => {
    return todos.filter((todo) => todo.title.includes(search));
});

export { $searched, todoRemoved, todoAdded, todosReset, getTodosFx, searchUpdatedDebounce };
