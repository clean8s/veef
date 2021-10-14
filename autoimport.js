import {fileURLToPath} from "url"
import {parse, dirname, join as pathJoin} from "path"


function getThisDir() {
    return dirname(fileURLToPath(import.meta.url))
}

export {getThisDir, pathJoin}