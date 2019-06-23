uniform float frame;
uniform sampler2D tDiffuse;
uniform sampler2D input_image;

varying vec2 vUv;

#define NUMBER_OF_SCANLINES 80.
#define SCANLINE_DARKNESS 0.65

void main() {
    vec4 color = texture2D(input_image, vUv);
    if (fract(vUv.y * NUMBER_OF_SCANLINES) > 0.5) {
        color = vec4(color.r * SCANLINE_DARKNESS, color.g * SCANLINE_DARKNESS, color.b * SCANLINE_DARKNESS, color.a);
    }
    gl_FragColor = color;
}
