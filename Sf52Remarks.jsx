import React, { useState, useEffect } from "react";
import { Field, useField } from "react-final-form";
import Sf52RemarkSearch from "./Sf52RemarkSearch";
import { withPath } from "./common/util";
import "./styles/remarks.css";

const Sf52Remarks = ({ savedRemarks }) => {
  const remarkStringToArray = (remarksString) => {
    if (!remarksString) {
      return [];
    }
    return remarksString.split("\n").map((remark) => {
      const [key, ...rest] = remark.split(": ");
      return { code: key, remark: rest.join(": ") };
    });
  };

  const remarksArrayToString = (remarks) => {
    if (!Array.isArray(remarks) || remarks.length === 0) {
      return "";
    }
    return remarks.map((e) => `${e.code}: ${e.remark}`).join("\n");
  };

  const [remarks, setRemarks] = useState([...remarkStringToArray(savedRemarks)]);

  const { input } = useField(withPath("REMARKSF50"));
  const handleClick = (newRemarks) => {
    if (newRemarks.length <= 10) {
      setRemarks([...newRemarks]);
    } else {
      window.alert("Can only select 10 remarks");
    }
  };

  const handleRemove = (remarkToRemove) => {
    const filteredRemarks = remarks.filter((remark) => remark.code !== remarkToRemove.code);
    setRemarks(filteredRemarks);
  };

  const handleChange = (index, edit) => {
    if (Array.isArray(remarks)) {
      const editedRemarks = remarks.map((remark, i) => {
        return i === index ? { code: remark.code, remark: edit } : remark;
      });
      setRemarks([...editedRemarks]);
    }
  };

  useEffect(() => {
    if (!remarks.length) {
      input.onChange(null);
    } else {
      const remarksAsString = remarksArrayToString(remarks);
      input.onChange(remarksAsString);
    }
  }, [remarks]);

  return (
      <div className="container py-4">
        {/*<h4 className="text-primary mb-4">PART F - Remarks for SF50</h4>*/}
        <div className="card p-3 shadow-sm">
          <div className="mb-3">
            <Sf52RemarkSearch handleClick={handleClick} remarks={remarks} />
          </div>
          <Field
              name={withPath("REMARKSF50")}
              subscription={{
                value: true,
                active: true,
                error: true,
                touched: true,
              }}
          >
            {({ input, meta: { active, error, touched } }) => (
                <>
                  {Array.isArray(remarks) &&
                      remarks.map((e, index) => (
                          <div className="input-group mb-3" key={e.code + index}>
                            <button
                                className="btn btn-danger btn-sm"
                                type="button"
                                onClick={() => handleRemove(e)}
                            >
                              x
                            </button>
                            <span className="input-group-text bg-light">{e.code}</span>
                            <input
                                type="text"
                                className="form-control"
                                maxLength={74}
                                onChange={(e) => handleChange(index, e.target.value)}
                                value={e.remark}
                            />
                          </div>
                      ))}
                  {error && <span className="text-danger">{error}</span>}
                </>
            )}
          </Field>
        </div>
      </div>
  );
};

export default Sf52Remarks;