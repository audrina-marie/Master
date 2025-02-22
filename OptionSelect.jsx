
import React, { useRef, useEffect } from 'react';
import { Field } from 'react-final-form';
import { FormGroup, Label } from 'reactstrap';
// Swap out the import:
import Choices from '@formio/choices.js';
import '../../../../../fhr-formio-client/node_modules/@formio/choices.js/public/assets/styles/choices.min.css';
import { withPath } from './util';

const OptionSelect = ({
                          label,
                          selectOptions,
                          path,
                          displayOptions = false,
                          valuesOnly = false
                      }) => {
    return (
        <Field
            name={withPath(path)}
            subscription={{
                value: true,
                active: true,
                error: true,
                touched: true
            }}
        >
            {({ input }) => (
                <ChoicesAdapter
                    label={label}
                    selectOptions={selectOptions}
                    input={input}
                    displayOptions={displayOptions}
                    valuesOnly={valuesOnly}
                />
            )}
        </Field>
    );
};

const ChoicesAdapter = ({
                            label,
                            selectOptions,
                            input,
                            displayOptions,
                            valuesOnly
                        }) => {
    const selectRef = useRef(null);
    const choicesRef = useRef(null);

    useEffect(() => {
        if (!selectRef.current) return;

        // Initialize the Choices instance from @formio/choices.js
        choicesRef.current = new Choices(selectRef.current, {
            // Transform your passed-in props into the choices array
            choices: selectOptions.map(({ value, name }) => ({
                label: valuesOnly ? value : name,
                value
            })),
            placeholderValue: 'Select',
            searchEnabled: true,
            itemSelectText: '' // Removes "Press Enter to select"
        });

        // If the field already has a value, sync it with Choices
        if (input.value) {
            choicesRef.current.setChoiceByValue(input.value);
        }

        // Listen for changes from Choices, then call input.onChange
        const handleChange = (event) => {
            input.onChange(event.target.value);
        };
        selectRef.current.addEventListener('change', handleChange);

        // Cleanup on unmount or re-render
        return () => {
            // if (choicesRef.current) {
            //     choicesRef.current.destroy();
            // }
            if (selectRef.current) {
                selectRef.current.removeEventListener('change', handleChange);
            }
        };
    }, [selectOptions, input, valuesOnly]);

    // If final-form updates the value externally, keep Choices in sync
    useEffect(() => {
        if (!choicesRef.current) return;
        if (input.value) {
            choicesRef.current.setChoiceByValue(input.value);
        } else {
            // Clear if there's no value
            choicesRef.current.clearStore();
        }
    }, [input.value]);

    return (
        <FormGroup>
            {label && <Label>{label}</Label>}
            <select ref={selectRef} style={{ display: 'none' }}>
                <option value="">Select</option>
                {/* {selectOptions.map(({ value, name }) => (
                    <option key={value} value={value}>
                        {valuesOnly ? value : name}
                    </option>
                ))} */}
            </select>
            {displayOptions && (
                <div style={{ marginTop: '0.5rem' }}>
                    {selectOptions.map(({ value, name }) => (
                        <a
                            key={`${value}-${name}`}
                            href="#"
                            style={{ marginRight: '0.75rem' }}
                            onClick={(e) => {
                                e.preventDefault();
                                // Update final-form and choices to reflect the clicked option
                                input.onChange(value);
                                if (choicesRef.current) {
                                    choicesRef.current.setChoiceByValue(value);
                                }
                            }}
                        >
                            {name}
                        </a>
                    ))}
                </div>
            )}
        </FormGroup>
    );
};

export default OptionSelect;
