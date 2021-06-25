import isAsyncFunc from "@/xv-validation/utils/isAsyncFunc";
import callOrValue from "@/xv-validation/utils/callOrGetValue";

class XVRule {
    name;
    args;
    path;
    options;
    validator;

    constructor(name, validator, args, options) {
        this.name = name;
        this.validator = validator;
        this.args = args || []
        this.options = options || {};
    }


    isAsync() {
        return isAsyncFunc(this.validator);
    }

    isMandatory(validationData) {
        return callOrValue(this.options.mandatory,validationData) || false
    }

    async validate(target, context) {
        const validationData = {
            target,
            rule: this,
            context
        };
        let validatorResult = this.validator(validationData);

        if (this.isAsync()) validatorResult = await validatorResult;

        if (Array.isArray(validatorResult)) {
            return validatorResult.filter(res => !res.valid);
        } else if (validatorResult === true) {
            return {valid: true}
        } else if (validatorResult instanceof String) {
            return {valid: false, message: validatorResult}
        } else {
            return {
                valid: false,
                message: this.getMessage(validationData)
            }
        }
    }

    getMessage(validationData) {
        const {context} = validationData;
        if (this.options.message) {
            switch (typeof this.options.message) {
                case "string":
                    return this.options.message;
                case "function":
                    return this.options.message(validationData)
            }
        }

        const field = this.getFieldName(validationData);
        return context.getMessageBuilderFor(this)({...validationData, field});
    }

    /**
     *
     * @returns {string|*}
     * @param validationData {context,target,rule}
     */
    getFieldName(validationData) {
        const {context, target} = validationData;
        if (this.options.fieldName) {
            switch (typeof this.options.fieldName) {
                case "string":
                    return this.options.fieldName;
                case "function":
                    return this.options.fieldName(validationData)
            }
        }

        return context.getFieldNameFor(this.path, target.path);
    }
}

export default XVRule;