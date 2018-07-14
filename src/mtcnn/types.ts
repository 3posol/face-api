import * as tf from '@tensorflow/tfjs-core';

import { ConvParams, FCParams } from '../commons/types';
import { FaceDetection } from '../FaceDetection';
import { FaceLandmarks5 } from './FaceLandmarks5';

export type SharedParams = {
  conv1: ConvParams
  prelu1_alpha: tf.Tensor1D
  conv2: ConvParams
  prelu2_alpha: tf.Tensor1D
  conv3: ConvParams
  prelu3_alpha: tf.Tensor1D
}

export type PNetParams = SharedParams & {
  conv4_1: ConvParams
  conv4_2: ConvParams
}

export type RNetParams = SharedParams & {
  fc1: FCParams
  prelu4_alpha: tf.Tensor1D
  fc2_1: FCParams
  fc2_2: FCParams
}

export type ONetParams = SharedParams & {
  conv4: ConvParams
  prelu4_alpha: tf.Tensor1D
  fc1: FCParams
  prelu5_alpha: tf.Tensor1D
  fc2_1: FCParams
  fc2_2: FCParams
  fc2_3: FCParams
}

export type NetParams = {
  pnet: PNetParams
  rnet: RNetParams
  onet: ONetParams
}

export type MtcnnResult = {
  faceDetection: FaceDetection,
  faceLandmarks: FaceLandmarks5
}

export type MtcnnForwardParams = {
  minFaceSize: number
  scaleFactor: number
  maxNumScales: number
  scoreThresholds: number[]
  scaleSteps?: number[]
}
