import 'react'
declare global {
    namespace JSX  {
    interface IntrinsicElements {
        "v-icon": { class?: string, name: string, size?: string, color?: string, style?: string, onClick?: Function }
    }
}
}