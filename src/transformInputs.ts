import * as tf from '@tensorflow/tfjs-core';

import { NetInput } from './NetInput';
import { TNetInput } from './types';

export function padToSquare(imgTensor: tf.Tensor4D): tf.Tensor4D {
  return tf.tidy(() => {

    const [_, height, width] = imgTensor.shape
    if (height === width) {
      return imgTensor
    }

    if (height > width) {
      const pad = tf.fill([1, height, height - width, 3], 0) as tf.Tensor4D
      return tf.concat([imgTensor, pad], 2)
    }
    const pad = tf.fill([1, width - height, width, 3], 0) as tf.Tensor4D
    return tf.concat([imgTensor, pad], 1)
  })
}

export function getImageTensor(input: tf.Tensor | NetInput | TNetInput): tf.Tensor4D {
  return tf.tidy(() => {
    if (input instanceof tf.Tensor) {
      const rank = input.shape.length
      if (rank !== 3 && rank !== 4) {
        throw new Error('input tensor must be of rank 3 or 4')
      }

      return (rank === 3 ? input.expandDims(0) : input).toFloat() as tf.Tensor4D
    }

    const netInput = input instanceof NetInput ? input : new NetInput(input)
    return tf.concat(
      netInput.canvases.map(canvas =>
        tf.fromPixels(canvas).expandDims(0).toFloat()
      )
    ) as tf.Tensor4D
  })
}