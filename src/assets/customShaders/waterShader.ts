export const WATER_VERTEX_SHADER =
    `
    #define PHONG

    varying vec3 vViewPosition;
    varying vec4 pos;
    varying vec2 textureCoords;
    varying vec2 vUv;
    uniform vec3 camPos;
    varying vec3 toCameraVector;

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
        
        vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * modelViewPosition;
        vUv = uv;
        pos = vec4(gl_Position.x, gl_Position.y, gl_Position.z, gl_Position.w) ;
        toCameraVector = camPos.xyz - modelViewPosition.xyz;
    }`;

export const WATER_FRAGMENT_SHADER =
    `
#define PHONG

uniform sampler2D reflectionTexture;
uniform sampler2D refractionTexture;
uniform sampler2D dudvMap;
uniform sampler2D normalMap;
uniform float moveFactor;
 
varying vec2 vUv;
varying vec4 pos;
varying vec2 textureCoords;
varying vec3 toCameraVector;

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

	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;

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

    vec2 screen = (vec2(pos.x, pos.y )/pos.w + 1.0)*0.5;    

    vec2 reflectionTextureCoord = vec2(screen.x, screen.y);
    vec2 refractionTextureCoord = vec2(screen.x, screen.y);

    // vec2 distortedTexCoords = texture2D(dudvMap, vec2(vUv.x + moveFactor, vUv.y) * 2000.0).rg * 0.1;
    // distortedTexCoords = vUv + vec2(distortedTexCoords.x, distortedTexCoords.y + moveFactor);
    // vec2 totalDistortion = (texture2D(dudvMap, distortedTexCoords).rg * 2.0 - 1.0) * 0.02;

    // reflectionTextureCoord += totalDistortion;
    // refractionTextureCoord += totalDistortion;
    // reflectionTextureCoord = clamp (reflectionTextureCoord, 0.001, 0.999);
    // refractionTextureCoord = clamp (refractionTextureCoord, 0.001, 0.999);

    vec3 viewVector = normalize(toCameraVector);
    float refractiveFactor = dot(viewVector, vec3( 0.0, 1.0, 0.0) );
    refractiveFactor = pow(refractiveFactor, 0.5);
    
    vec4 colorOut = clamp( mix(texture2D(reflectionTexture, reflectionTextureCoord),
                                texture2D(refractionTexture, refractionTextureCoord),
                                0.5), 0.0, 1.0);
	gl_FragColor = mix(colorOut, vec4(0.2, 0.09, 0.02, 1.0), 0.6);

	#include <tonemapping_fragment>
	#include <encodings_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

}

`;

