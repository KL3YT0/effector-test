import { createEffect } from 'effector';
import { ExternalTodo } from '../types';
import { asyncTimeout } from '../utils';

const getTodosFx = createEffect(async (): Promise<ExternalTodo[]> => {
    const todos = (await fetch('https://jsonplaceholder.typicode.com/todos')).json();

    await asyncTimeout();

    return todos;
});

export { getTodosFx };
