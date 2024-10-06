import * as fs from "fs";
import { parse } from "node-html-parser";

const JSX_STRING = /\(\s*(<.*>)\s*\)/gs;
const JSX_INTERPOLATION = /\{([a-zA-Z0-9]+)\}/gs;
const QUOTED_STRING = /["|'](.*)["|']/gs;

/**
 * Turns string of attributes into an object.
 *
 * @param {string} attrsStr
 * @returns {Record<string, string>}
 * @example
 * ```
 * getAttrs("className={myClass} ref={myRef}")
 * // { className: '{myClass}', ref: '{myRef}' }
 * ```
 */
function getAttrs(attrsStr) {
    if (attrsStr.trim().length == 0) return {};

    /**
     * @type {Record<string, string>}
     */
    let objAttrs = {};

    /**
     * @type {string[]}
     * @example ['className={myClass}', 'ref={myRef}']
     */
    const parts = attrsStr.split(" ");

    parts.forEach((p) => {
        const [name, value] = p.split("=");
        objAttrs[name] = value;
    });

    return objAttrs;
}

/**
 * @param {string} txt
 * @example
 * ```
 * parseText("Hello {name}!")
 * // "Hello " + name + "!"
 * ```
 */
function parseText(txt) {
    /**
     * Looks for dynamic placeholders like `{name}` in a string.
     */
    const interpolations = txt.match(JSX_INTERPOLATION);

    if (!interpolations) {
        return `"${txt}"`;
    } else {
        txt = replaceInterpolations(txt);

        // TODO: check if needed
        // interpolations.shift()
        // interpolations.forEach( v => {
        //     txt = txt.replace(`{${v}}`, `" + (${v}) + "`)
        // })
        return `"${txt}"`;
    }
}

/**
 * @param {string} k
 * @param {string} v
 * @returns {string}
 * @example
 * ```
 * replacer("className", "{myClass}")
 * // {myClass}
 * ```
 */
function replacer(k, v) {
    if (k) {
        let quoted = QUOTED_STRING.exec(v);
        if (quoted) {
            return parseText(quoted[1]);
        }
        return v;
    } else {
        return v;
    }
}

/**
 * @param {string} txt
 * @param {boolean} isOnJSON
 * @returns {string}
 * @example
 * ```
 * replaceInterpolations("Hello {name}!", false)
 * // Hello " + name + "!
 *
 * replaceInterpolations('{"className":"{myClass}","ref":"{myRef}"}', true)
 * // {"className":myClass,"ref":myRef}
 * ```
 */
function replaceInterpolations(txt, isOnJSON = false) {
    let interpolations = null;

    while ((interpolations = JSX_INTERPOLATION.exec(txt))) {
        if (isOnJSON) {
            txt = txt.replace(`"{${interpolations[1]}}"`, interpolations[1]);
        } else {
            txt = txt.replace(
                `{${interpolations[1]}}`,
                `" + ${interpolations[1]} + "`
            );
        }
    }

    return txt;
}

/**
 * @param {HTMLElement} root
 */
function translate(root) {
    // TODO: check if needed
    // if (Array.isArray(root) && root.length == 0) return null;

    const children = root.childNodes
        .map((child) => translate(child))
        .filter((c) => c != null);

    if (root.nodeType == 3) {
        // TextNode
        if (root._rawText.trim() === "") return null;
        return parseText(root._rawText);
    }

    /**
     * @type {string}
     * @example "h1" | "div"
     */
    const tagName = root.rawTagName;

    const attributes = getAttrs(root.rawAttrs);

    return `MyLib.createElement("${tagName}", ${replaceInterpolations(
        // TODO: not sure why replacer is needed
        JSON.stringify(attributes, replacer),
        true
    )}, ${children})`;
}

/**
 * @param {string} fileName
 */
async function parseJSXFile(fileName) {
    /**
     * File's content as a buffer.
     *
     * @type {Buffer}
     * @example `<Buffer 0d 0a 2f 2a 0d 0a 63 72 61 74 65 ...`
     */
    const fileContentBuffer = await fs.promises.readFile(fileName);

    /**
     * File's content as a string.
     *
     * @type {string}
     */
    let str = fileContentBuffer.toString();

    /**
     * @type {Array}
     * @example
     * ```
     * // match[0] - with brackets
     * `(
     *   <div className={myClass} ref={myRef}>
     *     <h1>Hello {name}!</h1>
     *   </div>
     * )`
     *
     * // match[1] - without brackets
     * `<div className={myClass} ref={myRef}>
     *    <h1>Hello {name}!</h1>
     * </div>`
     * ```
     */
    const matches = JSX_STRING.exec(str);

    if (matches) {
        const HTML = matches[1];

        /**
         * @type {HTMLElement}
         */
        const htmlElement = parse(HTML);

        const translated = translate(htmlElement.firstChild);
        str = str.replace(matches[1], translated);
        await fs.promises.writeFile("output.js", str);
    }
}

(async () => {
    await parseJSXFile("./file.jsx");
})();
