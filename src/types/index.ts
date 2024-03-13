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

export type { Todo, ExternalTodo };
