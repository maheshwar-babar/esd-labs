// Lab day (AI required). This file ends up as the form described in CONTRACT.md §4.
import { useState } from "react";

const EMPTY_VALUES = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

const FIELDS = [
  { name: "code", label: "Code", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "department", label: "Department", type: "text" },
  { name: "credits", label: "Credits", type: "number" },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "description", label: "Description", type: "textarea" },
];

export function AddCourseForm({ onAdd }) {
  const [values, setValues] = useState(EMPTY_VALUES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await onAdd({
        ...values,
        credits: Number(values.credits),
        capacity: Number(values.capacity),
        description: values.description === "" ? null : values.description,
      });
      setValues({ ...EMPTY_VALUES });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
      setFieldErrors(error?.fieldErrors ?? {});
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Add a course</h2>
      <form noValidate onSubmit={handleSubmit}>
        {FIELDS.map(({ name, label, type }) => {
          const inputId = `course-${name}`;
          const errorId = `${inputId}-error`;
          const fieldError = fieldErrors[name];

          return (
            <div key={name}>
              <label htmlFor={inputId}>{label}</label>
              {type === "textarea" ? (
                <textarea
                  id={inputId}
                  name={name}
                  value={values[name]}
                  onChange={handleChange}
                  aria-invalid={fieldError ? "true" : undefined}
                  aria-describedby={fieldError ? errorId : undefined}
                />
              ) : (
                <input
                  id={inputId}
                  name={name}
                  type={type}
                  value={values[name]}
                  onChange={handleChange}
                  aria-invalid={fieldError ? "true" : undefined}
                  aria-describedby={fieldError ? errorId : undefined}
                />
              )}
              {fieldError && <span id={errorId}>{fieldError}</span>}
            </div>
          );
        })}
        {errorMessage && <p role="alert">{errorMessage}</p>}
        <button type="submit" disabled={isSubmitting}>
          Add course
        </button>
      </form>
    </section>
  );
}