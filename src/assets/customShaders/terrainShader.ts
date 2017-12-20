export const TERRAIN_VERTEX_SHADER =
    `
    #define PHONG

    uniform vec4 clipPlane;
    uniform float waterHeight;
    varying float shouldClip;
    varying vec3 vViewPosition;
    varying vec3 vUv;
    varying vec2 tUv;

    #ifndef FLAT_SHADED
        varying vec3 vNormal;
    #endif

    #include <common>
    #include <uv_pars_vertex>
    #include <uv2_pars_vertex>
    #include <displacementmap_pars_vertex>
    #include <envmap_pars_vertex>
    #include <color_pars_vertex>
    #include <fog_pars_vertex>
    #include <morphtarget_pars_vertex>
    #include <skinning_pars_vertex>
    #include <shadowmap_pars_vertex>
    #include <logdepthbuf_pars_vertex>
    #include <clipping_planes_pars_vertex>

    void main() {

        #include <uv_vertex>
        #include <uv2_vertex>
        #include <color_vertex>

        #include <beginnormal_vertex>
        #include <morphnormal_vertex>
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <defaultnormal_vertex>

    #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

        vNormal = normalize( transformedNormal );

    #endif

        #include <begin_vertex>
        #include <morphtarget_vertex>
        #include <skinning_vertex>
        #include <displacementmap_vertex>
        #include <project_vertex>
        #include <logdepthbuf_vertex>
        #include <clipping_planes_vertex>

        vViewPosition = - mvPosition.xyz;

        #include <worldpos_vertex>
        #include <envmap_vertex>
        #include <shadowmap_vertex>
        #include <fog_vertex>

        vUv = position;
        tUv = uv;

        vec4 modelViewPosition = modelViewMatrix * vec4(position.x, position.y - 2.01*waterHeight, position.z, 1.0);
        shouldClip = dot(vec4(position, 1.0), clipPlane); 
        gl_Position = projectionMatrix * modelViewPosition;
    }`
;

export const TERRAIN_FRAGMENT_SHADER =
    `
    #define PHONG

    uniform sampler2D textureRock;
    uniform sampler2D textureGrass;
    uniform sampler2D textureDirt;
    uniform float textureRockRepeat;
    uniform float textureGrassRepeat;
    uniform float textureDirtRepeat;
    uniform float minVal;
    uniform float maxVal;
    uniform float reflection;

    varying vec3 vUv;
    varying vec2 tUv;
    varying float shouldClip;

    uniform vec3 diffuse;
    uniform vec3 emissive;
    uniform vec3 specular;
    uniform float shininess;
    uniform float opacity;

    #include <common>
    #include <packing>
    #include <dithering_pars_fragment>
    #include <color_pars_fragment>
    #include <uv_pars_fragment>
    #include <uv2_pars_fragment>
    #include <map_pars_fragment>
    #include <alphamap_pars_fragment>
    #include <aomap_pars_fragment>
    #include <lightmap_pars_fragment>
    #include <emissivemap_pars_fragment>
    #include <envmap_pars_fragment>
    #include <gradientmap_pars_fragment>
    #include <fog_pars_fragment>
    #include <bsdfs>
    #include <lights_pars>
    #include <lights_phong_pars_fragment>
    #include <shadowmap_pars_fragment>
    #include <bumpmap_pars_fragment>
    #include <normalmap_pars_fragment>
    #include <specularmap_pars_fragment>
    #include <logdepthbuf_pars_fragment>
    #include <clipping_planes_pars_fragment>

    void main() {

        #include <clipping_planes_fragment>

        vec3 white = vec3(1.0, 1.0, 1.0);
        vec3 brown = vec3(0.2, 0.09, 0.02);
        vec3 green = vec3(0.03, 0.4, 0.13);

        vec3 actualColor;
        vec4 actualTexture;

        if(vUv.y > maxVal/2.0) {
            actualColor = mix(brown, white, (vUv.y - maxVal/2.0)/maxVal);
            actualTexture = mix(texture2D(textureDirt, tUv * textureDirtRepeat),
                                texture2D(textureRock, tUv * textureRockRepeat),
                                (vUv.y - maxVal/2.0)/maxVal);      
        } else {
            actualColor = mix(green, brown, (vUv.y + maxVal/2.0)/maxVal);
            actualTexture = mix(texture2D(textureGrass, tUv * textureGrassRepeat),
                                texture2D(textureDirt, tUv * textureDirtRepeat),
                                (vUv.y + maxVal/2.0)/maxVal);      
        }

        vec4 diffuseColor = vec4( actualColor, opacity );
        ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
        vec3 totalEmissiveRadiance = actualColor;

        #include <logdepthbuf_fragment>
        #include <map_fragment>
        #include <color_fragment>
        #include <alphamap_fragment>
        #include <alphatest_fragment>
        #include <specularmap_fragment>
        #include <normal_fragment>
        #include <emissivemap_fragment>

        // accumulation
        #include <lights_phong_fragment>
        #include <lights_template>

        // modulation
        #include <aomap_fragment>

        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

        #include <envmap_fragment>
        if(shouldClip < 0.0){
            discard;
        } else {
            gl_FragColor = clamp(actualTexture * vec4(outgoingLight, diffuseColor.a), 0.0, 1.0);
        }

        #include <tonemapping_fragment>
        #include <encodings_fragment>
        #include <fog_fragment>
        #include <premultiplied_alpha_fragment>
        #include <dithering_fragment>

    }`
;

