varying vec2 vUv;
#define PI 3.1415926535897932384626433832795
uniform float uFrequency;
uniform float uTime;
uniform sampler2D uTexture;
#include ../includes/ClassicPerlinNoise.glsl

void main() {

    vec2 newuv = vUv;
    // loads the three.js texture to the shader and using the uv coordinates to sample the texture
    //then adding some noise to the uv coordinates to make the texture move
    vec4 textureColor = texture2D(uTexture, newuv + 0.05 * (1. - abs(cnoise(vec4(vUv * 10., uTime, 10.), vec4(1000.)))));
    gl_FragColor = vec4(newuv, 0.0, 1.);
    gl_FragColor = textureColor;
}
