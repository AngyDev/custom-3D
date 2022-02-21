# Measurement

### Usage

1. The user clicks the dedicated button in the sidebar
2. The user presses the *Ctrl* button and clicks on the mesh
3. To finish the measurement the user has to maintain the ctrl button pressed and clicks another time on the mesh.
4. It is possible to see the value of the measurement on the mesh

### How measurement works

The measurement functionality is based on the window event and on the canvas one. The system creates four events, two for mouse movement and two for keypress. The keypress events are important to add a listener when the user clicks the ctrl button and when leaves the button, the movement events are important because they catch the mouse movements to add the point and the distance to the scene.

The measurement is composed by four objects, two points, *THREE.Point()*, one line, *THREE.LineSegments()*, and a label, *CSS2DRenderer()*.