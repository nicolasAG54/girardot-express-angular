import { Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, Texture } from 'three';

export type MallFinish = 'glass' | 'metal' | 'stone' | 'concrete' | 'asphalt' | 'wood' | 'fabric' | 'foliage' | 'paint';

/** Match documented material names, never infer a finish from a facade colour. */
export function mallFinish(name: string): MallFinish {
  const key = name.toLowerCase();
  if (/glass|vidrio/.test(key)) return 'glass';
  if (/steel|aluminum|aluminium|metal|inoxidable|cromado|stanless|corrogateshiny/.test(key)) return 'metal';
  if (/asphalt/.test(key)) return 'asphalt';
  if (/concrete|stucco/.test(key)) return 'concrete';
  if (/terrazzo|tile|stone/.test(key)) return 'stone';
  if (/wood|oak|hout|laminate/.test(key)) return 'wood';
  if (/fabric|leather/.test(key)) return 'fabric';
  if (/grass|ivy|leaf|stem|string_of_pearls|homalw/.test(key)) return 'foliage';
  return 'paint';
}

/** Runtime surface response only: preserves source albedo, maps, UVs and geometry. */
export class MallMaterials {
  private readonly replacements = new Map<MeshStandardMaterial, MeshStandardMaterial>();

  constructor(private readonly anisotropy: number) {}

  apply(root: Object3D): void {
    root.traverse(object => {
      if (!(object instanceof Mesh)) return;
      const apply = (source: MeshStandardMaterial): MeshStandardMaterial => {
        if (!source.isMeshStandardMaterial) return source;
        const cached = this.replacements.get(source);
        const finish = mallFinish(source.name);
        object.userData['mallFinish'] = finish;
        if (cached) return cached;
        let material = source;
        if (finish === 'glass') {
          const glass = new MeshPhysicalMaterial();
          // Physical.copy expects another physical material; copy the common PBR fields explicitly.
          MeshStandardMaterial.prototype.copy.call(glass, source);
          glass.defines = { STANDARD: '', PHYSICAL: '' };
          glass.roughness = .075;
          glass.metalness = 0;
          glass.ior = 1.5;
          glass.clearcoat = 1;
          glass.clearcoatRoughness = .06;
          // Alpha glazing retains the original tint without an extra transmission render pass.
          glass.transparent = source.transparent;
          const { r, g, b } = source.color;
          const neutral = Math.max(r, g, b) - Math.min(r, g, b) < .08;
          glass.opacity = source.transparent && neutral && !source.map
            ? Math.min(source.opacity, .32) : source.opacity;
          glass.depthWrite = !source.transparent;
          glass.envMapIntensity = 1.15;
          material = glass;
        } else {
          const response: Record<Exclude<MallFinish, 'glass'>, [number, number]> = {
            metal: [.3, .82], stone: [.38, 0], concrete: [.88, 0],
            asphalt: [.96, 0], wood: [.52, 0], fabric: [.94, 0],
            foliage: [.82, 0], paint: [.72, 0],
          };
          [material.roughness, material.metalness] = response[finish];
          // Reuse the client's actual grain. No substitute tile pattern or added weathering.
          if (source.map && !source.normalMap && !source.bumpMap &&
              ['stone', 'concrete', 'asphalt', 'wood'].includes(finish)) {
            material.bumpMap = source.map;
            material.bumpScale = finish === 'asphalt' ? .008 : .003;
          }
        }
        for (const value of Object.values(material)) {
          if (value instanceof Texture) value.anisotropy = this.anisotropy;
        }
        material.needsUpdate = true;
        this.replacements.set(source, material);
        if (material !== source) source.dispose();
        return material;
      };
      object.material = Array.isArray(object.material) ? object.material.map(apply) : apply(object.material);
    });
  }

  setGlazingEnvironment(texture: Texture): void {
    for (const material of this.replacements.values()) {
      if (!(material instanceof MeshPhysicalMaterial)) continue;
      material.envMap = texture;
      material.envMapIntensity = .7;
      material.needsUpdate = true;
    }
  }
}
