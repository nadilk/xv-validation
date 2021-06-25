export default function (str,c) {
    let re = new RegExp("^[" + c + "]+|[" + c + "]+$", "g");
    return str.replace(re,"");
}