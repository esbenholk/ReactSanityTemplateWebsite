import React, { useEffect, useState, useRef, Suspense } from "react";
import styled from "styled-components";
import useWindowDimensions from "./functions/useWindowDimensions";
import * as THREE from "three";
import denseCapColors from "./denseCapColors";
import { xpositions, ypositions, zpositions } from "./pointPositions";
import { urlFor } from "./blocks/image";

import {
  Color,
  CubeTextureLoader,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
} from "three";

import {
  FirstPersonControls,
  DeviceOrientationControls,
  PointMaterial,
  Points,
  Point,
  useTexture,
} from "@react-three/drei";

import { OBJLoader } from "three-stdlib";
import { useLoader, Canvas, useThree, useFrame } from "@react-three/fiber";

const objUrl = "../assets/jungle/jungle4.obj";

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

function Jungle({ cubeMap, updateJungleMenu, openJungleMenuLink }) {
  const { height } = useWindowDimensions();
  const [cubeMapTextureUrls, SetCubeMapTxtureUrls] = useState([]);

  const [orientationRequestPermission, setOrientationRequestPermission] =
    useState(false);
  const [orientationPermissionGranted, setOrientationPermissionGranted] =
    useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.DeviceOrientationEvent && "ontouchstart" in window);

    if (typeof DeviceMotionEvent.requestPermission === "function") {
      DeviceMotionEvent.requestPermission().then((permissionState) => {
        if (permissionState === "granted") {
          setOrientationPermissionGranted(true);
        }
      });
    } else {
      ///comes out to FALSE onload - but should be true after granting
      setOrientationPermissionGranted(
        DeviceMotionEvent.permissionState === "granted"
      );
    }

    ///comes out to TRUE onload
    setOrientationRequestPermission(
      window.DeviceOrientationEvent &&
        typeof window.DeviceOrientationEvent.requestPermission === "function"
    );
  }, []);

  function askingForPermission() {
    DeviceMotionEvent.requestPermission().then((permissionState) => {
      if (permissionState === "granted") {
        setOrientationPermissionGranted(true);
        window.location.reload();
      }
    });
  }

  useEffect(() => {
    let tempArray = [];
    tempArray.push(urlFor(cubeMap.posx.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.negx.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.posy.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.negy.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.posz.asset).height(1000).url());
    tempArray.push(urlFor(cubeMap.negz.asset).height(1000).url());

    SetCubeMapTxtureUrls(tempArray);
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
      <Canvas
        id="canvas"
        style={{
          width: "100%",
          position: "relative",
          height: height,
          background: "black",
        }}
        camera={{
          position: [0, 0, 25],
          near: 0.1,
          far: 10000,
          orthographic: true,
        }}
        onPointerMissed={() => {
          updateJungleMenu(false, "", "");
        }}
      >
        {isMobile ? (
          <DeviceOrientationControls />
        ) : (
          <FirstPersonControls activeLook={true} lookSpeed={0.09} />
        )}

        <Suspense fallback={null}>
          {cubeMapTextureUrls.length > 5 && (
            <SkyBox cubeMapTextureUrls={cubeMapTextureUrls} />
          )}
          <Particles />
          <Frames
            updateJungleMenu={updateJungleMenu}
            openJungleMenuLink={openJungleMenuLink}
          />
        </Suspense>
      </Canvas>

      {orientationRequestPermission && !orientationPermissionGranted && (
        <PermissionButton
          onTouchEnd={() => {
            askingForPermission();
          }}
        />
      )}
    </>
  );
}

