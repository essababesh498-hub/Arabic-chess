import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber/native';
import type { Square } from 'chess.js';
import type { BoardStageProps } from '@/components/board/BoardStage';
import { glyphMaterial, glyphPlane } from '@/components/board/board3d/glyphs';
import {
  captureRingGeometry,
  dotGeometry,
  frameGeometry,
  ignoreRaycast,
  lipGeometry,
  tileGeometry,
} from '@/components/board/board3d/geometry';
import {
  initialActors,
  reconcile,
  squareToPoint,
  type BoardActor,
} from '@/components/board/board3d/actors';
import { PieceMesh } from '@/components/board/board3d/PieceMesh';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const RANKS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/** Same tilt as the reference: about 54° off the table, near rank larger, tops still visible. */
const ELEVATION = (54 * Math.PI) / 180;
const FACING_BACK = 9.6;
const TURNED_BACK = 15.8;

export function boardCameraPose(angle: number) {
  const turn = Math.abs(Math.sin(angle * 2));
  const back = FACING_BACK + (TURNED_BACK - FACING_BACK) * turn;
  const height = back * Math.tan(ELEVATION);
  return {
    x: Math.sin(angle) * back,
    y: height,
    z: Math.cos(angle) * back,
    lookX: 0,
    lookY: 0,
    lookZ: 0,
  };
}

const initialPose = boardCameraPose(0);

export const boardCamera = {
  fov: 36,
  near: 0.1,
  far: 80,
  position: [initialPose.x, initialPose.y, initialPose.z] as [number, number, number],
  lookAt: [0, 0, 0] as [number, number, number],
};

type SceneProps = {
  fen: string;
  orientation: NonNullable<BoardStageProps['orientation']>;
  selected: Square | null;
  legalTargets: Square[];
  lastMove: BoardStageProps['lastMove'];
  highlighted: Square[];
  interactive: boolean;
  showCoordinates: boolean;
  onSquarePress?: (square: Square) => void;
  yaw: number;
  shadows: boolean;
  detail: 'low' | 'high';
};

export function ChessScene({
  fen,
  orientation,
  selected,
  legalTargets,
  lastMove,
  highlighted,
  interactive,
  showCoordinates,
  onSquarePress,
  yaw,
  shadows,
  detail,
}: SceneProps) {
  const [actors, setActors] = useState<BoardActor[]>(() => initialActors(fen));
  const fenRef = useRef(fen);
  const targets = useMemo(() => new Set(legalTargets), [legalTargets]);
  const highlights = useMemo(() => new Set(highlighted), [highlighted]);
  const occupied = useMemo(() => {
    const squares = new Set<Square>();
    for (const actor of actors) {
      if (!actor.leaving) squares.add(actor.square);
    }
    return squares;
  }, [actors]);

  useEffect(() => {
    if (fenRef.current === fen) return;
    fenRef.current = fen;
    setActors((current) => {
      const lingering = current.filter((actor) => actor.leaving);
      return [...reconcile(current, fen), ...lingering];
    });
  }, [fen]);

  const removeActor = (id: string) => {
    setActors((current) => current.filter((actor) => actor.id !== id));
  };

  return (
    <>
      <CameraRig yaw={yaw} />
      <hemisphereLight color="#F6E6BC" groundColor="#241910" intensity={0.62} />
      <ambientLight intensity={0.28} />
      <KeyLight shadows={shadows} />
      <directionalLight position={[-6, 8, -4]} intensity={0.32} />
      <group rotation={[0, orientation === 'black' ? Math.PI : 0, 0]}>
        <mesh geometry={frameGeometry} position={[0, -0.08, 0]} receiveShadow>
          <meshStandardMaterial color="#2A2118" metalness={0.58} roughness={0.34} />
        </mesh>
        <mesh geometry={lipGeometry} position={[0, 0.055, 0]} receiveShadow>
          <meshStandardMaterial color="#C6A15A" metalness={0.72} roughness={0.28} />
        </mesh>
        {FILES.map((file, fileIndex) =>
          RANKS.map((rank) => {
            const square = `${file}${rank}` as Square;
            const point = squareToPoint(square);
            const light = (fileIndex + rank) % 2 === 1;
            const hot = selected === square
              ? 'selected'
              : lastMove?.from === square || lastMove?.to === square
                ? 'last'
                : highlights.has(square)
                  ? 'hi'
                  : null;
            return (
              <group key={square}>
                <Tile
                  square={square}
                  x={point.x}
                  z={point.z}
                  light={light}
                  fileIndex={fileIndex}
                  rank={rank}
                  hot={hot}
                  interactive={interactive}
                  onSquarePress={onSquarePress}
                />
                {targets.has(square) && !occupied.has(square) ? (
                  <mesh
                    geometry={dotGeometry}
                    position={[point.x, 0.16, point.z]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    onPointerDown={(event) => {
                      if (!interactive) return;
                      event.stopPropagation();
                      onSquarePress?.(square);
                    }}
                  >
                    <meshBasicMaterial color="#F8E7B0" transparent opacity={0.92} />
                  </mesh>
                ) : null}
                {targets.has(square) && occupied.has(square) ? (
                  <mesh
                    geometry={captureRingGeometry}
                    position={[point.x, 0.16, point.z]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    onPointerDown={(event) => {
                      if (!interactive) return;
                      event.stopPropagation();
                      onSquarePress?.(square);
                    }}
                  >
                    <meshBasicMaterial color="#F0B4A8" transparent opacity={0.9} />
                  </mesh>
                ) : null}
              </group>
            );
          }),
        )}
        {actors.map((actor) => (
          <PieceMesh
            key={actor.id}
            actor={actor}
            selected={selected === actor.square && !actor.leaving}
            interactive={interactive}
            shadows={shadows}
            detail={detail}
            onSquarePress={onSquarePress}
            onGone={removeActor}
          />
        ))}
        {showCoordinates ? <Coordinates /> : null}
      </group>
    </>
  );
}

function Tile({
  square,
  x,
  z,
  light,
  fileIndex,
  rank,
  hot,
  interactive,
  onSquarePress,
}: {
  square: Square;
  x: number;
  z: number;
  light: boolean;
  fileIndex: number;
  rank: number;
  hot: 'selected' | 'last' | 'hi' | null;
  interactive: boolean;
  onSquarePress?: (square: Square) => void;
}) {
  const color = useMemo(() => {
    if (hot === 'selected') return new THREE.Color('#E2B657');
    if (hot === 'last') return new THREE.Color(light ? '#E8D2A4' : '#6A5432');
    if (hot === 'hi') return new THREE.Color(light ? '#F0E2B8' : '#7A6238');
    const base = new THREE.Color(light ? '#E8DCC8' : '#3A3228');
    const shift = (((fileIndex * 5 + rank * 3) % 7) - 3) * 0.012;
    base.offsetHSL(0, 0, shift);
    return base;
  }, [fileIndex, hot, light, rank]);

  return (
    <mesh
      geometry={tileGeometry}
      position={[x, 0.122, z]}
      receiveShadow
      onPointerDown={(event) => {
        if (!interactive) return;
        event.stopPropagation();
        onSquarePress?.(square);
      }}
    >
      <meshStandardMaterial
        color={color}
        roughness={light ? 0.32 : 0.46}
        metalness={light ? 0.22 : 0.28}
      />
    </mesh>
  );
}

function Coordinates() {
  return (
    <group>
      {FILES.map((file, index) => (
        <Glyph key={file} character={file} x={index - 3.5} z={4.48} />
      ))}
      {RANKS.map((rank) => (
        <Glyph key={rank} character={String(rank)} x={-4.48} z={4.5 - rank} />
      ))}
    </group>
  );
}

function Glyph({ character, x, z }: { character: string; x: number; z: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ camera }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const angle = Math.atan2(camera.position.x, camera.position.z);
    const parentYaw = mesh.parent?.rotation.y ?? 0;
    mesh.rotation.set(-Math.PI / 2, angle - parentYaw, 0);
  });

  return (
    <mesh
      ref={ref}
      geometry={glyphPlane}
      material={glyphMaterial(character)}
      position={[x, 0.16, z]}
      raycast={ignoreRaycast}
    />
  );
}

