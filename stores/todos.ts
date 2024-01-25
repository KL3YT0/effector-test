import { createEffect, createEvent, createStore } from 'effector';

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

const getTodosFx = createEffect(async (): Promise<ExternalTodo[]> => {
    const todos = (await fetch('https://jsonplaceholder.typicode.com/todos')).json();

    return todos;
});

const $store = createStore<Todo[]>(createTodos())
    .on(removeTodoEvent, (state, id) => {
        return state.filter((todo) => todo.id !== id);
    })
    .on(addTodoEvent, (state) => {
        const id = crypto.randomUUID();

        console.log(id);

        return [
            {
                id,
                title: `title ${id}`,
                description: `description ${id}`,
                deadline: `24.04.2024`,
            },
            ...state,
        ];
    })
    .on(getTodosFx.doneData, (_, todos) => {
        return todos
            .map((todo) => ({
                title: todo.title,
                description: `description ${todo.id}`,
                id: String(todo.id),
                deadline: '25.04.2024',
            }))
            .slice(0, 20);
    })
    .reset(resetTodosEvent);

export { $store, removeTodoEvent, addTodoEvent, resetTodosEvent, getTodosFx };
