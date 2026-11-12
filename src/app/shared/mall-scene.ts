import {
  ACESFilmicToneMapping, Box3, Color, CubeCamera, DirectionalLight, Euler, Fog, HalfFloatType,
  Group, HemisphereLight, Mesh, MeshStandardMaterial,
  Object3D, PCFSoftShadowMap, PerspectiveCamera, PMREMGenerator, Scene,
  Texture, Vector3, WebGLCubeRenderTarget, WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { MALL_ROUTES, type MallFloor } from './mall-walk';
import { tintCar } from './mall-ambience';
import { MallMaterials } from './mall-materials';

export interface MallSceneCallbacks {
  progress(value: number): void;
  failure(): void;
  step(direction: number): void;
  moving(value: boolean): void;
}

interface CameraMove {
  from: Vector3; to: Vector3; fromRotation: Euler; toRotation: Euler;
  start: number; duration: number;
}

function disposeObject(root: Object3D): void {
  const geometries = new Set<Mesh['geometry']>();
  const materials = new Set<MeshStandardMaterial>();
  const textures = new Set<import('three').Texture>();
  root.traverse(object => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      for (const value of Object.values(material)) {
        if (value instanceof Texture) textures.add(value);
      }
    }
  });
  geometries.forEach(geometry => geometry.dispose());
  materials.forEach(material => material.dispose());
  textures.forEach(texture => {
    texture.dispose();
    const data = texture.source?.data;
    if (typeof ImageBitmap !== 'undefined' && data instanceof ImageBitmap) data.close();
  });
}

