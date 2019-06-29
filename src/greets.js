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
      var loadObject = function (objPath, material, three_scene, clone_array) {
        var objLoader = new THREE.OBJLoader();
        Loader.loadAjax(objPath, function(text) {
          var object = objLoader.parse(text);
          var test;
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              child.material = new THREE.MeshStandardMaterial({color: 'blue'});
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


//      console.log(this.proto_brick.tostring());




    }

    update(frame) {
      super.update(frame);

      for(var i = 0; i < this.bricks.length; i++) {
        this.bricks[i].position.y = 10 * Math.sin(i * frame / 10000);
      }
    }
  }

  global.greets = greets;
})(this);
