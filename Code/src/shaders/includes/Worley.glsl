//Calculate the squared length of a vector
float length2(vec2 p) {
    return dot(p, p);
}

//Generate some noise to scatter points.
float noise(vec2 p) {
    return fract(sin(fract(sin(p.x) * (43.13311)) + p.y) * 31.0011);
}

float worley(vec2 p) {
    //Set our distance to infinity
    float d = 1e30;
    //For the 9 surrounding grid points
    for(int xo = -1; xo <= 1; ++xo) {
        for(int yo = -1; yo <= 1; ++yo) {
            //Floor our vec2 and add an offset to create our point
            vec2 tp = floor(p) + vec2(xo, yo);
            //Calculate the minimum distance for this grid point
            //Mix in the noise value too!
            d = min(d, length2(p - tp - noise(tp)));
        }
    }
    return 3.0 * exp(-4.0 * abs(2.5 * d - 1.0));
}

float fworley(vec2 p) {
    //Stack noise layers 
    return sqrt(sqrt(sqrt(worley(p * 5.0 + 0.05 * uTime * 10.) *
        sqrt(worley(p * 50.0 + 0.12 + -0.1 * uTime)) *
        sqrt(sqrt(worley(p * -10.0 + 0.03 * uTime))))));
}