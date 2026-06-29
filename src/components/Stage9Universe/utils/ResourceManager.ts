import * as THREE from 'three';

class ResourceManager {
  private resources: Set<THREE.Object3D | THREE.Material | THREE.BufferGeometry | THREE.Texture> = new Set();

  public register(resource: any) {
    if (resource) {
      this.resources.add(resource);
    }
  }

  public dispose(resource: any) {
    if (!resource) return;
    
    if (this.resources.has(resource)) {
      this.resources.delete(resource);
    }

    if (resource.dispose && typeof resource.dispose === 'function') {
      resource.dispose();
    }
  }

  public disposeAll() {
    this.resources.forEach((resource: any) => {
      if (resource.dispose && typeof resource.dispose === 'function') {
        resource.dispose();
      }
    });
    this.resources.clear();
  }
  
  public traverseAndDispose(object: THREE.Object3D) {
    if (!object) return;
    
    object.traverse((child: any) => {
      if (child.geometry) {
        this.dispose(child.geometry);
      }
      
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat: THREE.Material) => this.dispose(mat));
        } else {
          this.dispose(child.material);
        }
      }
    });
  }
}

export const resourceManager = new ResourceManager();
