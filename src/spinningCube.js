(function(global) {


  const F = (frame, from, delta) => (frame - FRAME_FOR_BEAN(from)) / (FRAME_FOR_BEAN(from + delta) - FRAME_FOR_BEAN(from));

  const CAMERA_ANGLES = {
    heli: [{
        position: new THREE.Vector3(-10, 6, 0),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 30, height: 13, angle: 0,
    }, {
        position: new THREE.Vector3(-20, 10, 8),
        lookAt: new THREE.Vector3(10, -4, -10),
        distance: 40, height: 25, angle: 0,
    }, {
        position: new THREE.Vector3(-20, -8, 5),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 30, height: 35, angle: -2,
    }, {
        position: new THREE.Vector3(-11, -8, 5),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 50, height: 35, angle: -3.5,
    }, {
        position: new THREE.Vector3(-5, -8, 5),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 30, height: 5, angle: -4.5,
    }, {
        position: new THREE.Vector3(-5, -4, 5),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 30, height: 25, angle: -5.5,
    }, {
        position: new THREE.Vector3(2, -4, 5),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 40, height: 25, angle: -5.5,
    }, {
        position: new THREE.Vector3(-5, -4, 5),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 80, height: 25, angle: -8.,
    }, {
        position: new THREE.Vector3(-5, -4, 5),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 40, height: 25, angle: -8.,
    }, {
        position: new THREE.Vector3(-24, 2, 2),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 40, height: 45, angle: -8.5,
    }, {
        position: new THREE.Vector3(-16, -8, 2),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 40, height: 45, angle: -6.,
    }, {
        position: new THREE.Vector3(-16, 0, 2),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 60, height: 45, angle: -6.2,
    }, {
        position: new THREE.Vector3(-16, -5, 2),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 100, height: 45, angle: -5.5,
    }, {
        position: new THREE.Vector3(-16, -8, 2),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 100, height: 45, angle: -6.2,
    }, {
        position: new THREE.Vector3(-22, -8, 2),
        lookAt: new THREE.Vector3(10, 15, -10),
        distance: 100, height: 25, angle: -6.2,
    }],
    bat: [{
        position: new THREE.Vector3(-2, 4, 0),
        lookAt: new THREE.Vector3(0, 0, 0),
      distance: 40, height: 25, angle: 0,
    }, {
        position: new THREE.Vector3(3, -5, 0),
        lookAt: new THREE.Vector3(0, 10, 0),
      distance: 20, height: 15, angle: 0,
    }, {
        position: new THREE.Vector3(-10, -3, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 48, height: -2, angle: 2.,
    }, {
        position: new THREE.Vector3(4, -8, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 60, height: 25, angle: 2.5,
    }, {
        position: new THREE.Vector3(4, -8, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 30, height: 25, angle: 3.5,
    }, {
        position: new THREE.Vector3(4, -8, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 60, height: 25, angle: 3.5,
    }, {
        position: new THREE.Vector3(4, -12, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 50, height: 65, angle: 4.0,
    }, {
        position: new THREE.Vector3(4, -6, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 80, height: 35, angle: 4.0,
    }, {
        position: new THREE.Vector3(2, -8, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 40, height: 45, angle: 3.0,
    }, {
        position: new THREE.Vector3(5, -7, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 30, height: 15, angle: 3.0,
    }, {
        position: new THREE.Vector3(5, -7, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 70, height: 45, angle: 3.5,
    }, {
        position: new THREE.Vector3(5, -7, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 70, height: 45, angle: 3.5,
    }, {
        position: new THREE.Vector3(6, -12, 0),
        lookAt: new THREE.Vector3(0, 10, 0), 
        distance: 140, height: 45, angle: 2.1,
      }
    ],
    robot: [{
      position: new THREE.Vector3(0, 0, 0),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 40, height: 13, angle: 0,
    }, {
        position: new THREE.Vector3(0, 4, 0),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 40, height: 10, angle: -0.5,
    }, {
        position: new THREE.Vector3(0, 6, 0),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 30, height: 10, angle: -0.2,
    }, {
        position: new THREE.Vector3(0, 2, 0),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 40, height: 10, angle: 1.5,
      }, {
        position: new THREE.Vector3(0, 0, 0),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 30, height: 50, angle: 1.5,
    }, {
        position: new THREE.Vector3(0, 6, 2),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 30, height: 20, angle: 1.5,
    }, {
        position: new THREE.Vector3(0, 6, 2),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 40, height: 20, angle: 1.8,
    }, {
        position: new THREE.Vector3(0, 6, 2),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 30, height: 20, angle: 1.5,
      }, {
        position: new THREE.Vector3(0, 6, 2),
        lookAt: new THREE.Vector3(0, 0, 0),
        distance: 30, height: 20, angle: -1.5,
      }, {
        position: new THREE.Vector3(0, 6, 2),
        lookAt: new THREE.Vector3(0, 6, 0),
        distance: 40, height: 20, angle: -1.7,
      }, {
        position: new THREE.Vector3(4, 6, -2),
        lookAt: new THREE.Vector3(0, 6, 0),
        distance: 20, height: 50, angle: -1.7,
      }, {
        position: new THREE.Vector3(8, 4, 2),
        lookAt: new THREE.Vector3(0, 6, 0),
        distance: 25, height: 25, angle: -1.7,
      }, {
        position: new THREE.Vector3(-2, 10, 0),
        lookAt: new THREE.Vector3(0, 6, 0),
        distance: 50, height: 25, angle: 0,
      }, {
        position: new THREE.Vector3(-3, 7, 0),
        lookAt: new THREE.Vector3(0, 6, 0),
        distance: 100, height: 25, angle: 0,
    }],
      treb: [{
        position: new THREE.Vector3(-15, -8, 0),
        lookAt: new THREE.Vector3(10, 10, -10),
        distance: 40, height: 25, angle: 0,
      }, {
          position: new THREE.Vector3(-15, -9, 0),
        lookAt: new THREE.Vector3(10, 10, -10),
        distance: 40, height: 25, angle: 0.5,
      }, {
          position: new THREE.Vector3(-15, -9, 0),
        lookAt: new THREE.Vector3(10, 10, -10),
        distance: 40, height: 25, angle: 0.5,
      }, {
          position: new THREE.Vector3(-13, -8, 0),
        lookAt: new THREE.Vector3(10, 10, -10),
        distance: 30, height: 0, angle: -0.5,
      }, {
          position: new THREE.Vector3(-13, -8, 0),
          lookAt: new THREE.Vector3(10, 15, -10),
        distance: 20, height: 30, angle: -0.5,
      }, {
          position: new THREE.Vector3(-13, -8, 0),
          lookAt: new THREE.Vector3(10, 15, -10),
        distance: 40, height: 30, angle: 1.5,
      }, {
          position: new THREE.Vector3(-8, -2, 0),
          lookAt: new THREE.Vector3(10, 10, -10),
        distance: 50, height: 15, angle: 2.5,
      }, {
          position: new THREE.Vector3(-14, 0, 0),
          lookAt: new THREE.Vector3(10, 10, -10),
        distance: 50, height: 25, angle: 3.5,
      }, {
          position: new THREE.Vector3(10, -10, 0),
          lookAt: new THREE.Vector3(0, 10, 0),
          distance: 100, height: 55, angle: 3.5,
      }, {
          position: new THREE.Vector3(-10, 7, -20),
          lookAt: new THREE.Vector3(0, 10, 0),
        distance: 30, height: 15, angle: 5.0,
      }, {
          position: new THREE.Vector3(-10, 7, -20),
          lookAt: new THREE.Vector3(0, 10, 0),
        distance: 30, height: 15, angle: 5.0,
      }, {
          position: new THREE.Vector3(-10, 7, -20),
          lookAt: new THREE.Vector3(0, 10, 0),
        distance: 30, height: 15, angle: 5.0,
      }, {
          position: new THREE.Vector3(8, -2, -0),
          lookAt: new THREE.Vector3(0, 10, 0),
        distance: 120, height: 25, angle: 3.5,
      }, {
          position: new THREE.Vector3(8, -2, -0),
          lookAt: new THREE.Vector3(0, 10, 0),
        distance: 120, height: 25, angle: 3.5,
      }, {
          position: new THREE.Vector3(-8, 2, -0),
          lookAt: new THREE.Vector3(0, 10, 0),
        distance: 120, height: 25, angle: 3.5,
    }],
    car: [{
      position: new THREE.Vector3(-3, -6, 0),
      lookAt: new THREE.Vector3(10, 10, -10),
      distance: 40, height: 25, angle: 0,
    }, {
      position: new THREE.Vector3(-3, 6, 0),
      lookAt: new THREE.Vector3(10, 0, -10),
      distance: 45, height: 15, angle: -0.5,
    }, {
      position: new THREE.Vector3(-6, 4, 0),
      lookAt: new THREE.Vector3(10, 0, -10),
      distance: 40, height: 15, angle: 0,
    }, {
      position: new THREE.Vector3(-6, 5, 0),
      lookAt: new THREE.Vector3(10, 0, -10),
      distance: 40, height: 25, angle: 0,
    }, {
      position: new THREE.Vector3(-6, 5, 0),
      lookAt: new THREE.Vector3(10, 0, -10),
      distance: 20, height: 15, angle: 0,
    }, {
      position: new THREE.Vector3(-10, 2, 0),
      lookAt: new THREE.Vector3(10, 0, -10),
      distance: 40, height: 15, angle: 0,
    }, {
      position: new THREE.Vector3(-8, 3, 0),
      lookAt: new THREE.Vector3(10, 0, -10),
      distance: 50, height: 15, angle: 0.5,
    }, {
      position: new THREE.Vector3(-8, 5, 0),
      lookAt: new THREE.Vector3(10, 0, -10),
      distance: 50, height: 15, angle: 1,
    }, {
      position: new THREE.Vector3(-8, 5, 5),
      lookAt: new THREE.Vector3(10, 0, -10),
      distance: 20, height: 60, angle: 1.5,
      }, {
      position: new THREE.Vector3(-8, 0, 8),
      lookAt: new THREE.Vector3(10, 10, -10),
      distance: 50, height: 25, angle: 2.5,
    }, {
      position: new THREE.Vector3(-2, 3, 0),
      lookAt: new THREE.Vector3(10, 4, -10),
        distance: 80, height: 15, angle: 3,
    }, {
      position: new THREE.Vector3(-2, 3, 0),
      lookAt: new THREE.Vector3(10, 4, -10),
        distance: 80, height: 15, angle: 3,
    }, {
      position: new THREE.Vector3(-2, 3, 0),
      lookAt: new THREE.Vector3(10, 4, -10),
        distance: 80, height: 15, angle: 3,
    }, {
      position: new THREE.Vector3(-2, 3, 0),
      lookAt: new THREE.Vector3(10, 4, -10),
        distance: 80, height: 15, angle: 3,
    }, {
        position: new THREE.Vector3(-10, 6.5, 0),
        lookAt: new THREE.Vector3(0, 0, -10),
        distance: 75, height: -5, angle: 3.9,
    }]
  };

  class spinningCube extends NIN.THREENode {

    constructor(id, options) {
      super(id, {
        camera: options.camera,
        partsOnCurrentPage: {},
        stepNumber: 0,
        inputs: {
          model: new NIN.Input(),
          positions: new NIN.Input(),
        },
        outputs: {
          render: new NIN.TextureOutput(),
          normal: new NIN.TextureOutput(),
          depth: new NIN.TextureOutput(),
          inverter: new NIN.TextureOutput(),
          partsOnCurrentPage: new NIN.Output(),
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
      this.camera.near = 1;
      this.camera.far = 150;
      this.camera.updateProjectionMatrix();

      this.modelContainer = new THREE.Object3D();
      this.scene.add(this.modelContainer);

      this.normalMaterial = new THREE.MeshNormalMaterial({
        side: THREE.BackSide,
      });

      this.normalRenderTarget = new THREE.WebGLRenderTarget(1920 * 2, 1080 * 2);
      this.inverterRT = new THREE.WebGLRenderTarget(1920 / 4, 1080 / 4);
      this.resize();

      this.lookAtHelper = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 10, 0.1),
        new THREE.MeshBasicMaterial({color: 0xff00ff}));
      //this.scene.add(this.lookAtHelper);
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
      let cameraAngles = CAMERA_ANGLES.car;
      let frameOffset = 2210;
      let beanOffset = 256;
      if (BEAN < 384) {
        positions = this.positions.car;
        cameraAngles = CAMERA_ANGLES.car;
        frameOffset = 2210;
        beanOffset = 256;
      } else if (BEAN < 512) {
        positions = this.positions.heli;
        cameraAngles = CAMERA_ANGLES.heli;
        frameOffset = 3354 - 35;
        beanOffset = 384;
      } else if (BEAN < 640) {
        positions = this.positions.robot;
        cameraAngles = CAMERA_ANGLES.robot;
        frameOffset = 4473 - 35;
        beanOffset = 512;
      } else if (BEAN < 1024) {
        positions = this.positions.treb;
        cameraAngles = CAMERA_ANGLES.treb;
        frameOffset = 7828;
        beanOffset = 896;
      } else if (BEAN < 1152) {
        positions = this.positions.bat;
        cameraAngles = CAMERA_ANGLES.bat;
        frameOffset = 8947 - 35;
        beanOffset = 1024;
      }

      if (!positions) {
        return;
      }


      const t = F(frame, beanOffset + (this.stepNumber) * 8 - 1, 1);
      const previousCameraAngle = cameraAngles[Math.max(this.stepNumber - 1, 0)];
      const currentCameraAngle = cameraAngles[Math.max(0, Math.min(this.stepNumber, cameraAngles.length - 1))];
      if (previousCameraAngle && currentCameraAngle) {
        const angle = easeIn(previousCameraAngle.angle, currentCameraAngle.angle, t);
        const lookAtX = easeIn(previousCameraAngle.lookAt.x, currentCameraAngle.lookAt.x, t);
        const lookAtY = easeIn(previousCameraAngle.lookAt.y, currentCameraAngle.lookAt.y, t);
        const lookAtZ = easeIn(previousCameraAngle.lookAt.z, currentCameraAngle.lookAt.z, t);
        const distance = easeIn(previousCameraAngle.distance, currentCameraAngle.distance, t);
        const height = easeIn(previousCameraAngle.height, currentCameraAngle.height, t);
        const positionX = easeIn(previousCameraAngle.position.x, currentCameraAngle.position.x, t);
        const positionY = easeIn(previousCameraAngle.position.y, currentCameraAngle.position.y, t);
        const positionZ = easeIn(previousCameraAngle.position.z, currentCameraAngle.position.z, t);
        const x = distance * Math.sin(angle);
        const y = height;
        const z = distance * Math.cos(angle);
        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(lookAtX, lookAtY, lookAtZ));
        this.camera.position.x += positionX;
        this.camera.position.y += positionY - 1;
        this.camera.position.z += positionZ;
      }

      frame -= frameOffset;
      let startFrameForInventory = ((this.stepNumber) * 70)-44
      let endFrameForInventory = ((this.stepNumber+1) * 70)-44
      
      this.model.traverse(obj => {
        if(obj.material) {
          const action = positions[obj.name];
          if(action === undefined) {
            //console.log('ERROR', obj.name);
            return;
          }
            if (action.start_frame >= startFrameForInventory && action.start_frame < endFrameForInventory) {
              this.partsOnCurrentPage[obj.name] = obj;
            }
            if(action.start_frame > frame) {
              obj.visible = false;
              const materials = obj.material instanceof Array ? obj.material : [obj.material];
              for(const material of materials) {
                material.targetColor.copy(material.originalColor);
                material.opacity = smoothstep(1, 0, (frame - action.start_frame + 10) / 10);
              }
              return;
            }

            obj.visible = true;

            const materials = obj.material instanceof Array ? obj.material : [obj.material];
            for(const material of materials) {
              material.targetColor.copy(material.originalColor);
              material.opacity = smoothstep(0, 1, (frame - action.start_frame) / 5);
              material.needsUpdate = true;
              material.transparent = true;
            }

          const idx = Math.min(frame - action.start_frame, action.end_frame - action.start_frame);
            obj.position.x = action.positions[0][idx];
            obj.position.y = action.positions[1][idx];
            obj.position.z = action.positions[2][idx];
            obj.quaternion.x = action.quaterions[idx].x;
            obj.quaternion.y = action.quaterions[idx].y;
            obj.quaternion.z = action.quaterions[idx].z;
            obj.quaternion.w = action.quaterions[idx].w;
          }
      });
      this.outputs.partsOnCurrentPage.setValue(this.partsOnCurrentPage);
    }

    update(frame) {
      super.update(frame);
      let currentStepNumber = (((BEAN % 128) / 8) | 0) + 1
      if (currentStepNumber != this.stepNumber) {
        this.partsOnCurrentPage = {}
      }
      this.stepNumber = currentStepNumber;
       this.positions = this.inputs.positions.getValue();

      const model = this.inputs.model.getValue();
      if(model !== this.model) {
        if(this.model !== undefined) {
          this.modelContainer.remove(this.model);
        }
        this.modelContainer.add(model);
        this.model = model;
      }

      this.modelContainer.position.x = 0;
      this.modelContainer.position.y = -0;
      this.modelContainer.rotation.y = 0.7;

      if(this.world) {
        this.world.step();
      }

      if(this.model) {


        if (BEAT && BEAN === 380) {
          this.resetPhysics();
        }
        if (BEAT && BEAN === 512) {
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
      if (BEAN >= 369 && BEAN < 380 ||
        BEAN >= 496 && BEAN < 512 ||
        BEAN >= 624 && BEAN < 636 ||
        BEAN >= 1008 && BEAN < 1024 ||
        BEAN >= 1126 && BEAN < 1152) {
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
