
export default function dedent(code: string) : string {
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
    if(code.startsWith('\n')) {
        code = code.substring(1);
        nonSpace--;
    }

    const weight = (spc: string): number => {
        return spc.split('').reduce((acc, x) => {
            if (x === '\t') acc+= 4;
            else if(x.match(/\s/)) acc++;
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
        for(let i = 0; i < detectedWeight; i++) {
            if(x.length > 0 && x[0].trim().length === 0) {
                if(x[0] === '\t') {
                    i += 3;
                }
                x = x.substring(1);
            }
        }
        return x;
    }).join("\n").trim()
}