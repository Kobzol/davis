"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var RuntimeException = (function (_super) {
    __extends(RuntimeException, _super);
    function RuntimeException(message) {
        if (message === void 0) { message = ""; }
        _super.call(this, message);
        this.message = message;
    }
    return RuntimeException;
}(Error));
exports.RuntimeException = RuntimeException;
//# sourceMappingURL=runtime-exception.js.map