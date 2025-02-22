import React, { useState } from "react";
import { useForm, Field } from "react-final-form";
import { Input, FormGroup, Label, Row, Col } from "reactstrap";
import makeStyles from '@material-ui/styles/makeStyles';
import { withPath, important } from "./common/util";
import NoaSearchReact from "./Sf52NoaSearch/NoaSearchReact";

const useStyles = makeStyles((theme) => ({
  headingSearchButton: {
    marginLeft: important("2rem"),
  },
}));

const Sf52Action = ({ actionNumber, headingText }) => {
  const classes = useStyles()
  const form = useForm();

  const updateFields = (selectedRow, description, customDescCode) => {
    const isCustomDescCode = customDescCode.includes(selectedRow?.noa_code);
    form.batch(() => {
      form.change(withPath(`CODE_${actionNumber}A`), selectedRow.noa_code);
      form.change(withPath(`NATURE_${actionNumber}B`), isCustomDescCode ? description : selectedRow.noa_description);
      form.change(withPath(`CODE_${actionNumber}C`), selectedRow.auth_code_1);
      form.change(withPath(`AUTHORITY_${actionNumber}D`), selectedRow.auth_1_description);
      form.change(withPath(`CODE_${actionNumber}E`), selectedRow.auth_code_2);
      form.change(withPath(`AUTHOTITY_${actionNumber}F`), selectedRow.auth_2_description);
    });
  };

  const actionDataUrl = "/frbweb/fhrnavigator/case-tracking/reportName/noaLookup_no_depts_no_groups";

  const noaCodeQuery = form.getFieldState(withPath(`CODE_${actionNumber}A`))?.value;

  return (
    <div>
      {headingText
        ?
        <h4 className="text-lg font-medium mb-4">
          {headingText}
          <NoaSearchReact
            updateFields={updateFields}
            dataUrl={actionDataUrl}
            fieldQuery={noaCodeQuery}
            buttonClassName={classes.headingSearchButton}
          />
        </h4>
        :
        <NoaSearchReact
          updateFields={updateFields}
          dataUrl={actionDataUrl}
          fieldQuery={noaCodeQuery}
          buttonClassName="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium"
        />
      }
      <Row>
        <Col>
          <Field
            name={withPath (`CODE_${actionNumber}A`)}
            subscription={{
              value: true,
              active: true,
              error: true,
              touched: true,
            }}>
            {({ input }) => (
              <FormGroup>
                <Label>{`${actionNumber}-A Code`}</Label>
                <Input
                  type="text"
                  value={input.value}
                  onChange={(e) => input.onChange (e.target.value)}
                  maxLength={4}></Input>
              </FormGroup>
            )}
          </Field>
        </Col>
        <Col>
          <Field
            name={withPath (`NATURE_${actionNumber}B`)}
            subscription={{
              value: true,
              active: true,
              error: true,
              touched: true,
            }}>
            {({ input }) => (
              <FormGroup>
                <Label>{`${actionNumber}-B Nature of Action`}</Label>
                <Input
                  type="text"
                  value={input.value}
                  onChange={(e) => input.onChange (e.target.value)}
                  maxLength={60}></Input>
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
      <Row>
        <Col>
          <Field
            name={withPath (`CODE_${actionNumber}C`)}
            subscription={{
              value: true,
              active: true,
              error: true,
              touched: true,
            }}>
            {({ input }) => (
              <FormGroup>
                <Label>{`${actionNumber}-C Code`}</Label>
                <Input
                  type="text"
                  value={input.value}
                  onChange={(e) => input.onChange (e.target.value)}
                  maxLength={4}></Input>
              </FormGroup>
            )}
          </Field>
        </Col>
        <Col>
          <Field
            name={withPath (`AUTHORITY_${actionNumber}D`)}
            subscription={{
              value: true,
              active: true,
              error: true,
              touched: true,
            }}>
            {({ input }) => (
              <FormGroup>
                <Label>{`${actionNumber}-D Legal Authority`}</Label>
                <Input
                  type="text"
                  value={input.value}
                  onChange={(e) => input.onChange (e.target.value)}
                  maxLength={120}></Input>
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
      <Row>
        <Col>
          <Field
            name={withPath (`CODE_${actionNumber}E`)}
            subscription={{
              value: true,
              active: true,
              error: true,
              touched: true,
            }}>
            {({ input }) => (
              <FormGroup>
                <Label>{`${actionNumber}-E Code`}</Label>
                <Input
                  type="text"
                  value={input.value}
                  onChange={(e) => input.onChange (e.target.value)}
                  maxLength={4}></Input>
              </FormGroup>
            )}
          </Field>
        </Col>
        <Col>
          <Field
            name={withPath (`AUTHOTITY_${actionNumber}F`)}
            subscription={{
              value: true,
              active: true,
              error: true,
              touched: true,
            }}>
            {({ input }) => (
              <FormGroup>
                <Label>{`${actionNumber}-F Legal Authority`}</Label>
                <Input
                  type="text"
                  value={input.value}
                  onChange={(e) => input.onChange (e.target.value)}
                  maxLength={120}></Input>
              </FormGroup>
            )}
          </Field>
        </Col>
      </Row>
    </div>
  );
};

export default Sf52Action;