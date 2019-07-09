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

      this.scene.add(light);
      this.cameraHeight = 35;

      this.camera.position.z = 200;
      this.camera.position.y = 35;
      this.camera.position.x = 10;
      this.camera.lookAt(new THREE.Vector3(0, 3, 0));
      this.camera.fov = 18;
      this.camera.near = 40;
      this.camera.far = 120;
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
          pos: [0, 7.5, 0],
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
      if(Object.keys(this.positions).length < 3) {
        return;
      }

      if(!this.model) {
        return;
      }

      /* skip during explosions */
      if (BEAN >= 380 && BEAN < 384 ||
        BEAN >= 508 && BEAN < 512 ||
        BEAN >= 636 && BEAN < 640) {
        return;
      }

      let positions = this.positions.robot;
      let frameOffset = 2210;
      if(BEAN < 384) {
      positions = this.positions.robot;
      frameOffset = 2210;
      } else if(BEAN < 512) {
      positions = this.positions.heli;
      frameOffset = 3354;
      } else if(BEAN < 640) {
      positions = this.positions.treb;
      frameOffset = 4473;
      }


      frame -= frameOffset;
      this.model.traverse(obj => {
        if(obj.material) {
          const action = positions[obj.name];
          if(action === undefined) {
            //console.log('ERROR', obj.name);
            return;
          }
            if(action.start_frame > frame) {
              const materials = obj.material instanceof Array ? obj.material : [obj.material];
              for(const material of materials) {
                material.targetColor.copy(material.originalColor);
                material.opacity = smoothstep(1, 0, (frame - action.start_frame + 10) / 10);
              }
              return;
            }

            const materials = obj.material instanceof Array ? obj.material : [obj.material];
            for(const material of materials) {
              material.targetColor.copy(material.originalColor);
              material.opacity = smoothstep(0, 1, (frame - action.start_frame) / 5);
              material.needsUpdate = true;
              material.transparent = true;
            }

            const idx = Math.min(frame - action.start_frame, action.end_frame - action.start_frame - 1);
            obj.position.x = action.positions[0][idx];
            obj.position.y = action.positions[1][idx];
            obj.position.z = action.positions[2][idx];
            obj.quaternion.x = action.quaterions[idx].x;
            obj.quaternion.y = action.quaterions[idx].y;
            obj.quaternion.z = action.quaterions[idx].z;
            obj.quaternion.w = action.quaterions[idx].w;
          }
      });
    }

    update(frame) {
      super.update(frame);

      this.positions = this.inputs.positions.getValue();

      const angle = -0.8;
      this.camera.position.x = 90 * Math.sin(angle);
      this.camera.position.z = 90 * Math.cos(angle);
      this.cameraHeight = lerp(30, 40, F(frame, 256, 128));
      if(BEAN >= 384) {
      this.cameraHeight = lerp(30, 40, F(frame, 384, 128));
      }
      this.camera.position.y = this.cameraHeight;
      this.camera.lookAt(new THREE.Vector3(0, this.cameraHeight - 35+  8, 0));

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


        if (BEAT && BEAN === 380) {
          this.resetPhysics();
        }
        if (BEAT && BEAN === 504) {
          this.resetPhysics();
        }
        if (BEAT && BEAN === 636) {
          this.resetPhysics();
        }

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

      this.updatePositions(frame);
    }



    render(renderer) {
      if (BEAN >= 369 && BEAN < 380) {
        /* to workaround a bug */
        NIN.FullscreenRenderTargetPool.getFullscreenRenderTarget();
        return;
      }
      if(!this.model) {
        return;
      }
      this.model.traverse(obj => {
        if(obj.material) {
          const materials = obj.material instanceof Array ? obj.material : [obj.material];
          for(const material of materials) {
            material.color.copy(material.targetColor);
          }
        }
      });
      renderer.setClearColor(0xeeeeee);
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
      this.model.traverse(obj => {
        if(obj.material) {
          const materials = obj.material instanceof Array ? obj.material : [obj.material];
          for(const material of materials) {
            if(material.name === 'SOLID-BLACK') {
              material.color.setHex(0xffffff);
            } else {
              material.color.setHex(0);
            }
          }
        }
      });
      renderer.render(this.scene, this.camera);

      renderer.setRenderTarget(null);

      this.outputs.normal.setValue(renderTargetNormal.texture);
      this.outputs.depth.setValue(renderTargetNormal.depthTexture);
      this.outputs.inverter.setValue(invertLinesRenderTarget.texture);
    }
  }

  global.spinningCube = spinningCube;
})(this);
