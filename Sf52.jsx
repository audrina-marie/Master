import React, { useEffect, useState } from "react";
import { useForm, Field, useField } from "react-final-form";
import arrayMutators from "final-form-arrays";
import createDecorator from "final-form-focus";
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
import ESignature from "../../common/ESignature/ESignature";
import AutoSave from "./common/AutoSave";
// import { setFieldValue } from "../../../../common/Util/FormUtil";
import DateInputWithErrorBoundary from "../../common/Inputs/DateInput";
import RichEditorComponent from "../../../../common/RichEditorComponent/RichEditorComponent";
// import FFTextInput from "../../../../common/FinalForm/FFTextInput";
import FFTextInput from "../../common/FinalForm/FFTextInput";
// import { withPath, charCount, withSignPath } from "../common/util";
import { withPath, charCount, withSignPath } from "./common/util";
import Sf52Action from "./Sf52Action";
import OptionSelect from "./common/OptionSelect";
import { fetchData } from "../../common/Util/DataProviderUtil";
import {
  vetPreferenceOptions,
  tenureOptions,
  positionOccupiedOptions,
  flsaCategoryOptions,
  citizenshipOptions,
  rifOptions,
  workScheduleOptions,
  retirementPlanOptions,
  annuitantOptions,
  payRateOptions,
  fegliOptions,
  funClassOptions,
  edLevelOptions,
  academicDisciplineOptions,
  vetStatusOptions,
  supervisorStatusOptions,
} from "../sf52/common/options";
import { concatFields } from "./common/util";
import {
  employeeDataLookupUrl,
  orgCodeLookupUrl,
  dutyStationLookupUrl,
  orgDeptLookupUrl,
  occSeriesLookupUrl,
  gradesLookupUrl,
} from "./common/lookupUrls";
import Sf52Remarks from "./Sf52Remarks";
import PositionLookup from "./PositionLookup";
import NoaSearchReact from "./Sf52NoaSearch/NoaSearchReact";
import Sf52Position from "./Sf52Position";
import SignatureRow from "./common/SignatureRow";
import Sf52Fesi from "./Sf52Fesi";
import ErrorMsg from "./common/ErrorMsg";
import PayloadPreview from "../../common/Util/PayloadPreview";
import ErrorBoundary from "../../common/ErrorBoundary/ErrorBoundary";
import CodeField from "./common/CodeField";
import { formatDate } from "../../common/Util/DateUtil";
import "./styles/sf52Styles.css";

