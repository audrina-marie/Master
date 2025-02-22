import React from "react";
import { Field, useForm } from "react-final-form";
import { Input } from "reactstrap";
import { withPath } from "../common/util";

const CodeField = ({ dropdownPath, codePath }) => {
  const form = useForm();
  const dropdownState = form.getFieldState(withPath(dropdownPath))?.value;
  const code = dropdownState?.split(" - ")[0].trim() || "";
  form.change(withPath(codePath), code);
  return (
    <>
      <Field name={withPath(codePath)}>
        {({ input }) => {
          return <Input type="hidden" value={code} {...input} />;
        }}
      </Field>
    </>
  );
};

export default CodeField;
