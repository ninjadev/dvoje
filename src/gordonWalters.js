(function(global) {
  class gordonWalters extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      var lineHeight = 4;
      this.lines = [], this.circles = [];
      var screenHeight = 1080;

      var lineGenerator = function(color, posY) {
        var line = new THREE.Mesh(new THREE.BoxGeometry(400, lineHeight, lineHeight), new THREE.MeshBasicMaterial({color: color}))
        line.position.y = posY
        return line
      }
      var circleGenerator = function(color, posY) {
        var direction = Math.random() < 0.5 ? -1 : 1
        var circle = new THREE.Mesh(new THREE.SphereGeometry(lineHeight, 16, 16), new THREE.MeshBasicMaterial({color: color}))
        circle.position.y = posY+ (direction * (lineHeight/2))
        circle.position.x = Math.random()*200*direction;
        return {obj: circle, direction: direction, acc: (Math.random() * direction)}
      }

      for(var posY = -200; posY < -200+screenHeight; posY += 2*lineHeight+1) {
        this.lines.push(lineGenerator(0xffffff, posY));
        this.circles.push(circleGenerator(0xffffff, posY+lineHeight));
      }

      for(var line of this.lines) {
        this.scene.add(line)
      }
      for(var circle of this.circles) {
        this.scene.add(circle.obj)
      }

      var light = new THREE.PointLight(0x00, 1, 100);
      light.position.set(50, 50, 50);

      //this.scene.add(light);

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);
      
      for(var line of this.lines) {
        line.position.y -= 0.3;
      }
      for(var circ of this.circles) {
        var circle = circ.obj;
        circle.position.y -= 0.3;
        circle.position.x += circ.acc;
        if (circle.position.x > 200) {
          circle.position.x = -200;
        }
        if (circle.position.x < -200) {
          circle.position.x = 200;
        }
      } 
      this.camera.position.z = 100 + (20 * Math.cos(frame / 80));
    }
  }

  global.gordonWalters = gordonWalters;
})(this);
