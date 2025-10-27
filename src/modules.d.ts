declare module 'jsqr' {
  interface Point {
    x: number;
    y: number;
  }

  interface QRCode {
    data: string;
    location: {
      topLeftCorner: Point;
      topRightCorner: Point;
      bottomLeftCorner: Point;
      bottomRightCorner: Point;
    };
  }

  interface DecodeOptions {
    inversionAttempts?: 'dontInvert' | 'onlyInvert' | 'attemptBoth' | 'invertFirst';
  }

  export default function jsQR(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    options?: DecodeOptions
  ): QRCode | null;
}

