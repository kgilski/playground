type HTMLAttributes = {
    id?: string;
    className?: string;
    children?: any;
    [`data-${string}`]: string;
    [key: string]: any;
};

declare global {
    export namespace JSX {
        interface IntrinsicElements {
            div: HTMLAttributes;
        }
    }
}

export {};
