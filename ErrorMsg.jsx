import React, { useEffect, useState } from "react";
import { Alert } from "reactstrap";
import { useForm } from "react-final-form";

const ErrorMsg = () => {
  const [errorMsgs, setErrorMsgs] = useState([]);
  const form = useForm();
  const errors = form.getState().errors?.formResponse?.data;

  useEffect(() => {
    if (errors) {
      const newMessages = [];
      for (let key in errors) {
        if (errors.hasOwnProperty(key)) {
          newMessages.push(`${errors[key]}`);
          setErrorMsgs(newMessages);
        }
      }
    }
  }, [errors]);

  return (
    <>
      {errors && (
        <Alert color="danger">
          {errorMsgs.map((message, index) => (
            <div key={index}>. {message}</div>
          ))}
        </Alert>
      )}
    </>
  );
};

export default ErrorMsg;
