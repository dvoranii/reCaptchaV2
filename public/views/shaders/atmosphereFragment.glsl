varying vec3 vertexNormal; 
void main() {
    // vertexNormal = normalize(normalMatrix * normal);
    float intensity = pow(0.45 - dot(vertexNormal, vec3(0,0,1.0)), 2.0);
    gl_FragColor = vec4(0.5608, 0.8392, 0.6706, 0.8)* intensity * vec4(1.0, 1.0, 1.0, 1);

}