async function loadBytes(url: string, signal: AbortSignal, progress: (value: number) => void): Promise<ArrayBuffer> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Model unavailable: ${response.status}`);
  if (!response.body) return response.arrayBuffer();
  const reader = response.body.getReader();
  const total = Number(response.headers.get('content-length'));
  const chunks: Uint8Array[] = [];
  let loaded = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.byteLength;
    if (total > 0) progress(Math.min(.9, loaded / total * .9));
  }
  const result = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  return result.buffer;
}

export class MallScene {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(42, 1, .08, 1000);
  private readonly controls: OrbitControls;
  private readonly ambience = new Group();
  private readonly resizeObserver: ResizeObserver;
  private readonly intersectionObserver: IntersectionObserver;
  private readonly listeners = new AbortController();
  private readonly pmrem: PMREMGenerator;
  private readonly materials: MallMaterials;
  private environment?: ReturnType<PMREMGenerator['fromScene']>;
  private glazingEnvironment?: ReturnType<PMREMGenerator['fromCubemap']>;
  private frame = 0;
  private disposed = false;
  private visible = true;
  private interior = false;
  private movement?: CameraMove;
  private pointer?: { id: number; x: number; y: number };
  private readonly direction = new Vector3();

  constructor(private readonly host: HTMLElement, private readonly callbacks: MallSceneCallbacks) {
    this.renderer = new WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = .95;
    this.materials = new MallMaterials(Math.min(4, this.renderer.capabilities.getMaxAnisotropy()));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    // Geometry/props are static: update shadows once, never every camera frame.
    this.renderer.shadowMap.autoUpdate = false;
    const canvas = this.renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Girardot Express en 3D. Arrastra para mirar. En el recorrido usa W para avanzar, S para retroceder y las flechas para mirar.');
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y';
    this.host.appendChild(canvas);
    this.scene.background = new Color('#e6eff3');
    this.scene.fog = new Fog('#e6eff3', 240, 650);
    this.scene.add(new HemisphereLight(0xe7f1ff, 0x9a8873, .35));
    const sun = new DirectionalLight(0xfff0dd, 3.1);
    sun.position.set(75, 85, -10);
    sun.target.position.set(125, 0, -60);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left: -70, right: 70, top: 60, bottom: -60, near: 1, far: 220 });
    sun.shadow.normalBias = .018;
    sun.shadow.bias = -.00008;
    sun.shadow.radius = 2;
    this.scene.add(sun, sun.target, this.ambience);
    this.pmrem = new PMREMGenerator(this.renderer);
    // Analytic daylight generated locally once; no remote HDRI, paid service or animation loop.
    const skyScene = new Scene();
    const sky = new Sky();
    sky.scale.setScalar(1000);
    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = 4;
    uniforms['rayleigh'].value = 1.3;
    uniforms['mieCoefficient'].value = .003;
    uniforms['mieDirectionalG'].value = .8;
    uniforms['sunPosition'].value.copy(sun.position).sub(sun.target.position).normalize();
    skyScene.add(sky);
    this.environment = this.pmrem.fromScene(skyScene, .04, .1, 2000);
    this.scene.environment = this.environment.texture;
    this.scene.environmentIntensity = .12;
    sky.geometry.dispose();
    sky.material.dispose();
    this.controls = new OrbitControls(this.camera, canvas);
    this.controls.enablePan = false;
    this.controls.minDistance = 15;
    this.controls.maxDistance = 500;
    this.controls.minPolarAngle = Math.PI / 10;
    this.controls.maxPolarAngle = Math.PI / 2.05;
    this.controls.addEventListener('change', this.invalidate);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.intersectionObserver = new IntersectionObserver(entries => {
      this.visible = entries[0]?.isIntersecting ?? true;
      if (this.visible) this.invalidate();
    });
    this.intersectionObserver.observe(host);
    const options = { signal: this.listeners.signal };
    document.addEventListener('visibilitychange', this.invalidate, options);
    canvas.addEventListener('webglcontextlost', event => {
      event.preventDefault();
      if (!this.disposed) this.callbacks.failure();
    }, options);
    canvas.addEventListener('pointerdown', this.pointerDown, options);
    canvas.addEventListener('pointermove', this.pointerMove, options);
    canvas.addEventListener('pointerup', this.pointerUp, options);
    canvas.addEventListener('pointercancel', this.pointerUp, options);
    canvas.addEventListener('keydown', this.keyDown, options);
    this.resize();
    this.reset();
  }

  async load(signal: AbortSignal): Promise<void> {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const bytes = await loadBytes('assets/models/girardot-express.glb', signal, this.callbacks.progress);
    const model = await loader.parseAsync(bytes, 'assets/models/');
    if (signal.aborted) { disposeObject(model.scene); signal.throwIfAborted(); }
    this.materials.apply(model.scene);
    model.scene.traverse(object => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      object.castShadow = !materials.every(material => material.transparent && material.opacity < .5);
      object.receiveShadow = true;
    });
    this.scene.add(model.scene);
    this.callbacks.progress(.94);
    for (const name of ['car', 'woman', 'man']) {
      const propBytes = await loadBytes(`assets/models/ambience/${name}-static.glb`, signal, () => {});
      const prop = await loader.parseAsync(propBytes, 'assets/models/ambience/');
      if (signal.aborted) { disposeObject(prop.scene); signal.throwIfAborted(); }
      this.placeProps(name, prop.scene);
    }
    const plantingBytes = await loadBytes('assets/models/ambience/ivy.glb', signal, () => {});
    const planting = await loader.parseAsync(plantingBytes, 'assets/models/ambience/');
    if (signal.aborted) { disposeObject(planting.scene); signal.throwIfAborted(); }
    this.addPlanting(planting.scene);
    this.renderer.shadowMap.needsUpdate = true;
    // One small, static local probe lets glazing reflect the actual mall, not a studio.
    const probeTarget = new WebGLCubeRenderTarget(128, { type: HalfFloatType });
    const probe = new CubeCamera(.15, 300, probeTarget);
    probe.position.set(105, 2, -59);
    const hidden: Mesh[] = [];
    const ambienceVisible = this.ambience.visible;
    // Reflections stay correct when visitors switch illustrative props off later.
    this.ambience.visible = false;
    model.scene.traverse(object => {
      if (object instanceof Mesh && object.visible && object.userData['mallFinish'] === 'glass') {
        hidden.push(object); object.visible = false;
      }
    });
    try {
      probe.update(this.renderer, this.scene);
      this.glazingEnvironment = this.pmrem.fromCubemap(probeTarget.texture);
      this.materials.setGlazingEnvironment(this.glazingEnvironment.texture);
    } finally {
      hidden.forEach(object => object.visible = true);
      this.ambience.visible = ambienceVisible;
      probeTarget.dispose();
    }
    // Probe shadows excluded the props; build the main view's shadows on its first draw.
    this.renderer.shadowMap.needsUpdate = true;
    this.callbacks.progress(1);
    this.invalidate();
  }

  private placeProps(name: string, source: Group): void {
    const placements = name === 'car'
      ? [[94,-51,.1],[102,-51,.1],[110,-51,.1],[118,-51,.1],[96,-40,3.24],[105,-40,3.24],[115,-40,3.24],[146,-42,3.24]]
      : name === 'woman'
        ? [[91,-58,1.5],[103,-60.5,1.2],[110,-62,2.4],[120,-58,3.4],[127,-61.2,.3],[114,-64,5],[116,-75.1,1.5,4.75]]
        : [[92.2,-58.2,-1],[101,-58.3,-.7],[108.8,-62.5,.6],[118.5,-58.2,2.2],[125.5,-60.8,3.1],[115.3,-64.2,1.4],[117.2,-75.2,-1.3,4.75]];
    placements.forEach(([x,z,angle,elevation], i) => {
      const prop = source.clone(true);
      prop.name = name === 'car' ? `Auto ${i+1}` : `Visitante ${name} ${i+1}`;
      const floor = name === 'car' ? -.01076 * (x - 43.1) : elevation ?? 0;
      prop.position.set(x, floor, z);
      prop.rotation.y = angle;
      prop.traverse(object => {
        if (!(object instanceof Mesh)) return;
        object.castShadow = true;
        object.receiveShadow = true;
        if (name === 'car' && i > 0) {
          tintCar(object, ['#274354','#b6bbb9','#8b3030','#dfdbcf'][i % 4]);
        }
      });
      this.ambience.add(prop);
    });
  }

  private addPlanting(source: Group): void {
    // Reuse real foliage geometry from the client's SKP, in its planting strip.
    const bounds = new Box3().setFromObject(source);
    const center = bounds.getCenter(new Vector3());
    source.position.sub(new Vector3(center.x, bounds.min.y, center.z));
    const plant = new Group();
    plant.add(source);
    plant.scale.setScalar(.85 / Math.max(.001, bounds.max.y-bounds.min.y));
    for (const x of [94,98,105,108,115,119,124,127]) {
      const instance = plant.clone(true);
      instance.position.set(x,.38,-56.3);
      instance.rotation.y = x * .3;
      instance.traverse(object => { if (object instanceof Mesh) object.castShadow = true; });
      this.ambience.add(instance);
    }
  }

  setAmbience(visible: boolean): void {
    this.ambience.visible = visible;
    this.renderer.shadowMap.needsUpdate = true;
    this.invalidate();
  }

  reset(): void {
    this.interior = false;
    this.movement = undefined;
    this.callbacks.moving(false);
    this.controls.enabled = true;
    this.camera.fov = 42;
    this.camera.near = .8;
    this.camera.far = 750;
    const distance = Math.max(100, 135 / (.767 * this.camera.aspect), 65 / .767) * 1.35;
    this.controls.target.set(136, 1, -55);
    this.camera.position.copy(this.controls.target).add(new Vector3(.42,.52,1).normalize().multiplyScalar(distance));
    this.camera.updateProjectionMatrix();
    this.controls.update();
    this.renderer.domElement.style.touchAction = 'pan-y';
    this.invalidate();
  }

  zoom(direction: number): void {
    if (this.interior) return;
    this.direction.copy(this.camera.position).sub(this.controls.target);
    const distance = Math.max(15, Math.min(500, this.direction.length() * (direction > 0 ? .8 : 1.25)));
    this.camera.position.copy(this.controls.target).add(this.direction.setLength(distance));
    this.controls.update();
    this.invalidate();
  }

  goTo(index: number, immediate = false, floor: MallFloor = 'ground'): void {
    const point = MALL_ROUTES[floor][index];
    if (!point) return;
    this.interior = true;
    this.controls.enabled = false;
    this.renderer.domElement.style.touchAction = 'none';
    this.camera.fov = 68;
    this.camera.near = .08;
    this.camera.far = 240;
    this.camera.updateProjectionMatrix();
    const to = new Vector3(...point.position);
    const clone = this.camera.clone();
    clone.position.copy(to);
    clone.lookAt(new Vector3(...point.lookAt));
    clone.rotation.reorder('YXZ');
    this.camera.rotation.reorder('YXZ');
    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.movement = undefined;
      this.camera.position.copy(to);
      this.camera.quaternion.copy(clone.quaternion);
      this.callbacks.moving(false);
    } else {
      this.movement = {
        from:this.camera.position.clone(),to,fromRotation:this.camera.rotation.clone(),
        toRotation:clone.rotation.clone(),start:performance.now(),
        duration:Math.max(650,Math.min(5500,this.camera.position.distanceTo(to)/2*1000)),
      };
      this.callbacks.moving(true);
    }
    this.invalidate();
  }

  private resize(): void {
    if (this.disposed) return;
    const width = Math.max(1, this.host.clientWidth), height = Math.max(1, this.host.clientHeight);
    this.renderer.setSize(width,height,false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    if (!this.interior) this.reset();
    this.invalidate();
  }

  private readonly pointerDown = (event: PointerEvent): void => {
    if (!this.interior || this.movement || !event.isPrimary) return;
    this.pointer = { id:event.pointerId,x:event.clientX,y:event.clientY };
    this.renderer.domElement.setPointerCapture(event.pointerId);
    this.renderer.domElement.focus({ preventScroll:true });
  };

  private readonly pointerMove = (event: PointerEvent): void => {
    if (!this.pointer || event.pointerId !== this.pointer.id) return;
    this.look((event.clientX-this.pointer.x)*-.004,(event.clientY-this.pointer.y)*-.003);
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
  };

  private readonly pointerUp = (event: PointerEvent): void => {
    if (this.pointer?.id === event.pointerId) this.pointer = undefined;
  };

  private look(yaw: number, pitch: number): void {
    this.camera.rotation.y += yaw;
    this.camera.rotation.x = Math.max(-1.1,Math.min(1.1,this.camera.rotation.x + pitch));
    this.invalidate();
  }

  private readonly keyDown = (event: KeyboardEvent): void => {
    if (!this.interior || this.movement) return;
    const actions: Record<string,() => void> = {
      ArrowLeft:() => this.look(.13,0),ArrowRight:() => this.look(-.13,0),
      ArrowUp:() => this.look(0,.1),ArrowDown:() => this.look(0,-.1),
      w:() => this.callbacks.step(1),s:() => this.callbacks.step(-1),
    };
    const action = actions[event.key];
    if (action) { event.preventDefault(); action(); }
  };

  private readonly invalidate = (): void => {
    if (this.disposed || this.frame || !this.visible || document.hidden) return;
    this.frame = requestAnimationFrame(this.render);
  };

  private readonly render = (time: number): void => {
    this.frame = 0;
    if (this.disposed || !this.visible || document.hidden) return;
    const move = this.movement;
    if (move) {
      const t = Math.min(1,(time-move.start)/move.duration);
      const eased = t*t*(3-2*t);
      this.camera.position.lerpVectors(move.from,move.to,eased);
      const delta = ((move.toRotation.y-move.fromRotation.y+Math.PI*3)%(Math.PI*2))-Math.PI;
      this.camera.rotation.set(
        move.fromRotation.x+(move.toRotation.x-move.fromRotation.x)*eased,
        move.fromRotation.y+delta*eased,0,'YXZ');
      if (t === 1) { this.movement=undefined; this.callbacks.moving(false); }
    }
    this.renderer.render(this.scene,this.camera);
    if (this.movement) this.invalidate();
  };

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.listeners.abort();
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    this.controls.dispose();
    disposeObject(this.scene);
    this.scene.traverse(object => { if (object instanceof DirectionalLight) object.shadow.dispose(); });
    this.environment?.dispose();
    this.glazingEnvironment?.dispose();
    this.pmrem.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}

export async function createMallScene(host: HTMLElement, signal: AbortSignal, callbacks: MallSceneCallbacks): Promise<MallScene> {
  const scene = new MallScene(host,callbacks);
  signal.addEventListener('abort',() => scene.dispose(),{ once:true });
  try { await scene.load(signal); signal.throwIfAborted(); return scene; }
  catch (error) { scene.dispose(); throw error; }
}
