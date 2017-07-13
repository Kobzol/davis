"use strict";
var _ = require("lodash");
var assembler_1 = require("./assembler");
var Label = (function () {
    function Label(name, local, address) {
        this.name = name;
        this.local = local;
        this.address = address;
    }
    return Label;
}());
var LabelResolver = (function () {
    function LabelResolver() {
        this.labels = {};
        this.lastGlobalLabel = null;
        this.unresolvedParameters = [];
    }
    LabelResolver.prototype.addLabel = function (address, label, local) {
        if (local === void 0) { local = false; }
        label = this.normalizeLabelName(label, local, address);
        if (this.hasLabel(label)) {
            throw new assembler_1.AssemblyException("Duplicate label found: " + label);
        }
        this.labels[label] = new Label(label, local, address);
        if (!local) {
            this.lastGlobalLabel = this.labels[label];
        }
    };
    LabelResolver.prototype.markUnresolvedParameter = function (labelParameter, line) {
        if (labelParameter.label.startsWith(".")) {
            if (this.lastGlobalLabel === null) {
                throw new assembler_1.AssemblyException("Local label used without global label: " + labelParameter.label, line);
            }
            labelParameter.label = this.lastGlobalLabel.name + labelParameter.label;
        }
        this.unresolvedParameters.push({
            labelParameter: labelParameter,
            line: line
        });
    };
    LabelResolver.prototype.resolveAddresses = function () {
        var _this = this;
        _.each(this.unresolvedParameters, function (record) {
            if (!_.has(_this.labels, record.labelParameter.label)) {
                throw new assembler_1.AssemblyException("Unknown label " + record.labelParameter.label, record.line + 1);
            }
            record.labelParameter.resolveLabel(_this.labels[record.labelParameter.label].address);
        });
    };
    LabelResolver.prototype.normalizeLabelName = function (label, local, address) {
        if (local) {
            var previousLabel = this.findPreviousGlobalLabel(address);
            if (previousLabel === undefined) {
                throw new assembler_1.AssemblyException("Local label without a global label: " + label);
            }
            return previousLabel.name + "." + label;
        }
        return label;
    };
    LabelResolver.prototype.hasLabel = function (label) {
        return _.has(this.labels, label);
    };
    LabelResolver.prototype.findPreviousGlobalLabel = function (address) {
        return _.findLast(this.labels, function (label) { return !label.local && label.address <= address; });
    };
    return LabelResolver;
}());
exports.LabelResolver = LabelResolver;
//# sourceMappingURL=label.js.map