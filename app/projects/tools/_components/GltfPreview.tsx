"use client";

import * as React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { DRACOLoader, KTX2Loader } from "three-stdlib";

function Model({ url }: { url: string }) {
  const gl = useThree((s) => s.gl);

  const draco = React.useMemo(() => {
    const d = new DRACOLoader();
    d.setDecoderPath("/draco/");
    return d;
  }, []);

  const ktx2 = React.useMemo(() => {
    const k = new KTX2Loader();
    k.setTranscoderPath("/basis/");
    k.detectSupport(gl);
    return k;
  }, [gl]);

  const gltf = useGLTF(url, false, false, (loader) => {
    loader.setDRACOLoader(draco);
    loader.setKTX2Loader(ktx2);
  });

  React.useEffect(() => {
    return () => {
      draco.dispose();
      ktx2.dispose();
    };
  }, [draco, ktx2]);

  return <primitive object={gltf.scene} />;
}

export default function GltfPreview({ url }: { url: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0.8, 2.4], fov: 40 }}
      dpr={1}                 // ✅ faster than [1,2]
      gl={{ antialias: true }} // you can set false if you want even faster
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1} />

      <React.Suspense fallback={null}>
        <group position={[0, -0.6, 0]}>
          <Model url={url} />
        </group>
        <Environment preset="city" />
      </React.Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.8}
      />
    </Canvas>
  );
}
