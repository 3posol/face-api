import * as tf from '@tensorflow/tfjs-core';
import { NetInput } from '../NetInput';
import { FaceLandmarks } from './FaceLandmarks';
export declare function faceLandmarkNet(weights: Float32Array): {
    detectLandmarks: (input: string | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | (string | HTMLCanvasElement | HTMLImageElement | HTMLVideoElement)[] | tf.Tensor<tf.Rank> | NetInput) => Promise<FaceLandmarks>;
};
