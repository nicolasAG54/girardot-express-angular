import { BoxGeometry, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, Texture } from 'three';
import { MallMaterials, mallFinish } from './mall-materials';

describe('Mall surface response', () => {
  it.each([
    ['[Terrazzo Tile Light]1', 'stone'], ['[Concrete Scored Jointless]', 'concrete'],
    ['[Asphalt New]', 'asphalt'], ['acero inoxidable pulido', 'metal'],
    ['[Wood Floor]1', 'wood'], ['Fabric_B01_20cm', 'fabric'],
    ["PDM_Devil's_Ivy_Leaf", 'foliage'], ['Vidrio translúcido transparente', 'glass'],
    ['[0131_Silver]1', 'paint'], ['[0084_MediumTurquoise]', 'paint'],
  ])('classifies %s without using its colour', (name, finish) => {
    expect(mallFinish(name)).toBe(finish);
  });

  it('preserves shared geometry, transforms, albedo, UV texture and material groups', () => {
    const map = new Texture();
    const floor = new MeshStandardMaterial({ name: '[Terrazzo Tile Light]1', map, color: '#c6b7a0' });
    const colour = floor.color.clone();
    const geometry = new BoxGeometry();
    const a = new Mesh(geometry, floor);
    const b = new Mesh(geometry, [floor]);
    a.position.set(1, 4.75, -3);
    const root = new Group(); root.add(a, b);
    new MallMaterials(4).apply(root);
    expect(a.geometry).toBe(geometry);
    expect(a.position.toArray()).toEqual([1, 4.75, -3]);
    expect(a.material).toBe(floor);
    expect(b.material[0]).toBe(floor);
    expect(floor.color.equals(colour)).toBe(true);
    expect(floor.map).toBe(map);
    expect(floor.bumpMap).toBe(map);
    expect(floor.roughness).toBe(.38);
    expect(map.anisotropy).toBe(4);
    geometry.dispose(); floor.dispose(); map.dispose();
  });

  it('shares converted glazing, preserves coloured panes and releases superseded material only once', () => {
    const neutral = new MeshStandardMaterial({ name: 'Translucent Glass Gray', color: '#bbbbbb', transparent: true, opacity: .5 });
    const tint = new MeshStandardMaterial({ name: 'Vidrio translúcido azul', color: '#ffaf2c', transparent: true, opacity: .5 });
    const disposed = vi.spyOn(neutral, 'dispose');
    const geometry = new BoxGeometry();
    const a = new Mesh(geometry, neutral);
    const b = new Mesh(geometry, [neutral, tint]);
    const root = new Group(); root.add(a, b);
    const finishes = new MallMaterials(2);
    finishes.apply(root);
    expect(a.material).toBeInstanceOf(MeshPhysicalMaterial);
    expect(b.material[0]).toBe(a.material);
    expect(a.material.opacity).toBe(.32);
    expect(a.material.depthWrite).toBe(false);
    expect(b.material[1].opacity).toBe(.5);
    expect(b.material[1].color.equals(tint.color)).toBe(true);
    expect((a.material as MeshPhysicalMaterial).transmission).toBe(0);
    expect(a.material.defines?.['PHYSICAL']).toBe('');
    expect(b.userData['mallFinish']).toBe('glass');
    const reflection = new Texture();
    finishes.setGlazingEnvironment(reflection);
    expect(a.material.envMap).toBe(reflection);
    expect(b.material[1].envMap).toBe(reflection);
    expect(disposed).toHaveBeenCalledTimes(1);
    geometry.dispose(); a.material.dispose(); b.material[1].dispose(); reflection.dispose();
  });
});
