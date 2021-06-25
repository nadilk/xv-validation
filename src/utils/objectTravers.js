/**
 * Traversing down the object structure using pattern path.
 * If whole the path is passed - it fires callback with (val - value of the last path chain,path - the path that was passed)
 * @param obj
 * @param path
 * @param callback
 * @param currPath
 * @returns {Promise<void>}
 */
async function traverseObjectByPathEndings(obj, path, callback, currPath) {
    if (typeof path === 'string')
        path = path.split('.').filter(p => !!p);

    if (path.length > 0 && obj instanceof Object) {
        currPath = currPath ? currPath + '.' : '';
        const traverseKeys = path[0] === '*' ? Object.keys(obj) : [path[0]];
        for (let key of traverseKeys) {
            await traverseObjectByPathEndings(obj[key], path.slice(1), callback, currPath + key);
        }
    } else if (path.length === 0) {

        await callback(obj, currPath || '');
    }
}

/**
 * Travesing through the whole object structure
 * and firing callback at each path node (val - value of the current node,path - the path that was passed)
 * @param obj
 * @param callback
 * @param currPath
 * @returns {Promise<void>}
 */
async function traverseObject(obj, callback, currPath) {
    await callback(obj, currPath || '');
    currPath = currPath ? currPath + '.' : '';
    if (obj instanceof Object || Array.isArray(obj)) {
        for (let key of Object.keys(obj)) {
            await traverseObject(obj[key], callback, currPath + key)
        }
    }
}

/**
 * Checking if object has the given path props tree
 * @param obj
 * @param path {string|Array} - !!NO WILDCARD PATHS
 * @returns {Promise<boolean>}
 */
async function isObjectPathExists(obj, path) {
    if (typeof path === 'string')
        path = path.split('.').filter(p => !!p);

    if (path.length === 0)
        return true;


    if (typeof obj === 'object' && obj[path[0]] !== undefined)
        return await isObjectPathExists(obj[path[0]], path.slice(1));
    else
        return false;
}

/**
 * Compares path with wildcard pattern
 * @param path
 * @param patternPath
 * @param strict {boolean} if true - length must match, if false - compares by shortest path
 * @returns {boolean}
 */
function isPathMatchesPattern(path, patternPath, strict = false) {
    let pathParts = path.split('.').filter(part => part.length > 0);
    let templateParts = patternPath.split('.').filter(part => part.length > 0);
    if (pathParts.length !== templateParts.length && strict)
        return false;
    for (let partIndex = 0; partIndex < Math.min(pathParts.length, templateParts.length); partIndex++) {
        if (templateParts[partIndex] !== '*' && templateParts[partIndex] !== pathParts[partIndex])
            return false;
    }
    return true;
}

/**
 * Replaces star parts with values of the sibling path
 * @param wildcardPath - path having wildcards
 * @param samplePath - path without wildcards
 * @returns {string} - recovered wildcard path
 */
function recoverPathBySample(wildcardPath, samplePath) {
    const wParts = wildcardPath.split('.');
    const sParts = samplePath.split('.');
    for (let i = 0; i < Math.min(wParts.length, sParts.length); i++) {
        if (wParts[i] === sParts[i] || wParts[i] === '*') {
            wParts[i] = sParts[i];
        } else {
            break;
        }
    }
    return wParts.join('.');
}

/**
 * Getting value of the object by path
 * @param obj
 * @param path
 * @param defaultValue
 * @returns {*}
 */
function getValueByPath(obj, path, defaultValue) {
    if (typeof path === 'string')
        path = path.split('.').filter(p => !!p);

    if (path.length === 0)
        return obj;

    if (typeof obj === 'object')
        return getValueByPath(obj[path[0]], path.slice(1));
    else
        return defaultValue;
}

export {
    traverseObjectByPathEndings,
    traverseObject,
    getValueByPath,
    isPathMatchesPattern,
    isObjectPathExists,
    recoverPathBySample
}