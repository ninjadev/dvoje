uniform float frame;
uniform float GU;
uniform sampler2D tDiffuse;
uniform sampler2D tNormal;
uniform sampler2D tDepth;
uniform sampler2D tInverter;

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

    float Dup = texture2D(tDepth, vUv + eps.zy).r;
    float Dupright = texture2D(tDepth, vUv + eps.xy).r;
    float Dright = texture2D(tDepth, vUv + eps.xz).r;
    float Ddownright = texture2D(tDepth, vUv - eps.zy + eps.xz).r;
    float Ddown = texture2D(tDepth, vUv - eps.zy).r;
    float Ddownleft = texture2D(tDepth, vUv - eps.xy).r;
    float Dleft = texture2D(tDepth, vUv - eps.xz).r;
    float Dupleft = texture2D(tDepth, vUv + eps.zy - eps.xz).r;

    float lines = (
        ( 1. -smoothstep(0.85, 1., sobel(upleft.r,   up.r,   upright.r,
                    left.r,             right.r,
                    downleft.r, down.r, downright.r))) *
        ( 1. -smoothstep(0.85, 1., sobel(upleft.g,   up.g,   upright.g,
                    left.g,             right.g,
                    downleft.g, down.g, downright.g))) *
        ( 1. -smoothstep(0.85, 1., sobel(upleft.b,   up.b,   upright.b,
                    left.b,             right.b,
                    downleft.b, down.b, downright.b))) *
        ( 1. -smoothstep(0.5, 0.6, sobel(Dupleft,   Dup,   Dupright,
                    Dleft,             Dright,
                    Ddownleft, Ddown, Ddownright)))
    );

    vec3 inverter = texture2D(tInverter, vUv).rgb;

    vec3 color = mix(diffuse * lines, vec3(0.9 - lines * 0.9), inverter.r);
    gl_FragColor = vec4(color, 1.);
}
