import React from 'react'

export default function Import() {
    return (
        <div>
            <label htmlFor="input_import" className="btn">
                Import
            </label>
            <input type="file" multiple id="input_import" accept=".stl" />
        </div>
    )
}
