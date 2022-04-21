import React from "react";
import { useForm } from "react-hook-form";
import Button from "../../Button/Button";
import PropTypes from "prop-types";

export default function NewProject({ saveNewProject, onClose }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  return (
    <div>
      <form className="form flex flex-col" onSubmit={handleSubmit(saveNewProject)}>
        <div className="modal__body text-black">
          <div className="pb-6">
            <label className="form__label" htmlFor="project_name">
              Project name:
            </label>
            <input className="form__input" {...register("projectName", { required: "This field is required" })} id="project_name" />
            {errors.projectName && <div className="form__error">{errors.projectName.message}</div>}
          </div>

          <div>
            <label className="form__label" htmlFor="patient_code">
              Patient code:
            </label>
            <input className="form__input" {...register("patientCode", { required: true })} id="patient_code" />
            {errors.patientCode && <div className="form__error">This field is required</div>}
          </div>
        </div>

        {/* <button className="form__submit col-4" type="submit" disabled={loading}>{loading ? 'Loading...' : 'Submit'}</button> */}
        {/* <div className="flex justify-end">
          <Button typeClass="btn--size" text="Save" />
        </div> */}

        <div className="modal__footer modal__border-t">
          <Button type="submit" typeClass="modal__btn-confirm" text="Confirm" />
          <Button type="button" typeClass="modal__btn-cancel" text="Cancel" onClick={onClose} />
        </div>
      </form>
    </div>
  );
}

NewProject.propTypes = {
  saveNewProject: PropTypes.func,
  onClose: PropTypes.func,
};
