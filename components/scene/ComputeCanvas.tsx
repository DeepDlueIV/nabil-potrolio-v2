'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { ComputeSceneProps } from './ComputeScene';
import { requestRoute } from './compute-model';

type ComputeCanvasProps = Omit<ComputeSceneProps, 'forceFallback'> & { onContextLost: () => void; onReady: () => void };
type V3 = [number, number, number];
const box = new THREE.BoxGeometry(1, 1, 1);
const metal = new THREE.MeshStandardMaterial({ color: '#3b4d5c', metalness: .75, roughness: .38 });
const dark = new THREE.MeshStandardMaterial({ color: '#101b27', metalness: .55, roughness: .48 });
const alloy = new THREE.MeshStandardMaterial({ color: '#899eab', metalness: .8, roughness: .32 });
const board = new THREE.MeshStandardMaterial({ color: '#173f3b', metalness: .25, roughness: .6 });
const cyan = new THREE.MeshStandardMaterial({ color: '#7ee7f5', emissive: '#367e8b', emissiveIntensity: .65, metalness: .5, roughness: .35 });
const cableMaterial = new THREE.MeshStandardMaterial({ color: '#327a89', metalness: .35, roughness: .55 });

function Block({ position, size, material = metal }: { position: V3; size: V3; material?: THREE.Material }) {
  return <mesh geometry={box} material={material} position={position} scale={size} />;
}

