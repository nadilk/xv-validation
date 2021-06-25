import {
    isObjectPathExists,
    isPathMatchesPattern,
    traverseObject,
    traverseObjectByPathEndings
} from "@/xv-validation/utils/objectTravers";

class XValidator {
    rules;

    constructor(rules) {
        this.rules = rules
    }

    async validate(data, context, paths) {
        paths = paths || [];
        if (typeof paths === 'string')
            paths = [paths];

        const mandatoryErrors = await this.validateMandatory(data, context, paths);
        const pathErrors = await this.validatePathRules(data, context, paths);

        return [...mandatoryErrors, ...pathErrors];

    }

    async validatePathRules(model, context, paths) {

        const errors = [];

        await traverseObject(model, async (value, valuePath) => {

            const valueRules = this.getRulesForPath(valuePath, true);
            for (let rule of valueRules) {
                let validationResult = await rule.validate({
                    value: value,
                    path: valuePath
                }, context);

                if (!Array.isArray(validationResult))
                    validationResult = [validationResult];

                validationResult.forEach((valRes) => {
                    if (!valRes?.valid && paths.some(path => isPathMatchesPattern(valuePath, path))) {
                        errors.push({
                            target: {
                                value: value,
                                path: valuePath
                            },
                            message: valRes?.message,
                            rule: valRes?.rule || rule
                        });
                    }
                })

            }
        })

        return errors;
    }


    getRulesForPath(path, strict, filter) {
        return this.rules.filter((rule) => isPathMatchesPattern(path, rule.path, strict) && (filter ? filter(rule) : true));
    }

    async validateMandatory(data, context, paths) {
        const mandatoryRules = this.rules.filter(r => r.isMandatory({
            target: {
                value: undefined,
                path: r.path
            },
            rule: r,
            context
        }));
        const errors = [];
        for (let rule of mandatoryRules) {
            const missingPaths = await this.getMissingPaths(data, rule.path);
            missingPaths.forEach(p => {
                if (paths.some(path => isPathMatchesPattern(p, path))) {
                    errors.push({
                        target: {
                            value: undefined,
                            path: p
                        },
                        message: rule.getMessage({
                            target: {
                                value: undefined,
                                path: p
                            },
                            rule: rule,
                            context
                        }),
                        rule: rule,
                        context
                    });
                }
            });
        }
        return errors;
    }

    async getMissingPaths(obj, pathTemplate) {
        let lastAsterisk = pathTemplate.lastIndexOf('*');
        let optionalPath = lastAsterisk !== -1 ? pathTemplate.substring(0, lastAsterisk + 1) : '';
        let obligatoryPath = lastAsterisk !== -1 ? pathTemplate.substring(lastAsterisk + 2) : pathTemplate;

        const missingPaths = [];

        await traverseObjectByPathEndings(obj, optionalPath, async function (subObj, subObjPath) {

            if (!(await isObjectPathExists(subObj, obligatoryPath)))
                missingPaths.push(subObjPath ? (subObjPath + '.') : '' + obligatoryPath);
        });

        return missingPaths;
    }


}

export default XValidator;