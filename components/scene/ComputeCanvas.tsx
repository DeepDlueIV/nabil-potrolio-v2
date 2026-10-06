'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { ComputeSceneProps } from './ComputeScene';
import type { SceneComponentId } from './compute-model';

type ComputeCanvasProps = Omit<ComputeSceneProps, 'forceFallback'> & {
  visible: boolean;
  onContextLost: () => void;
};

function ClusterModel({ mode, selected, phase, paused }: Omit<ComputeCanvasProps, 'visible' | 'onContextLost'>) {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const targetSpread = mode === 'exploded' ? 1.1 : 0;
  const phaseRotation = phase === 'compute' ? -0.2 : phase === 'orchestration' ? 0.04 : 0.23;

  useFrame((state, delta) => {
    if (!group.current || paused) return;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, phaseRotation + state.pointer.x * 0.09, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -0.16 + state.pointer.y * 0.045, 4, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, phase === 'system' ? -.15 : .05, 4, delta);
    if (pulse.current) {
      const progress = (state.clock.elapsedTime % 2.4) / 2.4;
      pulse.current.position.x = -2.4 + progress * 4.8;
    }
  });

  const active = (id: SceneComponentId) => selected === id ? '#7ee7f5' : '#344454';
  const emissive = (id: SceneComponentId) => selected === id ? '#276c77' : '#071018';

  return (
    <group ref={group} rotation={[-.16, -.2, 0]}>
      <group position={[0, targetSpread * 1.25, 0]}>
        {[-1.5, -.5, .5, 1.5].map((x, index) => (
          <group key={x} position={[x, (index % 2) * .06, 0]}>
            <mesh castShadow>
              <boxGeometry args={[.78, .18, 2.5]} />
              <meshStandardMaterial color={active('accelerators')} emissive={emissive('accelerators')} metalness={.88} roughness={.22} />
            </mesh>
            <mesh position={[0, .14, -.7]}>
              <boxGeometry args={[.48, .06, .68]} />
              <meshStandardMaterial color="#091018" emissive={index === 1 ? '#7ee7f5' : '#102731'} emissiveIntensity={index === 1 ? 1.8 : .4} />
            </mesh>
          </group>
        ))}
      </group>
      <group>
        <mesh position={[0, -.25, 0]}>
          <boxGeometry args={[4.7, .08, 3.05]} />
          <meshStandardMaterial color={active('fabric')} emissive={emissive('fabric')} metalness={.82} roughness={.35} wireframe={phase === 'system'} />
        </mesh>
        <mesh ref={pulse} position={[-2.4, -.18, 0]}>
          <sphereGeometry args={[.075, 18, 18]} />
          <meshStandardMaterial color="#dffcff" emissive="#7ee7f5" emissiveIntensity={3} />
        </mesh>
      </group>
      <group position={[-3.15 - targetSpread * .5, .12, 0]}>
        <mesh castShadow>
          <boxGeometry args={[.9, 1.45, 2.1]} />
          <meshStandardMaterial color={active('gateway')} emissive={emissive('gateway')} metalness={.78} roughness={.28} />
        </mesh>
        {[.45, .12, -.21, -.54].map((y) => <mesh key={y} position={[.46, y, .42]}><sphereGeometry args={[.045, 12, 12]} /><meshBasicMaterial color="#7ee7f5" /></mesh>)}
      </group>
      <group position={[0, -1.1 - targetSpread, .08]}>
        <mesh receiveShadow>
          <boxGeometry args={[5.4, .22, 3.4]} />
          <meshStandardMaterial color={active('data')} emissive={emissive('data')} metalness={.72} roughness={.42} />
        </mesh>
        {[-1.8, -1.2, -.6, 0, .6, 1.2, 1.8].map((x) => <mesh key={x} position={[x, .16, -.9]}><boxGeometry args={[.28, .08, .5]} /><meshBasicMaterial color={x === .6 ? '#7ee7f5' : '#536675'} /></mesh>)}
      </group>
    </group>
  );
}

function ContextLossHandler({ onContextLost }: { onContextLost: () => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);
    return () => canvas.removeEventListener('webglcontextlost', handleContextLost);
  }, [gl, onContextLost]);

  return null;
}

export function ComputeCanvas({ visible, onContextLost, ...props }: ComputeCanvasProps) {
  return (
    <div className="compute-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [6.7, 4.4, 7.4], fov: 34 }}
        dpr={[1, 1.5]}
        frameloop={props.paused || !visible ? 'never' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => gl.setClearColor(0x090d13, 0)}
      >
        <ambientLight intensity={.9} />
        <directionalLight position={[5, 7, 6]} intensity={3.2} color="#d9f8ff" castShadow />
        <pointLight position={[-4, 1, 3]} intensity={5} color="#2da9ba" />
        <ContextLossHandler onContextLost={onContextLost} />
        <ClusterModel {...props} />
      </Canvas>
    </div>
  );
}
