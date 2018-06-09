import * as tf from '@tensorflow/tfjs-core';

import { NetInput } from '../NetInput';
import { getImageTensor, padToSquare } from '../transformInputs';
import { TNetInput } from '../types';
import { convDown } from './convLayer';
import { extractParams } from './extractParams';
import { normalize } from './normalize';
import { residual, residualDown } from './residualLayer';

export function faceRecognitionNet(weights: Float32Array) {
  const params = extractParams(weights)

  function forward(input: tf.Tensor | NetInput | TNetInput) {
    return tf.tidy(() => {

      const x = normalize(padToSquare(getImageTensor(input)))

      let out = convDown(x, params.conv32_down)
      out = tf.maxPool(out, 3, 2, 'valid')

      out = residual(out, params.conv32_1)
      out = residual(out, params.conv32_2)
      out = residual(out, params.conv32_3)

      out = residualDown(out, params.conv64_down)
      out = residual(out, params.conv64_1)
      out = residual(out, params.conv64_2)
      out = residual(out, params.conv64_3)

      out = residualDown(out, params.conv128_down)
      out = residual(out, params.conv128_1)
      out = residual(out, params.conv128_2)

      out = residualDown(out, params.conv256_down)
      out = residual(out, params.conv256_1)
      out = residual(out, params.conv256_2)
      out = residualDown(out, params.conv256_down_out)

      const globalAvg = out.mean([1, 2]) as tf.Tensor2D
      const fullyConnected = tf.matMul(globalAvg, params.fc)

      return fullyConnected
    })
  }

  const computeFaceDescriptor = async (input: tf.Tensor | NetInput | TNetInput) => {
    const result = forward(input)
    const data = await result.data()
    result.dispose()
    return data
  }

  const computeFaceDescriptorSync = (input: tf.Tensor | NetInput | TNetInput) => {
    const result = forward(input)
    const data = result.dataSync()
    result.dispose()
    return data
  }

  return {
    computeFaceDescriptor,
    computeFaceDescriptorSync,
    forward
  }
}