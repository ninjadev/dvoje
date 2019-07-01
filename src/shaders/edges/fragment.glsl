uniform float frame;
uniform float GU;
uniform sampler2D tDiffuse;
uniform sampler2D tNormal;

varying vec2 vUv;


/*
a b c
d e f
g h i
*/

float sobel(float a, float b, float c, float d, float f,  float g, float h, float i) {
    float horizontal = (
        a * -1. + c +
        d * -2. + f * 2. +
        g * -1. + i
    );
    float vertical = (
        a * -1. + b * -2. + c * -1. +
        g + h * 2. + i
    );
    return pow(pow(horizontal, 2.) + pow(vertical, 2.), 0.1);
}

void main() {
    vec3 diffuse = texture2D(tDiffuse, vUv).rgb;

    vec2 resolution = vec2(16. * GU, 9. * GU) * 2.;

    vec3 eps = vec3(1. / resolution.x, 1. / resolution.y, 0.);

    vec3 up = texture2D(tNormal, vUv + eps.zy).rgb;
    vec3 upright = texture2D(tNormal, vUv + eps.xy).rgb;
    vec3 right = texture2D(tNormal, vUv + eps.xz).rgb;
    vec3 downright = texture2D(tNormal, vUv - eps.zy + eps.xz).rgb;
    vec3 down = texture2D(tNormal, vUv - eps.zy).rgb;
    vec3 downleft = texture2D(tNormal, vUv - eps.xy).rgb;
    vec3 left = texture2D(tNormal, vUv - eps.xz).rgb;
    vec3 upleft = texture2D(tNormal, vUv + eps.zy - eps.xz).rgb;

    float lines = (
        sobel(upleft.r,   up.r,   upright.r,
              left.r,             right.r,
              downleft.r, down.r, downright.r) *
        sobel(upleft.g,   up.g,   upright.g,
              left.g,             right.g,
              downleft.g, down.g, downright.g) *
        sobel(upleft.b,   up.b,   upright.b,
              left.b,             right.b,
              downleft.b, down.b, downright.b)
    );

    vec3 color = diffuse * (1. - lines);
    gl_FragColor = vec4(vec3(color), 1.);
}
