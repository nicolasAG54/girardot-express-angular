import { Material, Mesh, MeshStandardMaterial } from 'three';

export function tintCar(mesh: Mesh, color: string): void {
  const tint = (material: Material): Material => {
    const copy = material.clone();
    if (copy instanceof MeshStandardMaterial && copy.color.b > copy.color.r * 1.15) {
      copy.color.set(color);
      copy.roughness = .4;
    }
    return copy;
  };
  // A material array requires geometry groups in Three.js. Keep single meshes
  // single so cloned cars without groups continue to render.
  mesh.material = Array.isArray(mesh.material) ? mesh.material.map(tint) : tint(mesh.material);
}
