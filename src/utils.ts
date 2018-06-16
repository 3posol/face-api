import { FaceDetectionNet } from './faceDetectionNet/types';
import { FaceLandmarks } from './faceLandmarkNet/FaceLandmarks';
import { Dimensions, DrawBoxOptions, DrawLandmarksOptions, DrawOptions, DrawTextOptions } from './types';

export function isFloat(num: number) {
  return num % 1 !== 0
}

export function round(num: number) {
  return Math.floor(num * 100) / 100
}

export function getElement(arg: string | any) {
  if (typeof arg === 'string') {
    return document.getElementById(arg)
  }
  return arg
}

export function getContext2dOrThrow(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('canvas 2d context is null')
  }
  return ctx
}

export function createCanvas({ width, height }: Dimensions): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

export function createCanvasFromMedia(media: HTMLImageElement | HTMLVideoElement, dims?: Dimensions): HTMLCanvasElement {
  const { width, height } = dims || getMediaDimensions(media)
  const canvas = createCanvas({ width, height })
  getContext2dOrThrow(canvas).drawImage(media, 0, 0, width, height)
  return canvas
}

export function getMediaDimensions(media: HTMLImageElement | HTMLVideoElement) {
  if (media instanceof HTMLImageElement) {
    return { width: media.naturalWidth, height: media.naturalHeight }
  }
  if (media instanceof HTMLVideoElement) {
    return { width: media.videoWidth, height: media.videoHeight }
  }
  return media
}

export function bufferToImage(buf: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!(buf instanceof Blob)) {
      return reject('bufferToImage - expected buf to be of type: Blob')
    }

    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(buf)
  })
}

export function getDefaultDrawOptions(): DrawOptions {
  return {
    color: 'blue',
    lineWidth: 2,
    fontSize: 20,
    fontStyle: 'Georgia'
  }
}

export function drawBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  options: DrawBoxOptions
) {
  const drawOptions = Object.assign(
    getDefaultDrawOptions(),
    (options || {})
  )

  ctx.strokeStyle = drawOptions.color
  ctx.lineWidth = drawOptions.lineWidth
  ctx.strokeRect(x, y, w, h)
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  options: DrawTextOptions
) {
  const drawOptions = Object.assign(
    getDefaultDrawOptions(),
    (options || {})
  )

  const padText = 2 + drawOptions.lineWidth

  ctx.fillStyle = drawOptions.color
  ctx.font = `${drawOptions.fontSize}px ${drawOptions.fontStyle}`
  ctx.fillText(text, x + padText, y + padText + (drawOptions.fontSize * 0.6))
}

export function drawDetection(
  canvasArg: string | HTMLCanvasElement,
  detection: FaceDetectionNet.Detection | FaceDetectionNet.Detection[],
  options?: DrawBoxOptions & DrawTextOptions & { withScore: boolean }
) {
  const canvas = getElement(canvasArg)
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('drawBox - expected canvas to be of type: HTMLCanvasElement')
  }

  const detectionArray = Array.isArray(detection)
    ? detection
    : [detection]

  detectionArray.forEach((det) => {
    const {
      score,
      box
    } = det

    const {
      x,
      y,
      width,
      height
    } = box

    const drawOptions = Object.assign(
      getDefaultDrawOptions(),
      (options || {})
    )

    const { withScore } = Object.assign({ withScore: true }, (options || {}))

    const ctx = getContext2dOrThrow(canvas)
    drawBox(
      ctx,
      x,
      y,
      width,
      height,
      drawOptions
    )
    if (withScore) {
      drawText(
        ctx,
        x,
        y,
        `${round(score)}`,
        drawOptions
      )
    }
  })
}

export function drawLandmarks(
  canvasArg: string | HTMLCanvasElement,
  faceLandmarks: FaceLandmarks,
  options?: DrawLandmarksOptions & { drawLines: boolean }
) {
  const canvas = getElement(canvasArg)
  if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error('drawLandmarks - expected canvas to be of type: HTMLCanvasElement')
  }

    const drawOptions = Object.assign(
      getDefaultDrawOptions(),
      (options || {})
    )

    const { drawLines } = Object.assign({ drawLines: false }, (options || {}))

    const ctx = getContext2dOrThrow(canvas)
    const { lineWidth,color } = drawOptions
    ctx.fillStyle = color
    const ptOffset = lineWidth / 2
    faceLandmarks.getPositions().forEach(pt => ctx.fillRect(pt.x - ptOffset, pt.y - ptOffset, lineWidth, lineWidth))
}