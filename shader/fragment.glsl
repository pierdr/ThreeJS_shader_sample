uniform vec4 resolution;

varying vec2 vCoordinates;

uniform sampler2D tex1;

varying vec2 vUv;

void main()	{

	//ADD COLOR TO THE PARTICLE
	vec2 myUV =  vec2(vCoordinates.x/512.0,vCoordinates.y/512.0);
	vec4 image = texture2D(tex1,vUv);
	gl_FragColor = image;
	// gl_FragColor = mix(image,vec4(0.,1.0,0.,1.0),0.5);
}