function RepeatedBlocks({ items, material }: { items: Array<{ position: V3; size: V3 }>; material: THREE.Material }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const transform = new THREE.Object3D();
    items.forEach((item, index) => {
      transform.position.set(...item.position);
      transform.scale.set(...item.size);
      transform.updateMatrix();
      mesh.current?.setMatrixAt(index, transform.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [items]);
  return <instancedMesh ref={mesh} args={[box, material, items.length]} />;
}

const acceleratorPositions: V3[] = Array.from({ length: 8 }, (_, index) => [index % 2 ? .83 : -.83, .16, -1.08 + Math.floor(index / 2) * .72]);
const heatsinkFins = acceleratorPositions.flatMap(([x, y, z]) => Array.from({ length: 7 }, (_, index) => ({ position: [x - .48 + index * .16, y + .13, z] as V3, size: [.035, .15, .52] as V3 })));
const fanVents = [-1.5, -.5, .5, 1.5].flatMap((x) => Array.from({ length: 9 }, (_, i) => ({ position: [x - .36 + i * .09, -.18, 1.56] as V3, size: [.035, .43, .025] as V3 })));
const railHoles = [-2.16, 2.16].flatMap((x) => Array.from({ length: 14 }, (_, i) => ({ position: [x, -1.8 + i * .28, 1.74] as V3, size: [.08, .11, .015] as V3 })));
const safeCurvePoint = (curve: THREE.CatmullRomCurve3, progress: number) => curve.getPointAt(THREE.MathUtils.clamp(progress, 0, .999));

function RackModel({ phase, running, active, reduced, pointer }: Omit<ComputeCanvasProps, 'onContextLost' | 'onReady'> & { pointer: React.RefObject<{ x: number; y: number }> }) {
  const root = useRef<THREE.Group>(null);
  const drawer = useRef<THREE.Group>(null);
  const signal = useRef<THREE.Mesh>(null);
  const start = useRef<number | null>(null);
  const invalidate = useThree((state) => state.invalidate);
  const extended = phase === 'inside' || phase === 'flow';
  const target = extended ? 1.65 : 0;
  const route = useMemo(() => new THREE.CatmullRomCurve3(requestRoute.map((point) => new THREE.Vector3(...point)), false, 'centripetal'), []);
  const wire = useMemo(() => new THREE.TubeGeometry(route, 64, .018, 6, false), [route]);
  const entry = useMemo(() => new THREE.CatmullRomCurve3(requestRoute.slice(0, 4).map((point) => new THREE.Vector3(...point))), []);
  const entryWire = useMemo(() => new THREE.TubeGeometry(entry, 24, .035, 6, false), [entry]);

  useEffect(() => {
    start.current = null;
    if (!running && drawer.current) drawer.current.position.z = target;
    if (!running && root.current) root.current.rotation.set(0, 0, 0);
    if (!running && signal.current) signal.current.position.copy(phase === 'flow' ? safeCurvePoint(route, .72) : safeCurvePoint(entry, .65));
    invalidate();
  }, [phase, target, running, active, reduced, invalidate, route, entry]);

  useEffect(() => () => { wire.dispose(); entryWire.dispose(); }, [wire, entryWire]);

  useFrame((state, delta) => {
    if (!running || !active) return;
    if (start.current === null) start.current = state.clock.elapsedTime;
    if (drawer.current) drawer.current.position.z = THREE.MathUtils.damp(drawer.current.position.z, target, 4.5, delta);
    if (root.current) {
      root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, reduced ? 0 : pointer.current.x * .045, 5, delta);
      root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, reduced ? 0 : pointer.current.y * .025, 5, delta);
    }
    if (signal.current) {
      const elapsed = state.clock.elapsedTime - start.current;
      if (phase === 'system') signal.current.position.copy(safeCurvePoint(entry, (elapsed % 4) / 3));
      else if (phase === 'flow') {
        const progress = elapsed % 6;
        const position = progress < 2.8 ? progress / 2.8 : progress < 3.4 ? 1 : 1 - (progress - 3.4) / 2.6;
        signal.current.position.copy(safeCurvePoint(route, position));
      }
    }
  });

  return (
    <group ref={root} dispose={null}>
      {/* Стойка сохраняет силуэт при выдвижении вычислительного лотка. */}
      {[-2.16, 2.16].flatMap((x) => [-1.6, 1.68].map((z) => <Block key={`${x}-${z}`} position={[x, 0, z]} size={[.18, 4.3, .16]} material={alloy} />))}
      <RepeatedBlocks items={railHoles} material={dark} />
      <Block position={[0, 2.12, 0]} size={[4.55, .16, 3.45]} />
      <Block position={[0, -2.12, 0]} size={[4.55, .2, 3.45]} />
      <Block position={[0, 0, -1.65]} size={[4.2, 4, .1]} material={dark} />
      {[-1.95, 1.95].map((x) => <Block key={x} position={[x, -.15, 0]} size={[.08, 3.7, 3.1]} material={dark} />)}
      <Block position={[0, 1.47, 0]} size={[3.95, .48, 3]} material={dark} />
      <Block position={[0, 1.47, 1.54]} size={[3.9, .44, .13]} />
      {Array.from({ length: 8 }, (_, i) => <Block key={i} position={[-1.55 + i * .43, 1.48, 1.63]} size={[.28, .16, .03]} material={i < 2 ? cyan : dark} />)}
      {[-1.76, 1.76].map((x) => <Block key={x} position={[x, 1.45, 1.69]} size={[.07, .27, .08]} material={alloy} />)}
      <group ref={drawer}>
        <Block position={[0, -.34, 0]} size={[3.9, .12, 3.08]} />
        <Block position={[0, -.25, 0]} size={[3.6, .04, 2.92]} material={board} />
        {[-1.93, 1.93].map((x) => <Block key={x} position={[x, -.1, 0]} size={[.08, .48, 3.08]} />)}
        {acceleratorPositions.map((point, index) => <group key={index} position={point}>
          <Block position={[0, -.08, 0]} size={[1.2, .15, .56]} material={dark} />
          <Block position={[0, 0, 0]} size={[1.1, .08, .54]} material={alloy} />
          <Block position={[.48, .05, .29]} size={[.08, .04, .04]} material={cyan} />
        </group>)}
        <RepeatedBlocks items={heatsinkFins} material={alloy} />
        <Block position={[0, .04, -.1]} size={[.14, .05, 2.65]} material={cyan} />
        {[-1.08, -.36, .36, 1.08].map((z) => <Block key={z} position={[0, .04, z]} size={[2.65, .025, .035]} material={cableMaterial} />)}
        <Block position={[0, -.18, 1.5]} size={[3.9, .66, .08]} material={dark} />
        <RepeatedBlocks items={fanVents} material={metal} />
        {[-1.5, -.5, .5, 1.5].map((x) => <group key={x}>
          <Block position={[x, -.18, 1.62]} size={[.11, .52, .12]} material={alloy} />
          <Block position={[x - .32, .04, 1.6]} size={[.05, .025, .02]} material={cyan} />
        </group>)}
        {[-1.86, 1.86].map((x) => <Block key={x} position={[x, -.18, 1.7]} size={[.08, .45, .18]} material={alloy} />)}
      </group>
      <Block position={[0, -1.24, 0]} size={[3.9, .66, 3]} material={dark} />
      <Block position={[0, -1.24, 1.54]} size={[3.9, .64, .1]} />
      {Array.from({ length: 8 }, (_, i) => <group key={i}>
        <Block position={[-1.59 + i * .45, -1.24, 1.62]} size={[.37, .47, .08]} material={dark} />
        <Block position={[-1.59 + i * .45, -1.24, 1.69]} size={[.05, .3, .04]} material={alloy} />
        <Block position={[-1.7 + i * .45, -1.1, 1.69]} size={[.035, .035, .01]} material={cyan} />
      </group>)}
      <mesh geometry={entryWire} material={cableMaterial} />
      {phase === 'flow' && <mesh geometry={wire} material={cyan} />}
      <mesh ref={signal} visible={phase === 'system' || phase === 'flow'} position={[-3.6, 1.42, 1.75]}>
        <sphereGeometry args={[.065, 12, 10]} />
        <meshBasicMaterial color="#d8fcff" />
      </mesh>
    </group>
  );
}

