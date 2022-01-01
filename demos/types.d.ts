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
            'v-editor': any,
            'v-controls': any,
            'v-divider': any,
            'v-card-divider': any,
            'v-item': any,
            'v-dropdown': any,
            'raw': any,
            'raw-snippet': any,
        }

        interface IntrinsicAttributes {
            dangerouslySetInnerHTML?: {
                __html: string;
            };
        }

        interface HTMLAttributes {
            onclick?: string
        }
    }
}
