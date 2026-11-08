import React, { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useIsFocused } from 'expo-router';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber/native';
import type { BoardStageProps } from '@/components/board/BoardStage';
import { ChessScene, boardCamera } from '@/components/board/board3d/ChessScene';
import { useBoardPixelSize } from '@/components/board/boardSize';

/**
 * Tilted 3D board. Pieces are original lathe/extrude meshes, not imported models.
 * The Canvas comes from React Three Fiber's Expo entry, which renders through expo-gl
 * on web and on a phone.
 */
export function Board3DScene({
  fen,
  orientation = 'white',
  selected = null,
  legalTargets = [],
  lastMove = null,
  highlighted = [],
  interactive = true,
  onSquarePress,
  showCoordinates = true,
  maxSize,
  viewport,
}: BoardStageProps) {
  const fitted = useBoardPixelSize(maxSize);
  const width = viewport?.width ?? fitted;
  const height = viewport?.height ?? fitted;
  const focused = useIsFocused();
  const low = Platform.OS !== 'web' || Math.min(width, height) < 280;
  const shadows = !low;
  const gl = useMemo(
    () => ({
      antialias: !low,
      alpha: true,
      powerPreference: 'low-power' as const,
    }),
    [low],
  );

  const canvasStyle = {
    flex: 1,
    backgroundColor: 'transparent' as const,
    width,
    height,
  };

  return (
    <View style={[styles.stage, { width, height }]} accessibilityLabel="لوحة الشطرنج">
      {focused ? (
        <Canvas
          style={canvasStyle}
          shadows={shadows}
          frameloop="demand"
          camera={{
            fov: boardCamera.fov,
            near: boardCamera.near,
            far: boardCamera.far,
            position: boardCamera.position,
          }}
          gl={gl}
          onCreated={({ gl: renderer, camera }) => {
            renderer.setClearColor(0x000000, 0);
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            camera.lookAt(boardCamera.lookAt[0], boardCamera.lookAt[1], boardCamera.lookAt[2]);
          }}
        >
          <ChessScene
            fen={fen}
            orientation={orientation}
            selected={selected}
            legalTargets={legalTargets}
            lastMove={lastMove}
            highlighted={highlighted}
            interactive={interactive}
            showCoordinates={showCoordinates}
            onSquarePress={onSquarePress}
            yaw={0}
            shadows={shadows}
            detail={low ? 'low' : 'high'}
          />
        </Canvas>
      ) : (
        <View style={canvasStyle} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
});
