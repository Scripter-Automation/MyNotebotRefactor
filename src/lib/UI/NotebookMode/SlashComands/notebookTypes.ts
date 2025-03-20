interface Block {
    id:string;
    html_tag:string;
    style:string;
    text:string;
    editable:boolean;
    // Children is a good idea but will be implemented later
    //children?:Block[];
}


export {type Block}