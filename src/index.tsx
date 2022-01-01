import React from 'react'
import '../demos/types.d.ts'
import '../icons/customElement'


export type Component<T> = React.ComponentType<T>
export type VNode = React.ReactNode


import {Tree, Dialog, Table, Alert, CodeEditor, Tabs, VeefElement, Search, loadComponents} from "./veef";
export {Tree, Dialog, Table, Alert, CodeEditor, Tabs, VeefElement, Search};

// TODO: Make different versions of the library
// one of which doesn't auto-load the components.
// loadComponents()

type WindiProps = { idx: number, children?: any }

loadComponents({})
