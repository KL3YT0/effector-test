type CB = (...args: any[]) => unknown;

const debounce = (fn: CB, ms = 300) => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: unknown, ...args: unknown[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

async function asyncTimeout(timeout = 3000): Promise<void> {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, timeout);
    });
}

export { debounce, asyncTimeout };
