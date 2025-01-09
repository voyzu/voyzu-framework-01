/**
 * Web UI Binding.
 *
 * Client side JavaScript functions for binding objects to and from Shoelace controls.
 * @module "web.ui.binding"
 */

/**
 * Javascript code that can be injected into an HTML page.
 * @returns {string} Binding JavaScript code.
 */
export function getCode() {
    let code = '\n\n';
    code += generateObject.toString();
    code += '\n\n';
    code += populateContainer.toString();

    return code;
}

function populateContainer(container, object) {

    for (const [key, val] of Object.entries(object)) {

        // Set element value, if there is an element with an id that matches the property being set
        const elem = container.querySelector(`#${key}`);

        if (elem?.nodeName === 'SL-CHECKBOX') {
            elem.checked = val === true;
        } else if (elem?.nodeName === 'SL-SELECT') {
            elem.value = val? val.toString().replaceAll(' ','_') : '';
        } else if (elem) {
            elem.value = val ? val.toString() : '';
        }
    } // Next object key | value
}

function generateObject(container) {

    const object = {};
    for (const control of container.querySelectorAll('[id]')) {

        if (!control.nodeName.startsWith('SL')) {
            // We only support Shoelace controls
            continue;
        }

        if (control?.nodeName === 'SL-CHECKBOX') {
            object[control.id] = Boolean(control.checked);
        } else if (control?.nodeName === 'SL-SELECT') {
            object[control.id] = control.value.replaceAll('_', ' ');
        } else {
            object[control.id] = control?.value;
        }
    }

    return object;
}