/**
 * Steps the camera back along its authored angle when the canvas is too
 * narrow to contain every file. Square and landscape views keep the pose.
 */
export function boardViewScale(aspect: number) {
  if (!Number.isFinite(aspect) || aspect <= 0 || aspect >= 1) return 1;
  return 1 / Math.max(aspect, 0.35);
}

function CameraRig({ yaw }: { yaw: number }) {
  const current = useRef(0);
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);
  useFrame(({ camera }, delta) => {
    const step = 1 - Math.exp(-delta * 3.2);
    const next = current.current + (yaw - current.current) * step;
    const moving = Math.abs(yaw - next) > 0.0008;
    current.current = moving ? next : yaw;
    const pose = boardCameraPose(current.current);
    const aspect = size.height > 0 ? size.width / size.height : 0;
    const fit = boardViewScale(aspect);
    camera.position.set(pose.x * fit, pose.y * fit, pose.z * fit);
    camera.lookAt(pose.lookX, pose.lookY, pose.lookZ);
    if (
      camera instanceof THREE.PerspectiveCamera &&
      aspect > 0 &&
      Math.abs(camera.aspect - aspect) > 0.001
    ) {
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
    }
    if (moving) invalidate();
  });
  return null;
}

function KeyLight({ shadows }: { shadows: boolean }) {
  const light = useRef<THREE.DirectionalLight>(null);
  useFrame(({ camera }) => {
    if (!light.current) return;
    light.current.position.set(camera.position.x * 0.45 + 2.5, 16, camera.position.z * 0.45 + 1.5);
  });

  return (
    <directionalLight
      ref={light}
      position={[2.5, 16, 7.5]}
      intensity={1.35}
      castShadow={shadows}
      shadow-mapSize-width={512}
      shadow-mapSize-height={512}
      shadow-bias={-0.0006}
      shadow-normalBias={0.04}
      shadow-camera-near={4}
      shadow-camera-far={48}
      shadow-camera-left={-8}
      shadow-camera-right={8}
      shadow-camera-top={8}
      shadow-camera-bottom={-8}
    />
  );
}
