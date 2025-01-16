/* eslint-disable */

/**
 * Web UI Validation.
 * 
 * Client side JavaScript functions for data validation using Shoelace controls
 * 
 * @module "web.ui.validation"
 */

/**
 * Javascript code that can be injected into an HTML page.
 * @returns {string} Validation JavaScript code.
 */
export function getCode() {
    let code = '\n\n';
    code += wireUpChanges.toString();
    code += '\n\n';
    code += checkValidity.toString();
    code += '\n\n';
    code += resetValidity.toString();
    code += '\n\n';
    code += checkControlValidity.toString();
    code += '\n\n';
    code += displayInvalid.toString();
    code += '\n\n';
    code += displayValid.toString();

    return code;
}

function wireUpChanges(container) {
    for (const control of container.querySelectorAll('[id]')) {

        if (!control.nodeName.startsWith('SL')) {
            // We only support Shoelace controls
            continue;
        }

        if (control.dataset.validationExempt !== undefined) {
            // Console.log(`won't validate control ${control.id} as its exempt`)
            continue;
        }

        // Shoelace input controls e.g. check box, input etc will fire an 'sl-change' event
        // When their value changes
        control.addEventListener('sl-change', (event) => {
            checkControlValidity(event.target);
        });
    } // Next control in container
}

function checkValidity(container) {
    let isValid = true;

    for (const control of container.querySelectorAll('[id]')) {

        if (!control.nodeName.startsWith('SL')) {
            // We only support Shoelace controls
            continue;
        }

        if (control.dataset.validationExempt !== undefined) {
            // Console.log(`won't validate control ${control.id} as its exempt`)
            continue;
        }

        if (checkControlValidity(control) === false) {
            isValid = false;
        }
    } // Next control in container

    return isValid;
}

function resetValidity(container) {
    for (const control of container.querySelectorAll(['[id]'])) {
        if (!control.nodeName.startsWith('SL')) {
            // We only support Shoelace controls
            continue;
        }

        displayValid(control);
    }
}

function checkControlValidity(control) {

    let isValid = true;
    displayValid(control);

    const valid = control.validity;

    // controls like sl-alert will have a validity of undefined. These are presumed to be valid.
    if (valid !==undefined && !valid.valid) {
        isValid = false;
        if (valid.badInput) {
            displayInvalid(control, control.dataset.badInputMessage ?? 'bad input');
        }
        if (valid.customError) {
            displayInvalid(control, control.dataset.customErrorMessage ?? 'custom error');
        }
        if (valid.patternMismatch) {
            displayInvalid(control, control.dataset.patternMismatchMessage ?? `${control.dataset.label ?? control.label ?? control.id} does not match pattern ${control.pattern}`);
        }
        if (valid.rangeOverflow) {
            displayInvalid(control, control.dataset.rangeOverflowMessage ?? `${control.dataset.label ?? control.label ?? control.id} exceeds maximum value ${control.max}`);
        }
        if (valid.rangeUnderflow) {
            displayInvalid(control, control.dataset.rangeUnderflowMessage ?? `${control.dataset.label ?? control.label ?? control.id} is lower than minimum value ${control.min}`);
        }
        if (valid.stepMismatch) {
            displayInvalid(control, control.dataset.stepMismatchMessage ?? `${control.dataset.label ?? control.label ?? control.id} is not a valid step (${control.step})`);
        }
        if (valid.tooLong) {
            displayInvalid(control, control.dataset.tooLongMessage ?? `${control.dataset.label ?? control.label ?? control.id} cannot be longer than ${control.maxlength} characters`);
        }
        if (valid.tooShort) {
            displayInvalid(control, control.dataset.tooShortMessage ?? `${control.dataset.label ?? control.label ?? control.id} must be at least ${control.minlength} characters`);
        }
        if (valid.typeMismatch) {
            displayInvalid(control, control.dataset.typeMismatchMessage ?? `${control.dataset.label ?? control.label ?? control.id} is not a valid ${control.type}`);
        }
        if (valid.valueMissing) {
            displayInvalid(control, control.dataset.valueMissingMessage ?? `${control.dataset.label ?? control.label ?? control.id} is required`);
        }
    }

    return isValid;
}

function displayInvalid(control, text) {

    // Add style to control
    control.classList.add('invalid-input');

    // Remove any existing validation messages
    const parent = control.parentElement;
    const invalidMessageDiv = parent.querySelector('#invalid-message-div');

    if (invalidMessageDiv) {
        invalidMessageDiv.remove();
    }

    // show the invalid message in the help text
    // this is not ideal as it will overwrite any actual help text.
    // doing this as a work around
    control.helpText = text

    // the below code shows what I'd like to do, but I can't get it to work reliably
    // // Add invalid message
    // const div = document.createElement('div');
    // div.id = 'invalid-message-div';
    // div.innerText = text;
    // div.style.cssText = 'color:var(--sl-color-danger-500);font-size:var(--sl-input-help-text-font-size-medium);font-weight:bold';
    
    // control.after(div);

}

function displayValid(control) {
    control.classList.remove('invalid-input');

    const parent = control.parentElement;
    const invalidMessageDiv = parent.querySelector('#invalid-message-div');

    if (invalidMessageDiv) {
        invalidMessageDiv.remove();
    }
}
