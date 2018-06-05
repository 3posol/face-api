import * as tf from '@tensorflow/tfjs-core';

import { FaceDetectionNet } from './types';

function extractorsFactory(extractWeights: (numWeights: number) => Float32Array) {

  function extractDepthwiseConvParams(numChannels: number): FaceDetectionNet.MobileNetV1.DepthwiseConvParams {
    const filters = tf.tensor4d(extractWeights(3 * 3 * numChannels), [3, 3, numChannels, 1])
    const batch_norm_scale = tf.tensor1d(extractWeights(numChannels))
    const batch_norm_offset = tf.tensor1d(extractWeights(numChannels))
    const batch_norm_mean = tf.tensor1d(extractWeights(numChannels))
    const batch_norm_variance = tf.tensor1d(extractWeights(numChannels))

    return {
      filters,
      batch_norm_scale,
      batch_norm_offset,
      batch_norm_mean,
      batch_norm_variance
    }
  }

  function extractConvWithBiasParams(
    channelsIn: number,
    channelsOut: number,
    filterSize: number
  ): FaceDetectionNet.ConvWithBiasParams {
    const filters = tf.tensor4d(
      extractWeights(channelsIn * channelsOut * filterSize * filterSize),
      [filterSize, filterSize, channelsIn, channelsOut]
    )
    const bias = tf.tensor1d(extractWeights(channelsOut))

    return {
      filters,
      bias
    }
  }

  function extractPointwiseConvParams(
    channelsIn: number,
    channelsOut: number,
    filterSize: number
  ): FaceDetectionNet.PointwiseConvParams {
    const {
      filters,
      bias
    } = extractConvWithBiasParams(channelsIn, channelsOut, filterSize)

    return {
      filters,
      batch_norm_offset: bias
    }
  }

  function extractConvPairParams(channelsIn: number, channelsOut: number): FaceDetectionNet.MobileNetV1.ConvPairParams {
    const depthwise_conv_params = extractDepthwiseConvParams(channelsIn)
    const pointwise_conv_params = extractPointwiseConvParams(channelsIn, channelsOut, 1)

    return {
      depthwise_conv_params,
      pointwise_conv_params
    }
  }

  function extractMobilenetV1Params(): FaceDetectionNet.MobileNetV1.Params {

    const conv_0_params = extractPointwiseConvParams(3, 32, 3)

    const channelNumPairs = [
      [32, 64],
      [64, 128],
      [128, 128],
      [128, 256],
      [256, 256],
      [256, 512],
      [512, 512],
      [512, 512],
      [512, 512],
      [512, 512],
      [512, 512],
      [512, 1024],
      [1024, 1024]
    ]

    const conv_pair_params = channelNumPairs.map(
      ([channelsIn, channelsOut]) => extractConvPairParams(channelsIn, channelsOut)
    )

    return {
      conv_0_params,
      conv_pair_params
    }

  }

  function extractPredictionLayerParams(): FaceDetectionNet.PredictionParams {
    const conv_0_params = extractPointwiseConvParams(1024, 256, 1)
    const conv_1_params = extractPointwiseConvParams(256, 512, 3)
    const conv_2_params = extractPointwiseConvParams(512, 128, 1)
    const conv_3_params = extractPointwiseConvParams(128, 256, 3)
    const conv_4_params = extractPointwiseConvParams(256, 128, 1)
    const conv_5_params = extractPointwiseConvParams(128, 256, 3)
    const conv_6_params = extractPointwiseConvParams(256, 64, 1)
    const conv_7_params = extractPointwiseConvParams(64, 128, 3)

    const box_encoding_0_predictor_params = extractConvWithBiasParams(512, 12, 1)
    const class_predictor_0_params = extractConvWithBiasParams(512, 9, 1)
    const box_encoding_1_predictor_params = extractConvWithBiasParams(1024, 24, 1)
    const class_predictor_1_params = extractConvWithBiasParams(1024, 18, 1)
    const box_encoding_2_predictor_params = extractConvWithBiasParams(512, 24, 1)
    const class_predictor_2_params = extractConvWithBiasParams(512, 18, 1)
    const box_encoding_3_predictor_params = extractConvWithBiasParams(256, 24, 1)
    const class_predictor_3_params = extractConvWithBiasParams(256, 18, 1)
    const box_encoding_4_predictor_params = extractConvWithBiasParams(256, 24, 1)
    const class_predictor_4_params = extractConvWithBiasParams(256, 18, 1)
    const box_encoding_5_predictor_params = extractConvWithBiasParams(128, 24, 1)
    const class_predictor_5_params = extractConvWithBiasParams(128, 18, 1)

    const box_predictor_0_params = {
      box_encoding_predictor_params: box_encoding_0_predictor_params,
      class_predictor_params: class_predictor_0_params
    }
    const box_predictor_1_params = {
      box_encoding_predictor_params: box_encoding_1_predictor_params,
      class_predictor_params: class_predictor_1_params
    }
    const box_predictor_2_params = {
      box_encoding_predictor_params: box_encoding_2_predictor_params,
      class_predictor_params: class_predictor_2_params
    }
    const box_predictor_3_params = {
      box_encoding_predictor_params: box_encoding_3_predictor_params,
      class_predictor_params: class_predictor_3_params
    }
    const box_predictor_4_params = {
      box_encoding_predictor_params: box_encoding_4_predictor_params,
      class_predictor_params: class_predictor_4_params
    }
    const box_predictor_5_params = {
      box_encoding_predictor_params: box_encoding_5_predictor_params,
      class_predictor_params: class_predictor_5_params
    }

    return {
      conv_0_params,
      conv_1_params,
      conv_2_params,
      conv_3_params,
      conv_4_params,
      conv_5_params,
      conv_6_params,
      conv_7_params,
      box_predictor_0_params,
      box_predictor_1_params,
      box_predictor_2_params,
      box_predictor_3_params,
      box_predictor_4_params,
      box_predictor_5_params
    }
  }


  return {
    extractMobilenetV1Params,
    extractPredictionLayerParams
  }

}

export function extractParams(weights: Float32Array): FaceDetectionNet.NetParams {
  const extractWeights = (numWeights: number): Float32Array => {
    const ret = weights.slice(0, numWeights)
    weights = weights.slice(numWeights)
    return ret
  }

  const {
    extractMobilenetV1Params,
    extractPredictionLayerParams
  } = extractorsFactory(extractWeights)

  const mobilenetv1_params = extractMobilenetV1Params()
  const prediction_layer_params = extractPredictionLayerParams()

  if (weights.length !== 0) {
    throw new Error(`weights remaing after extract: ${weights.length}`)
  }

  return {
    mobilenetv1_params,
    prediction_layer_params
  }
}