import React from 'react'

export default function Import() {

    const handleChange = (e) => {
        const files = e.target.files;
        console.log(files);
    }

    return (
        <div>
            <label htmlFor="input_import" className="btn">
                Import
            </label>
            <input type="file" multiple id="input_import" accept=".stl" onChange={handleChange}/>
        </div>
    )
}
