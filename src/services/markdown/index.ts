import { Markdown } from "../../model/markdown";

// eslint-disable-next-line
export const getMarkdownContents = (markdownFiles: string[], setContents: (contents: Markdown[]) => void) => {
    Promise.all(markdownFiles.map(res => getMarkdownMetadata(res.split("\n"))))
        .then(markdowns => {
            markdowns.sort((a: Markdown, b: Markdown) => b.timedate - a.timedate);
            setContents(markdowns);
        })
        .catch(err => console.log(err));
}

const getMarkdownMetadata: (contentLine: string[]) => Markdown = (contentLine: string[]) => {
    const indices = getMetadataIndex(contentLine);
    // eslint-disable-next-line
    const object: any = new Markdown();
    for(let i = indices[0]+1; i < indices[1]; i++) {
        object[contentLine[i].split("=")[0].trim()] = contentLine[i].split("=")[1].trim();
    }
    object["timedate"] = object["timedate"] ? parseInt(object["timedate"]) : -1;
    object["tags"] = object["tags"].length ? object["tags"].split("; ") : [];
    object["content"] = contentLine.slice(indices[1]+2, undefined).join("\n");
    return object;
};

const getMetadataIndex: (contentLine: string[]) => number[] = (contentLine: string[]) => {
    return [contentLine.indexOf("---"),
        contentLine.indexOf("---", 1)];
}
