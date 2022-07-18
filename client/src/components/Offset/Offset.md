# Offset

### Usage

1. The user chooses the mesh to offset clicking to the dedicated button
2. The button opens an input and a button
3. The user chooses the offset to add to the mesh
4. The user clicks the button
5. The system applies the offset to the mesh

### How offset works

When the user chooses the mesh, the system takes the uuid the selected mesh and searches the mesh object in the scene object through the function findById. When the system returns the selected mesh object, the system takes the offset that the user has selected and then checks if it is the first time the offset is applied to the mesh. If it is then the system creates a new mesh cloning the geometry and the material of the selected mesh.

It was decided to use the following code `const newMesh = new THREE.Mesh(meshToOffset.geometry.clone(), meshToOffset.material.clone());` instead of `const newMesh = meshToOffset.clone()`, because the last command create a new mesh with references to the cloned mesh. It is problem because when we apply updates on the new mesh them are replied on the original one.

To offset a mesh the system applies a scale method to the mesh. To do that the system has to take the center of the original mesh and applies it to the new mesh and set a new position based on the center of the mesh. Then it sets the offset to the scale of the mesh. At the end the system adds the mesh to the scene.

It was decided to change the opacity and transparency of the mesh to render the new mesh more readable.

If in the scene is already present a mesh with the offset and if the user wants to change the offset of this mesh, the system, without creating a new mesh, will apply the same algorithm as above on the existing mesh.

If the user chooses an offset equal 1, the mesh, if presents, it is removed
