(function(global) {
  class greets extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
                                 new THREE.MeshStandardMaterial());
      //this.scene.add(this.cube);

      var light = new THREE.PointLight(0xffffff, 1, 2000);
      light.position.set(50, 50, 50);
      this.scene.add(light);
      var light2 = new THREE.PointLight(0xffffff, 1, 2000);
      light2.position.set(-50, -50, 50);
      this.scene.add(light2);
      
      this.bricks = [];
      this.bricks2 = [];
      this.camera.far = 2000;
      this.camera.position.z = 30;
      this.camera.up = new THREE.Vector3(0,0,1);

      var loadObject = function (objPath, material, three_scene, clone_array) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
          var object = objLoader.parse(text);
          var test;
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({color: 'white'});
              child.material.side = THREE.DoubleSide;
            }

          });
          //three_scene.add(object);
          var object2 = object.clone();
          object2.position.x = 1;
          //three_scene.add(object2);

          //three_object.add(object);
          // 2600 is the exact number of bricks in a mega brick!
          for(var i = 0; i < 2600; i++) {
            //this.bricks.push(object.clone());
            //three_scene.add(this.bricks[i]);
            clone_array.push(object.clone());
            clone_array[i].position.x = -20 + i* 0.02;
            clone_array[i].rotation.x = Math.PI / 2;
            three_scene.add(clone_array[i]);
          }
        });
      };

      this.proto_brick = new THREE.Object3D();
      this.scene.add(this.proto_brick);
      this.proto_brick2 = new THREE.Object3D();
      this.scene.add(this.proto_brick2);
      var brick_material = new THREE.MeshStandardMaterial({color: 'red'});
      loadObject('res/32000.obj', brick_material, this.proto_brick, this.bricks);
      loadObject('res/32000.obj', brick_material, this.proto_brick2, this.bricks2);

      this.brick_placements = [];
      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0]]);


      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [1,1,0,0,0,0,0,0,0,0]]);

