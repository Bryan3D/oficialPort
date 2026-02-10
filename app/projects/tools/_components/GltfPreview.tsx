"use client";

import * as React from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { DRACOLoader, KTX2Loader } from "three-stdlib";

function CompressedModel({ url }: { url: string }) {
  const gl = useThree((s) => s.gl);

  const draco = React.useMemo(() => {
    const loader = new DRACOLoader();
    loader.setDecoderPath("/draco/"); // ✅ public/draco/*
    return loader;
  }, []);

  const ktx2 = React.useMemo(() => {
    return new KTX2Loader()
      .setTranscoderPath("/basis/") // ✅ public/basis/*
      .detectSupport(gl);
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

  return (
    <primitive
      object={gltf.scene}
      // If it looks too big/small:
      // scale={0.8}
      // rotation={[0, Math.PI, 0]}
    />
  );
}

export default function GltfPreview({ url }: { url: string }) {
  return (
    <Canvas camera={{ position: [0, 0.8, 2.4], fov: 40 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1} />

      <React.Suspense fallback={null}>
        <group position={[0, -0.6, 0]}>
          <CompressedModel url={url} />
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
