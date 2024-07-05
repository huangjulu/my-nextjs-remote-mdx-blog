type Meta = {
    id: string,
    title: string,
    date: string,
    tags: string[],
}

type BlogPost = {
    meta: Meta,
    content:  React.ReactElement<any, string | React.JSXElementConstructor<any>>,
}