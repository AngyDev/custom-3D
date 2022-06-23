# Measurement

### Usage

1. The user clicks the dedicated button in the sidebar
2. The user clicks on the mesh
3. To finish the measurement the user has to maintain click button pressed and clicks another time on the mesh.
4. It is possible to see the value of the measurement on the mesh

### How measurement works

The measurement functionality is based on the canvas event of pointerDown and pointerMove (to be adaptive for iPad too). The system creates two events. The movement events are important because they catch the mouse movements to add the point and the distance between the two points.

The measurement object group is composed by four objects, two points, _THREE.Point()_, one line, _THREE.LineSegments()_, and a label, _CSS2DRenderer()_.
