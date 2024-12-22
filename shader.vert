#version 300 es

in vec4 a_vertex_color;
in vec4 a_vertex_position;
in vec2 a_texture_coordinates;
in mat4 a_instance_transform;

uniform mat4 u_perspective_matrix;

out vec4 v_vertex_color;
out vec2 v_texture_coordinates;

void main() {
  v_texture_coordinates = a_texture_coordinates;
  v_vertex_color = a_vertex_color;
  gl_Position = u_perspective_matrix * a_instance_transform * a_vertex_position;
}
