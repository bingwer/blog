// eslint-disable-next-line max-classes-per-file
import React, { useCallback, useEffect, useRef } from 'react';
import {
  BoxBufferGeometry,
  BoxGeometry,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  HemisphereLight,
  Matrix4,
  Mesh,
  MeshPhongMaterial,
  Object3D,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

const Colors = {
  red: 0xf25346,
  white: 0xd8d0d1,
  brown: 0x59332e,
  pink: 0xf5986e,
  brownDark: 0x23190f,
  blue: 0x68c3c0,
};

class Sea {
  geom: CylinderGeometry;

  mat: MeshPhongMaterial;

  mesh: Mesh<CylinderGeometry, MeshPhongMaterial>;

  constructor() {
    this.geom = new CylinderGeometry(600, 600, 800, 40, 1);
    this.geom.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2));

    this.mat = new MeshPhongMaterial({
      color: Colors.blue,
      transparent: true,
      opacity: 0.6,
      flatShading: true,
    });

    this.mesh = new Mesh(this.geom, this.mat);
    this.mesh.receiveShadow = true;
  }
}

class Cloud {
  geom: BoxGeometry;

  mat: MeshPhongMaterial;

  mesh: Object3D;

  nBlocs: number;

  constructor() {
    this.mesh = new Object3D();
    this.geom = new BoxGeometry(20, 20, 20);
    this.mat = new MeshPhongMaterial({
      color: Colors.white,
    });
    this.nBlocs = 3 + Math.floor(Math.random() * 3);

    for (let i = 0; i < this.nBlocs; i += 1) {
      const mesh = new Mesh(this.geom, this.mat);

      mesh.position.x = i * 15;
      mesh.position.y = Math.random() * 10;
      mesh.position.z = Math.random() * 10;
      mesh.rotation.x = Math.random() * Math.PI * 2;
      mesh.rotation.y = Math.random() * Math.PI * 2;

      const scale = 0.1 + Math.random() * 0.9;
      mesh.scale.set(scale, scale, scale);

      mesh.castShadow = true;
      mesh.receiveShadow = true;

      this.mesh.add(mesh);
    }
  }
}

class Sky {
  mesh: Object3D;

  nClouds: number;

  stepAngle: number;

  constructor() {
    this.mesh = new Object3D();
    this.nClouds = 20;
    this.stepAngle = (Math.PI * 2) / this.nClouds;

    for (let i = 0; i < this.nClouds; i += 1) {
      const cloud = new Cloud();
      const angle = this.stepAngle * i;
      const hieght = 750 + Math.random() * 200;

      cloud.mesh.position.y = Math.sin(angle) * hieght;
      cloud.mesh.position.x = Math.cos(angle) * hieght;
      cloud.mesh.rotation.z = angle + Math.PI / 2;
      cloud.mesh.position.z = -400 - Math.random() * 400;

      const scale = 1 + Math.random() * 2;
      cloud.mesh.scale.set(scale, scale, scale);

      this.mesh.add(cloud.mesh);
    }
  }
}

class AirPlane {
  mesh: Object3D;

  geomCockpit: BoxBufferGeometry;

  matCockpit: MeshPhongMaterial;

  cockpit: Mesh<BoxBufferGeometry, MeshPhongMaterial>;

  geomEngine: BoxGeometry;

  matEngine: MeshPhongMaterial;

  engine: Mesh<BoxGeometry, MeshPhongMaterial>;

  geomTailPlane: BoxGeometry;

  matTailPlane: MeshPhongMaterial;

  tailPlane: Mesh<BoxGeometry, MeshPhongMaterial>;

  geomSideWing: BoxGeometry;

  matSideWing: MeshPhongMaterial;

  sideWing: Mesh<BoxGeometry, MeshPhongMaterial>;

  geomPropeller: BoxGeometry;

  matPropeller: MeshPhongMaterial;

  propeller: Mesh<BoxGeometry, MeshPhongMaterial>;

  geomBlade: BoxGeometry;

  matBlade: MeshPhongMaterial;

  blade: Mesh<BoxGeometry, MeshPhongMaterial>;

