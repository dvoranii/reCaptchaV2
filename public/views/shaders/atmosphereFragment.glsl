varying vec3 vertexNormal; 
void main() {
    float intensity = pow(0.6 - dot(vertexNormal, vec3(0,0,1.0)), 1.5);
    gl_FragColor = vec4(0.5608, 0.8392, 0.6706, 0.8)* intensity * vec4(1.0, 1.0, 1.0, 1);

}