const Sf52 = (props) => {
  const {
    onScroll,
    onSave,
    saving,
    formApi,
    saveForm,
    lockState,
    onLock,
    locking,
    permissions,
    formState: {
      initialValues: {
        formResponse: { data: initData, signatures: initSignatures },
      },
      values: {
        form: formName,
        controlNumber,
        formResponse,
        formResponse: {
          data,
          data: {
            CODE_5A,
            EMP_NAME,
            EMP_FIRST_NAME,
            EMP_LAST_NAME,
            EMP_MIDDLE_NAME,
            EMP_SSN,
            EMP_DOB,
            employeeName,
            employeeFirstName,
            employeeLastName,
            employeeMiddleName,
            employeeSsn,
            employeeBirthDate,
            REMARKSF50,
            WRKSCHCODE,
            RETIRECODE,
            ANNCODE,
            PRDCODE,
            FEGLICODE,
            VETSTACD,
            SUPSTCD,
            SRVCMDATE,
            EFFEDATE,
          },
          signatures: { AUTH_SIGN_ACT_AUTH, AUTH_SIGN_ACT_REQ },
          formContext: { roleType, employeeId },
        },
      },
    },
  } = props;

  const [empData, setEmpData] = useState([]);
  const [showAllValues, setShowAllValues] = useState(false);
  const [nfcError, setNfcError] = useState(null);

  useEffect(() => {
    const getEmpData = async () => {
      const empDataResult = await fetchData(employeeDataLookupUrl);
      setEmpData([...empDataResult]);
    };
    getEmpData();
  }, []);
  // 0 exempt

  const form = useForm();

  useEffect(() => {
    if (
      (!EMP_FIRST_NAME && EMP_FIRST_NAME !== "") ||
      (!EMP_LAST_NAME && EMP_LAST_NAME !== "") ||
      (!EMP_MIDDLE_NAME && EMP_MIDDLE_NAME !== "") ||
      (!EMP_SSN && EMP_SSN !== "") ||
      (!EMP_DOB && EMP_DOB !== "")
    ) {
      form.batch(() => {
        form.change(withPath("EMP_FIRST_NAME"), employeeFirstName);
        form.change(withPath("EMP_MIDDLE_NAME"), employeeMiddleName);
        form.change(withPath("EMP_LAST_NAME"), employeeLastName);
        form.change(withPath("EMP_NAME"), `${employeeFirstName} ${employeeLastName} ${employeeMiddleName}`);
        form.change(withPath("EMP_SSN"), employeeSsn);
        form.change(withPath("EMP_DOB"), employeeBirthDate);
      });
    }
  }, [
    EMP_FIRST_NAME,
    EMP_LAST_NAME,
    EMP_MIDDLE_NAME,
    EMP_SSN,
    EMP_DOB,
    employeeFirstName,
    employeeMiddleName,
    employeeLastName,
    employeeSsn,
    employeeBirthDate,
    form,
  ]);

  const distAppnCd = empData[0]?.dist_appn_cd || "";
  const distSubLev = empData[0]?.dist_sub_lev || "";

  const apprCodeValue = distAppnCd && distSubLev ? `${distAppnCd}-${distSubLev}` : distAppnCd || distSubLev || "";

  const positionFieldsMap = [
    { fieldName: "FLSACODE", empValue: empData[0]?.flsa || "" },
    { fieldName: "BARGUNIT", empValue: empData[0]?.bus || "" },
    { fieldName: "APPRCODE", empValue: apprCodeValue || "" },
    { fieldName: "DUTYSTCODE", empValue: empData[0]?.duty_station || "" },
    {
      fieldName: "DUTYSTATION",
      empValue: concatFields([empData[0]?.territory, empData[0]?.state_name, empData[0]?.city_name]) || "",
    },
    { fieldName: "FUNCLASS", empValue: "" }, // none
  ];

  const rifValueNameMap = rifOptions.find((rif) => rif.value == empData[0]?.vet_pref_rif);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  };

  const employeeFieldsMap = [
    { fieldName: "VETPREF", empValue: empData[0]?.vet_pref_cd || "" },
    { fieldName: "TENURE", empValue: empData[0]?.tenure_group || "" },
    { fieldName: "AGENCYCD", empValue: "" }, // none
    { fieldName: "AGYUSE", empValue: "" }, // none
    { fieldName: "RIFCHK", empValue: `${rifValueNameMap?.value} ${rifValueNameMap?.name}` || "" },
    { fieldName: "FEGLICODE", empValue: empData[0]?.li_cov_code || "" },
    { fieldName: "FEGLI", empValue: "" }, // none
    { fieldName: "ANNCODE", empValue: empData[0]?.annuit_ind || "" },
    { fieldName: "ANNINDIC", empValue: "" }, // none
    { fieldName: "PRDCODE", empValue: empData[0]?.pay_rate_det || "" },
    { fieldName: "PYRATDET", empValue: "" }, // none
    { fieldName: "RETIRECODE", empValue: empData[0]?.rt_pln_cde || "" },
    { fieldName: "RETIREPLAN", empValue: "" }, // none
    { fieldName: "SRVCMDATE", empValue: formatDate(empData[0]?.scd_lv) || "" },
    { fieldName: "WRKSCHCODE", empValue: empData[0]?.work_schedule || "" },
    { fieldName: "WRKSCHED", empValue: "" }, // none
    { fieldName: "PTHOURS", empValue: empData[0]?.pt_biweekly_hrs || "" },
    { fieldName: "EDLEVEL", empValue: empData[0]?.edu_level || "" },
    { fieldName: "CITIZENSHIP", empValue: empData[0]?.citizensp_cd || "" },
    { fieldName: "VETSTACD", empValue: empData[0]?.vets_status || "" },
    { fieldName: "SUPSTCD", empValue: empData[0]?.pos_supv_cd || "" },
  ];

  const fieldsMap = [...positionFieldsMap, ...employeeFieldsMap];

  const handleToggleValues = () => setShowAllValues(!showAllValues);

  const displayStoredValue = (name, fieldsMap) => {
    const path = withPath(name);
    const field = useField(path);
    const value = fieldsMap.find((e) => e.fieldName === name)?.empValue;
    if (showAllValues && value) {
      return <span className="originalVal text-sm mt-1">Stored value: {value}</span>; //todo
    }
    return null;
  };

  const updateDutyStationFields = (selectedRow) => {
    const cityName = selectedRow.city_name || null;
    const dutyStationLocation = [
      selectedRow.duty_stn_name,
      selectedRow.country_cd,
      selectedRow.ctry_state_desc,
      cityName,
    ];
    form.batch(() => {
      form.change(withPath("DUTYSTATION"), concatFields(dutyStationLocation));
      form.change(withPath("DUTYSTCODE"), selectedRow.duty_stn_cd);
    });
  };

  const prePopulateFields = (fieldsMap) => {
    form.batch(() => {
      fieldsMap.forEach((field) => {
        if (form.getFieldState(withPath(field.fieldName))?.value === undefined) {
          form.change(withPath(field.fieldName), field.empValue);
        }
      });
    });
  };

  useEffect(() => {
    if (empData.length) {
      prePopulateFields(employeeFieldsMap);
      prePopulateFields(positionFieldsMap);
    }
  }, [employeeFieldsMap, positionFieldsMap, empData]);

  useEffect(() => {
    const fullName = `${EMP_LAST_NAME}, ${EMP_FIRST_NAME}, ${EMP_MIDDLE_NAME}`;
    form.change(withPath("EMP_NAME"), fullName);
  }, [EMP_FIRST_NAME, EMP_LAST_NAME, EMP_MIDDLE_NAME]);

  const getClearText = (options, code) => options.find((option) => option.value === code)?.name;
  // populate clear text
  useEffect(() => {
    // const workScheduleText = getClearText(workScheduleOptions, WRKSCHCODE);
    // const retirementText = getClearText(retirementPlanOptions, RETIRECODE);
    const annuitantText = getClearText(annuitantOptions, ANNCODE);
    // const payRateText = getClearText(payRateOptions, PRDCODE);
    // const fegliText = getClearText(fegliOptions, FEGLICODE);
    // const vetStatusText = getClearText(vetStatusOptions, VETSTACD);
    // const supervisorStatusText = getClearText(supervisorStatusOptions, SUPSTCD);
    // form.change(withPath("WRKSCHED"), workScheduleText);
    // form.change(withPath("RETIREPLAN"), retirementText);
    form.change(withPath("ANNINDIC"), annuitantText);
    // form.change(withPath("PYRATDET"), payRateText);
    // form.change(withPath("FEGLI"), fegliText);
    // form.change(withPath("VETSTATUS"), vetStatusText);
    // form.change(withPath("SUPVSTATUS"), supervisorStatusText);
  }, [WRKSCHCODE, RETIRECODE, ANNCODE, FEGLICODE, PRDCODE, VETSTACD, SUPSTCD]);

  const isNameChangeCode = CODE_5A == 780;

  // populate action req and action auth signature info
  useEffect(() => {
    if (AUTH_SIGN_ACT_REQ.signed) {
      form.change(withPath("ACTREQNAME"), AUTH_SIGN_ACT_REQ.signedBy);
      form.change(withPath("ACTREQTITLE"), AUTH_SIGN_ACT_REQ.signerTitle);
    } else {
      form.change(withPath("ACTREQNAME"), "");
      form.change(withPath("ACTREQTITLE"), "");
    }
    if (AUTH_SIGN_ACT_AUTH.signed) {
      form.change(withPath("AUTHNAME"), AUTH_SIGN_ACT_AUTH.signedBy);
      form.change(withPath("AUTHTITLE"), AUTH_SIGN_ACT_AUTH.signerTitle);
    } else {
      form.change(withPath("AUTHNAME"), "");
      form.change(withPath("AUTHTITLE"), "");
    }
  }, [AUTH_SIGN_ACT_AUTH, AUTH_SIGN_ACT_REQ]);

  // sync effective date with case info
  useEffect(() => {
    if (EFFEDATE && EFFEDATE !== "") {
      const formatEffDate = formatDate(EFFEDATE);
      form.change(withPath("EFFEDATE"), formatEffDate);
    }
  }, [EFFEDATE]);

  return (
    <div className="sf52-container">
      <ErrorBoundary>
        <BsForm className="space-y-6" id={`${form}`}>
          {/*<AutoSave*/}
          {/*  formResponse={formResponse}*/}
          {/*  formLabel={formName}*/}
          {/*  controlNumber={controlNumber}*/}
          {/*  onSave={saveForm}*/}
          {/*  formApi={formApi}*/}
          {/*/>*/}

          {/* Header */}
          {/* Form Header */}
          <header className="sf52-header">
            <div className="sf52-header-top">
              <div className="sf52-form-number">Standard Form 52</div>
              <div className="sf52-header-meta">Rev. 7/91</div>
            </div>
            <h1 className="sf52-title">REQUEST FOR PERSONNEL ACTION</h1>
            <div className="sf52-header-subtitle">
              U.S. Office of Personnel Management
              <br />
              FPM Supp. 296-33, Subch. 4
            </div>
          </header>
          <div className="flex justify-between items-center">
            <ErrorMsg />
          </div>

          {/* Part A */}
          <div className="sf52-sections-container">
            {/* Top Row - Parts A and B */}
            <div className="sf52-main-row">
              {/* Part A */}
              <div className="sf52-col">
                <section className="sf52-section">
                  <div className="sf52-section-content">
                    <Card className="shadow-sm mb-4">
                      <CardBody>
                        <div className="sf52-section-header">
                          <CardTitle tag="h4" className="text-lg font-medium mb-4">
                            PART A - Requesting Office
                          </CardTitle>
                          <p className="text-muted">(Also complete Part B, Items 1, 7-22, 32, 33, 36, and 39.)</p>
                        </div>
                        {/* Row 1 */}
                        <Row form className="mt-3">
                          {/* 1. Actions Requested */}
                          <Col md={3}>
                            <Label for={withPath("ACTSREQ")} className="block text-sm font-medium text-gray-700">
                              1. Actions Requested
                            </Label>
                            <FFTextInput
                              name={withPath("ACTSREQ")}
                              maxLength={78}
                              placeholder="Enter the action requested"
                              validationHint={charCount(78)}
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>

                          {/* 2. Request Number */}
                          <Col md={3}>
                            <Label for={withPath("REQNO")} className="block text-sm font-medium text-gray-700">
                              2. Request Number
                            </Label>
                            <FFTextInput
                              name={withPath("REQNO")}
                              maxLength={13}
                              placeholder="Enter request number"
                              validationHint={charCount(13)}
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>

                          {/* 3. For Additional Information Call (Name) */}
                          <Col md={2}>
                            <Label for={withPath("INFONAME")} className="block text-sm font-medium text-gray-700">
                              3. For Additional Info (Name)
                            </Label>
                            <FFTextInput
                              name={withPath("INFONAME")}
                              maxLength={55}
                              placeholder="Contact Name"
                              validationHint={charCount(55)}
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>

                          {/* 3. Telephone Number */}
                          <Col md={2}>
                            <Label for={withPath("INFOPHONE")} className="block text-sm font-medium text-gray-700">
                              Telephone Number
                            </Label>
                            <FFTextInput
                              name={withPath("INFOPHONE")}
                              maxLength={24}
                              placeholder="(XXX) XXX-XXXX"
                              validationHint={charCount(24)}
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>

                          {/* 4. Proposed Effective Date */}
                          <Col md={2}>
                            <Label for={withPath("PROEFFEDATE")} className="block text-sm font-medium text-gray-700">
                              4. Proposed Effective Date
                            </Label>
                            <DateInputWithErrorBoundary
                              name={withPath("PROEFFEDATE")}
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>
                        </Row>

                        {/* Row 3 - Action Requested By and Authorized By */}
                        <Row form className="mt-4 border-top pt-4">
                          <Col md={6}>
                            <Card className="p-3 shadow-sm">
                              <h6 className="font-weight-bold">5. Action Requested By</h6>
                              <Label for={withPath("ACTREQNAME")}>Typed Name</Label>
                              <FFTextInput
                                name={withPath("ACTREQNAME")}
                                maxLength={35}
                                placeholder="Enter name"
                                validationHint={charCount(35)}
                                className="form-control mb-2"
                              />
                              <Label for={withPath("ACTREQTITLE")}>Title</Label>
                              <FFTextInput
                                name={withPath("ACTREQTITLE")}
                                maxLength={60}
                                placeholder="Enter title"
                                validationHint={charCount(60)}
                                className="form-control mb-3"
                              />
                              <Field name={withSignPath("AUTH_SIGN_ACT_REQ")}>
                                {({ input }) => (
                                  <ESignature
                                    label="Signature"
                                    onSave={(e, signerTitle) => saveForm(e, formApi, signerTitle)}
                                    {...input.value}
                                    formRoleType={roleType}
                                    disabled={!permissions.includes("form_canESignForm")}
                                  />
                                )}
                              </Field>
                            </Card>
                          </Col>

                          <Col md={6}>
                            <Card className="p-3 shadow-sm">
                              <h6 className="font-weight-bold">6. Action Authorized By</h6>
                              <Label for={withPath("AUTHNAME")}>Typed Name</Label>
                              <FFTextInput
                                name={withPath("AUTHNAME")}
                                maxLength={35}
                                placeholder="Enter name"
                                validationHint={charCount(35)}
                                className="form-control mb-2"
                              />
                              <Label for={withPath("AUTHTITLE")}>Title</Label>
                              <FFTextInput
                                name={withPath("AUTHTITLE")}
                                maxLength={60}
                                placeholder="Enter title"
                                validationHint={charCount(60)}
                                className="form-control mb-3"
                              />
                              <Field name={withSignPath("AUTH_SIGN_ACT_AUTH")}>
                                {({ input }) => (
                                  <ESignature
                                    label="Signature"
                                    onSave={(e, signerTitle) => saveForm(e, formApi, signerTitle)}
                                    {...input.value}
                                    formRoleType={roleType}
                                    disabled={!permissions.includes("form_canESignForm")}
                                  />
                                )}
                              </Field>
                            </Card>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    {/* <Card className="bg-gray-50">
                        <div className="p-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <FFTextInput
                                  label="1. Actions Requested"
                                  name={withPath("ACTSREQ")}
                                  maxLength={78}
                                  className="h-9"
                                  validationHint={charCount(78)}
                                />
                              </div>
                              <div>
                                <FFTextInput
                                  label="2. Request Number"
                                  name={withPath("REQNO")}
                                  maxLength={13}
                                  className="h-9"
                                  validationHint={charCount(13)}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <FFTextInput
                                  label="3. For Additional Information Call (Name)"
                                  name={withPath("INFONAME")}
                                  maxLength={55}
                                  className="h-9"
                                  validationHint={charCount(55)}
                                />
                              </div>
                              <div>
                                <FFTextInput
                                  label="(Telephone Number)"
                                  name={withPath("INFOPHONE")}
                                  maxLength={24}
                                  className="h-9"
                                  validationHint={charCount(24)}
                                />
                              </div>
                              <div>
                                <label style={{ marginLeft: "1rem" }}>4. Proposed Effective Date</label>
                                <DateInputWithErrorBoundary name={withPath("PROEFFEDATE")} className="h-9" />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                              <div className="space-y-4">
                                <div>
                                  <FFTextInput
                                    label="5. Action Requested By (Typed Name, Title, Signature, and Request Date)"
                                    name={withPath("ACTREQNAME")}
                                    maxLength={35}
                                    className="h-9 mb-2"
                                    validationHint={charCount(35)}
                                  />
                                  <FFTextInput
                                    name={withPath("ACTREQTITLE")}
                                    maxLength={60}
                                    className="h-9"
                                    validationHint={charCount(60)}
                                  />
                                </div>
                                <Field name={withSignPath("AUTH_SIGN_ACT_REQ")}>
                                  {({ input }) => (
                                    <ESignature
                                      label="Signature"
                                      onSave={(e, signerTitle) => saveForm(e, formApi, signerTitle)}
                                      {...input.value}
                                      formRoleType={roleType}
                                      disabled={!permissions.includes("form_canESignForm")}
                                    />
                                  )}
                                </Field>
                              </div>

                              <div className="space-y-4 border-l border-gray-200 pl-6">
                                <div>
                                  <FFTextInput
                                    label="6. Action Authorized By (Typed Name, Title, Signature, and Concurrence Date)"
                                    name={withPath("AUTHNAME")}
                                    maxLength={35}
                                    className="h-9 mb-2"
                                    validationHint={charCount(35)}
                                  />
                                  <FFTextInput
                                    name={withPath("AUTHTITLE")}
                                    maxLength={60}
                                    className="h-9"
                                    validationHint={charCount(60)}
                                  />
                                </div>
                                <Field name={withSignPath("AUTH_SIGN_ACT_AUTH")}>
                                  {({ input }) => (
                                    <ESignature
                                      label="Signature"
                                      onSave={(e, signerTitle) => saveForm(e, formApi, signerTitle)}
                                      {...input.value}
                                      formRoleType={roleType}
                                      disabled={!permissions.includes("form_canESignForm")}
                                    />
                                  )}
                                </Field>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card> */}
                  </div>
                </section>
              </div>

              <div className="sf52-col">
                <section className="sf52-section">
                  <div className="sf52-section-content">
                    {/* Part B */}
                    <Card className="bg-gray-50 mb-4 p-3 shadow-sm">
                      <div className="p-6">
                        <div className="sf52-section-header">
                          <h4 className="text-lg font-medium mb-4">
                            PART B - For Preparation of SF50 (Use only codes in FPM Supplement 292-1. Show all dates in
                            month-day-year order.)
                          </h4>
                        </div>
                        {/* Row 1: Employee Name Fields */}
                        <Row form className="mt-3">
                          <Col md={2}>
                            <Label for={withPath("EMP_FIRST_NAME")} className="font-weight-bold">
                              1. First Name
                            </Label>
                            <FFTextInput
                              name={withPath("EMP_FIRST_NAME")}
                              placeholder="Enter first name"
                              readOnly={!isNameChangeCode}
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>
                          <Col md={2}>
                            <Label for={withPath("EMP_LAST_NAME")} className="font-weight-bold">
                              Last Name
                            </Label>
                            <FFTextInput
                              name={withPath("EMP_LAST_NAME")}
                              placeholder="Enter last name"
                              readOnly={!isNameChangeCode}
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>
                          <Col md={2}>
                            <Label for={withPath("EMP_MIDDLE_NAME")} className="font-weight-bold">
                              Middle Name
                            </Label>
                            <FFTextInput
                              name={withPath("EMP_MIDDLE_NAME")}
                              placeholder="Enter middle name"
                              readOnly={!isNameChangeCode}
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>

                          <Col md={2}>
                            <Label for={withPath("EMP_SSN")} className="font-weight-bold">
                              2. Social Security Number
                            </Label>
                            <FFTextInput
                              name={withPath("EMP_SSN")}
                              maxLength={11}
                              placeholder="XXX-XX-XXXX"
                              readOnly
                              validationHint={charCount(11)}
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>
                          <Col md={2}>
                            <Label for={withPath("EMP_DOB")} className="font-weight-bold">
                              3. Date of Birth
                            </Label>
                            <DateInputWithErrorBoundary
                              name={withPath("EMP_DOB")}
                              placeholder="MM/DD/YYYY"
                              readOnly
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>
                          <Col md={2}>
                            <Label for={withPath("EFFEDATE")} className="font-weight-bold">
                              4. Effective Date
                            </Label>
                            <DateInputWithErrorBoundary
                              name={withPath("EFFEDATE")}
                              placeholder="MM/DD/YYYY"
                              className="form-control hrsa-sf52-input"
                            />
                          </Col>
                        </Row>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                          <Card className="shadow-sm border rounded-lg card-lg">
                            <div className="w-full space-y-4 border-l border-gray-200 pl-6">
                              <Sf52Action headingText="FIRST ACTION" actionNumber={5} />
                            </div>
                          </Card>
                          <Card className="shadow-sm border rounded-lg card-lg">
                            <div className="w-full space-y-4 border-l border-gray-200 pl-6">
                              <Sf52Action headingText="SECOND ACTION" actionNumber={6} />
                            </div>
                          </Card>
                        </div>

                        <div className="mt-6">
                          <Sf52Position
                            CODE_5A={CODE_5A}
                            handleToggleValues={handleToggleValues}
                            showAllValues={showAllValues}
                            displayStoredValue={displayStoredValue}
                            prePopulateFields={prePopulateFields}
                          />
                        </div>
                      </div>
                    </Card>
                    {/* <Card className="bg-gray-50">
                        <div className="p-6">
                          <div className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <FFTextInput
                                  label="1. First Name"
                                  name={withPath("EMP_FIRST_NAME")}
                                  readOnly={!isNameChangeCode}
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <FFTextInput
                                  label="Last Name"
                                  name={withPath("EMP_LAST_NAME")}
                                  readOnly={!isNameChangeCode}
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <FFTextInput
                                  label="Middle Name"
                                  name={withPath("EMP_MIDDLE_NAME")}
                                  readOnly={!isNameChangeCode}
                                  className="h-9"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <FFTextInput
                                  label="2. Social Security Number"
                                  name={withPath("EMP_SSN")}
                                  readOnly
                                  maxLength={11}
                                  className="h-9"
                                  validationHint={charCount(11)}
                                />
                              </div>
                              <div>
                                <DateInputWithErrorBoundary
                                  label="3. Date of Birth"
                                  name={withPath("EMP_DOB")}
                                  readOnly
                                  className="h-9"
                                />
                              </div>
                              <div>
                                <DateInputWithErrorBoundary
                                  label="4. Effective Date"
                                  name={withPath("EFFEDATE")}
                                  className="h-9"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card> */}
                    {/* <Card className="bg-gray-50">
                        <div className="p-6">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <Sf52Action headingText="FIRST ACTION" actionNumber={5} />
                            </div>
                            <div className="border-l border-gray-200 pl-6">
                              <Sf52Action headingText="SECOND ACTION" actionNumber={6} />
                            </div>
                          </div>
                          <div className="mt-6">
                            <Sf52Position
                              CODE_5A={CODE_5A}
                              handleToggleValues={handleToggleValues}
                              showAllValues={showAllValues}
                              displayStoredValue={displayStoredValue}
                              prePopulateFields={prePopulateFields}
                            />
                          </div>
                        </div>
                      </Card> */}
                  </div>
                </section>
              </div>
              <section className="sf52-section">
                <div className="sf52-section-content">
                  {/* Employee Data Section */}
                  <Card className="bg-gray-50">
                    <div className="p-6">
                      <div className="sf52-section-header">
                        <h4 className="text-lg font-medium mb-4">EMPLOYEE DATA</h4>
                      </div>
                      <div className="space-y-6">
                        <Row>
                          <Col>
                            <OptionSelect
                              label="23. Veterans Preference"
                              selectOptions={vetPreferenceOptions}
                              path={"VETPREFDESC"}
                              displayOptions={false}
                            />
                            {displayStoredValue("VETPREFDESC", fieldsMap)}
                            <CodeField dropdownPath={"VETPREFDESC"} codePath={"VETPREF"} />
                          </Col>
                          <Col>
                            <OptionSelect
                              label="24. Tenure"
                              selectOptions={tenureOptions}
                              path={"TENUREDESC"}
                              displayOptions={false}
                            />
                            {displayStoredValue("TENUREDESC", fieldsMap)}
                            <CodeField dropdownPath={"TENUREDESC"} codePath={"TENURE"} />
                          </Col>
                          <Col>
                            <FFTextInput
                              label="25. Agency Use"
                              name={withPath("AGENCYCD")}
                              maxLength={3}
                              className="h-9"
                              validationHint={charCount(3)}
                            />
                            {displayStoredValue("AGENCYCD", fieldsMap)}
                            <FFTextInput
                              name={withPath("AGYUSE")}
                              maxLength={8}
                              className="h-9"
                              validationHint={charCount(8)}
                            />
                            {displayStoredValue("AGYUSE", fieldsMap)}
                          </Col>
                          <Col>
                            <Field name={withPath("RIFCHK")}>
                              {({ input }) => (
                                <div className="flex gap-4">
                                  <div className="">
                                    <label className="hrsa-sf52-label">
                                      26. Veterans Pref for RIF
                                      <div className="hrsa-sf52-radio-wrapper">
                                        <div className="hrsa-sf52-radio-group">
                                          <div className="hrsa-sf52-radio-item">
                                            <input
                                              type="radio"
                                              value="yes"
                                              checked={input.value === "yes"}
                                              onChange={() => input.onChange("yes")}
                                            />
                                            <label htmlFor="yes" className="hrsa-sf52-radio-label">
                                              YES
                                            </label>
                                          </div>
                                          <div className="hrsa-sf52-radio-item">
                                            <input
                                              type="radio"
                                              value="no"
                                              checked={input.value === "no"}
                                              onChange={() => input.onChange("no")}
                                            />
                                            <label htmlFor="no" className="hrsa-sf52-radio-label">
                                              NO
                                            </label>
                                          </div>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                </div>
                              )}
                            </Field>
                            {displayStoredValue("RIFCHK", fieldsMap)}
                          </Col>
                        </Row>

                        <div className="grid grid-cols-3 gap-4">
                          <Col>
                            <div className="space-y-2">
                              <OptionSelect
                                label="27. FEGLI"
                                selectOptions={fegliOptions}
                                path={"FEGLI"}
                                displayOptions={false}
                                valuesOnly={false}
                              />
                              {displayStoredValue("FEGLI", fieldsMap)}
                            </div>
                            <CodeField dropdownPath={"FEGLI"} codePath={"FEGLICODE"} />
                          </Col>
                          <Col>
                            <div className="space-y-2">
                              <OptionSelect
                                label="28. Annuitant Indicator"
                                selectOptions={annuitantOptions}
                                path={"ANNCODE"}
                                displayOptions={false}
                                valuesOnly={false}
                              />
                              {displayStoredValue("ANNCODE", fieldsMap)}
                            </div>
                          </Col>
                          <div>
                            <Row>
                              <Col>
                                <OptionSelect
                                  label="29. Pay Rate Determinant"
                                  selectOptions={payRateOptions}
                                  path={"PYRATDET"}
                                  displayOptions={false}
                                  valuesOnly={false}
                                />
                                {displayStoredValue("PYRATDET", fieldsMap)}
                                <CodeField dropdownPath={"PYRATDET"} codePath={"PRDCODE"} />
                              </Col>
                              <Col>
                                <OptionSelect
                                  label="30. Retirement Plan"
                                  selectOptions={retirementPlanOptions}
                                  path={"RETIREPLAN"}
                                  displayOptions={false}
                                  valuesOnly={false}
                                />
                                {displayStoredValue("RETIREPLAN", fieldsMap)}
                                <CodeField dropdownPath={"RETIREPLAN"} codePath={"RETIRECODE"} />
                              </Col>
                            </Row>
                          </div>
                        </div>

                        <Row>
                          <Col xs={3}>
                            <DateInputWithErrorBoundary
                              label="31. Service Comp. Date(Leave)"
                              labelPosition="top"
                              name={withPath("SRVCMDATE")}
                            />
                            {displayStoredValue("SRVCMDATE", fieldsMap)}
                          </Col>
                          <Col>
                            <OptionSelect
                              label="32. Work Schedule"
                              path={"WRKSCHED"}
                              selectOptions={workScheduleOptions}
                              displayOptions={false}
                              valuesOnly={false}
                            />
                            {displayStoredValue("WRKSCHED", fieldsMap)}
                            <CodeField dropdownPath={"WRKSCHED"} codePath={"WRKSCHODE"} />
                          </Col>
                          <Col>
                            <FFTextInput
                              validationHint={charCount(2)}
                              label="33. Part-Time Hours Per Biweekly Pay Period"
                              name={withPath("PTHOURS")}
                              maxLength={2}
                            />
                            {displayStoredValue("PTHOURS", fieldsMap)}
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Card>

                  {/* Position Data Section */}
                  <Card className="bg-gray-50 mb-4 p-3 shadow-sm">
                    <div className="sf52-section-header">
                      <h4 className="text-lg font-medium mb-4">POSITION DATA</h4>
                    </div>
                    <div className="card-body">
                      <Row form className="mt-3">
                        <Col md={3}>
                          <OptionSelect
                            path="POSOCCCODE"
                            selectOptions={positionOccupiedOptions}
                            displayOptions={false}
                            className="form-control hrsa-sf52-input"
                            label="34. Position Occupied"
                          />
                        </Col>

                        <Col md={3}>
                          <OptionSelect
                            path="FLSACODE"
                            selectOptions={flsaCategoryOptions}
                            displayOptions={false}
                            className="form-control hrsa-sf52-input"
                            label="35. FLSA Category"
                          />
                          {displayStoredValue("FLSACODE", fieldsMap)}
                        </Col>

                        <Col md={3}>
                          <FFTextInput
                            name={withPath("APPRCODE")}
                            maxLength={30}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(30)}
                            label="36. Appropriation Code"
                          />
                          {displayStoredValue("APPRCODE", fieldsMap)}
                        </Col>

                        <Col md={3}>
                          <FFTextInput
                            name={withPath("BARGUNIT")}
                            maxLength={13}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(13)}
                            label="37. Bargaining Unit Status"
                          />
                          {displayStoredValue("BARGUNIT", fieldsMap)}
                        </Col>
                      </Row>

                      <Row form className="mt-3">
                        <Col md={6}>
                          <NoaSearchReact updateFields={updateDutyStationFields} dataUrl={dutyStationLookupUrl} />
                        </Col>
                      </Row>

                      <Row form className="mt-3">
                        <Col>
                          <FFTextInput
                            name={withPath("DUTYSTCODE")}
                            maxLength={30}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(30)}
                            label="38. Duty Station Code"
                          />
                          {displayStoredValue("DUTYSTCODE", fieldsMap)}
                        </Col>

                        <Col>
                          <FFTextInput
                            name={withPath("DUTYSTATION")}
                            maxLength={60}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(60)}
                            label="39. Duty Station"
                          />
                          {displayStoredValue("DUTYSTATION", fieldsMap)}
                        </Col>

                        <Col>
                          <FFTextInput
                            name={withPath("AGYDATA")}
                            maxLength={15}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(15)}
                            label="40. Agency Data"
                          />
                        </Col>

                        <Col>
                          <FFTextInput
                            name={withPath("DATAA")}
                            maxLength={15}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(15)}
                            label="41. New Position"
                          />
                        </Col>

                        <Col>
                          <FFTextInput
                            name={withPath("DATAB")}
                            maxLength={15}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(15)}
                            label="42. Regraded Position"
                          />
                        </Col>
                        <Col>
                          <FFTextInput
                            name={withPath("DATAC")}
                            maxLength={15}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(15)}
                            label="43. Vice:"
                          />
                        </Col>
                      </Row>
                      <Row form className="mt-3">
                        <Col>
                          <FFTextInput
                            name={withPath("DATAD")}
                            maxLength={40}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(40)}
                            label="44. Qualification Standard Used"
                          />
                        </Col>

                        <Col>
                          <OptionSelect
                            path="EDLEVEL"
                            selectOptions={edLevelOptions}
                            displayOptions={false}
                            valuesOnly={false}
                            className="form-control hrsa-sf52-input"
                            label="45. Educational Level"
                          />
                          {displayStoredValue("EDLEVEL", fieldsMap)}
                        </Col>

                        <Col>
                          <FFTextInput
                            name={withPath("DEGATTAN")}
                            maxLength={4}
                            className="form-control hrsa-sf52-input"
                            validationHint={charCount(4)}
                            label="46. Year Degree Level"
                          />
                        </Col>

                        <Col>
                          <OptionSelect
                            path="ACDDISCP"
                            selectOptions={academicDisciplineOptions}
                            displayOptions={false}
                            valuesOnly={false}
                            className="form-control hrsa-sf52-input"
                            label="47. Academic Discipline"
                          />
                        </Col>

                        <Col>
                          <OptionSelect
                            path="FUNCLASS"
                            selectOptions={funClassOptions}
                            displayOptions={false}
                            valuesOnly={false}
                            className="form-control hrsa-sf52-input"
                            label="48. Functional Class"
                          />
                          {displayStoredValue("FUNCLASS", fieldsMap)}
                        </Col>
                      </Row>
                      <Row form className="mt-3">
                        <Col>
                          <OptionSelect
                            selectOptions={citizenshipOptions}
                            path="CITIZENSHIP"
                            displayOptions={false}
                            className="form-control hrsa-sf52-input"
                            label="49. Citizenship"
                          />
                          {displayStoredValue("CITIZENSHIP", fieldsMap)}
                        </Col>

                        <Col>
                          <OptionSelect
                            path="VETSTACD"
                            selectOptions={vetStatusOptions}
                            displayOptions={false}
                            valuesOnly={false}
                            className="form-control mb-2"
                            label="50. Veterans Status"
                          />
                          {displayStoredValue("VETSTACD", fieldsMap)}
                        </Col>

                        <Col>
                          <OptionSelect
                            path="SUPSTCD"
                            selectOptions={supervisorStatusOptions}
                            displayOptions={false}
                            valuesOnly={false}
                            className="form-control mb-2"
                            label="51. Supervisory Status"
                          />
                          {displayStoredValue("SUPSTCD", fieldsMap)}
                        </Col>
                      </Row>
                    </div>
                  </Card>
                </div>
                <section className="sf52-section">
                  <div className="sf52-section-content">
                    {/* Reviews and Approvals Section */}
                    {/* Part C - Reviews and Approvals Section */}
                    <Card className="bg-gray-50 mb-4 p-3 shadow-sm">
                      <div className="p-6">
                        <div className="sf52-section-header">
                          <h4 className="text-lg font-medium mb-4">
                            PART C - Reviews and Approvals (Not to be used by requesting office.)
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <SignatureRow
                              officeCode={"OFCA"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type={"initial"}
                            />
                            <SignatureRow
                              officeCode={"OFCB"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type={"initial"}
                            />
                            <SignatureRow
                              officeCode={"OFCC"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type={"initial"}
                            />
                          </div>
                          <div className="space-y-4 border-l border-gray-200 pl-6">
                            <SignatureRow
                              officeCode={"OFCD"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type={"initial"}
                            />
                            <SignatureRow
                              officeCode={"OFCE"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type={"initial"}
                            />
                            <SignatureRow
                              officeCode={"OFCF"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type={"initial"}
                            />
                          </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <Card>
                            <p className="text-sm mb-4">
                              2. Approval: I certify that the information entered on this form is accurate and that the
                              proposed action is in compliance with statutory and regulatory requirements
                            </p>
                            <Field name={withSignPath("AUTH_SIGN_APP")}>
                              {({ input }) => (
                                <ESignature
                                  label="Signature"
                                  onSave={(e, signerTitle) => saveForm(e, formApi, signerTitle)}
                                  {...input.value}
                                  formRoleType={roleType}
                                  disabled={!permissions.includes("form_canESignForm")}
                                />
                              )}
                            </Field>
                          </Card>
                        </div>
                      </div>
                    </Card>
                    {/* <Card>
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <SignatureRow
                              officeCode={"OFCA"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type='INITIAL'
                            />
                            <SignatureRow
                              officeCode={"OFCB"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type='INITIAL'
                            />
                            <SignatureRow
                              officeCode={"OFCC"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type='INITIAL'
                            />
                          </div>
                          <div className="space-y-4 border-l border-gray-200 pl-6">
                            <SignatureRow
                              officeCode={"OFCD"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type='INITIAL'
                            />
                            <SignatureRow
                              officeCode={"OFCE"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type='INITIAL'
                            />
                            <SignatureRow
                              officeCode={"OFCF"}
                              permissions={permissions}
                              saveForm={saveForm}
                              roleType={roleType}
                              formApi={formApi}
                              type='INITIAL'
                            />
                          </div>
                        </div>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm mb-4">
                              2. Approval: I certify that the information entered on this form is accurate and that the
                              proposed action is in compliance with statutory and regulatory requirements
                            </p>
                          </div>
                          <div>
                            <Field name={withSignPath("AUTH_SIGN_APP")}>
                              {({ input }) => (
                                <ESignature
                                  label="Signature"
                                  onSave={(e, signerTitle) => saveForm(e, formApi, signerTitle)}
                                  {...input.value}
                                  formRoleType={roleType}
                                  disabled={!permissions.includes("form_canESignForm")}
                                />
                              )}
                            </Field>
                          </div>
                        </div>
                      </div>
                    </Card> */}
                  </div>
                </section>
                <div className="sf52-section-header">
                  <h4 className="text-lg font-medium mb-4">PART E - Employee Resignation/Retirement</h4>
                </div>

                <div className="sf52-section-content">
                  {/* Employee Resignation/Retirement Section */}
                  <Card className="bg-gray-50">
                    <div className="p-6">
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm mb-4">
                            Privacy Act Statement: You are requested to furnish a specific reason for your resignation
                            or retirement and a forwarding address. Your reason may be considered in any future decision
                            regarding your re-employment in the Federal service and may also be used to determine your
                            eligibility for unemployment compensation benefits. Your forwarding address will be used
                            primarily to mail you copies of any documents you should have or any pay or compensation to
                            which you are entitled.
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">1. Reason for Resignation/Retirement</label>
                          <p className="text-sm text-gray-600 mb-2">
                            NOTE: Your reasons are used in determining possible unemployment benefits. Please be
                            specific and avoid generalizations. Your resignation/retirement is effective at the end of
                            the day - midnight - unless you specify otherwise.
                          </p>
                          <FFTextInput
                            name={withPath("REASONS")}
                            type="textarea"
                            maxLength={1200}
                            className="h-32"
                            validationHint={charCount(1200)}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <DateInputWithErrorBoundary
                              label="2. Effective Date"
                              name={withPath("EFFEDATE2")}
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Field name={withSignPath("EMP_SIGN")}>
                              {({ input }) => (
                                <ESignature
                                  label="Employee Signature"
                                  onSave={(e, signerTitle) => saveForm(e, formApi, signerTitle)}
                                  {...input.value}
                                  formRoleType={roleType}
                                  disabled={!permissions.includes("form_canESignForm")}
                                />
                              )}
                            </Field>
                          </div>
                          <div>
                            <FFTextInput
                              label="5. Forwarding Address"
                              name={withPath("FRWADDR")}
                              maxLength={120}
                              className="h-9"
                              validationHint={charCount(120)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </section>
            </div>
          </div>
          <Card className="bg-gray-50">
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <p className="text-sm mb-4">
                    Privacy Act Statement: You are requested to furnish a specific reason for your resignation or
                    retirement and a forwarding address. Your reason may be considered in any future decision regarding
                    your re-employment in the Federal service and may also be used to determine your eligibility for
                    unemployment compensation benefits. Your forwarding address will be used primarily to mail you
                    copies of any documents you should have or any pay or compensation to which you are entitled.
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">1. Reason for Resignation/Retirement</label>
                  <p className="text-sm text-gray-600 mb-2">
                    NOTE: Your reasons are used in determining possible unemployment benefits. Please be specific and
                    avoid generalizations. Your resignation/retirement is effective at the end of the day - midnight -
                    unless you specify otherwise.
                  </p>
                  <FFTextInput
                    name={withPath("REASONS")}
                    type="textarea"
                    maxLength={1200}
                    className="h-32"
                    validationHint={charCount(1200)}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <DateInputWithErrorBoundary
                      label="2. Effective Date"
                      name={withPath("EFFEDATE2")}
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Field name={withSignPath("EMP_SIGN")}>
                      {({ input }) => (
                        <ESignature
                          label="Employee Signature"
                          onSave={(e, signerTitle) => saveForm(e, formApi, signerTitle)}
                          {...input.value}
                          formRoleType={roleType}
                          disabled={!permissions.includes("form_canESignForm")}
                        />
                      )}
                    </Field>
                  </div>
                  <div>
                    <FFTextInput
                      label="5. Forwarding Address"
                      name={withPath("FRWADDR")}
                      maxLength={120}
                      className="h-9"
                      validationHint={charCount(120)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {/* test start */}
          <div className="hrsa-sf52-container">
            <div className="hrsa-sf52-card">
              <div className="hrsa-sf52-card-content">
                <div className="hrsa-sf52-space-y">
                  <div className="hrsa-sf52-grid">
                    <div className="hrsa-sf52-space-y">
                      <label className="hrsa-sf52-label">
                        Note to Supervisors: Do you know of additional or conflicting reasons for the employee's
                        resignation/retirement?
                      </label>
                      <div className="hrsa-sf52-info-alert">
                        <span className="hrsa-sf52-info-text">
                          If "YES", please state these facts on a separate sheet and attach to SF52.
                        </span>
                      </div>
                    </div>
                    <div className="hrsa-sf52-radio-wrapper">
                      <div className="hrsa-sf52-radio-group">
                        <div className="hrsa-sf52-radio-item">
                          <input type="radio" id="yes" name="additionalInfo" className="hrsa-sf52-radio" value="yes" />
                          <label htmlFor="yes" className="hrsa-sf52-radio-label">
                            YES
                          </label>
                        </div>
                        <div className="hrsa-sf52-radio-item">
                          <input type="radio" id="no" name="additionalInfo" className="hrsa-sf52-radio" value="no" />
                          <label htmlFor="no" className="hrsa-sf52-radio-label">
                            NO
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hrsa-sf52-textarea-container">
                    <textarea
                      placeholder="Additional remarks..."
                      className="hrsa-sf52-textarea"
                      maxLength="1200"></textarea>
                    <p className="hrsa-sf52-char-count"></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hrsa-sf52-card">
              <div className="hrsa-sf52-card-header">
                <h4 className="text-lg font-medium mb-4">PART E - Employee Resignation/Retirement</h4>
              </div>

              <div className="hrsa-sf52-card-content">
                <div className="hrsa-sf52-space-y">
                  <div className="hrsa-sf52-notice-alert">
                    Privacy Act Statement: You are requested to furnish a specific reason for your resignation or
                    retirement and a forwarding address. Your reason may be considered in any future decision regarding
                    your re-employment in the Federal service and may also be used to determine your eligibility for
                    unemployment compensation benefits.
                  </div>
                  <div className="hrsa-sf52-space-y">
                    <div>
                      <label className="hrsa-sf52-label hrsa-sf52-label-bold">
                        1. Reason for Resignation/Retirement
                      </label>
                      <p className="hrsa-sf52-hint">
                        Your reasons are used in determining possible unemployment benefits. Please be specific and
                        avoid generalizations. Your resignation/retirement is effective at the end of the day - midnight
                        - unless you specify otherwise.
                      </p>
                      <div className="hrsa-sf52-textarea-container">
                        <textarea
                          className="hrsa-sf52-textarea"
                          maxLength="1200"
                          placeholder="Enter your reason here..."></textarea>
                        <p className="hrsa-sf52-char-count"></p>
                      </div>
                    </div>
                    <div className="hrsa-sf52-grid-3">
                      <div className="hrsa-sf52-input-group">
                        <label className="hrsa-sf52-label">2. Effective Date</label>
                        <input type="date" className="hrsa-sf52-input" />
                      </div>
                      <div className="hrsa-sf52-input-group">
                        <label className="hrsa-sf52-label">Employee Signature</label>
                        <div className="hrsa-sf52-signature-box"></div>
                      </div>
                      <div className="hrsa-sf52-input-group">
                        <label className="hrsa-sf52-label">5. Forwarding Address</label>
                        <input type="text" maxLength="120" placeholder="Enter address..." className="hrsa-sf52-input" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="sf52-section-content">
                {/* Remarks for SF50 */}
                <Card className="bg-gray-50">
                  <section className="sf52-section">
                    <div className="sf52-section-header">
                      <h4 className="text-lg font-medium mb-4">PART F - Remarks for SF50</h4>
                    </div>
                    <Sf52Remarks savedRemarks={REMARKSF50} />
                  </section>
                </Card>
              </div>
            </div>

            <div className="hrsa-sf52-card">
              <div className="hrsa-sf52-card-header">
                <h4 className="text-lg font-medium mb-4">PART F - Remarks for SF50</h4>
              </div>

              <div className="hrsa-sf52-card-content">
                <div className="hrsa-sf52-remarks-box"></div>
              </div>
            </div>
            <div>
              <section className="sf52-section">
                <div className="sf52-section-header">
                  <h4 className="text-lg font-medium mb-4">NFC Processing</h4>
                </div>
                <div className="sf52-section-content">
                  <Sf52Fesi noaCode={CODE_5A} setNfcError={setNfcError} nfcError={nfcError} />
                </div>
              </section>
            </div>

            <div className="hrsa-sf52-footer">
              <div className="hrsa-sf52-footer-left">
                <span>7:13</span>
                <span>CONTINUED ON REVERSE SIDE</span>
                <span>52-118</span>
              </div>
              <div className="hrsa-sf52-footer-right">
                <span>Editions Prior to 7/91 Are Not Usable After 6/30/93</span>
                <span>NSN 7540-01-333-6239</span>
              </div>
            </div>
          </div>

          {/* test end */}

          {/*/!* Footer *!/*/}
          {/*<footer className="sf52-footer">*/}
          {/*  <div className="sf52-footer-left">*/}
          {/*    <p>7:13</p>*/}
          {/*    <p>CONTINUED ON REVERSE SIDE</p>*/}
          {/*    <p>52-118</p>*/}
          {/*  </div>*/}
          {/*  <div className="sf52-footer-right">*/}
          {/*    <p>Editions Prior to 7/91 Are Not Usable After 6/30/93</p>*/}
          {/*    <p>NSN 7540-01-333-6239</p>*/}
          {/*  </div>*/}
          {/*</footer>*/}
        </BsForm>
      </ErrorBoundary>
      {/*<PayloadPreview />*/}
    </div>
  );
};
export default Sf52;
