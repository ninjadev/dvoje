/// <reference path='three.js' />
(function(global) {
  class gordonWalters extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.lineHeight = 4;
      this.linesAndCircles = [];
      var screenHeight = 1080;
      var screenWidth = 1980;
      this.lineWidth = screenWidth;

      var color = 0;
      var colors = [0xcccbc4, 0x232321]
      for(var posY = -screenHeight/2; posY < screenHeight/2; posY += this.lineHeight) {
        var xOffset = (-this.lineWidth/2 * Math.random()) + this.lineWidth/4;
        var leftLine = this.lineGenerator(colors[color % 2], posY, -this.lineWidth/2 + xOffset);
        var rightLine = this.lineGenerator(colors[color % 2], posY, 13 + (this.lineWidth/2) + xOffset);
        var centerLine = this.lineGenerator(colors[(color+1) % 2], posY+2, 0, this.lineHeight+2);
        centerLine.position.z = -10;

        var leftCircle = this.circleGenerator(colors[color % 2], posY + this.lineHeight/2, 0 + xOffset);
        var rightCircle = this.circleGenerator(colors[color % 2], posY + this.lineHeight/2, 12 + xOffset);

        var direction = Math.random() < 0.5 ? -1 : 1

        this.linesAndCircles.push({
          circles: [leftCircle, rightCircle],
          lines: [centerLine, leftLine, rightLine],
          direction: direction,
          acc: (Math.random() * direction)
        });

        color++;
      }


      for(var obj of this.linesAndCircles) {
        for(var line of obj.lines) {
          this.scene.add(line)
        }
        for(var circle of obj.circles) {
          this.scene.add(circle)
        }
      }
      
      var plane = new THREE.Mesh(new THREE.PlaneGeometry(screenHeight, screenWidth),  new THREE.MeshBasicMaterial({
        color: 0xffffff,
      }))
      this.scene.add(plane)
      var light = new THREE.PointLight(0x00, 1, 100);
      light.position.set(50, 50, 50);

      this.scene.add(light);
      this.camera.position.z = -100;
    }

    update(frame) {
      super.update(frame);

      for(var obj of this.linesAndCircles) {

        for(var line of obj.lines) {
          line.position.y -= 0.3;
          line.position.x += obj.acc;
        }
        for(var circle of obj.circles) {
          circle.position.y -= 0.3;
          circle.position.x += obj.acc;
          /*
          if (circle.position.x > 200) {
            circle.position.x = -200;
          }
          if (circle.position.x < -200) {
            circle.position.x = 200;
          }
          */
        }
        
      }
      
      
      this.camera.position.z = 300 + (30 * Math.cos(frame / 80));
      //this.camera.rotation.x = 30 * Math.cos(frame / 80) * Math.PI / 180
    }


    lineGenerator(color, posY, posX, lineHeight2 = this.lineHeight) {
      var line = new THREE.Mesh(new THREE.BoxGeometry(this.lineWidth, lineHeight2, lineHeight2), new THREE.MeshBasicMaterial({color: color}))
      line.position.y = posY
      line.position.x = posX
      return line
    }

    circleGenerator(color, posY, posX) {
      var circle = new THREE.Mesh(new THREE.SphereGeometry(this.lineHeight, 16, 16), new THREE.MeshBasicMaterial({color: color}))
      circle.position.y = posY;
      circle.position.x = posX;
      return circle
    }
  }

  global.gordonWalters = gordonWalters;
})(this);
