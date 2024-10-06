function mapAttrName(name) {
    if (name == "className") return "class";
    return name;
}

export function createElement(tag, opts, ...children) {
    const params = Object.keys(opts)
        .map((oname) => `${mapAttrName(oname)}="${opts[oname]}"`)
        .join(" ");

    return `<${tag}${params ? ` ${params}` : ""}>
     ${children.map((c) => c).join("")}
     </${tag}>
    `;
}
