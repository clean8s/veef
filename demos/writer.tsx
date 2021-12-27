import {Fragment, FunctionComponent, h} from "preact"
import {render} from "preact-render-to-string";
import {readFileSync, writeFileSync} from "fs";
//@ts-ignore
import {App} from "./main";
import nunjucks from "nunjucks";
//@ts-ignore
import prettyPrint from "pretty"

//@ts-ignore
globalThis["__internalFn"] = () => {
    //@ts-ignore
    globalThis.__q = [h, Fragment];
}

class MyLoader {
    // TODO: use a proper custom block definition
    getSource(name: string) {
        const fl = readFileSync("./assets/full.html", "utf8")
        // const fl = require("./assets/full")
        let src = ""
        const newFl = fl.replace(/{%\s*tpl\s*"(.*?)"\s*%}(.*?){%\s*endtpl\s*%}/gsm, (s: string, arg: string, body: string) => {
            if (arg === name) {
                src = body;
            }
            return ""
        })
        if (name === 'full') {
            return {src: newFl, path: name, noCache: true};
        }
        let path = name;
        return {src, path, noCache: true};
    }
}
const env = new nunjucks.Environment(new MyLoader())

export function write(out: string) {
    let BASE = `

<!DOCTYPE html>
<html lang="en">
${env.render("head", {}).trim()}
${render(<App/>)}
${env.render("footer", {})}
</body>
</html>
`
    const origs: string[] = [];
    let idx = -1;
    BASE = BASE.replace("<script src=\"dist/index.js\"></script>", `<script src="dist/index.js?v${Math.random().toString(16).substring(3)}"></script>`)
    BASE = BASE.replaceAll(/<v-code.*?<\/v-code>/gs, (x) => {
        origs.push(x);
        return `/*code-ref*/`;
    });

    BASE = prettyPrint(BASE).replaceAll('/*code-ref*/', (_: any) => {
        idx++;
        return origs[idx]
    })

    BASE = BASE.replaceAll(/<style>(.*?)<\/style>/gs, (s: string, arg: string) => {
        return `<style>${arg.replaceAll(/$\s*/gsm, "")}</style>`;
    }).replace('"queen-json"', `[{"name":"Bohemian Rhapsody (1975)","value":"song-1"},{"name":"Under Pressure (with David Bowie) (1981)","value":"song-2"},{"name":"Killer Queen (1974)","value":"song-3"},{"name":"Radio Ga Ga (1984)","value":"song-4"},{"name":"Seven Seas of Rhye (1974)","value":"song-5"},{"name":"Another One Bites the Dust (1980)","value":"song-6"},{"name":"Don’t Stop Me Now (1979)","value":"song-7"},{"name":"We Will Rock You (1977)","value":"song-8"},{"name":"You’re My Best Friend (1976)","value":"song-9"},{"name":"Somebody to Love (1976)","value":"song-10"},{"name":"We Are the Champions (1977)","value":"song-11"},{"name":"Love of My Life (live at Festhalle Frankfurt, 2 February 1979) (1979)","value":"song-12"},{"name":"Spread Your Wings (1978)","value":"song-13"},{"name":"I Want to Break Free (1984)","value":"song-14"},{"name":"Who Wants to Live Forever (1986)","value":"song-15"},{"name":"Tie Your Mother Down (1977)","value":"song-16"},{"name":"Crazy Little Thing Called Love (1979)","value":"song-17"},{"name":"These Are the Days of Our Lives (1991)","value":"song-18"},{"name":"Now I’m Here (1975)","value":"song-19"},{"name":"Bicycle Race (1978)","value":"song-20"},{"name":"Fat Bottomed Girls (1978)","value":"song-21"},{"name":"The Show Must Go On (1991)","value":"song-22"},{"name":"Keep Yourself Alive (1973)","value":"song-23"},{"name":"Too Much Love Will Kill You (1996)","value":"song-24"},{"name":"Good Old Fashioned Lover Boy (1977)","value":"song-25"},{"name":"One Vision (1985)","value":"song-26"},{"name":"Play the Game (1980)","value":"song-27"},{"name":"I Want It All (1989)","value":"song-28"},{"name":"A Kind of Magic (1986)","value":"song-29"},{"name":"Save Me (1980)","value":"song-30"},{"name":"Hammer to Fall (1984)","value":"song-31"},{"name":"You Don’t Fool Me (1996)","value":"song-32"},{"name":"Let Me Live (1996)","value":"song-33"},{"name":"Back Chat (1982)","value":"song-34"},{"name":"A Winter’s Tale (1995)","value":"song-35"},{"name":"Innuendo (1991)","value":"song-36"},{"name":"Flash (1980)","value":"song-37"},{"name":"I’m Going Slightly Mad (1991)","value":"song-38"},{"name":"Thank God It’s Christmas (1984)","value":"song-39"},{"name":"Las Palabras de Amor (the Words of Love) (1982)","value":"song-40"},{"name":"It’s a Hard Life (1984)","value":"song-41"},{"name":"Breakthru (1989)","value":"song-42"},{"name":"Friends Will Be Friends (1986)","value":"song-43"},{"name":"Heaven for Everyone (1995)","value":"song-44"},{"name":"No One But You (Only the Good Die Young) (1998)","value":"song-45"},{"name":"Headlong (1991)","value":"song-46"},{"name":"Body Language (1982)","value":"song-47"},{"name":"Scandal (1989)","value":"song-48"},{"name":"The Invisible Man (1989)","value":"song-49"},{"name":"The Miracle (1989)","value":"song-50"}];`);
    // return BASE;
    writeFileSync(out, BASE);
}

/**Given a Node.textContent, de-indents the
 * source code such that you can freely indent your HTML:
 * <code>
 *    const x = 1          <=>    <code>const x = 1</code>
 * </code>
 */
export function dedent(code: string): string {
    let nonSpace = [...code].findIndex(x => !x.match(/\s/));
    if (nonSpace === -1) {
        // No non-space characters
        return code
    }

// The first newline is considered redundant
// because source usually looks like this:
//
// <code>
// code begins here
// </code>
    if (code.startsWith('\n')) {
        code = code.substring(1);
        nonSpace--;
    }

    const weight = (spc: string): number => {
        return spc.split('').reduce((acc, x) => {
            if (x === '\t') acc += 4;
            else if (x.match(/\s/)) acc++;
            return acc
        }, 0)
    };

    const detectedSpace = code.substring(0, nonSpace);
    const detectedWeight = detectedSpace.split('\n').reduce((acc, x) => {
        if (weight(x) > acc) acc = weight(x);
        return acc
    }, 0);

// const detectedWeight = weight(detectedSpace);

    const restString = code.substring(nonSpace);
    return restString.split("\n").map(x => {
        for (let i = 0; i < detectedWeight; i++) {
            if (x.length > 0 && x[0].trim().length === 0) {
                if (x[0] === '\t') {
                    i += 3;
                }
                x = x.substring(1);
            }
        }
        return x;
    }).join("\n").trim()
}

write("../dist/index.html")
