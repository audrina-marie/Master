import React from "react";
import { diff } from "deep-object-diff";
class AutoSave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      values: props.formResponse ? props.formResponse.data : {},
    };
    this.timeout = null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.formResponse !== this.props.formResponse) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.save(prevProps, this.props.formResponse, this.props.formApi);
      }, 30000);
    }
  }

  save = (prevProps, formResponse, formApi) => {
    // Use deep-object-diff to find the differences
    const differences = diff(prevProps.formResponse?.data, formResponse?.data);
    const errors = formApi.getState().errors?.formResponse?.data;
    if (Object.keys(differences).length > 0 && !errors) {
      this.setState({ values: formResponse.data });
      this.props.onSave({ target: { name: "auto" } }, formApi, null);
    }
  };

  render() {
    return null; // render nothing, this is a utility component
  }
}

export default AutoSave;
