import en                     from "./messages/en";
import callOrGetValue         from "./utils/callOrGetValue";
import XValidator             from "./XValidator";
import {isPathMatchesPattern} from "./utils/objectTravers";

const normalizeRules = (rules) => {
    const normalized = []
    for (let path in rules) {
        for (let rule of rules[path]) {
            rule.path = path;
            normalized.push(rule);
        }
    }
    return normalized;
}

const splitRules = (rules) => {
    const fieldNames = {};
    rules.filter(r => r.name === "_field_name").forEach(r => {
        fieldNames[r.path] = r.args[0];
    });
    return {
        rules: rules.filter(r => r.name !== "_field_name"),
        fieldNames
    };
}


class XVContext {
    name;
    getModel;
    dirtyPaths;
    onError;
    rules;
    validator;
    errors;
    messages;
    fieldNames;

    constructor(config) {
        this.validateConfig(config);
        this.name = config.name || this.getContextUniqueName();


        this.getModel = config.getModel;
        this.setRules(config.rules || []);
        this.errors = [];
        this.messages = config.messages || en;
        this.onError = config.onError;
        this.dirtyPaths = [];
    }


    async validate(paths, trackRules) {
        paths = paths || [""];
        if (typeof paths === "string")
            paths = [paths];
        const errors = await this.validator.validate(this.getModel(), this, paths, trackRules);
        this.setErrors(errors);
        this.rules
            .filter(r =>
                r.name === "_touches" &&
                paths.some(path => isPathMatchesPattern(r.path, path))
            )
            .forEach(r => this.showErrorsFor(r.args[0]));

        return errors.length > 0;
    }

    showErrorsFor(paths) {
        paths = paths || [""];
        this.errors.filter(e => paths.some(path => isPathMatchesPattern(e.target.path, path))).forEach(e => e.show = true);
    }

    hideErrorsFor(paths) {
        paths = paths || [""];
        this.errors.filter(e => paths.some(path => isPathMatchesPattern(e.target.path, path))).forEach(e => e.show = false);
    }

    addErrors(errors) {
        this.errors.push(...errors);
    }

    setErrors(errors) {
        this.errors.forEach(e => {
            if (e.show) {
                errors.filter(ne => ne.target.path === e.target.path).forEach(newE => newE.show = true);
            }
        })
        this.errors.splice(0);
        this.errors.push(...errors);

    }


    resetErrors(paths) {
        paths = paths || [""];
        if (typeof paths === "string")
            paths = [paths];


        if (!paths.length) {
            this.validator.validated.splice(0);
            this.errors.splice(0);
        } else {
            this.errors = this.errors.filter(e => !paths.some(path => isPathMatchesPattern(e.target.path, path)))
            this.validator.validated = this.validator.validated
                .filter(validatedPath => !paths.some(path => isPathMatchesPattern(validatedPath, path)))
        }
    }


    setRules(dirtyRules) {
        const normRules = normalizeRules(dirtyRules);
        const {rules, fieldNames} = splitRules(normRules);
        this.rules = rules;
        this.fieldNames = fieldNames;
        this.validator = new XValidator(rules);
    }

    getMessageBuilderFor(rule) {
        return this.messages[`${rule.path}:${rule.name}`] || this.messages[`:${rule.name}`] || (() => "Validation error");
    }

    getFieldNameFor(path, validationData) {
        validationData = validationData || {};
        return callOrGetValue(this.fieldNames[path], {...validationData, context: this}) || path;
    }

    getContextUniqueName() {
        return "xv_context_".Math.random();
    }


    validateConfig(config) {
        if (typeof config !== "object") {
            throw new Error("config must be an Object");
        }
        if (!config.getModel || typeof config.getModel !== "function") {
            throw new Error("config.getModel is required and must be a function");
        }
    }


}

export default XVContext