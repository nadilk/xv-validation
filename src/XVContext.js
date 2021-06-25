import en from "@/xv-validation/messages/en";
import XValidator from "@/xv-validation/XValidator";
import {isPathMatchesPattern} from "@/xv-validation/utils/objectTravers";

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
    rules.filter(r => r.name === '_field_name').forEach(r => {
        fieldNames[r.path] = r.args[0];
    });
    return {
        rules: rules.filter(r => r.name !== '_field_name'),
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


    async validate(paths) {
        paths = paths || [''];
        if (typeof paths === 'string')
            paths = [paths];
        this.resetErrors(paths);
        const errors = await this.validator.validate(this.getModel(), this, paths);
        this.addErrors(errors);

        return errors.length > 0;
    }

    addErrors(errors) {
        this.errors.push(...errors);

        if (this.onError)
            this.onError(this.errors);
    }

    resetErrors(paths) {
        paths = paths || [''];
        if (typeof paths === 'string')
            paths = [paths];
        if (!paths.length)
            this.errors.splice(0);
        else
            this.errors = this.errors.filter(e => !paths.some(path => isPathMatchesPattern(e.target.path, path)))

        if (this.onError)
            this.onError(this.errors);
    }


    setRules(dirtyRules) {
        const normRules = normalizeRules(dirtyRules);
        const {rules, fieldNames} = splitRules(normRules);
        this.rules = rules;
        this.fieldNames = fieldNames;
        this.validator = new XValidator(rules);
    }

    getMessageBuilderFor(rule) {
        return this.messages[`${rule.path}:${rule.name}`] || this.messages[`:${rule.name}`] || (() => 'Validation error');
    }

    getFieldNameFor(path) {
        return this.fieldNames[path] || path;
    }

    getContextUniqueName() {
        return 'xv_context_'.Math.random();
    }


    validateConfig(config) {
        if (!(config instanceof Object)) {
            throw new Error('config must be an Object');
        }
        if (!config.getModel || typeof config.getModel !== 'function') {
            throw new Error('config.getModel is required and must be a function');
        }
    }


}

export default XVContext