function Frames({ updateJungleMenu, openJungleMenuLink }) {
  const [object, setJungleObj] = useState(useLoader(OBJLoader, objUrl));
  const { width } = useWindowDimensions();
  const [frames, setFrames] = useState([]);

  useEffect(() => {
    if (object) {
      let x = 3.5;
      object.scale.set(x, x, x);
      object.rotation.set(0, -Math.PI / 1, 0);
      let tempArray = [];

      object.traverse(function (child) {
        if (child instanceof Mesh) {
          console.log(child.name);
          if (
            (child.name.includes("Cube") && !child.name.includes("click")) ||
            (child.name.includes("FRAME") && !child.name.includes("click"))
          ) {
            const mat = new MeshBasicMaterial({
              color: 0xff0000,
              wireframe: false,
            });
            mat.color = new Color(
              denseCapColors[Math.floor(Math.random() * denseCapColors.length)]
            );
            child.material = mat;

            tempArray.push(child);
          } else if (child.name.includes("click")) {
            const mat = new MeshPhongMaterial({
              color: 0xff0000,
              wireframe: false,
              opacity: 0,
              transparent: true,
            });

            child.material = mat;
          } else {
            child.material = new MeshBasicMaterial({
              color: 0x000000,
              wireframe: false,
              side: DoubleSide,
            });
          }
        }
      });

      setFrames(tempArray);

      setJungleObj(object);
    }
  }, [object]);

  return (
    <group scale={[1, 1, 1]}>
      <primitive
        onPointerEnter={(ev) => {
          // console.log("enter", ev.object);
          updateJungleMenu(
            true,
            ev.object.name,
            ev.object.material.color.getHexString()
          );
        }}
        onPointerLeave={(ev) => {
          // console.log("leave", ev.object);
          updateJungleMenu(
            false,
            ev.object.name,
            ev.object.material.color.getHexString()
          );
        }}
        onPointerOver={(ev) => {
          if (ev.object.name.includes("Cube")) {
            let color = new Color(
              denseCapColors[Math.floor(Math.random() * denseCapColors.length)]
            );
            ev.object.material.color = color;

            const r = /\d+/;
            const number = ev.object.name.match(r);

            const frame = frames.find((frame) =>
              frame.name.includes("frame" + number)
            );
            if (frame) {
              frame.material.color = color;
              console.log("has frame p:", frame);
            }
          }
        }}
        onClick={(ev) => {
          if (!ev.object.name.includes("loft")) {
            if (width > 900) {
              openJungleMenuLink(ev.object.name.split("_")[0]);
            } else {
              updateJungleMenu(
                true,
                ev.object.name,
                ev.object.material.color.getHexString()
              );
            }
          }
        }}
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
  const count = 200;
  const points = Array(count).fill(0);
  const size = 5;
  const positionFactor = 144;
  const positionFactor2 = 300;
  const rotationSpeed = 0.03;

  const particleTexture = useTexture(particleUrl);

  const particlesRef1 = useRef();
  const particlesRef2 = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    particlesRef1.current.rotation.y = elapsedTime * rotationSpeed;
    particlesRef1.current.rotation.z = (elapsedTime * rotationSpeed) / 2;

    particlesRef2.current.rotation.x = elapsedTime * rotationSpeed;
    particlesRef2.current.rotation.y = (elapsedTime * rotationSpeed) / 2;
  });

  return (
    <>
      <Points ref={particlesRef1} limit={10000}>
        <PointMaterial
          size={size}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          vertexColors
          map={particleTexture}
          alphaMap={particleTexture}
          toneMapped={false}
        />

        {points.map((_, i) => (
          <Point
            key={i}
            position={[
              (0.5 - xpositions[i]) * positionFactor,
              (0.5 - ypositions[i]) * positionFactor,
              (0.5 - zpositions[i]) * positionFactor,
            ]}
            color={"white"}
          />
          // <></>
        ))}
      </Points>
      <Points ref={particlesRef2} limit={10000}>
        <PointMaterial
          size={size}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          vertexColors
          map={particleTexture}
          alphaMap={particleTexture}
          toneMapped={false}
        />

        {points.map((_, i) => (
          <Point
            key={i}
            position={[
              (0.5 - xpositions[i]) * positionFactor2,
              (0.5 - ypositions[i]) * positionFactor2,
              (0.5 - zpositions[i]) * positionFactor2,
            ]}
            color={"white"}
          />
        ))}
      </Points>
    </>
  );
}
export default Jungle;
