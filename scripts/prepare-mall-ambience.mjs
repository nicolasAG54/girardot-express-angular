// Bake a natural standing pose into small, static CC0 props. No rendering or AI.
import fs from 'node:fs/promises';
import path from 'node:path';
import { AnimationMixer, Box3, Group, Mesh, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(value => { this.result = value; this.onloadend?.(); });
  }
};
const directory = path.resolve('public/assets/models/ambience');
for (const [name, height] of [['car', null], ['woman', 1.66], ['man', 1.76]]) {
  const input = await fs.readFile(path.join(directory, `${name}.glb`));
  const gltf = await new GLTFLoader().parseAsync(input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength), '');
  const clip = gltf.animations.find(clip => /_Idle$/.test(clip.name));
  if (clip) {
    const mixer = new AnimationMixer(gltf.scene);
    mixer.clipAction(clip).play();
    mixer.setTime(.5);
  }
  gltf.scene.updateMatrixWorld(true);
  const result = new Group();
  gltf.scene.traverse(object => {
    if (!object.isMesh) return;
    const geometry = object.geometry.clone();
    const positions = geometry.attributes.position;
    if (object.isSkinnedMesh) {
      object.skeleton.update();
      const vertex = new Vector3();
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i);
        object.applyBoneTransform(i, vertex);
        positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
      }
      geometry.deleteAttribute('skinIndex');
      geometry.deleteAttribute('skinWeight');
    }
    geometry.applyMatrix4(object.matrixWorld);
    geometry.computeVertexNormals();
    result.add(new Mesh(geometry, object.material));
  });
  const bounds = new Box3().setFromObject(result);
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const scale = height ? height / size.y : 4.4 / Math.max(size.x, size.z);
  for (const mesh of result.children) {
    mesh.geometry.translate(-center.x, -bounds.min.y, -center.z);
    mesh.geometry.scale(scale, scale, scale);
  }
  const output = await new GLTFExporter().parseAsync(result, { binary: true, onlyVisible: true });
  await fs.writeFile(path.join(directory, `${name}-static.glb`), new Uint8Array(output));
  console.log(name, { originalBytes: input.length, bakedBytes: output.byteLength, sourceSize: size.toArray(), scale });
}
