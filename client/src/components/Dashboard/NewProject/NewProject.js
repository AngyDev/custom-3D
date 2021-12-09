import React from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../Button/Button';

export default function NewProject({ isOpen, saveNewProject }) {

    const { handleSubmit, register, formState: { errors } } = useForm();

    // const onSubmit = (data) => {
    //     console.log(data);
    // }

    return (
        <div>
            <form className="form flex flex-col" onSubmit={handleSubmit(saveNewProject)}>
                <div className="form__el flex flex-col">
                    <label className="form__label" htmlFor="project_name">Project name:</label>
                    <input className="form__input" {...register("projectName", { required: "This field is required" })} id="project_name" />

                    {errors.projectName && <span>{errors.projectName.message}</span>}
                </div>

                <div className="form__el flex flex-col">
                    <label className="form__label" htmlFor="patient_code">Patient code:</label>
                    <input className="form__input" {...register("patientCode", { required: true })} id="patient_code" />

                    {errors.patientCode && <span>This field is required</span>}
                </div>

                {/* <button className="form__submit col-4" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button> */}
                <div className="flex justify-end">
                    <Button typeClass="btn--size" text='Save' />
                </div>
            </form>
        </div>
    )
}