  constructor() {
    this.mesh = new Object3D();
    this.geomCockpit = new BoxBufferGeometry(80, 50, 50, 1, 1, 1);
    this.matCockpit = new MeshPhongMaterial({
      color: Colors.red,
      flatShading: true,
    });
    this.cockpit = new Mesh(this.geomCockpit, this.matCockpit);
    this.cockpit.castShadow = true;
    this.cockpit.receiveShadow = true;
    this.mesh.add(this.cockpit);

    this.geomEngine = new BoxGeometry(20, 50, 50, 1, 1, 1);
    this.matEngine = new MeshPhongMaterial({
      color: Colors.white,
      flatShading: true,
    });
    this.engine = new Mesh(this.geomEngine, this.matEngine);
    this.engine.position.x = 40;
    this.engine.castShadow = true;
    this.engine.receiveShadow = true;
    this.mesh.add(this.engine);

    this.geomTailPlane = new BoxGeometry(15, 20, 5, 1, 1, 1);
    this.matTailPlane = new MeshPhongMaterial({
      color: Colors.red,
      flatShading: true,
    });
    this.tailPlane = new Mesh(this.geomTailPlane, this.matTailPlane);
    this.tailPlane.position.set(-35, 25, 0);
    this.tailPlane.castShadow = true;
    this.tailPlane.receiveShadow = true;
    this.mesh.add(this.tailPlane);

    this.geomSideWing = new BoxGeometry(40, 8, 150, 1, 1, 1);
    this.matSideWing = new MeshPhongMaterial({
      color: Colors.red,
      flatShading: true,
    });
    this.sideWing = new Mesh(this.geomSideWing, this.matSideWing);
    this.sideWing.castShadow = true;
    this.sideWing.receiveShadow = true;
    this.mesh.add(this.sideWing);

    this.geomPropeller = new BoxGeometry(20, 10, 10, 1, 1, 1);
    this.matPropeller = new MeshPhongMaterial({
      color: Colors.brown,
      flatShading: true,
    });
    this.propeller = new Mesh(this.geomPropeller, this.matPropeller);
    this.propeller.castShadow = true;
    this.propeller.receiveShadow = true;

    // blades
    this.geomBlade = new BoxGeometry(1, 100, 20, 1, 1, 1);
    this.matBlade = new MeshPhongMaterial({
      color: Colors.brownDark,
      flatShading: true,
    });
    this.blade = new Mesh(this.geomBlade, this.matBlade);
    this.blade.position.set(8, 0, 0);
    this.blade.castShadow = true;
    this.blade.receiveShadow = true;
    this.propeller.add(this.blade);
    this.propeller.position.set(50, 0, 0);
    this.mesh.add(this.propeller);
  }
}