// middle of the hole
      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [1,1,0,0,0,0,0,0,0,0]]);


      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [1,1,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0],
                                  [1,0,0,0,0,0,0,0,0,0]]);
      
      this.brick_placements.push([[1,1,1,1,1,1,1,1,1,1],
                                  [1,1,1,1,1,1,1,1,1,1],
                                  [1,1,1,1,1,1,1,1,1,1],
                                  [1,1,1,1,1,1,1,1,1,1],
                                  [1,1,1,1,1,1,1,1,1,1],
                                  [1,1,1,1,1,1,1,1,1,1],
                                  [1,1,1,1,1,1,1,1,1,1],
                                  [1,1,1,1,1,1,1,1,1,1],
                                  [1,1,1,1,1,1,1,1,1,1],
                                  [1,1,1,1,1,1,1,1,1,1]]);

      this.brick_placements.push([[0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,1,1,1],
                                  [0,0,0,0,0,1,1,1,0,0],
                                  [0,0,0,0,1,1,0,0,0,0],
                                  [0,0,0,0,1,1,0,0,0,0],
                                  [0,0,0,0,0,1,1,1,0,0],
                                  [0,0,0,0,0,0,0,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,1,1,1],
                                  [0,0,0,0,0,1,1,1,0,0],
                                  [0,0,0,0,1,1,0,0,0,0],
                                  [0,0,0,0,1,1,0,0,0,0],
                                  [0,0,0,0,0,1,1,1,0,0],
                                  [0,0,0,0,0,0,0,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0]]);

      this.brick_placements.push([[0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,1,1,1],
                                  [0,0,0,0,0,1,1,1,0,0],
                                  [0,0,0,0,1,1,0,0,0,0],
                                  [0,0,0,0,1,1,0,0,0,0],
                                  [0,0,0,0,0,1,1,1,0,0],
                                  [0,0,0,0,0,0,0,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0]]);


    }

    update(frame) {
      super.update(frame);


      var bc2 = 0;
      for(var x = 0; x < 10; x++) {
        for(var y = 0; y < 10; y++) {
          for(var z = 0; z < this.brick_placements.length; z++) {
            if (this.brick_placements[z][x][y] == 1 && bc + 4 <= this.bricks2.length) {
              console.log("hit");
              // Place one brick and mirror that operation on the xz and yz plane
              this.bricks2[bc2].position.x = -9.5 + x;
              this.bricks2[bc2].position.y = -4.5 + y * 0.5;
              this.bricks2[bc2].position.z = z * 0.6;

              this.bricks2[bc2+1].position.x = +9.5 - x;
              this.bricks2[bc2+1].position.y = -4.5 + y * 0.5;
              this.bricks2[bc2+1].position.z = z * 0.6;

              this.bricks2[bc2+2].position.x = -9.5 + x;
              this.bricks2[bc2+2].position.y = +4.5 - y * 0.5;
              this.bricks2[bc2+2].position.z = z * 0.6;

              this.bricks2[bc2+3].position.x = +9.5 - x;
              this.bricks2[bc2+3].position.y = +4.5 - y * 0.5;
              this.bricks2[bc2+3].position.z = z * 0.6;
              bc += 4;  
            }
          }
        }
      }



      // brick count
      var bc = 0;

      frame = frame % FRAME_FOR_BEAN(48) + FRAME_FOR_BEAN(768);

      var start_shrink = FRAME_FOR_BEAN(776);
      var shrink_duration = FRAME_FOR_BEAN(24)
      var sp = Math.min(1, Math.max(0, (frame - start_shrink) / shrink_duration)); // zoom progress

      for(var x = 0; x < 10; x++) {
        for(var y = 0; y < 10; y++) {
          for(var z = 0; z < this.brick_placements.length; z++) {
            if (this.brick_placements[z][x][y] == 1 && bc + 4 <= this.bricks.length) {
              var start_build = FRAME_FOR_BEAN(784);
              var brick_fall = 1 - Math.min(1, (frame - start_build - (x+y+z) * 5));

              // Place one brick and mirror that operation on the xz and yz plane
              this.bricks[bc].position.x = -9.5 + x;
              this.bricks[bc].position.y = -4.5 + y * 0.5;
              this.bricks[bc].position.z = z * 0.6 + brick_fall;

              this.bricks[bc+1].position.x = +9.5 - x;
              this.bricks[bc+1].position.y = -4.5 + y * 0.5;
              this.bricks[bc+1].position.z = z * 0.6 + brick_fall;

              this.bricks[bc+2].position.x = -9.5 + x;
              this.bricks[bc+2].position.y = +4.5 - y * 0.5;
              this.bricks[bc+2].position.z = z * 0.6 + brick_fall;

              this.bricks[bc+3].position.x = +9.5 - x;
              this.bricks[bc+3].position.y = +4.5 - y * 0.5;
              this.bricks[bc+3].position.z = z * 0.6 + brick_fall;
              bc += 4;  
            }
          }
        }
      }

      if (this.bricks.length > 0) {
        if (BEAN < 788) {
          this.bricks[0].position.x = -9.5;
          this.bricks[0].position.y = -4.5;
          this.bricks[0].position.z = 0;
          this.proto_brick2.position.z = 1000;
        } else {
          this.bricks[0].position.z = 1000;
          this.proto_brick2.position.x = -9.5;
          this.proto_brick2.position.y = -4.5;
          this.proto_brick2.position.z = 0;
        }
      
        var poi_motion = sp;
        var poi_x = (1 - poi_motion) * this.bricks[0].position.x;
        var poi_y = (1 - poi_motion) * this.bricks[0].position.y;
        //var poi_x = this.bricks[0].position.x * scale;
        //var poi_y = this.bricks[0].position.y * scale;
        var poi_z = 0;//sp * 11.5 * 0.6;


        this.camera.position.z = poi_z;
        this.camera.position.x = poi_x + 80 * Math.sin(frame / shrink_duration * Math.PI * 2) * (0.05 + sp * 0.95);
        this.camera.position.y = poi_y + 80 * Math.cos(frame / shrink_duration * Math.PI * 2) * (0.05 + sp * 0.95);
        //this.camera.position.y = -23 * Math.cos(frame / 100);
        this.camera.lookAt(new THREE.Vector3(poi_x, poi_y, poi_z));
      }

      for(var i = bc; i < this.bricks.length; i++) {
        this.bricks[i].position.z = 100;
        this.bricks2[i].position.z = 100;
      }
    }
  }

  global.greets = greets;
})(this);
