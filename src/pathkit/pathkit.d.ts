namespace PathKit {
  export class SkPath {
    protected constructor();

    addPath(): this;

    arc(
      x: number,
      y: number,
      radius: number,
      startAngle: number,
      endAngle: number,
      ccw: number
    ): this;

    moveTo(x: number, y: number): this;

    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): this;

    bezierCurveTo(
      cp1x: number,
      cp1y: number,
      cp2x: number,
      cp2y: number,
      x: number,
      y: number
    ): this;

    close(): this;

    closePath(): this;

    conicTo(x1: number, y1: number, x2: number, y2: number, w: number): this;

    dash(on: number, off: number, phase: number): this;

    ellipse(
      x: number,
      y: number,
      radiusX: number,
      radiusY: number,
      rotation: number,
      startAngle: number,
      endAngle: number,
      ccw: boolean
    ): this;

    getBounds(): SkRect;

    getFillTypeString(): string;

    getFillType(): FillType;

    setFillType(fill: FillType): void;

    lineTo(x: number, y: number): this;

    moveTo(x: number, y: number): this;

    op(otherPath: SkPath, op: number): this;

    quadTo(x1: number, y1: number, x2: number, y2: number): this;

    quadraticCurveTo(x1: number, y1: number, x2: number, y2: number): this;

    rect(x: number, y: number, w: number, h: number): this;

    simplify(): this;

    stroke(opts: any): this;

    transform(matrix: Array<number>): this;

    trim(startT: number, stopT: number, isComplement: boolean): this;

    toCmds(): Array<Array<Number>>;

    toPath2D(): Path2D;

    toSVGString(): string;

    delete();
  }

  /**
   * Represents the set of enum values.
   */
  export interface EmbindEnum {
    readonly values: number[];
  }
  /**
   * Represents a single member of an enum.
   */
  export interface EmbindEnumEntity {
    readonly value: number;
  }

  export type FillType = EmbindEnumEntity;

  export interface FillTypeEnumValues extends EmbindEnum {
    WINDING: FillType;
    EVENODD: FillType;
  }

  export interface SkRect {
    fLeft: number;
    fTop: number;
    fRight: number;
    fBottom: number;
  }

  export class StrokeJoin {
    protected constructor();
    get MITER(): number;
    get ROUND(): number;
    get BEVEL(): number;
  }

  export class StrokeCap {
    protected constructor();
    get BUTT(): number;
    get ROUND(): number;
    get SQUARE(): number;
  }

  export class PathOp {
    protected constructor();
    get DIFFERENCE(): number;
    get INTERSECT(): number;
    get UNION(): number;
    get XOR(): number;
    get REVERSE_DIFFERENCE(): number;
  }

  export type PathKitApi = {
    NewPath: () => PathKit.SkPath;
    FromCmds: (cmds: Array<Array<Number>>) => PathKit.SkPath;
    PathOp: PathOp;
    StrokeCap: StrokeCap;
    StrokeJoin: StrokeJoin;
    readonly FillType: FillTypeEnumValues;
  };
}

declare module "pathkit-wasm";

declare module "pathkit-wasm/bin/pathkit" {
  type PathKitInit = (options: {
    locateFile?: () => string;
  }) => Promise<PathKit.PathKitApi>;

  const init: PathKitInit;

  export default init;
}
