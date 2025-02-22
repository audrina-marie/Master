import React, { useState, useEffect } from "react";
import { Field, useField } from "react-final-form";
import { FormFeedback, FormText, Input, Label } from "reactstrap";

const PayField = ({
  label,
  name,
  inline = false,
  type = "text",
  readOnly = false,
  validationHint,
  disabled = false,
  maxLength,
  payBasis,
}) => {
  const [salary, setSalary] = useState(null);
  const formatSalary = (salary) => {
    if (!salary || salary.trim() === "" || isNaN(parseFloat(salary.replace(/[^0-9.]/g, "")))) {
      return "";
    }
    const cleanSalary = salary.replace(/[^0-9.]/g, "") || 0;
    let cents = "";

    const minDigits = payBasis === "PA" ? 0 : 2;
    const formattedSalary = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: minDigits,
      maximumFractionDigits: 2,
    }).format(parseFloat(cleanSalary));
    if (!formattedSalary.includes(".") && cleanSalary.endsWith(".")) {
      cents = cleanSalary.split(/(?=\.)/)[1];
    }
    return formattedSalary + cents;
  };

  const handleSalaryChange = (e) => {
    const inputValue = e.target.value.replace(/[^0-9.]/g, "");
    if (inputValue.trim() === "") {
      setSalary("");
    } else {
      const formattedValue = formatSalary(inputValue);
      setSalary(formattedValue);
    }
  };

  const salaryField = useField(name);
  // useEffect(() => {
  //   if (salaryField.input.value !== salary?.replace(/[^0-9.]/g, "")) {
  //     salaryField.input.onChange(salary?.replace(/[^0-9.]/g, ""));
  //   }
  // }, [salary, salaryField.input.value]);

  // initialize salary state
  useEffect(() => {
    if (salaryField.input.value && salary === null) {
      setSalary(salaryField.input.value);
    }
  }, [salaryField.input.value, salary]);

  return (
    <div>
      <Field name={name}>
        {({ input, meta }) => {
          return (
            <Label for={name} hidden={!label} className={inline ? "col-4" : null}>
              {label || name}
              <Input
                type={type}
                name={name}
                value={formatSalary(salary)}
                id={name}
                onChange={handleSalaryChange}
                onFocus={input.onFocus}
                onBlur={input.onBlur}
                invalid={!!meta.error}
                disabled={disabled || readOnly}
                className={inline ? "col-8" : null}
                maxLength={maxLength ? maxLength + 5 : null}
              />
              {meta.error && <FormFeedback>{meta.error}</FormFeedback>}
              {validationHint && (
                <FormText>
                  {typeof validationHint === "string"
                    ? validationHint
                    : validationHint(input.value.replace(/[^0-9.]/g, ""))}
                </FormText>
              )}
            </Label>
          );
        }}
      </Field>
    </div>
  );
};

export default PayField;
