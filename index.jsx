import React from "react";
import WithBreadcrumbs from "../../common/WithFormBreadcrumbs/WithFormBreadcrumbs";
import WithFormManager from "../../common/FinalForm/WithFormManager";
import init from "../../common/Util/Init";
import Sf52 from "./Sf52";
import { composeValidators, createValidatorMaker } from "../../common/validation/Validate";

if (!window.fetch) {
  // eslint-disable-next-line global-require
  require("es6-promise").polyfill();
  // eslint-disable-next-line global-require
  require("isomorphic-fetch");
}

const validateRemarks = createValidatorMaker((remarks) => {
  const remarksLength = remarks ? remarks.length <= 1800 : true;
  return remarksLength;
});

const validateNfcFields = createValidatorMaker((error) => {
  return !error;
});

const remarksValidator = (values) => {
  const remarksError = validateRemarks(
    "Remarks max field size is 1800 characters",
    "formResponse.data.REMARKSF50",
  )(values);
  return remarksError;
};

const nfcFieldsValidator = (values) => {
  const nfcError = validateNfcFields("Missing required NFC field", "formResponse.data.nfcError")(values);
  return nfcError;
};

const sf52Validator = composeValidators(remarksValidator, nfcFieldsValidator);

const WithFormManagerForm = WithFormManager({
  bsFormId: "sf52",
  hasPdfPrintButton: true,
  hasResetButton: false,
  hasLockButton: true,
  validator: sf52Validator,
})(Sf52);

const WithBreadcrumbsForm = WithBreadcrumbs({ logo: false })(WithFormManagerForm);

const App = (props) => (
  <div>
    <WithBreadcrumbsForm {...props} />
  </div>
);

init("sf52", App);
