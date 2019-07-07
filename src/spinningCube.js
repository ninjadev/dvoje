(function(global) {


  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  class spinningCube extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        inputs: {
          model: new NIN.Input(),
          positions: new NIN.Input(),
        },
        outputs: {
          render: new NIN.TextureOutput(),
          normal: new NIN.TextureOutput(),
          depth: new NIN.TextureOutput(),
          inverter: new NIN.TextureOutput(),
        }
      });



      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 60;
      this.camera.position.y = 25;
      this.camera.lookAt(new THREE.Vector3(0, 3, 0));
      this.camera.fov = 18;
      this.camera.near = 40;
      this.camera.far = 80;
      this.camera.updateProjectionMatrix();

      this.modelContainer = new THREE.Object3D();
      this.scene.add(this.modelContainer);

      this.normalMaterial = new THREE.MeshNormalMaterial({
        side: THREE.BackSide,
      });

      this.normalRenderTarget = new THREE.WebGLRenderTarget(1920 * 2, 1080 * 2);
      this.inverterRT = new THREE.WebGLRenderTarget(1920 / 4, 1080 / 4);
      this.resize();
    }

    resize() {
      this.inverterRT.setSize(16 * GU / 2, 9 * GU / 2);
      this.normalRenderTarget.setSize(16 * GU * 2, 9 * GU * 2);
      this.normalRenderTarget.depthBuffer = true;
      this.normalRenderTarget.depthTexture = new THREE.DepthTexture();
      this.normalRenderTarget.depthTexture.type = THREE.UnsignedShortType;
    }

    resetPhysics() {
      if(this.model) {
        this.world = new OIMO.World({
          timestep: 1/60,
          iterations: 8,
          broadphase: 2, // 1 brute force, 2 sweep and prune, 3 volume tree
          worldscale: 1, // scale full world
          random: false,  // randomize sample
          info: false,   // calculate statistic or not
          gravity: [0, 9.8, 0] ,
        });

        this.world.add({
          type: 'box',
          size: [10, 10, 10],
          pos: [0, 5, 0],
          rot: [0, 0, 0],
          move: false,
          density: 1,
          friction: 0.2,
          restitution: 0.2,
          belongsTo: 1,
          collidesWith: 0xffffffff,
        });

        this.model.traverse(item => {
          if(item.material) {
            item.body = this.world.add({
              type: 'box',
              size: item.size,
              pos: [
                item.originalPosition.x / 100,
                item.originalPosition.y / 100,
                item.originalPosition.z / 100,
              ],
              rot: [
                item.originalRotation.x * 360 / Math.PI / 2,
                item.originalRotation.y * 360 / Math.PI / 2,
                item.originalRotation.z * 360 / Math.PI / 2,
              ],
              move: true,
              density: 1,
              friction: 0.2,
              restitution: 0.2,
              belongsTo: 1,
              collidesWith: 0xffffffff,
            });
            item.body.applyImpulse(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, -0.05, 0));
          }
        });
      }
    }


    updatePositions(frame) {
      if(!this.positions) {
        return;
      }

      if(!this.model) {
        return;
      }

      this.model.traverse(obj => {
        if(obj.material) {
          const actions = this.positions[obj.name][obj.name];
          for(const key of actions) {
            const action = actions[key];
            if(action.start_frame > frame) {
              obj.visible = false;
              return;
            }
            obj.visible = true;
            if(action.end_frame <= frame) {
              obj.position.set(
                action.location__0[frame - action.start_frame],
                action.location__1[frame - action.start_frame],
                action.location__2[frame - action.start_frame]);
              obj.rotation.set(
                action.rotation__0[frame - action.start_frame],
                action.rotation__1[frame - action.start_frame],
                action.rotation__2[frame - action.start_frame]);
              obj.scale.set(
                action.scale__0[frame - action.start_frame],
                action.scale__1[frame - action.start_frame],
                action.scale__2[frame - action.start_frame]);
            }
          }
        }
      });
    }

    update(frame) {
      super.update(frame);

      this.updatePositions(frame);

      this.positions = this.inputs.positions.getValue();

      this.camera.position.x = 60 * Math.sin(frame / 50);
      this.camera.position.z = 60 * Math.cos(frame / 50);
      this.camera.lookAt(new THREE.Vector3(0, 3, 0));

      const model = this.inputs.model.getValue();
      if(model !== this.model) {
        if(this.model !== undefined) {
          this.modelContainer.remove(this.model);
        }
        this.modelContainer.add(model);
        this.model = model;
      }

      if(this.world) {
        this.world.step();
      }

      if(this.model) {

        if(BEAN >= 256 && BEAN < 384) {
          let i = 0;
          this.model.traverse(obj => {
            if(obj.material) {
              i++;
              obj.position.copy(obj.originalPosition);
              obj.rotation.copy(obj.originalRotation);
              obj.visible = (BEAN - 256) > i;
            }
          });
        }


        if(BEAT && BEAN === 380) {
          this.resetPhysics();
        }

        if(BEAN >= 380 && BEAN < 512) {
          this.model.traverse(obj => {
            if(obj.body) {
              obj.position.copy(obj.body.getPosition());
              obj.position.x *= 100;
              obj.position.y *= 100;
              obj.position.z *= 100;
              obj.quaternion.copy(obj.body.getQuaternion());
            }
          });
        }
      }
    }

    render(renderer) {
      if(!this.model) {
        return;
      }
      for(const materialName in this.model.materials) {
        const material = this.model.materials[materialName];
        material.color.copy(material.originalColor);
      }
      renderer.setClearColor(0xcad7eb);
      const renderTarget = NIN.FullscreenRenderTargetPool.getFullscreenRenderTarget();
      renderer.setRenderTarget(renderTarget);
      renderer.clear();
      renderer.render(this.scene, this.camera);
      renderer.setRenderTarget(null);
      this.outputs.render.setValue(renderTarget.texture);

      renderer.setClearColor(0);
      const renderTargetNormal = this.normalRenderTarget;
      renderer.setRenderTarget(renderTargetNormal);
      renderer.clear();
      this.scene.overrideMaterial = this.normalMaterial;
      renderer.render(this.scene, this.camera);

      const invertLinesRenderTarget = this.inverterRT;
      this.scene.overrideMaterial = null
      renderer.setRenderTarget(invertLinesRenderTarget);
      renderer.clear();
      for(const materialName in this.model.materials) {
        const material = this.model.materials[materialName];
        if(material.name === 'SOLID-BLACK') {
          material.color.setHex(0xffffff);
        } else {
          material.color.setHex(0);
        }
      }
      renderer.render(this.scene, this.camera);

      renderer.setRenderTarget(null);

      this.outputs.normal.setValue(renderTargetNormal.texture);
      this.outputs.depth.setValue(renderTargetNormal.depthTexture);
      this.outputs.inverter.setValue(invertLinesRenderTarget.texture);
    }
  }

  global.spinningCube = spinningCube;
})(this);
