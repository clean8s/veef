import React from "react"
import Serv from "react-dom/server"

console.log(Serv.renderToStaticMarkup(<v-search x={{a: 4}}></v-search>))