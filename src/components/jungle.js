import React, { useEffect, useState, useRef, Suspense } from "react";
import styled from "styled-components";
import useWindowDimensions from "./functions/useWindowDimensions";
import * as THREE from "three";
import denseCapColors from "./denseCapColors";
import { urlFor } from "./blocks/image";

import {
  Color,
  CubeTextureLoader,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
} from "three";

import {
  FirstPersonControls,
  DeviceOrientationControls,
  Points,
  Point,
  useTexture,
} from "@react-three/drei";

import { OBJLoader } from "three-stdlib";
import { useLoader, Canvas, useThree, useFrame } from "@react-three/fiber";

const objUrl = "../assets/jungle/jungle.obj";

const particleUrl = "../assets/jungle/particleTexture.png";

const PermissionButton = styled.div`
  width: 144.5px;
  height: 139px;
  background: url(../assets/jungle/tapme.png) no-repeat 0 0 / 100% auto;
  position: absolute;
  left: calc(50vw - 72.25px);
  top: calc(50vh - 69.5px);
  cursor: pointer;
`;

function Jungle({ cubeMap }) {
  const { height } = useWindowDimensions();
  const [cubeMapTextureUrls, SetCubeMapTxtureUrls] = useState([]);

  const [orientationRequestPermission, setOrientationRequestPermission] =
    useState(false);
  const [orientationPermissionGranted, setOrientationPermissionGranted] =
    useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.DeviceOrientationEvent && "ontouchstart" in window);
    setOrientationRequestPermission(
      window.DeviceOrientationEvent &&
        typeof window.DeviceOrientationEvent.requestPermission === "function"
    );
  }, []);

  console.log(cubeMap);

  useEffect(() => {
    let tempArray = [];
    tempArray.push(urlFor(cubeMap.posx.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.negx.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.posy.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.negy.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.posz.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.negz.asset).height(1000).url());

    SetCubeMapTxtureUrls(tempArray);

    console.log("temp array", tempArray);
  }, [
    cubeMap.posx.asset,
    cubeMap.negx.asset,
    cubeMap.posy.asset,
    cubeMap.negy.asset,
    cubeMap.posz.asset,
    cubeMap.negz.asset,
  ]);
  return (
    <>
      {orientationRequestPermission && !orientationPermissionGranted && (
        <PermissionButton
          onTouchEnd={() => {
            // if (mobileControls.current) mobileControls.current.connect();
            setOrientationPermissionGranted(true);
          }}
        />
      )}
      <Canvas
        id="canvas"
        style={{
          width: "100%",
          position: "relative",
          height: height,
          background: "zellow",
        }}
        // linear
        camera={{ position: [0, 0, 25], near: 0.1, far: 10000 }}
      >
        {isMobile ? (
          <DeviceOrientationControls />
        ) : (
          <FirstPersonControls activeLook={true} lookSpeed={0.06} />
        )}
        {/* <FirstPersonControls activeLook={true} lookSpeed={0.03} /> */}

        <Suspense fallback={null}>
          <Frames />
          {cubeMapTextureUrls.length > 5 && (
            <SkyBox cubeMapTextureUrls={cubeMapTextureUrls} />
          )}

          {/* <ambientLight /> */}
          <Particles />
        </Suspense>
      </Canvas>
    </>
  );
}

function Frames() {
  const [object, setJungleObj] = useState(useLoader(OBJLoader, objUrl));

  useEffect(() => {
    if (object) {
      object.scale.set(-1, 1, 1);
      let tempArray = [];
      object.traverse(function (child) {
        if (child instanceof Mesh) {
          if (child.name.includes("Cube") || child.name.includes("FRAME")) {
            const mat = new MeshBasicMaterial({
              color: 0xff0000,
              wireframe: false,
            });
            mat.color = new Color(
              denseCapColors[Math.floor(Math.random() * denseCapColors.length)]
            );
            child.material = mat;
          } else {
            child.material = new MeshBasicMaterial({
              color: 0x000000,
              wireframe: false,
              side: DoubleSide,
            });
          }
          tempArray.push(child);
        }
      });
      setJungleObj(object);
    }
  }, [object]);
  return (
    <group scale={[1, 1, 1]}>
      <primitive
        onPointerOver={(ev) => console.log("over", ev.object)}
        // onClick={(ev) => setEnabled(!enabled)}
        object={object}
      />
    </group>
  );
}
function SkyBox({ cubeMapTextureUrls }) {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new CubeTextureLoader();
    const mat = loader.load(cubeMapTextureUrls);
    scene.background = mat;
    scene.environment = mat;
  }, [scene, cubeMapTextureUrls]);

  return null;
}
function Particles() {
  const count = 750;
  const size = 2;
  const positionFactor = 144;
  const rotationSpeed = 0.1;

  const particleTexture = useTexture(particleUrl);

  const particlesRef1 = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    particlesRef1.current.rotation.y = elapsedTime * rotationSpeed;
    particlesRef1.current.rotation.z = (elapsedTime * rotationSpeed) / 2;
  });

  return (
    <Points ref={particlesRef1} limit={10000}>
      <pointsMaterial
        size={size}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        vertexColors
        map={particleTexture}
        alphaMap={particleTexture}
      />
      {Array.from({ length: count }).map((_, i) => (
        <Point
          key={i}
          position={[
            (0.5 - Math.random()) * positionFactor,
            (0.5 - Math.random()) * positionFactor,
            (0.5 - Math.random()) * positionFactor,
          ]}
          color={"white"}
        />
      ))}
    </Points>
  );
}
export default Jungle;
