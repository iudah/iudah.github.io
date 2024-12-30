#version 300 es

precision highp float;
uniform sampler2D u_texture_sampler;

in vec4 v_vertex_color;
in vec2 v_texture_coordinates;

out vec4 outColor;

void main() {
  outColor = texture(u_texture_sampler, v_texture_coordinates);
  //  texture has some shadow hence the red discard
  if (outColor.a < 0.1 || outColor.r < 0.2)
    discard;
  outColor *= v_vertex_color;
}
