declare module "virtual:windi" {
    const content: string;
    export default content;
}

declare module "*.css" {
    const content: string;
    export default content;
}

declare module 'color-string' {
    export function toHex(color: string): string;
    export type Color = string;
}

declare var MonacoSetup: {init: (cb: any)=>void};