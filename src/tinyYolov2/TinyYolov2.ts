import * as tf from '@tensorflow/tfjs-core';

import { convLayer } from '../commons/convLayer';
import { NeuralNetwork } from '../commons/NeuralNetwork';
import { NetInput } from '../NetInput';
import { toNetInput } from '../toNetInput';
import { TNetInput } from '../types';
import { convWithBatchNorm } from './convWithBatchNorm';
import { extractParams } from './extractParams';
import { NetParams } from './types';


export class TinyYolov2 extends NeuralNetwork<NetParams> {

  constructor() {
    super('TinyYolov2')
  }

  public async forwardInput(input: NetInput): Promise<any> {

    const { params } = this

    if (!params) {
      throw new Error('TinyYolov2 - load model before inference')
    }

    const out = tf.tidy(() => {
      const batchTensor = input.toBatchTensor(416).div(tf.scalar(255)).toFloat()

      let out = tf.pad(batchTensor, [[0, 0], [1, 1], [1, 1], [0, 0]]) as tf.Tensor4D

      out = convWithBatchNorm(out, params.conv0)
      out = tf.maxPool(out, [2, 2], [2, 2], 'valid')
      out = convWithBatchNorm(out, params.conv1)
      out = tf.maxPool(out, [2, 2], [2, 2], 'valid')
      out = convWithBatchNorm(out, params.conv2)
      out = tf.maxPool(out, [2, 2], [2, 2], 'valid')
      out = convWithBatchNorm(out, params.conv3)
      out = tf.maxPool(out, [2, 2], [2, 2], 'valid')
      out = convWithBatchNorm(out, params.conv4)
      out = tf.maxPool(out, [2, 2], [2, 2], 'valid')
      out = convWithBatchNorm(out, params.conv5)
      out = tf.maxPool(out, [2, 2], [1, 1], 'valid')
      out = convWithBatchNorm(out, params.conv6)
      out = convWithBatchNorm(out, params.conv7)
      out = convLayer(out, params.conv8, 'valid', false)

      return out
    })

    return out
  }

  public async forward(input: TNetInput): Promise<any> {
    return await this.forwardInput(await toNetInput(input, true, true))
  }

  /* TODO
  protected loadQuantizedParams(uri: string | undefined) {
    return loadQuantizedParams(uri)
  }
  */

  protected extractParams(weights: Float32Array) {
    return extractParams(weights)
  }
}