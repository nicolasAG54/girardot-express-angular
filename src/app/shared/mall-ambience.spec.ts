import { BoxGeometry, Mesh, MeshStandardMaterial } from 'three';
import { tintCar } from './mall-ambience';

describe('Car material variants', () => {
  it('keeps ungrouped car geometry drawable and preserves the original paint', () => {
    const paint = new MeshStandardMaterial({ color: '#4b9dcc' });
    const originalColor = paint.color.clone();
    const geometry = new BoxGeometry();
    geometry.clearGroups();
    const car = new Mesh(geometry, paint);
    tintCar(car, '#8b3030');
    expect(Array.isArray(car.material)).toBe(false);
    expect(car.material).not.toBe(paint);
    expect((car.material as MeshStandardMaterial).color.getHexString()).toBe('8b3030');
    expect(paint.color.equals(originalColor)).toBe(true);
    geometry.dispose(); paint.dispose();
    (car.material as MeshStandardMaterial).dispose();
  });
});
