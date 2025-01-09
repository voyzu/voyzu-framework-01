/* eslint-disable */

/**
 * Web UI Alert.
 * 
 * Client side JavaScript functions for working with the Shoelace alert component
 * 
 * @module "web.ui.alert"
 */

/**
 * Javascript code that can be injected into an HTML page.
 * @returns {string} Alert JavaScript code.
 */
export function getCode() {
    let code = '\n\n';
    code += showAlert.toString();
    code += '\n\n';
    code += hideAlert.toString();

    return code;
}

function showAlert(element, variant = 'primary', heading = '', message = '', closable = true, iconName = 'match-variant') {

    if (!element) {
        throw new Error('you must provide the alert element to call showAlert');
    }

    if (!heading) {
        throw new Error('you must provide a heading to call showAlert');
    }

    element.querySelector('#alert-heading').innerText = heading;
    element.querySelector('#alert-message').innerHTML = message;
    element.closable = closable;
    element.variant = variant;

    // Set the alert icon. We are using Shoelace icons here, i.e. not font awesome

    let alertIcon;
    if (iconName === 'match-variant') {
        switch (variant) {
            case 'primary': {
                alertIcon = 'info-circle';
                break;
            }
            case 'success': {
                alertIcon = 'check2-circle';
                break;
            }
            case 'neutral': {
                alertIcon = 'info-circle';
                break;
            }
            case 'warning': {
                alertIcon = 'exclamation-triangle';
                break;
            }
            case 'danger': {
                alertIcon = 'exclamation-octagon';
                break;
            }
            default: {
                console.error(`could not find icon matching variant ${variant}`);
            }
        }
    } else {
        alertIcon = iconName;
    }

    element.querySelector('sl-icon').name = alertIcon;

    element.show();
};

function hideAlert(element) {

    if (!element) {
        throw new Error('you must provide the alert element to call hideAlert');
    }
    element.hide();
};
