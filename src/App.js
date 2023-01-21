import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, MeshReflectorMaterial, OrbitControls, Stars } from '@react-three/drei';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { useKeyboardInput } from "./hooks/useKeyboardInput";
import './App.css';

function Cube(props) {
  const [ref, api] = useBox(() => ({ mass: 1, ...props }));

  const position = useRef([0, 0, 0])
  useEffect(() => {
    const unsubscribe = api.position.subscribe((v) => (position.current = v))
    return unsubscribe
  }, [])

  // Input hook
  const pressed = useKeyboardInput([" "]);

  useFrame(() => {
    if (JSON.stringify(pressed[" "]) === 'true') {
      console.log("the spacebar is being pressed.");
      api.applyImpulse([0, 1, 0], [0,0,0]);
    }
  });

  return (
    <mesh
      velocity={[100, 1, 1]}
      onClick={(event) => {
        const normal = event.face.normal.clone();
        normal.transformDirection(event.object.matrixWorld);
        normal.normalize();

        console.log("normal to array: " + normal.toArray().map((x) => x * 10));

        api.applyImpulse(normal.toArray().map((x) => x * 5), event.point.toArray());
      }}
      ref={ref} >
      <boxGeometry />
      <MeshDistortMaterial color='lightgreen' speed={1} distort={0.6} radius={1}/>
    </mesh>
  )
}

function Plane(props) {
  const [ref] = usePlane(() => ({ ...props }))
  return (
    <mesh ref={ref}>
      <planeGeometry args={[10, 10]}/>
      <MeshReflectorMaterial color='purple' /> 
    </mesh>
  )
}

function App() {
  return (
    <Canvas camera={{ position: [5, 5, 5]}} style={{background: "grey"}}>
      <pointLight position={[0,10,0]} intensity={0.5}  />
      <Physics>
        <Cube rotation={[-0.3, -7, 1.4]} position={[0, 2, 0]}/>
        <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}/>
      </Physics>

      <OrbitControls />

      <Stars />
    </Canvas>
  )
}

export default App;
