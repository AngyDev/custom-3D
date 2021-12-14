import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import downloadIcon from '../../assets/images/icons/download-solid.svg';
import { getChildren, getGroup } from '../../features/scene/sceneSlice';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { STLExporter } from 'three/examples/jsm/exporters/STLExporter.js';

export default function Export() {

    const [isOpen, setIsOpen] = useState(false);
    const children = useSelector(getChildren);
    // const [objects, setObjects] = useState();

    const options = [];
    if (children !== undefined) {
        children.map((item) => {
            if (item.type === 'Mesh') {
                options.push(item);
            }
            if (item.type === 'Group' && item.children.length !== 0) {
                item.children.forEach((obj) => options.push(obj))
            }
        })
    }

    const exportObjects = () => {
        setIsOpen(true);
    }

    const exportFiles = (objects) => {
        const exporter = new STLExporter();
        objects.map((obj) => {
            const mesh = options.filter((option) => option.name === obj)[0];
            console.log(mesh);
            const result = exporter.parse(mesh, { binary: true });
            save(new Blob([result], { type: 'application/octet-stream' }), mesh.name);
        });
    }

    const save = (blob, filename) => {
        const link = document.createElement('a');
        link.style.display = 'none';
        document.body.appendChild(link);

        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    return (
        <>
            <Button typeClass="btn--img" img={downloadIcon} onClick={exportObjects} title="Export" />
            <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Export Objects" text="Export">
                <ExportModal options={options} exportFiles={exportFiles} />
            </Modal>
        </>
    )
}

function ExportModal({ options, exportFiles }) {

    const [objects, setObjects] = useState([]);

    const handleChange = (e) => {
        let values = [...e.target.selectedOptions].map(option => option.value);
        console.log(values);
        setObjects([...objects, values[0]]);
        console.log(objects);
    }

    const handleClick = () => {
        exportFiles(objects);
    }

    return (
        <>
            <select className="custom-select" size="5" multiple={true} value={objects} onChange={handleChange}>
                {
                    options.map((value, i) => (<option key={i} value={value.name}>{value.name}</option>))
                }
            </select>
            <Button typeClass="btn--size" text="EXPORT" onClick={handleClick} />
        </>
    )
}
