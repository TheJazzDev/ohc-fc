import * as THREE from "three";

const UP = new THREE.Vector3(0, 1, 0);

// The 12 icosahedron vertex directions give the classic paneled-football read.
export function panelOrientations(): THREE.Quaternion[] {
  const icosahedron = new THREE.IcosahedronGeometry(1, 0);
  const positions = icosahedron.attributes.position;
  const directions: THREE.Vector3[] = [];

  for (let i = 0; i < positions.count; i++) {
    const vertex = new THREE.Vector3().fromBufferAttribute(positions, i).normalize();
    if (directions.some((seen) => seen.distanceTo(vertex) < 1e-3)) continue;
    directions.push(vertex);
  }

  return directions.map((direction) => new THREE.Quaternion().setFromUnitVectors(UP, direction));
}
