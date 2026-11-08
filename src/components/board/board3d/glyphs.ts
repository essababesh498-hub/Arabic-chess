import * as THREE from 'three';

/** Tiny 5×7 glyphs so rank and file labels work without a font texture or a DOM canvas. */
const FONT: Record<string, string[]> = {
  a: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  b: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  c: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  d: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  e: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  f: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  g: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  h: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '10000', '11110', '00001', '10001', '01110'],
  '6': ['01110', '10000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
};

const SCALE = 4;
const materials = new Map<string, THREE.MeshBasicMaterial>();

export const glyphPlane = new THREE.PlaneGeometry(0.34, 0.46);

function textureFor(character: string) {
  const rows = FONT[character];
  const width = 5 * SCALE;
  const height = 7 * SCALE;
  const data = new Uint8Array(width * height * 4);
  if (!rows) return new THREE.DataTexture(data, width, height);

  for (let y = 0; y < 7; y += 1) {
    for (let x = 0; x < 5; x += 1) {
      if (rows[y]?.[x] !== '1') continue;
      for (let sy = 0; sy < SCALE; sy += 1) {
        for (let sx = 0; sx < SCALE; sx += 1) {
          const px = x * SCALE + sx;
          const py = (6 - y) * SCALE + sy;
          const index = (py * width + px) * 4;
          data[index] = 246;
          data[index + 1] = 230;
          data[index + 2] = 188;
          data[index + 3] = 255;
        }
      }
    }
  }

  const texture = new THREE.DataTexture(data, width, height);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function glyphMaterial(character: string) {
  const cached = materials.get(character);
  if (cached) return cached;
  const material = new THREE.MeshBasicMaterial({
    map: textureFor(character),
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  materials.set(character, material);
  return material;
}
