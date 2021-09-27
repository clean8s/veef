import {Logo} from './logo'
import 'virtual:windi.css'
import {Rx} from "./lib/rx";

Rx((props) => {
    return <div>another one {JSON.stringify(props.data)}</div>
}, {
    tagName: "x-other",
    propTypes: {
        data: Object
    }
})

Rx((props) => {
    return (
        <>
            <Logo/>
            <p className="text-[red]">Hello Vite + Preact!</p>
            <x-demo domAttr={domAttr({a: 5})}/>
            <x-other data={{a: 5}}/>
            <p>
                <a
                    class="link"
                    href="https://preactjs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn Preact
                </a>
            </p>
        </>
    )
}, {
    tagName: "x-app",
    propTypes: {
        "age": Number
    }
})