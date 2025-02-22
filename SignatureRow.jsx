import React from "react";
import { Form, Field } from "react-final-form";
import {
  Input,
  FormGroup,
  Label,
  Button,
  Row,
  Col,
  Container,
  Card,
  CardBody,
  Form as BsForm,
  Spinner,
  CardTitle,
  InputGroupAddon,
} from "reactstrap";
import ESignature from "../../../common/ESignature/ESignature";
import FFTextInput from "../../../common/FinalForm/FFTextInput";
import { withSignPath, withPath } from "./util";
import { charCount } from "../../Fema/common/util";

const SignatureRow = ({ officeCode, permissions, saveForm, roleType, formApi, type = 'SIGNATURE' }) => {
  const lastLetter = officeCode.charAt(officeCode.length - 1);
  const signPath = `AUTH_SIGN_${lastLetter}`;
  return (
    <>
      <FFTextInput
        validationHint={charCount(10)}
        label="Office/Function"
        name={withPath(officeCode)}
        maxLength={10}></FFTextInput>
      <Field
        name={withSignPath(signPath)}
        subscription={{
          value: true,
          active: false,
          error: true,
          touched: true,
        }}>
        {({ input }) => (
          <ESignature
            label="Signature"
            onSave={(e, signerTitle) => saveForm(e, formApi, signerTitle)}
            {...input.value}
            formRoleType={roleType}
            disabled={!permissions.includes("form_canESignForm")}
            type={type}
          />
        )}
      </Field>
    </>
  );
};

export default SignatureRow;
