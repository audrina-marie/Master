import React, { useState, useEffect, useRef } from "react";
import { fetchData } from "../../common/Util/DataProviderUtil";
import { nfcNoaCodesUrl } from "./common/lookupUrls";
import { Form, Errors } from "../FormIOBuilder/components";
import { useForm } from "react-final-form";
import { withPath } from "./common/util";
import "../../../../fhr-navigator/src/main/webapp/styles/bootstrap-4/css/bootstrap.min.css";
import "../../../node_modules/@fortawesome/fontawesome-free/css/all.css";
import "../../../../fhr-formio-client/dist/formio.full.css";
import "../../../../fhr-formio-client/src/sass/formio.form.builder.scss";

import "../../../../fhr-navigator/src/main/webapp/styles/bootstrap-4/css/bootstrap.min.css";
import "../../../node_modules/@fortawesome/fontawesome-free/css/all.css";
import "../../../../fhr-formio-client/dist/formio.full.css";
import "../../../../fhr-formio-client/src/sass/formio.form.builder.scss";

const lookups = {
  "DATE-PERS-ACTN-VALID": {
    label: "Authentication/Authorization Date",
    tooltip: "DATE-PERS-ACTN-VALID - The date the personnel action was authenticated.",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "authDate",
    type: "textfield",
    input: true,
  },

  "TYPE-OF-APPOINTMENT-CODE": {
    label: "Type of Appointment",
    widget: "choicesjs",
    tooltip: "TYPE-OF-APPOINTMENT-CODE - The type of appointment the employee has accepted.",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "01 - Competitive - Career/SES-Career", value: "01" },
        { label: "02 - Competitive - Career Conditional ", value: "02" },
        { label: "03 - Competitive - Term, TAPER, Indefinite/SES- Military Term", value: "03" },
        { label: "04 - Competitive - Temporary, Special Need/SES-Time Limited/Career", value: "04" },
        { label: "06 - Excepted - Permanent/SES - Noncareer", value: "06" },
        { label: "07 - Excepted - Conditional ", value: "07" },
        { label: "08 - Excepted - Indefinite/Limited (more than 1 year)", value: "08" },
        { label: "09 - Excepted - Temporary/SES- Time Limited-Noncareer", value: "09" },
      ],
    },
    key: "TYPE_OF_APPOINTMENT_CODE",
    type: "select",
    input: true,
  },

  "COLA-POST-DIFF-CODE": {
    label: "Post-differential COLA",
    widget: "choicesjs",
    tooltip:
      "COLA-POST-DIFF-CODE - Identifies whether the employee is entitled to receive a cost of living allowance (COLA) and/or post differential, in addition to the base salary.",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "0 - None", value: "0" },
        { label: "2 - Non-foreign post differential", value: "2" },
        { label: "3 - Non-foreign cost of living allowance and post differential", value: "3" },
        { label: "4 - Foreign post differential", value: "4" },
        { label: "5 - Cola - local retail/private housing", value: "5" },
        { label: "6 - Cola - local retail/federal housing", value: "6" },
        { label: "7 - Cola - commissary/px/private housing", value: "7" },
        { label: "8 - Cola - commissary/px/federal housing", value: "8" },
        { label: "9 - Cola - commissary/px/military housing", value: "9" },
      ],
    },
    key: "COLA_POST_DIFF_CODE",
    type: "select",
    input: true,
  },

  "ANNUAL-LEAVE-CATEGORY": {
    label: "Annual Leave Category",
    widget: "choicesjs",
    tooltip:
      "ANNUAL-LEAVE-CATEGORY - Mandatory - A code that identifies the annual leave earning status. If the employee is eligible to earn annual leave, the code represents the appropriate earning category. Validated against Leave SCD.",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "0 - Ineligible to earn annual leave", value: "0" },
        { label: "4 - Earns 4 hours of annual leave", value: "4" },
        { label: "6 - Earns 6 hours of annual leave", value: "6" },
        { label: "8 - Earns 8 hours of annual leave", value: "8" },
      ],
    },
    key: "ANNUAL_LEAVE_CATEGORY",
    type: "select",
    input: true,
  },

  "ANNUAL-LEAVE-45-DAY-CODE": {
    label: "Annual Leave 45 Day Code",
    widget: "choicesjs",
    tooltip:
      "ANNUAL-LEAVE-45-DAY-CODE - Mandatory - Identifies those employees who are stationed at an overseas foreign post of duty which are entitled to carry forward from one leave year to another a maximum annual leave accumulation of 45 days (360)",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" },
      ],
    },
    key: "ANNUAL_LEAVE_45_DAY_CODE",
    type: "select",
    input: true,
  },

  "SCD-ACCEL-LV-IND": {
    label: "Accelerated Leave SCD",
    tooltip: "SCD-ACCEL-LV-IND - Allows override of leave accrual rate validation against the leave SCD",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    hiddenEmp: false,
    disabledEmp: false,
    tableView: false,
    key: "SCD_ACCEL_LV_IND",
    type: "checkbox",
    input: true,
    defaultValue: false,
  },

  "LEAVE-EARNING-STATUS-PP": {
    label: "Earns Leave for First/Last Pay Period",
    widget: "choicesjs",
    tooltip:
      "LEAVE-EARNING-STATUS-PP - Identifies whether an employee is entitled to leave accruals for the first and last pay period of employment.",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" },
      ],
    },
    key: "LEAVE_EARNING_STATUS_PP",
    type: "select",
    input: true,
  },

  "UNIFORM-SERVICE-STATUS": {
    label: "Uniform Service Status",
    widget: "choicesjs",
    tooltip: "UNIFORM-SERVICE-STATUS - Mandatory - The employee’s current military status",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "0 - None", value: "0" },
        { label: "1 - Ready reserve", value: "1" },
        { label: "2 - Standby reserve", value: "2" },
        { label: "3 - National Guard", value: "3" },
        { label: "4 - Retired military, regular", value: "4" },
        { label: "5 - Retired military, non-regular", value: "5" },
        { label: "6 - Retired military, regular and reserve/National Guard", value: "6" },
        {
          label:
            "7 - Retired military, non-regular and  reserve/National Guard 8 = Retired military and DC  National Guard",
          value: "7",
        },
        { label: "9 = DC National Guard", value: "9" },
      ],
    },
    key: "UNIFORM_SERVICE_STATUS",
    type: "select",
    input: true,
  },

  "SUP-MGR-PROB-PER-REQ": {
    label: "Supervisor/Manager Probationary Period Required?",
    widget: "choicesjs",
    tooltip:
      "SUP-MGR-PROB-PER-REQ - Identifies whether a supervisory/managerial probationary period is required, served, or waived.",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "0 - Not required", value: "0" },
        { label: "1 - Required", value: "1" },
        { label: "2 - Served", value: "2" },
        { label: "3 - Waived", value: "3" },
      ],
    },
    key: "SUP_MGR_PROB_PER_REQ",
    type: "select",
    input: true,
  },

  "DATE-SUPV-MGR-PROB": {
    label: "Supervisor/Manager Probation Start",
    tooltip:
      "DATE-SUPV-MGR-PROB - The starting date for the supervisory/managerial probationary period, or for SES probationary period.",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    hiddenEmp: false,
    disabledEmp: false,
    tableView: true,
    key: "DATE_SUPV_MGR_PROB",
    conditional: {
      show: true,
      when: "SupervisoryStatus",
      eq: "2",
    },
    type: "textfield",
    applyMaskOn: "change",
    disabledNonEmp: false,
    input: true,
  },

  "APPOINTMENT-LIMIT-CODE": {
    label: "Appointment Limit? ",
    widget: "choicesjs",
    tooltip: "APPOINTMENT-LIMIT-CODE - NFC Data Element Name: APPOINTMENT-LIMIT-CODE",
    hiddenEmp: false,
    disabledEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "0 - No service year or appointment NTE date limitations or NTE date limitation only", value: "0" },
        { label: "2 - Service year limitation with or without an appointment NTE date limitation", value: "2" },
      ],
    },
    key: "APPOINTMENT_LIMIT_CODE",
    type: "select",
    input: true,
  },

  "DATE-SERVICE-START": {
    label: "Service Start (required for term appointments)",
    tooltip:
      "DATE-SERVICE-START - The date on which the employee's service year begins. A service year is a 12 to 24 month period beginning with the date of the first appointment under an authority that establishes a dollar, hour, or day limitation, which cannot be exceeded within the service year.",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_SERVICE_START",
    type: "textfield",
    input: true,
  },

  // Missing key mappings
  "PHYSICAL-HANDICAP-CODE": {
    label: "Self-Identification of Disability",
    widget: "choicesjs",
    tooltip: "NFC data element name: PHYSICAL-HANDICAP-CODE",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        {
          label: "01 - I do not wish to identify my disability or serious health condition",
          value: "01",
        },
        {
          label: "05 - I do not have a disability or serious health condition.",
          value: "05",
        },
        {
          label: "06 - I have a disability or serious health condition, but it is not listed on this form.",
          value: "06",
        },
        {
          label: "02 - Developmental Disability, for example, autism spectrum disorder",
          value: "02",
        },
      ],
    },
    key: "PHYSICAL_HANDICAP_CODE",
    type: "select",
    input: true,
  },

  GAIN_LOSE_DEPT_NON_USDA: {
    label: "Gain/Loss - Previous Employment or Other",
    widget: "choicesjs",
    tooltip:
      "GAIN_LOSE_DEPT_NON_USDA - Mandatory - The federal department that an employee is transferring from; or identify the prior status of an employee who is transferring from an entity other than another federal department",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "1B - Unknown", value: "1B" },
        { label: "1A - Military", value: "1A" },
        { label: "2A - University employee ", value: "2A" },
        { label: "3A - Student", value: "3A" },
        { label: "4A - Self-employed", value: "4A" },
        { label: "5A - Retirement", value: "5A" },
        { label: "6A - Foreign country or corporation", value: "6A" },
        { label: "7A - Private Industry", value: "7A" },
        { label: "8A - Unemployment", value: "8A" },
        { label: "9A - State or local government", value: "9A" },
        { label: "1C - Death", value: "1C" },
        { label: "AF - Department of The Air Force", value: "AF" },
        { label: "AG - Department of Agriculture", value: "AG" },
        { label: "AH - National Foundation On The Arts And The Humanities", value: "AH" },
        { label: "AR - Department of The Army", value: "AR" },
        { label: "CM - Department of Commerce", value: "CM" },
        { label: "DD - Department of Defense", value: "DD" },
        { label: "DJ - Department of Justice", value: "DJ" },
        { label: "DL - Department of Labor", value: "DL" },
        { label: "DN - Department of Energy", value: "DN" },
        { label: "ED - Department of Education", value: "ED" },
        { label: "FQ - Court Services And Offender Supervision Agency For The District of Columbia", value: "FQ" },
        { label: "FR - Federal Reserve System", value: "FR" },
        { label: "GS - General Services Administration", value: "GS" },
        { label: "HB - Committee For Purchase From People Who Are Blind And Severely Disabled", value: "HB" },
        { label: "HE - Department of Health And Human Services", value: "HE" },
        { label: "HF - Federal Housing Finance Agency", value: "HF" },
        { label: "HS - Department of Homeland Security", value: "HS" },
        { label: "HU - Department of Housing And Urban Development", value: "HU" },
        { label: "IN - Department of The Interior", value: "IN" },
        { label: "JL - Judicial Branch", value: "JL" },
        { label: "LL - Legislative Branch", value: "LL" },
        { label: "NN - National Aeronautics And Space Administration", value: "NN" },
        { label: "NV - Department of The Navy", value: "NV" },
        { label: "RH - Armed Forces Retirement Home", value: "RH" },
        { label: "SM - Smithsonian Institution", value: "SM" },
        { label: "ST - Department of State", value: "ST" },
        { label: "TD - Department of Transportation", value: "TD" },
        { label: "TR - Department of The Treasury", value: "TR" },
        { label: "VA - Department of Veterans Affairs", value: "VA" },
        { label: "WH - Executive Office of The President", value: "WH" },
        { label: "XX - Executive Branch", value: "XX" },
      ],
    },
    key: "GAIN_LOSE_DEPT_NON_USDA",
    type: "select",
    input: true,
  },

  PREVIOUS_AGENCY: {
    label: "Agency Transfer - Previous Agency",
    widget: "choicesjs",
    tooltip: "PREVIOUS_AGENCY - The previous agency when an employee moves to another agency within the same dept.",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "HSCB - Federal Emergency Management Agency", value: "CB" },
        { label: "HSCA - CISA", value: "CA" },
      ],
    },
    key: "PREVIOUS_AGENCY",
    type: "select",
    input: true,
  },

  CSRS_COVERAGE_AT_APPNT: {
    label: "CSRS Previous Coverage",
    widget: "choicesjs",
    tooltip:
      "CSRS_COVERAGE_AT_APPNT - Mandatory - Identifies whether the Civil Service Retirement System (CSRS) or the Federal Employee Retirement System (FERS) covered an employee, at the time of the most recent appointment to Federal service.",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "N = Never Covered", value: "N" },
        { label: "P = Previously Covered", value: "P" },
        { label: "R = Refund Eligible", value: "R" },
      ],
    },
    key: "CSRS_COVERAGE_AT_APPNT",
    type: "select",
    input: true,
  },

  FERS_PREV_COV_IND: {
    label: "FERS Previous Coverage",
    widget: "choicesjs",
    tooltip: "FERS_PREV_COV_IND - Mandatory - Previously covered by FERS",
    hiddenEmp: false,
    disabledEmp: false,
    tableView: true,
    data: {
      values: [
        { label: "Yes", value: "Y" },
        { label: "No", value: "N" },
      ],
    },
    key: "FERS_PREV_COV_IND",
    type: "select",
    input: true,
  },

  DATE_SCD_CSR: {
    label: "Retirement SCD",
    tooltip: "DATE_SCD_CSR - Optional - Retirement Service Computation Date",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    hiddenEmp: false,
    disabledEmp: false,
    tableView: true,
    key: "DATE_SCD_CSR",
    type: "textfield",
    applyMaskOn: "change",
    disabledNonEmp: false,
    input: true,
  },

  DATE_SCD_WGI: {
    label: "WGI SCD",
    tooltip:
      "DATE_SCD_WGI - Mandatory - The date from which service is to be credited toward the employee's next within grade salary increase.",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      locale: "en",
      displayInTimezone: "viewer",
    },
    hiddenEmp: false,
    disabledEmp: false,
    tableView: true,
    key: "DATE_SCD_WGI",
    type: "textfield",
    applyMaskOn: "change",
    disabledNonEmp: false,
    input: true,
  },

  DATE_SCD_RIF: {
    label: "SCD for RIF",
    tooltip: "DATE_SCD_RIF - Optional - The employee's service computation date for reduction-in-force (RIF) purposes.",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_SCD_RIF",
    type: "textfield",
    input: true,
  },

  TSP_ELIGIBILITY_CODE: {
    label: "TSP Eligibility",
    widget: "choicesjs",
    tooltip:
      "TSP_ELIGIBILITY_CODE - Mandatory - Indicates whether or not the employee is eligible to participate in the Federal Thrift Savings Plan (TSP) for the FERS, CSRS, or Offset employees",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    data: {
      values: [
        {
          label: "1 - Eligible to participate in first open season after effective date",
          value: "1",
        },
        {
          label: "2 - Eligible to participate in second open season after effective date",
          value: "2",
        },
        {
          label: "3 - Eligible immediately",
          value: "3",
        },
        {
          label:
            "4 - Eligible immediately for agency contribution on first open season after effective date to participate",
          value: "4",
        },
        {
          label:
            "5 - Eligible immediately for agency contribution eligible on second open season after effective date to participate",
          value: "5",
        },
        {
          label: "6 - Not eligible to participate",
          value: "6",
        },
      ],
    },
    key: "TSP_ELIGIBILITY_CODE",
    type: "select",
    input: true,
  },

  DATE_TSP_VESTED: {
    label: "TSP Vested",
    tooltip:
      "DATE_TSP_VESTED - Mandatory - The beginning date of the vesting period for the 1 percent government contribution to the Thrift Savings Plan (TSP).",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    hiddenEmp: false,
    disabledEmp: false,
    tableView: true,
    key: "DATE_TSP_VESTED",
    type: "textfield",
    input: true,
  },

  DATE_HOME_LV_12_MO_BEG: {
    label: "Home Leave 12 Month Begining Date",
    tooltip: "DATE-HOME-LV-12-MO-BEG - Start date of current 12-month accrual period",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_HOME_LV_12_MO_BEG",
    type: "textfield",
    input: true,
  },

  DATE_HOME_LV_12_END: {
    label: "Home Leave 12 Month End Date",
    tooltip: "DATE-HOME-LV-12-END - End date of current 12-month accrual period",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_HOME_LV_12_END",
    type: "textfield",
    input: true,
  },

  DATE_HOME_LV_24_MO_BEG: {
    label: "Home Leave 24 Month Beginning Date",
    tooltip: "DATE-HOME-LV-24-MO-BEG - Start date of the basic 24-month continuous period of service",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_HOME_LV_24_MO_BEG",
    type: "textfield",
    input: true,
  },

  DATE_HOME_LV_24_END: {
    label: "Home Leave 24 Month End Date",
    tooltip: "DATE-HOME-LV-24-END - End date of the basic 24-month continuous period of service",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_HOME_LV_24_END",
    type: "textfield",
    input: true,
  },

  "RECRUITMENT-PERCENT": {
    label: "Recruitment Bonus Percent",
    tooltip:
      "RECRUITMENT-PERCENT - The percentage of base pay used to compute the recruitment bonus rate paid to a newly appointed employee.",
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    validate: {
      pattern: "(([0-9])|([1][0-9])|([2][0-5]))?",
      customMessage: 'Enter up to 25% as a number without "%"',
      minLength: 0,
      maxLength: 2,
    },
    key: "RECRUITMENT_PERCENT",
    type: "textfield",
    input: true,
  },

  "RECRUITMENT-BONUS": {
    label: "Recruitment Bonus Amount",
    tooltip:
      "RECRUITMENT-BONUS - Lump sum dollar amount paid to a newly appointed employee to whom a written offer of employment has been made by the agency.",
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    validate: {
      pattern: "[0-9]{0,6}([.][0-9]{2})?",
      customMessage: "Enter a dollar amount with or without cents",
      minLength: 0,
    },
    key: "RECRUITMENT_BONUS",
    type: "textfield",
    input: true,
  },

  "RELOCATION-PERCENT": {
    label: "Relocation Percent",
    tooltip:
      "RELOCATION-PERCENT - The percentage of base pay used to compute the relocation bonus rate paid to a current employee to compensate them for relocation.",
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    validate: {
      pattern: "(([0-9])|([1][0-9])|([2][0-5]))?",
      customMessage: 'Enter up to 25% as a number without "%"',
      minLength: 0,
      maxLength: 2,
    },
    key: "RELOCATION_PERCENT",
    type: "textfield",
    input: true,
  },

  "RELOCATION-BONUS": {
    label: "Relocation Amount",
    tooltip: "RELOCATION-BONUS - Lump sum dollar amount paid to a current employee to compensate them for relocation.",
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    validate: {
      pattern: "[0-9]{0,6}([.][0-9]{2})?",
      customMessage: "Enter a dollar amount with or without cents",
      minLength: 0,
    },
    key: "RELOCATION_BONUS",
    type: "textfield",
    input: true,
  },

  "RETENTION-PERCENT": {
    label: "Retention Percent",
    tooltip: "RETENTION-PERCENT - The percentage amount of a retention allowance or supervisory differential.",
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    validate: {
      pattern: "(([0-9])|([1][0-9])|([2][0-5]))?",
      customMessage: 'Enter up to 25% as a number without "%"',
      minLength: 0,
      maxLength: 2,
    },
    key: "RETENTION_PERCENT",
    type: "textfield",
    input: true,
  },

  "RETENTION-ALLOWANCE": {
    label: "Retention Allowance Amount",
    tooltip:
      "RETENTION-ALLOWANCE - An incentive allowance offered to retain needed employees who would otherwise separate from Federal service.",
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    validate: {
      pattern: "[0-9]{0,6}([.][0-9]{2})?",
      customMessage: "Enter a dollar amount with or without cents",
      minLength: 0,
    },
    key: "RETENTION_ALLOWANCE",
    type: "textfield",
    input: true,
  },

  "FOREIGN-LANG-PERCENT": {
    label: "Foreign Language Percent",
    tooltip:
      "FOREIGN-LANG-PERCENT - An allowance offered to employees in foreign service positions to acquire and/or maintain proficiency in foreign languages used at overseas posts.",
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    validate: {
      pattern: "(([0-9])|([1][0-9])|([2][0-5]))?",
      customMessage: 'Enter up to 25% as a number without "%"',
      minLength: 0,
      maxLength: 2,
    },
    key: "FOREIGN_LANG_PERCENT",
    type: "textfield",
    input: true,
  },

  "FOREIGN-LANG-ALLOW": {
    label: "Foreign Language Allowance Amount",
    tooltip:
      "FOREIGN-LANG-ALLOW - An allowance paid annually to law enforcement officers who are proficient in and use foreign language(s) in their duties.",
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    validate: {
      pattern: "[0-9]{0,6}([.][0-9]{2})?",
      customMessage: "Enter a dollar amount with or without cents",
      minLength: 0,
    },
    key: "FOREIGN_LANG_ALLOW",
    type: "textfield",
    input: true,
  },

  "DATE-RETEN-RIGHTS-END": {
    label: "Retention Rights End",
    tooltip: "DATE-RETEN-RIGHTS-END - Optional - The date job retention rights will terminate",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_RETEN_RIGHTS_END",
    type: "textfield",
    input: true,
  },

  "DATE-RETAIN-RATE-EXPIR": {
    label: "Retained Rate Expiration",
    tooltip:
      "DATE-RETAIN-RATE-EXPIR - Optional - The date on which the employee's entitlement to a retain rate will terminate. Complete if Pay Rate Determinant Code equals A, B, E, F, U or V",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_RETAIN_RATE_EXPIR",
    type: "textfield",
    input: true,
  },

  "DATE-CAR-PERM-TEN-START": {
    label: "Career/Permanent Tenure Start",
    tooltip:
      "DATE-CAR-PERM-TEN-START - Mandatory - The beginning date for counting service toward career or permanent tenure.",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_CAR_PERM_TEN_START",
    type: "textfield",
    input: true,
  },

  "DATE-PROB-PERIOD-START": {
    label: "Probationary Period Start",
    tooltip:
      "DATE-PROB-PERIOD-START - Identifies whether the employee’s appointment is subject to completion of a year probationary (or trial) period and to show the commencing date of the probationary period.",
    widget: {
      type: "calendar",
      altInput: true,
      allowInput: true,
      clickOpens: true,
      enableDate: true,
      enableTime: false,
      mode: "single",
      noCalendar: false,
      format: "MM/dd/yyyy",
      dateFormat: "MM/dd/yyyy",
      useLocaleSettings: false,
      hourIncrement: 1,
      minuteIncrement: 5,
      time_24hr: false,
      saveAs: "text",
      displayInTimezone: "viewer",
      locale: "en",
    },
    applyMaskOn: "change",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    tableView: true,
    key: "DATE_PROB_PERIOD_START",
    type: "textfield",
    input: true,
  },
};

