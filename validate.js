// Add document load event listener
document.addEventListener("DOMContentLoaded", load);

function formHasErrors() {
	let errorFlag = false;

	// Check required fields.
	let requiredFields = ["name", "phone", "email"];

	for (let i = 0; i < requiredFields.length; i++) {
		let textField = document.getElementById(requiredFields[i]);

		if (!formFieldHasInput(textField)) {
			document.getElementById(requiredFields[i] + "_error").style.display = "block";
			errorFlag = true;
		}
	}

	// Check if email is valid.
	let email = document.getElementById("email").value;
	let emailRegex = new RegExp(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+[.][A-Z]{2,}$/i);

	if (!emailRegex.test(email) && email != "") {
		document.getElementById("emailFormat_error").style.display = "block";
		errorFlag = true;
	}

    // Check if phone number is valid.
    let phoneNumber = document.getElementById("phone").value;
    let phoneRegex = new RegExp(/^\d{3}-?\d{3}-?\d{4}$/);

    if (!phoneRegex.test(phoneNumber) && phoneNumber != "") {
		document.getElementById("phoneFormat_error").style.display = "block";
		errorFlag = true;
	}

	// Focus first element with error.
	let errorFields = ["name", "phone", "email"];
	for (let i = 0; i < errorFields.length; i++) {
		if (document.getElementById(errorFields[i] + "_error").style.display == "block") {
			document.getElementById(errorFields[i]).focus();
			break;
		}
	}

	return errorFlag;
}

function hideErrors() {
	// Get an array of error elements.
	let error = document.getElementsByClassName("error");

	// Loop through each element in the error array.
	for (let i = 0; i < error.length; i++) {
		// Hide the error element by setting it's display style to "none".
		error[i].style.display = "none";
	}
}

function resetForm(e) {
	// Confirm that the user wants to reset the form.
	if (confirm('Clear form?')) {
		// Ensure all error fields are hidden.
		hideErrors();

		// Set focus to the first text field on the page.
		document.getElementById("name").focus();

		return true;
	}

	// Prevents the form from resetting
	e.preventDefault();

	return false;
}

function formFieldHasInput(fieldElement) {
	// Check if the text field has a value.
	if (fieldElement.value == null || fieldElement.value.trim() == "") {
		// Invalid entry.
		return false;
	}

	// Valid entry.
	return true;
}

function validate(e) {
	// Hides all error elements on the page.
	hideErrors();

	// Determine if the form has errors.
	if (formHasErrors()) {
		// Prevents the form from submitting.
		e.preventDefault();

		return false;
	}

	return true;
}


function load() {
    // Add event listener for submit.
	document.getElementById("contactform").addEventListener("submit", validate);

	// Hide error messages.
	hideErrors();

	// Add event listener for reset.
	document.getElementById("contactform").addEventListener("reset", resetForm);
}