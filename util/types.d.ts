export {};
declare module "preact" {
    namespace JSX {
        interface IntrinsicElements {
            'v-icon': any,
            'v-tabs': any,
            'v-alert': any,
            'v-search': any,
            'v-tree': any,
            'v-dialog': any,
            'v-table': any,
            'v-code': any,
            'template': any,
            'v-grid': any,
            'v-card': any,
        }

        interface IntrinsicAttributes {
            dangerouslySetInnerHTML?: {
                __html: string;
            };
        }
    }
}