const Sf52Fesi = ({ noaCode = "" }) => {
  const [nfcData, setNfcData] = useState([]);
  const [formFields, setFormFields] = useState([]);
  const [requiredFields, setRequiredFields] = useState([]);
  const [formError, setFormError] = useState(null);

  const autoSaveRef = useRef();

  const finalForm = useForm();

  const formResponse = finalForm.getState().values.formResponse.data;

  useEffect(() => {
    if (requiredFields.length) {
      const isError = requiredFields.some((field) => !formResponse[field]);
      finalForm.change(withPath("nfcError"), isError);
    }
  }, [formResponse, requiredFields]);

  useEffect(() => {
    const getNfcCodes = async () => {
      const data = await fetchData(nfcNoaCodesUrl); // Ensure nfcNoaCodesUrl is defined
      const nfcIndex = data.findIndex((e) => e.data_element === "NFC Additional Data Elements");
      const nfcDataSegment = data.slice(nfcIndex + 1);
      setNfcData(nfcDataSegment);
    };
    getNfcCodes();
  }, []);

  const isDateField = (str) => {
    if (str) {
      const normalizedStr = str
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .toLowerCase()
        .trim();
      return normalizedStr.includes("date");
    }
    return false;
  };

  const isRequired = (obj, numberStr) => {
    for (let key of Object.keys(obj)) {
      const match = key.match(/noa_(\d+)/);
      if (match && match[1] === numberStr) {
        return obj[key];
      }
    }
    return null;
  };

  const createField = (nfcEntry, lookup = null) => {
    const { data_element: label, json_element_name: key } = nfcEntry;
    const required = isRequired(nfcEntry, noaCode) === "R";
    const hidden = isRequired(nfcEntry, noaCode) === null;
    const type = isDateField(key) ? "datetime" : "textfield";

    if (required && key) {
      setRequiredFields((prevRequiredFields) => {
        // const newField = withPath(key);
        if (!prevRequiredFields.includes(key)) {
          return [...prevRequiredFields, key];
        }
        return prevRequiredFields;
      });
    }

    if (lookup) {
      // Clone the lookup to avoid mutating the original object
      const field = { ...lookup };

      field.validate = {
        ...(field.validate || {}),
        required,
      };
      field.hidden = hidden;

      return field;
    } else {
      const timeFields = {
        format: "MM/dd/yyyy",
        dateFormat: "MM/dd/yyyy",
        enableTime: false,
      };
      const standardField = {
        label,
        applyMaskOn: "change",
        hiddenEmp: false,
        disabledEmp: false,
        disabledNonEmp: false,
        tableView: true,
        validate: {
          required,
        },
        key,
        type,
        input: true,
        hidden,
      };
      return type === "datetime" ? { ...standardField, ...timeFields } : standardField;
    }
  };

  useEffect(() => {
    console.log('noaCode', noaCode)
    if (noaCode) {
      const fieldsList = nfcData.map((e) => {
        const key = e.json_element_name;

        if (lookups[key]) {
          return createField(e, lookups[key]);
        } else {
          return createField(e);
        }
      });
      setFormFields(fieldsList);
    }
  }, [noaCode, nfcData, lookups]);

  const form = {
    label: "Tabs",
    hiddenEmp: false,
    disabledEmp: false,
    disabledNonEmp: false,
    key: "tabs",
    type: "tabs",
    input: false,
    tableView: false,
    components: [
      {
        // label: "NFC Processing",
        key: "nfcProcessing",
        components: [
          {
            // title: "NFC Processing",
            collapsible: false,
            hiddenEmp: false,
            disabledEmp: false,
            disabledNonEmp: false,
            key: "nfcProcessing1",
            // type: "panel",
            // label: "Panel",
            input: false,
            tableView: false,
            components: [...formFields],
          },
        ],
      },
    ],
  };

  return (
    <div>
      <Form
        onError={(error) => setFormError(error)}
        form={form}
        submission={formResponse}
        hideComponents={false}
        onChange={(submission) => {
          const key = submission?.changed?.component?.key;
          const val = submission?.changed?.value;
          finalForm.change(withPath(key), val);
          // if (submission?.changed?.instance?.type == "signature") {
          //   this.checkSignatureChange(submission);
          // }
          // Trigger AutoSave
          if (autoSaveRef.current) {
            autoSaveRef.current.receiveProps(submission, this.state.formLabel, this.props.controlNumber);
          }
        }}
        onSubmit={(formX) => this.onSubmitForm(formX)}
      />
    </div>
  );
};

export default Sf52Fesi;
