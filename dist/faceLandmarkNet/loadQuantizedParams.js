import * as tslib_1 from "tslib";
import { loadWeightMap } from '../commons/loadWeightMap';
import { isTensor4D, isTensor1D, isTensor2D } from '../commons/isTensor';
var DEFAULT_MODEL_NAME = 'face_landmark_68_model';
export function loadQuantizedParams(uri) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        function extractConvParams(prefix) {
            var params = {
                filters: weightMap[prefix + "/kernel"],
                bias: weightMap[prefix + "/bias"]
            };
            if (!isTensor4D(params.filters)) {
                throw new Error("expected weightMap[" + prefix + "/kernel] to be a Tensor4D, instead have " + params.filters);
            }
            if (!isTensor1D(params.bias)) {
                throw new Error("expected weightMap[" + prefix + "/bias] to be a Tensor1D, instead have " + params.bias);
            }
            return params;
        }
        function extractFcParams(prefix) {
            var params = {
                weights: weightMap[prefix + "/kernel"],
                bias: weightMap[prefix + "/bias"]
            };
            if (!isTensor2D(params.weights)) {
                throw new Error("expected weightMap[" + prefix + "/kernel] to be a Tensor2D, instead have " + params.weights);
            }
            if (!isTensor1D(params.bias)) {
                throw new Error("expected weightMap[" + prefix + "/bias] to be a Tensor1D, instead have " + params.bias);
            }
            return params;
        }
        var weightMap;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadWeightMap(uri, DEFAULT_MODEL_NAME)];
                case 1:
                    weightMap = _a.sent();
                    return [2 /*return*/, {
                            conv0_params: extractConvParams('conv2d_0'),
                            conv1_params: extractConvParams('conv2d_1'),
                            conv2_params: extractConvParams('conv2d_2'),
                            conv3_params: extractConvParams('conv2d_3'),
                            conv4_params: extractConvParams('conv2d_4'),
                            conv5_params: extractConvParams('conv2d_5'),
                            conv6_params: extractConvParams('conv2d_6'),
                            conv7_params: extractConvParams('conv2d_7'),
                            fc0_params: extractFcParams('dense'),
                            fc1_params: extractFcParams('logits')
                        }];
            }
        });
    });
}
//# sourceMappingURL=loadQuantizedParams.js.map