function ThreeElement() {
  const container = useRef<HTMLDivElement>(null);
  const scene = useRef<null | Scene>(null);
  const camera = useRef<null | PerspectiveCamera>(null);
  const renderer = useRef<null | WebGLRenderer>(null);
  const hemisphereLight = useRef<null | HemisphereLight>(null);
  const shadowLight = useRef<null | DirectionalLight>(null);

  const airPlaneMesh = useRef<null | AirPlane>(null);
  const skyMesh = useRef<null | Sky>(null);
  const seaMesh = useRef<null | Sea>(null);

  const mousePos = useRef({ x: 0, y: 0 });

  const createScene = useCallback(() => {
    if (scene.current || camera.current || renderer.current) return;

    const worldContainer = container.current;
    if (worldContainer instanceof HTMLDivElement) {
      const { offsetWidth: width, offsetHeight: height } = worldContainer;

      const sceneObj = new Scene();
      sceneObj.fog = new Fog(0xf7d9aa, 100, 950);

      scene.current = sceneObj;

      const aspectRatio = width / height;
      const fieldOfView = 60;
      const nearPlane = 1;
      const farPlane = 10000;

      const camaraObj = new PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane,
      );

      camaraObj.position.x = 0;
      camaraObj.position.z = 200;
      camaraObj.position.y = 100;

      camera.current = camaraObj;

      const rendererObj = new WebGLRenderer({
        alpha: true,
        antialias: true,
      });

      rendererObj.setSize(width, height);
      rendererObj.shadowMap.enabled = true;

      renderer.current = rendererObj;
      if (worldContainer.children.length === 0) {
        rendererObj.domElement.style.zIndex = '100';
        worldContainer.appendChild(rendererObj.domElement);
      }
    }
  }, []);

  const handleResize = useCallback(() => {
    const worldContainer = container.current;
    if (
      worldContainer instanceof HTMLDivElement &&
      renderer.current &&
      camera.current
    ) {
      const { offsetWidth: width, offsetHeight: height } = worldContainer;
      renderer.current.setSize(width, height);
      camera.current.aspect = width / height;
      camera.current.updateProjectionMatrix();
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (container.current instanceof HTMLDivElement) {
      if (e instanceof MouseEvent) {
        const tx = -1 + (e.clientX / window.innerWidth) * 2;
        const ty = 1 - (e.clientY / window.innerHeight) * 2;

        mousePos.current = { x: tx, y: ty };
      } else {
        const tx = -1 + (e.touches[0].clientX / window.innerWidth) * 2;
        const ty = 1 - (e.touches[0].clientY / window.innerHeight) * 2;

        mousePos.current = { x: tx, y: ty };
      }
    }
  }, []);

  const createLights = useCallback(() => {
    if (hemisphereLight.current || shadowLight.current) return;

    const hemisphereLightObj = new HemisphereLight(0xaaaaaa, 0x000000, 0.9);
    const shadowLightObj = new DirectionalLight(0xffffff, 0.9);

    shadowLightObj.position.set(150, 350, 350);
    shadowLightObj.castShadow = true;

    shadowLightObj.shadow.camera.left = -400;
    shadowLightObj.shadow.camera.right = 400;
    shadowLightObj.shadow.camera.top = 400;
    shadowLightObj.shadow.camera.bottom = -400;
    shadowLightObj.shadow.camera.near = 1;
    shadowLightObj.shadow.camera.far = 1000;

    shadowLightObj.shadow.mapSize.width = 2048;
    shadowLightObj.shadow.mapSize.height = 2048;

    hemisphereLight.current = hemisphereLightObj;
    shadowLight.current = shadowLightObj;

    if (scene.current) {
      scene.current.add(hemisphereLightObj);
      scene.current.add(shadowLightObj);
    }
  }, []);

  const createSea = useCallback(() => {
    if (scene.current) {
      if (seaMesh.current) return;

      const sea = new Sea();

      sea.mesh.name = 'sea';
      sea.mesh.position.y = -600;
      seaMesh.current = sea;
      scene.current.add(sea.mesh);
    }
  }, []);

  const createSky = useCallback(() => {
    if (scene.current) {
      if (skyMesh.current) return;

      const sky = new Sky();

      sky.mesh.name = 'sky';
      sky.mesh.position.y = -600;

      skyMesh.current = sky;
      scene.current.add(sky.mesh);
    }
  }, []);

  const createAirPlane = useCallback(() => {
    if (scene.current) {
      if (airPlaneMesh.current) return;

      const airplane = new AirPlane();

      airplane.mesh.name = 'airplane';
      airplane.mesh.scale.set(0.5, 0.5, 0.5);
      airplane.mesh.position.y = 100;
      airPlaneMesh.current = airplane;
      scene.current.add(airplane.mesh);
    }
  }, []);

  const updatePlane = useCallback(() => {
    const normalize = (
      v: number,
      vmin: number,
      vmax: number,
      tmin: number,
      tmax: number,
    ) => {
      const nv = Math.max(Math.min(v, vmax), vmin);
      const dv = vmax - vmin;
      const pc = (nv - vmin) / dv;
      const dt = tmax - tmin;
      const tv = tmin + pc * dt;
      return tv;
    };

    const targetX = normalize(mousePos.current.x, -1, 1, -100, 100);
    const targetY = normalize(mousePos.current.y, -1, 1, 25, 175);

    if (airPlaneMesh.current) {
      airPlaneMesh.current.mesh.position.y = targetY;
      airPlaneMesh.current.mesh.position.x = targetX;
      airPlaneMesh.current.propeller.rotation.x += 3;
    }
  }, []);

  const doAnimation = useCallback(() => {
    if (
      airPlaneMesh.current &&
      skyMesh.current &&
      seaMesh.current &&
      renderer.current &&
      scene.current &&
      camera.current
    ) {
      seaMesh.current.mesh.rotation.z += 0.005;
      skyMesh.current.mesh.rotation.z += 0.01;

      updatePlane();
      renderer.current.render(scene.current, camera.current);

      requestAnimationFrame(doAnimation);
    }
  }, [updatePlane]);

  useEffect(() => {
    const renderContiner = container.current;
    createScene();
    createLights();
    createSea();
    createSky();
    createAirPlane();

    window.addEventListener('resize', handleResize, false);
    if (renderContiner instanceof HTMLDivElement) {
      renderContiner.addEventListener('mousemove', handleMouseMove, false);
      renderContiner.addEventListener('touchmove', handleMouseMove, false);
    }

    if (renderer.current && scene.current && camera.current)
      renderer.current.render(scene.current, camera.current);

    doAnimation();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (renderContiner instanceof HTMLDivElement) {
        renderContiner.removeEventListener('mousemove', handleMouseMove, false);
        renderContiner.removeEventListener('touchmove', handleMouseMove, false);
      }
    };
  }, [
    createScene,
    createLights,
    createSea,
    createSky,
    createAirPlane,
    doAnimation,
    handleResize,
    handleMouseMove,
  ]);

  return (
    <div
      id="world"
      className="absolute h-full w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#e4e0ba] to-[#f7d9aa]"
      ref={container}
    />
  );
}

export default React.memo(ThreeElement);
