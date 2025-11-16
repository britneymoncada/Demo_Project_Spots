const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__save-button",
  inactiveButtonClass: "modal__save-button_inactive",
  inputErrorClass: "modal__input-error_active",
  errorClass: "modal__error_visible",
};

/* -------- FORM VALIDATION HELPERS --------- */

function showInputError(formElement, inputElement, errorMessage, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;
  errorElement.textContent = errorMessage;
  errorElement.classList.add(settings.inputErrorClass);
}

function hideInputError(formElement, inputElement, settings) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  if (!errorElement) return;
  errorElement.textContent = "";
  errorElement.classList.remove(settings.inputErrorClass);
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => !inputElement.validity.valid);
}

function toggleButtonState(inputList, buttonElement, settings) {
  if (!buttonElement) return;
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(settings.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(settings.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}
/* -------- FORM EVENT LISTENERS--------- */

function checkInput(formElement, inputElement, settings) {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      settings
    );
  } else {
    hideInputError(formElement, inputElement, settings);
  }
}

function setEventListeners(formElement, settings) {
  const inputs = Array.from(
    formElement.querySelectorAll(settings.inputSelector)
  );
  const button = formElement.querySelector(settings.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInput(formElement, input, settings);
      toggleButtonState(inputs, button, settings);
    });
  });

  toggleButtonState(inputs, button, settings);
}
/* -------- ENABLE VALIDATION --------- */

function enableValidation(settings) {
  const forms = Array.from(document.querySelectorAll(settings.formSelector));
  forms.forEach((form) => {
    setEventListeners(form, settings);
  });
}

export { enableValidation, settings };
