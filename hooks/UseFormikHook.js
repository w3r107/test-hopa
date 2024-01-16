import { useFormik } from "formik";

export default function useFormikHook(submit, validationSchema, initialValues) {
  const {
    handleChange,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    setValues,
    errors,
    touched,
    values,
    setTouched,
  } = useFormik({
    initialValues: initialValues,
    onSubmit: submit,
    validationSchema: validationSchema,
  });

  return {
    handleChange,
    handleSubmit,
    setFieldTouched,
    setFieldValue,
    setValues,
    setTouched,
    errors,
    touched,
    values,
  };
}
