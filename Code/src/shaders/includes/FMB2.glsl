#include ../includes/Random.glsl

const mat2 mtx = mat2(0.80, 0.60, -0.60, 0.80);

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(mix(random(ip), random(ip + vec2(1.0, 0.0)), u.x), mix(random(ip + vec2(0.0, 1.0)), random(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
}

float fbm(vec2 p) {
    float f = 0.0;

    f += 0.500000 * noise(p + uTime);
    p = mtx * p * 2.02;
    f += 0.031250 * noise(p);
    p = mtx * p * 2.01;
    f += 0.250000 * noise(p);
    p = mtx * p * 2.03;
    f += 0.125000 * noise(p);
    p = mtx * p * 2.01;
    f += 0.062500 * noise(p);
    p = mtx * p * 2.04;
    f += 0.015625 * noise(p + sin(uTime));

    return f / 0.96875;
}


//https://iquilezles.org/articles/warp/