import React, { useEffect, useState } from "react";
import { useForm, useField } from "react-final-form";
import {
  Col,
  Container,
  Card,
  CardBody,
  Row,
} from "reactstrap";
import FFTextInput from "../../common/FinalForm/FFTextInput";
import OptionSelect from "./common/OptionSelect";
import { withPath, charCount, concatFields } from "./common/util";
import {
  employeeDataLookupUrl,
  orgDeptLookupUrl,
  occSeriesLookupUrl,
  gradesLookupUrl,
  payPlansLookupUrl,
  positionDataUrl,
} from "./common/lookupUrls";
import NoaSearchReact from "./Sf52NoaSearch/NoaSearchReact";
import PayField from "./common/PayField";
import { stepOptions } from "./common/options";
import { fetchData } from "../../common/Util/DataProviderUtil";

import "./styles/sf52Styles.css";

const Sf52Position = ({
                        CODE_5A,
                        handleToggleValues,
                        showAllValues,
                        displayStoredValue,
                        prePopulateFields
                      }) => {
  const [empData, setEmpData] = useState([]);
  const [payBasis, setPayBasis] = useState("");

  // Fetch employee data on component mount
  useEffect(() => {
    const getEmpData = async () => {
      const empDataResult = await fetchData(employeeDataLookupUrl);
      setEmpData([...empDataResult]);
    };
    getEmpData();
  }, []);

  // Handle pay basis updates
  const frBasis = useField(withPath("FRBASIS"));
  const toBasis = useField(withPath("TOBASIS"));
  useEffect(() => {
    const pb = toBasis.input.value || frBasis.input.value || empData[0]?.salary_rate_code;
    setPayBasis(pb);
  }, [empData, toBasis.input.value, frBasis.input.value]);

  // Concatenate organization location fields
  const concatOrgLocation = concatFields([
    empData[0]?.dept_lvl_1,
    empData[0]?.dept_lvl_2,
    empData[0]?.dept_lvl_3,
    empData[0]?.dept_lvl_4,
    empData[0]?.dept_lvl_5,
    empData[0]?.dept_lvl_6,
    empData[0]?.dept_lvl_7,
    empData[0]?.dept_lvl_8,
    empData[0]?.dept_lvl_9,
  ]);

  // Field name definitions
  const toPositionFieldNames = [
    "TOPOSNO",
    "TOPOSNO1",
    "TOPAYPLAN",
    "TOCCCODE",
    "TOGRADE",
    "TOORG",
    "TOLOCATION",
    "TOSTEP",
    "TOSALARY",
    "TOBASIS",
    "TOBASICPAY",
    "TOLOCADJ",
    "TOADJPAY",
    "TOOTHRPAY",
  ];

  // Utility functions
  const formatSalary = (salary) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(salary);
  };

  const handleFlsa = (flsa) => (flsa == 0 || flsa === "E" ? "E" : "N");

  // Field mappings
  const fromPositionFieldsMap = [
    { fieldName: "FRPOSTLE", empValue: empData[0]?.pos_off_title || "" },
    {
      fieldName: "FRPOSNO",
      empValue: [empData[0]?.mstr_rec_num, empData[0]?.emp_ind_pd_number].filter(Boolean).join("-") || "",
    },
    { fieldName: "FRPAYPLAN", empValue: empData[0]?.emp_pay_plan || "" },
    { fieldName: "FROCCCODE", empValue: empData[0]?.occ_series_code || "" },
    { fieldName: "FRGRADE", empValue: empData[0]?.emp_grade || "" },
    { fieldName: "FROMORG", empValue: empData[0]?.org_dept_name || "" },
    { fieldName: "FRLOCATION", empValue: concatOrgLocation || "" },
    { fieldName: "FRSTEP", empValue: empData[0]?.step || "" },
    { fieldName: "FRSALARY", empValue: formatSalary(empData[0]?.current_salary) || "" },
    { fieldName: "FRBASIS", empValue: empData[0]?.salary_rate_code || "" },
    { fieldName: "FRBASICPAY", empValue: formatSalary(empData[0]?.schd_sal) || "" },
    { fieldName: "FRLOCADJ", empValue: "" },
    { fieldName: "FRADJPAY", empValue: "" },
    { fieldName: "FROTHRPAY", empValue: "" },
  ];

  const toPositionFieldsMap = toPositionFieldNames.map((position, index) => ({
    fieldName: position,
    empValue: fromPositionFieldsMap[index].empValue
  }));

  const form = useForm();

  // Update field handlers
  const updatePositionFields = (selectedRow) => {
    const apprCodes = [selectedRow.dist_appn_cd, selectedRow.dist_sub_lev];
    const flsa = handleFlsa(selectedRow.fair_labor_standards_code);
    const dutyStationLocation = [selectedRow.city_name, selectedRow.state_name, selectedRow.country_cd];

    form.batch(() => {
      form.change(withPath("POSOCCCODE"), selectedRow.position_status);
      form.change(withPath("FLSACODE"), flsa);
      form.change(withPath("BARGUNIT"), selectedRow.bargaining_unit_status);
      form.change(withPath("APPRCODE"), concatFields(apprCodes));
      form.change(withPath("DUTYSTCODE"), selectedRow.duty_station_cd);
      form.change(withPath("DUTYSTATION"), concatFields(dutyStationLocation));
      form.change(withPath("FUNCLASS"), selectedRow.cls_for_sc_eng_name);
    });
  };

  const updateToPositionFields = (selectedRow) => {
    const deptLevels = Array.from({ length: 9 }, (_, i) => selectedRow[`dept_lvl_${i + 1}`]);

    form.batch(() => {
      form.change(withPath("TOPOSNO"), selectedRow.std_position_title);
      form.change(withPath("TOPOSNO1"), selectedRow.pd_number);
      form.change(withPath("TOPAYPLAN"), selectedRow.pay_plan);
      form.change(withPath("TOCCCODE"), selectedRow.occu_series_cd);
      form.change(withPath("TOGRADE"), selectedRow.grade);
      form.change(withPath("TOORG"), selectedRow.org_display_name);
      form.change(withPath("TOLOCATION"), concatFields(deptLevels));
      updatePositionFields(selectedRow);
    });

    if (changeRules) {
      prePopulateFields(fromPositionFieldsMap);
    }
  };

  const updateFromPositionFields = (selectedRow) => {
    const deptLevels = Array.from({ length: 9 }, (_, i) => selectedRow[`dept_lvl_${i + 1}`]);

    form.batch(() => {
      form.change(withPath("FRPOSTLE"), selectedRow.std_position_title);
      form.change(withPath("FRPOSNO"), selectedRow.pd_number);
      form.change(withPath("FRPAYPLAN"), selectedRow.pay_plan);
      form.change(withPath("FROCCCODE"), selectedRow.occu_series_cd);
      form.change(withPath("FRGRADE"), selectedRow.grade);
      form.change(withPath("FROMORG"), selectedRow.org_display_name);
      form.change(withPath("FRLOCATION"), concatFields(deptLevels));
      updatePositionFields(selectedRow);
    });
  };

  const updateOrgFields = (selectedRow) => {
    const org = [selectedRow.deptName, selectedRow.opmOrgStructCode];
    form.batch(() => {
      form.change(withPath("TOORG"), concatFields(org));
    });
  };

  const updateSeriesField = (selectedRow) => {
    form.change(withPath("TOCCCODE"), selectedRow.code);
  };

  const updatePayPlanField = (selectedRow) => {
    form.change(withPath("TOPAYPLAN"), selectedRow.opm_pay_plan_cd);
  };

  const updateGradeField = (selectedRow) => {
    form.change(withPath("TOGRADE"), selectedRow.opm_grade_cd);
  };

  // Rule flags
  const positionToRules = String(CODE_5A)[0] === "1";
  const positionFromRules = String(CODE_5A)[0] === "3";
  const changeRules = !isNaN(CODE_5A) && !positionFromRules && !positionToRules;

  // Field hooks
  const fromFields = fromPositionFieldsMap.map(({ fieldName }) => useField(withPath(fieldName)));
  const toFields = toPositionFieldNames.map((fieldName) => useField(withPath(fieldName)));

  // Handle field changes
  useEffect(() => {
    if (changeRules) {
      toFields.forEach((toField, toFieldIndex) => {
        const fromField = fromFields[toFieldIndex];
        if (toField.meta.dirty && toField.meta.touched && !fromField.meta.dirty) {
          const { empValue } = fromPositionFieldsMap[toFieldIndex];
          fromField.input.onChange(empValue);
        }
      });
    }
  }, [changeRules, fromFields, toFields]);

  // Handle pre-population
  useEffect(() => {
    if (changeRules) {
      prePopulateFields(toPositionFieldsMap);
    }
  }, [changeRules, toPositionFieldsMap]);

  useEffect(() => {
    if (positionFromRules) {
      prePopulateFields(fromPositionFieldsMap);
    }
  }, [positionFromRules]);

  return (
    <Container className="sf52-form">
      <Row className="mb-4">
        <Col xs={12}>
          <button type="button" onClick={handleToggleValues} className="btn btn-secondary">
            {showAllValues ? "Hide Stored Values" : "Show Stored Values"}
          </button>
        </Col>
      </Row>

      <Row>
        {/* FROM Section */}
        <Col md={6} className="border-end">
          <Card className="mb-4">
            <CardBody>
              <h4><i>FROM:</i></h4>
              <hr />

              {/* Position Title and Number */}
              <Row className="mb-3">
                <Col xs={12}>
                  {!isNaN(CODE_5A) && !positionToRules && (
                    <NoaSearchReact
                      showIcon={true}
                      updateFields={updateFromPositionFields}
                      dataUrl={positionDataUrl}
                    />
                  )}
                  <FFTextInput
                    validationHint={charCount(80)}
                    label="7. FROM: Position Title and Number"
                    name={withPath("FRPOSTLE")}
                    maxLength={80}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FRPOSTLE", fromPositionFieldsMap)}
                  <FFTextInput
                    validationHint={charCount(40)}
                    name={withPath("FRPOSNO")}
                    maxLength={40}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FRPOSNO", fromPositionFieldsMap)}
                </Col>
              </Row>

              {/* Pay Plan, Occ Code, Grade Level */}
              <Row className="mb-3">
                <Col xs={4}>
                  <FFTextInput
                    validationHint={charCount(6)}
                    label="8. Pay Plan"
                    name={withPath("FRPAYPLAN")}
                    maxLength={6}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FRPAYPLAN", fromPositionFieldsMap)}
                </Col>
                <Col xs={4}>
                  <FFTextInput
                    validationHint={charCount(6)}
                    label="9. Occ. Code"
                    name={withPath("FROCCCODE")}
                    maxLength={6}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FROCCCODE", fromPositionFieldsMap)}
                </Col>
                <Col xs={4}>
                  <FFTextInput
                    validationHint={charCount(9)}
                    label="10. Grade or Level"
                    name={withPath("FRGRADE")}
                    maxLength={9}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FRGRADE", fromPositionFieldsMap)}
                </Col>
              </Row>

              {/* Step, Salary, Pay Basis */}
              <Row className="mb-3">
                <Col xs={4}>
                  <FFTextInput
                    validationHint={charCount(4)}
                    label="11. Step or Rate"
                    name={withPath("FRSTEP")}
                    maxLength={4}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FRSTEP", fromPositionFieldsMap)}
                </Col>
                <Col xs={4}>
                  <PayField
                    validationHint={charCount(7)}
                    label="12. Total Salary"
                    name={withPath("FRSALARY")}
                    maxLength={7}
                    payBasis={payBasis}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FRSALARY", fromPositionFieldsMap)}
                </Col>
                <Col xs={4}>
                  <FFTextInput
                    validationHint={charCount(9)}
                    label="13. Pay Basis"
                    name={withPath("FRBASIS")}
                    maxLength={9}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FRBASIS", fromPositionFieldsMap)}
                </Col>
              </Row>

              {/* Pay Details */}
              <Row className="mb-3">
                <Col xs={3}>
                  <PayField
                    validationHint={charCount(7)}
                    label="12A. Basic Pay"
                    name={withPath("FRBASICPAY")}
                    maxLength={7}
                    readOnly={positionFromRules}
                    payBasis={payBasis}
                  />
                  {displayStoredValue("FRBASICPAY", fromPositionFieldsMap)}
                </Col>
                <Col xs={3}>
                  <PayField
                    validationHint={charCount(7)}
                    label="12B. Locality Adj."
                    name={withPath("FRLOCADJ")}
                    maxLength={7}
                    readOnly={positionFromRules}
                    payBasis={payBasis}
                  />
                  {displayStoredValue("FRLOCADJ", fromPositionFieldsMap)}
                </Col>
                <Col xs={3}>
                  <PayField
                    validationHint={charCount(7)}
                    label="12C. Adj. Basic Pay"
                    name={withPath("FRADJPAY")}
                    maxLength={7}
                    readOnly={positionFromRules}
                    payBasis={payBasis}
                  />
                  {displayStoredValue("FRADJPAY", fromPositionFieldsMap)}
                </Col>
                <Col xs={3}>
                  <PayField
                    validationHint={charCount(7)}
                    label="12D. Other Pay"
                    name={withPath("FROTHRPAY")}
                    maxLength={7}
                    readOnly={positionFromRules}
                    payBasis={payBasis}
                  />
                  {displayStoredValue("FROTHRPAY", fromPositionFieldsMap)}
                </Col>
              </Row>

              {/* Organization */}
              <Row>
                <Col xs={12}>
                  <FFTextInput
                    validationHint={charCount(80)}
                    label="14. Name and Location of Position's Organization"
                    name={withPath("FROMORG")}
                    maxLength={80}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FROMORG", fromPositionFieldsMap)}
                  <FFTextInput
                    validationHint={charCount(200)}
                    name={withPath("FRLOCATION")}
                    maxLength={200}
                    readOnly={positionFromRules}
                  />
                  {displayStoredValue("FRLOCATION", fromPositionFieldsMap)}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>

        {/* TO Section */}
        <Col md={6}>
          <Card className="mb-4">
            <CardBody>
              <h4><i>TO:</i></h4>
              <hr />

              {/* Position Title and Number */}
              <Row className="mb-3">
                <Col xs={12}>
                  {!isNaN(CODE_5A) && !positionFromRules && (
                    <div className="toSearch">
                      <NoaSearchReact
                        updateFields={updateToPositionFields}
                        dataUrl={positionDataUrl}
                      />
                    </div>
                  )}
                  <FFTextInput
                    validationHint={charCount(80)}
                    label="15. TO: Position Title and Number"
                    name={withPath("TOPOSNO")}
                    maxLength={80}
                  />
                  <FFTextInput
                    validationHint={charCount(40)}
                    name={withPath("TOPOSNO1")}
                    maxLength={40}
                  />
                </Col>
              </Row>

              {/* Pay Plan, Occ Code, Grade Level */}
              <Row className="mb-3">
                <Col xs={4}>
                  <NoaSearchReact
                    updateFields={updatePayPlanField}
                    dataUrl={payPlansLookupUrl}
                    renderButton={(onClick) => (
                      <button className="material-button material-button--small" onClick={onClick}>
                        <SearchIcon />
                        Search Pay Plan
                      </button>
                    )}
                    buttonText="Pay Plan"
                  />
                  <FFTextInput
                    validationHint={charCount(4)}
                    label="16. Pay Plan"
                    name={withPath("TOPAYPLAN")}
                    maxLength={4}
                  />
                </Col>
                <Col xs={4}>
                  <NoaSearchReact
                    updateFields={updateSeriesField}
                    dataUrl={occSeriesLookupUrl}
                    renderButton={(onClick) => (
                      <button className="material-button material-button--small" onClick={onClick}>
                        <SearchIcon />
                        Search Series
                      </button>
                    )}
                    buttonText="Series"
                  />
                  <FFTextInput
                    validationHint={charCount(6)}
                    label="17. Occ. Code"
                    name={withPath("TOCCCODE")}
                    maxLength={6}
                  />
                </Col>
                <Col xs={4}>
                  <NoaSearchReact
                    updateFields={updateGradeField}
                    dataUrl={gradesLookupUrl}
                    renderButton={(onClick) => (
                      <button className="material-button material-button--small" onClick={onClick}>
                        <SearchIcon />
                        Search Grade
                      </button>
                    )}
                    buttonText="Grade"
                  />
                  <FFTextInput
                    validationHint={charCount(9)}
                    label="18. Grade or Level"
                    name={withPath("TOGRADE")}
                    maxLength={9}
                  />
                </Col>
              </Row>

              {/* Step, Salary, Pay Basis */}
              <Row className="mb-3">
                <Col xs={4}>
                  <OptionSelect
                    label="19. Step or Rate"
                    path="TOSTEP"
                    selectOptions={stepOptions}
                    displayOptions={false}
                  />
                </Col>
                <Col xs={4}>
                  <PayField
                    validationHint={charCount(7)}
                    label="20. Total Salary/Award"
                    name={withPath("TOSALARY")}
                    maxLength={7}
                    payBasis={payBasis}
                  />
                </Col>
                <Col xs={4}>
                  <FFTextInput
                    validationHint={charCount(6)}
                    label="21. Pay Basis"
                    name={withPath("TOBASIS")}
                    maxLength={6}
                  />
                </Col>
              </Row>

              {/* Pay Details */}
              <Row className="mb-3">
                <Col xs={3}>
                  <PayField
                    validationHint={charCount(7)}
                    label="20A. Basic Pay"
                    name={withPath("TOBASICPAY")}
                    maxLength={7}
                    payBasis={payBasis}
                  />
                </Col>
                <Col xs={3}>
                  <PayField
                    validationHint={charCount(7)}
                    label="20B. Locality Adj."
                    name={withPath("TOLOCADJ")}
                    maxLength={7}
                    payBasis={payBasis}
                  />
                </Col>
                <Col xs={3}>
                  <PayField
                    validationHint={charCount(7)}
                    label="20C. Adj. Basic Pay"
                    name={withPath("TOADJPAY")}
                    maxLength={7}
                    payBasis={payBasis}
                  />
                </Col>
                <Col xs={3}>
                  <PayField
                    validationHint={charCount(7)}
                    label="20D. Other Pay"
                    name={withPath("TOOTHRPAY")}
                    maxLength={7}
                    payBasis={payBasis}
                  />
                </Col>
              </Row>

              {/* Organization */}
              <Row>
                <Col xs={12}>
                  <NoaSearchReact
                    updateFields={updateOrgFields}
                    dataUrl={orgDeptLookupUrl}
                    renderButton={(onClick) => (
                      <button className="material-button material-button--small" onClick={onClick}>
                        <SearchIcon />
                        Search Org Dept
                      </button>
                    )}
                  />
                  <FFTextInput
                    validationHint={charCount(80)}
                    label="22. Name and Location of Position's Organization"
                    name={withPath("TOORG")}
                    maxLength={80}
                  />
                  <FFTextInput
                    validationHint={charCount(200)}
                    name={withPath("TOLOCATION")}
                    maxLength={200}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Sf52Position;