function CanvasLifecycle({ onContextLost, onReady }: Pick<ComputeCanvasProps, 'onContextLost' | 'onReady'>) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    const lost = (event: Event) => { event.preventDefault(); onContextLost(); };
    canvas.addEventListener('webglcontextlost', lost);
    const frame = requestAnimationFrame(onReady);
    return () => { canvas.removeEventListener('webglcontextlost', lost); cancelAnimationFrame(frame); };
  }, [gl, onContextLost, onReady]);
  return null;
}

export function ComputeCanvas({ onContextLost, onReady, ...props }: ComputeCanvasProps) {
  const pointer = useRef({ x: 0, y: 0 });
  const canParallax = props.active && props.running && !props.reduced;
  return (
    <div className="hardware-canvas" aria-hidden="true"
      onPointerMove={(event) => {
        if (!canParallax || event.pointerType !== 'mouse' || !window.matchMedia('(pointer: fine)').matches) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointer.current = { x: (event.clientX - bounds.left) / bounds.width * 2 - 1, y: (event.clientY - bounds.top) / bounds.height * 2 - 1 };
      }}
      onPointerLeave={() => { pointer.current = { x: 0, y: 0 }; }}
    >
      <Canvas camera={{ position: [7, 4.8, 8.7], fov: 35, near: .1, far: 50 }} dpr={[1, 1.5]}
        frameloop={props.running && props.active ? 'always' : 'demand'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl, camera }) => { gl.setClearColor(0x090d13, 0); camera.lookAt(0, 0, .4); }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 7, 5]} intensity={3} color="#dcebf7" />
        <directionalLight position={[-5, 2, 1]} intensity={2} color="#7bc7d6" />
        <pointLight position={[3, 1, -4]} intensity={25} color="#cbd8fa" />
        <CanvasLifecycle onContextLost={onContextLost} onReady={onReady} />
        <RackModel {...props} pointer={pointer} />
      </Canvas>
    </div>
  );
}
