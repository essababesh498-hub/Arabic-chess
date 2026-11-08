import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber/native';
import type { BoardActor } from '@/components/board/board3d/actors';
import { squareToPoint } from '@/components/board/board3d/actors';
import {
  contactShadowGeometry,
  ignoreRaycast,
  pieceGeometries,
  selectRingGeometry,
  type PieceGeometries,
} from '@/components/board/board3d/geometry';

const BASE_Y = 0.15;

type Props = {
  actor: BoardActor;
  selected: boolean;
  interactive: boolean;
  shadows: boolean;
  detail: 'low' | 'high';
  onSquarePress?: (square: BoardActor['square']) => void;
  onGone: (id: string) => void;
};

export function PieceMesh({
  actor,
  selected,
  interactive,
  shadows,
  detail,
  onSquarePress,
  onGone,
}: Props) {
  const group = useRef<THREE.Group>(null);
  const point = useRef(squareToPoint(actor.square));
  const height = useRef(0);
  const opacity = useRef(1);
  const removed = useRef(false);
  const invalidate = useThree((state) => state.invalidate);
  const geometry = pieceGeometries[detail];

  const material = useMemo(() => {
    const ivory = actor.color === 'w';
    return new THREE.MeshStandardMaterial({
      color: ivory ? '#F4EFE6' : '#171412',
      roughness: ivory ? 0.46 : 0.34,
      metalness: ivory ? 0.06 : 0.24,
    });
  }, [actor.color]);

  const slitMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: actor.color === 'w' ? '#2A241C' : '#E7DCC8',
        roughness: 0.5,
        metalness: 0.05,
      }),
    [actor.color],
  );

  useEffect(() => {
    return () => {
      material.dispose();
      slitMaterial.dispose();
    };
  }, [material, slitMaterial]);

  useEffect(() => {
    material.emissive.set(selected ? '#E2B657' : '#000000');
    material.emissiveIntensity = selected ? 0.55 : 0;
  }, [material, selected]);

  useFrame((_, delta) => {
    const target = squareToPoint(actor.square);
    const step = 1 - Math.exp(-delta * 6.5);
    let moving = false;

    if (actor.leaving) {
      const drift = actor.color === 'w' ? 1 : -1;
      point.current.z += drift * delta * 1.35;
      height.current = Math.min(1.6, height.current + delta * 1.5);
      opacity.current = Math.max(0, opacity.current - delta * 1.65);
      moving = opacity.current > 0;
      if (opacity.current <= 0 && !removed.current) {
        removed.current = true;
        onGone(actor.id);
      }
    } else {
      const dx = target.x - point.current.x;
      const dz = target.z - point.current.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 0.004) {
        point.current.x = target.x;
        point.current.z = target.z;
        height.current += (0 - height.current) * step;
        if (height.current > 0.004) moving = true;
        else height.current = 0;
      } else {
        point.current.x += dx * step;
        point.current.z += dz * step;
        const lift = Math.min(0.42, distance * 0.28);
        height.current += (lift - height.current) * step;
        moving = true;
      }
      opacity.current = 1;
    }

    material.opacity = opacity.current;
    material.transparent = opacity.current < 0.999;
    material.depthWrite = opacity.current > 0.85;

    if (group.current) {
      group.current.position.set(point.current.x, BASE_Y + height.current, point.current.z);
    }
    if (moving) invalidate();
  });

  return (
    <group
      ref={(node) => {
        group.current = node;
        if (node) {
          node.position.set(point.current.x, BASE_Y + height.current, point.current.z);
        }
      }}
      onPointerDown={(event) => {
        if (!interactive || actor.leaving) return;
        event.stopPropagation();
        onSquarePress?.(actor.square);
      }}
    >
      <mesh
        geometry={contactShadowGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.008, 0]}
        raycast={ignoreRaycast}
      >
        <meshBasicMaterial color="#000000" transparent opacity={0.28} depthWrite={false} />
      </mesh>
      {selected ? (
        <mesh
          geometry={selectRingGeometry}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.012, 0]}
          raycast={ignoreRaycast}
        >
          <meshBasicMaterial color="#F8E7B0" transparent opacity={0.95} depthWrite={false} />
        </mesh>
      ) : null}
      <group scale={1.12}>
      <PieceBody
        actor={actor}
        geometry={geometry}
        material={material}
        slitMaterial={slitMaterial}
        shadows={shadows}
      />
      </group>
    </group>
  );
}

function PieceBody({
  actor,
  geometry,
  material,
  slitMaterial,
  shadows,
}: {
  actor: BoardActor;
  geometry: PieceGeometries;
  material: THREE.Material;
  slitMaterial: THREE.Material;
  shadows: boolean;
}) {
  if (actor.type === 'n') {
    const facing = actor.color === 'w' ? Math.PI / 2 : -Math.PI / 2;
    return (
      <group rotation={[0, facing, 0]}>
        <mesh geometry={geometry.nBase} material={material} castShadow={shadows} />
        <mesh geometry={geometry.nHead} material={material} castShadow={shadows} />
      </group>
    );
  }

  const body =
    actor.type === 'r'
      ? geometry.r
      : actor.type === 'b'
        ? geometry.b
        : actor.type === 'q'
          ? geometry.q
          : actor.type === 'k'
            ? geometry.k
            : geometry.p;

  return (
    <group>
      <mesh geometry={body} material={material} castShadow={shadows} />
      {actor.type === 'r'
        ? [0, 1, 2, 3].map((index) => {
            const angle = (index * Math.PI) / 2 + Math.PI / 4;
            return (
              <mesh
                key={index}
                geometry={geometry.merlon}
                material={material}
                position={[
                  Math.cos(angle) * 0.12,
                  geometry.tops.r + 0.06,
                  Math.sin(angle) * 0.12,
                ]}
                castShadow={shadows}
              />
            );
          })
        : null}
      {actor.type === 'b' ? (
        <mesh
          geometry={geometry.slit}
          material={slitMaterial}
          position={[0, geometry.tops.b * 0.78, actor.color === 'w' ? -0.07 : 0.07]}
        />
      ) : null}
      {actor.type === 'q' ? (
        <group>
          <mesh
            geometry={geometry.ball}
            material={material}
            position={[0, geometry.tops.q + 0.07, 0]}
            castShadow={shadows}
          />
          {[0, 1, 2, 3, 4].map((index) => {
            const angle = (index / 5) * Math.PI * 2;
            return (
              <mesh
                key={index}
                geometry={geometry.pip}
                material={material}
                position={[
                  Math.cos(angle) * 0.11,
                  geometry.tops.q - 0.01,
                  Math.sin(angle) * 0.11,
                ]}
              />
            );
          })}
        </group>
      ) : null}
      {actor.type === 'k' ? (
        <group>
          <mesh
            geometry={geometry.crossV}
            material={material}
            position={[0, geometry.tops.k + 0.12, 0]}
            castShadow={shadows}
          />
          <mesh
            geometry={geometry.crossH}
            material={material}
            position={[0, geometry.tops.k + 0.16, 0]}
            castShadow={shadows}
          />
        </group>
      ) : null}
    </group>
  );
}
