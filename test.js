import {Processor} from "windicss/lib"
console.log(new Processor().compile("w-40 h-20 lg:bg-red-300").styleSheet)
