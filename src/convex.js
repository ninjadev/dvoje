// import qh from 'quickhull3d';

function uniform_point_generator(n, bb, scalealizer) {
    let points = [];

    for(i = 0; i < n; i++) {
        let outside = true;
        while not (outside){
            x = scalealizer*Math.random();
            if (x> bb.xmin && x<bb.xmax){outside = false;}
        }
        let outside = true;
        while not (outside){
            y = scalealizer*Math.random();
            if (y> bb.ymin && y<bb.ymay){outside = false;}
        }
        let outside = true;
        while not (outside){
            z = scalealizer*Math.random();
            if (z> bb.zmin && z<bb.zmaz){outside = false;}
        }
        points.push([x, y, z]);
    }
    return points;

}
uniform_point_generator(100, {xmax:1, xmin:0, ymin:0, ymax:1, zmin:0, zmax:1});

// sphere.r
// sphere.p
function points_in_sphere(points, sphere) {
    let in_sphere = [];
    for (i = 0; i < points.length; i++){
        if Math.sqrt((points[i][0] - sphere.p[0])**2 + (points[i][1] - sphere.p[1])**2 + (points[i][2] - sphere.p[2])**2) < sphere.r {
            in_sphere.push(i);
        }
    }
    return in_sphere;
}

let bb = {xmax:1, xmin:0, ymin:0, ymax:1, zmin:0, zmax:1};

let sphere = {r: 0.4, p:[0,0,0]};
let points = uniform_point_generator(100, bb, 1.0);
let in_sphere = points_in_sphere(points, sphere);
let convex_hull_faces = qh(in_sphere);

function (faces, points_inside_geometry) {
    var geometry = new THREE.Geometry();
    for (i = 0; i < faces.length; i += 1) {
    }
}

