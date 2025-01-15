float fbm( vec3 p ) {
        float f = 0.0;
        f += 0.5000*snoise( p ); p = p*2.02;
        f += 0.2500*snoise( p ); p = p*2.03;
        f += 0.1250*snoise( p ); p = p*2.01;
        f += 0.0625*snoise( p );
        return f/0.9375;
}

// 	<https://www.shadertoy.com/view/MdX3Rr>
//	by inigo quilez
//        licensed under Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.