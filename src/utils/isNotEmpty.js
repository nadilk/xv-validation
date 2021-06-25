export default (val) =>
    val !== undefined &&
    val !== null &&
    (!Array.isArray(val) || val.length > 0) &&
    (typeof val !== "string" || val.trim().length > 0);