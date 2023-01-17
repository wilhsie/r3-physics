import React, { useState } from "react";
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, MeshReflectorMaterial, OrbitControls } from '@react-three/drei';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import './App.css';

function Cube(props) {
  const [ref, api] = useBox(() => ({ mass: 1, ...props }));

  // onClick constant keeps track of cube state
  const [active, setActive] = useState(false)
  
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
      <MeshReflectorMaterial /> 
    </mesh>
  )
}

function App() {
  return (
    <Canvas camera={{ position: [5, 5, 5]}}>
      <ambientLight intensity={0.3} />
      <pointLight position={[10,10,15]} />
      <Physics>
        <Cube rotation={[-0.3, -7, 1.4]}/>
        <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}/>
      </Physics>
  
      <OrbitControls />
    </Canvas>
  )
}

export default App;
