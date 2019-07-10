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

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);
      
      this.bricks = [];
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
          for(var i = 0; i < 2000; i++) {
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
      var brick_material = new THREE.MeshStandardMaterial({color: 'red'});
      loadObject('res/32000.obj', brick_material, this.scene, this.bricks);
      this.scene.add( this.proto_brick );

            /*for( var i = 0; i < 5; i++) {
              this.bricks.add(new THREE.Object3D(this.proto_brick.children[0].children[0].geomerty, new THREE.MeshStandardMaterial()));
              this.scene.add(this.bricks[i]);
            }*/
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
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,0,0,0,0,0,0,0,0],
                                  [0,0,1,1,1,1,1,1,1,1],
                                  [0,0,1,0,0,0,0,0,0,0],
                                  [1,1,0,0,0,0,0,0,0,0]]);
    }

    update(frame) {
      super.update(frame);

      this.camera.position.z = 14;
      this.camera.position.x = 10 * Math.sin(frame / 100);
      this.camera.position.y = 10 * Math.cos(frame / 100);

      this.camera.lookAt(new THREE.Vector3(0,0,5));
      // brick count
      var bc = 0;


      for(var x = 0; x < 10; x++) {
        for(var y = 0; y < 10; y++) {
          for(var z = 0; z < this.brick_placements.length; z++) {
            if (this.brick_placements[z][x][y] == 1 && bc + 4 <= this.bricks.length) {
              // Place one brick and mirror that operation on the xz and yz plane
              this.bricks[bc].position.x = -9.5 + x;
              this.bricks[bc].position.y = -4.5 + y * 0.5;
              this.bricks[bc].position.z = z * 0.6;

              this.bricks[bc+1].position.x = +9.5 - x;
              this.bricks[bc+1].position.y = -4.5 + y * 0.5;
              this.bricks[bc+1].position.z = z * 0.6;

              this.bricks[bc+2].position.x = -9.5 + x;
              this.bricks[bc+2].position.y = +4.5 - y * 0.5;
              this.bricks[bc+2].position.z = z * 0.6;

              this.bricks[bc+3].position.x = +9.5 - x;
              this.bricks[bc+3].position.y = +4.5 - y * 0.5;
              this.bricks[bc+3].position.z = z * 0.6;
              bc += 4;  
            }
          }
        }
      }
      for(var i = bc; i < this.bricks.length; i++) {
        this.bricks[i].position.y = 100;
      }
    }
  }

  global.greets = greets;
})(this);
