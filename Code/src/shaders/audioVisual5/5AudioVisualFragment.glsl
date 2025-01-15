varying vec2 vUv;
#define PI 3.1415926535897932384626433832795
uniform float uFrequency;
uniform float uTime;
uniform sampler2D uTexture;
#include ../includes/ClassicPerlinNoise.glsl
#include ../includes/Worley2.glsl

void main() {
    vec3 noise = (vec3(vUv, uTime));
    vec2 newuv = vUv;
    // loading a texture jpeg into the shader and animating it with worley noise with time
    vec4 textureColor = texture2D(uTexture, newuv + 0.015 * (1. - abs(fworley(vUv + uTime/10.))));
    gl_FragColor = vec4(newuv, 0.0, 1.);
    gl_FragColor = textureColor;
}