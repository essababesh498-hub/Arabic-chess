import * as THREE from 'three';

/**
 * Original Staunton-like meshes built with lathe and extrude geometry.
 * No downloaded models, so there is no third-party asset license.
 */

export type PieceGeometries = {
  p: THREE.LatheGeometry;
  r: THREE.LatheGeometry;
  b: THREE.LatheGeometry;
  q: THREE.LatheGeometry;
  k: THREE.LatheGeometry;
  nBase: THREE.LatheGeometry;
  nHead: THREE.BufferGeometry;
  merlon: THREE.BoxGeometry;
  crossV: THREE.BoxGeometry;
  crossH: THREE.BoxGeometry;
  ball: THREE.SphereGeometry;
  pip: THREE.SphereGeometry;
  slit: THREE.BoxGeometry;
  tops: { r: number; b: number; q: number; k: number };
};

function lathe(points: Array<[number, number]>, segments: number) {
  const geometry = new THREE.LatheGeometry(
    points.map(([radius, y]) => new THREE.Vector2(radius, y)),
    segments,
  );
  geometry.computeVertexNormals();
  return geometry;
}

function knightHead(curveSegments: number) {
  const shape = new THREE.Shape();
  shape.moveTo(-0.02, 0);
  shape.lineTo(0.16, 0);
  shape.lineTo(0.18, 0.08);
  shape.lineTo(0.14, 0.2);
  shape.lineTo(0.2, 0.34);
  shape.lineTo(0.25, 0.48);
  shape.lineTo(0.16, 0.57);
  shape.lineTo(0.08, 0.5);
  shape.lineTo(0.055, 0.68);
  shape.lineTo(-0.015, 0.55);
  shape.lineTo(-0.09, 0.4);
  shape.lineTo(-0.07, 0.18);
  shape.lineTo(-0.02, 0.08);
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    steps: 1,
    depth: 0.16,
    bevelEnabled: true,
    bevelThickness: 0.018,
    bevelSize: 0.016,
    bevelSegments: 1,
    curveSegments,
  });
  geometry.translate(-0.07, 0.14, -0.1);
  geometry.computeVertexNormals();
  return geometry;
}

function build(segments: number): PieceGeometries {
  const pawn: Array<[number, number]> = [
    [0.001, 0],
    [0.2, 0],
    [0.22, 0.035],
    [0.18, 0.07],
    [0.12, 0.11],
    [0.085, 0.16],
    [0.072, 0.3],
    [0.1, 0.36],
    [0.068, 0.4],
    [0.12, 0.45],
    [0.15, 0.52],
    [0.145, 0.6],
    [0.07, 0.66],
    [0.02, 0.69],
  ];
  const rook: Array<[number, number]> = [
    [0.001, 0],
    [0.21, 0],
    [0.23, 0.04],
    [0.16, 0.085],
    [0.125, 0.13],
    [0.112, 0.36],
    [0.15, 0.42],
    [0.178, 0.48],
    [0.178, 0.56],
  ];
  const bishop: Array<[number, number]> = [
    [0.001, 0],
    [0.2, 0],
    [0.22, 0.04],
    [0.15, 0.09],
    [0.09, 0.15],
    [0.064, 0.36],
    [0.1, 0.46],
    [0.052, 0.52],
    [0.09, 0.6],
    [0.072, 0.74],
    [0.028, 0.82],
  ];
  const queen: Array<[number, number]> = [
    [0.001, 0],
    [0.21, 0],
    [0.23, 0.045],
    [0.16, 0.09],
    [0.095, 0.16],
    [0.074, 0.42],
    [0.12, 0.52],
    [0.082, 0.58],
    [0.15, 0.66],
    [0.1, 0.73],
    [0.04, 0.77],
  ];
  const king: Array<[number, number]> = [
    [0.001, 0],
    [0.22, 0],
    [0.24, 0.05],
    [0.17, 0.1],
    [0.1, 0.16],
    [0.082, 0.44],
    [0.13, 0.54],
    [0.088, 0.6],
    [0.155, 0.68],
    [0.108, 0.76],
    [0.042, 0.81],
  ];
  const knightBase: Array<[number, number]> = [
    [0.001, 0],
    [0.2, 0],
    [0.22, 0.04],
    [0.15, 0.08],
    [0.12, 0.15],
  ];

  return {
    p: lathe(pawn, segments),
    r: lathe(rook, segments),
    b: lathe(bishop, segments),
    q: lathe(queen, segments),
    k: lathe(king, segments),
    nBase: lathe(knightBase, Math.max(8, segments - 2)),
    nHead: knightHead(Math.max(4, Math.round(segments / 2))),
    merlon: new THREE.BoxGeometry(0.075, 0.12, 0.075),
    crossV: new THREE.BoxGeometry(0.034, 0.2, 0.034),
    crossH: new THREE.BoxGeometry(0.15, 0.034, 0.034),
    ball: new THREE.SphereGeometry(0.055, 10, 8),
    pip: new THREE.SphereGeometry(0.03, 6, 5),
    slit: new THREE.BoxGeometry(0.018, 0.2, 0.03),
    tops: {
      r: rook[rook.length - 1]![1],
      b: bishop[bishop.length - 1]![1],
      q: queen[queen.length - 1]![1],
      k: king[king.length - 1]![1],
    },
  };
}

export const pieceGeometries = {
  high: build(12),
  low: build(8),
};

export const tileGeometry = new THREE.BoxGeometry(0.96, 0.055, 0.96);
export const frameGeometry = new THREE.BoxGeometry(9.25, 0.28, 9.25);
export const lipGeometry = new THREE.BoxGeometry(8.55, 0.08, 8.55);
export const dotGeometry = new THREE.CircleGeometry(0.13, 14);
export const captureRingGeometry = new THREE.RingGeometry(0.3, 0.4, 20);
export const selectRingGeometry = new THREE.RingGeometry(0.28, 0.4, 20);
export const contactShadowGeometry = new THREE.CircleGeometry(0.26, 12);

export function ignoreRaycast() {
  return undefined;
}
