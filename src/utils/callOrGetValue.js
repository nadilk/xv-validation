export default function (source){
    return (typeof source === "function") ? source(...([...arguments].slice(1)))  : source;
}