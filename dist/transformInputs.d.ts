import * as tf from '@tensorflow/tfjs-core';
import { NetInput } from './NetInput';
import { TNetInput } from './types';
/**
 * Pads the smaller dimension of an image tensor with zeros, such that width === height.
 *
 * @param imgTensor The image tensor.
 * @param isCenterImage (optional, default: false) If true, add padding on both sides of the image, such that the image
 * @returns The padded tensor with width === height.
 */
export declare function padToSquare(imgTensor: tf.Tensor4D, isCenterImage?: boolean): tf.Tensor4D;
export declare function getImageTensor(input: tf.Tensor | NetInput | TNetInput): tf.Tensor4D;
