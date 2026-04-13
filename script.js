const subjectOptions = [
  "Maths",
  "Physics",
  "Chemistry",
  "Computer Science",
  "English",
  "Economics",
  "Arts",
  "Accounting",
  "Biology",
  "History"
];

const citiesByState = {
  California: ["Los Angeles", "San Diego", "San Francisco"],
  Texas: ["Houston", "Dallas", "Austin"],
  Florida: ["Miami", "Orlando", "Tampa"],
  "New York": ["New York City", "Buffalo", "Albany"]
};

const form = document.getElementById("student-form");

const elements = {
  form,
  firstName: document.getElementById("firstName"),
  lastName: document.getElementById("lastName"),
  email: document.getElementById("email"),
  genderInputs: Array.from(form.querySelectorAll('input[name="gender"]')),
  mobile: document.getElementById("mobile"),
  dateOfBirth: document.getElementById("dateOfBirth"),
  subjectsInput: document.getElementById("subjectsInput"),
  subjectsList: document.getElementById("subjectsList"),
  subjectsBox: document.getElementById("subjectsBox"),
  hobbyInputs: Array.from(form.querySelectorAll('input[name="hobbies"]')),
  picture: document.getElementById("picture"),
  fileName: document.getElementById("fileName"),
  picturePreviewBox: document.getElementById("picturePreviewBox"),
  picturePreviewGrid: document.getElementById("picturePreviewGrid"),
  picturePreviewStatus: document.getElementById("picturePreviewStatus"),
  address: document.getElementById("address"),
  state: document.getElementById("state"),
  city: document.getElementById("city"),
  directionsToggle: document.getElementById("directionsToggle"),
  directionsPanel: document.getElementById("directionsPanel"),
  modal: document.getElementById("resultModal"),
  resultBody: document.getElementById("resultBody"),
  closeButtons: [document.getElementById("closeModal"), document.getElementById("closeFooter")]
};

const errors = {
  name: document.getElementById("nameError"),
  email: document.getElementById("emailError"),
  gender: document.getElementById("genderError"),
  mobile: document.getElementById("mobileError"),
  dateOfBirth: document.getElementById("dateOfBirthError"),
  subjects: document.getElementById("subjectsError"),
  hobbies: document.getElementById("hobbiesError"),
  picture: document.getElementById("pictureError"),
  address: document.getElementById("addressError"),
  stateCity: document.getElementById("stateCityError")
};

const state = {
  selectedSubjects: [],
  selectedPictures: []
};

function setFieldError(element, message = "") {
  if (element) element.textContent = message;
}

function setValidity(input, isValid, message, errorElement) {
  if (input) {
    input.setCustomValidity(isValid ? "" : message);
  }
  setFieldError(errorElement, isValid ? "" : message);
  return isValid;
}

function clearCustomValidity(inputs) {
  inputs.forEach((input) => input.setCustomValidity(""));
}

function normalizeDateInput(value) {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 6);
  let formatted = "";

  if (digitsOnly.length > 0) formatted += digitsOnly.slice(0, 2);
  if (digitsOnly.length > 2) formatted += `.${digitsOnly.slice(2, 4)}`;
  if (digitsOnly.length > 4) formatted += `.${digitsOnly.slice(4, 6)}`;

  return formatted;
}

function createRow(label, value) {
  const row = document.createElement("tr");
  const key = document.createElement("th");
  const content = document.createElement("td");
  key.textContent = label;
  content.textContent = value || "-";
  row.append(key, content);
  return row;
}

function getCheckedValues(name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function validateName() {
  const firstNameFilled = Boolean(elements.firstName.value.trim());
  const lastNameFilled = Boolean(elements.lastName.value.trim());
  const isValid = firstNameFilled && lastNameFilled;

  if (isValid) {
    clearCustomValidity([elements.firstName, elements.lastName]);
    setFieldError(errors.name, "");
    return true;
  }

  elements.firstName.setCustomValidity(firstNameFilled ? "" : "Please enter your first name");
  elements.lastName.setCustomValidity(lastNameFilled ? "" : "Please enter your last name");
  setFieldError(errors.name, "Please fill in first name and last name");
  return false;
}

function validateEmail() {
  if (!elements.email.value.trim()) {
    return setValidity(elements.email, false, "Please enter your email", errors.email);
  }

  return setValidity(elements.email, elements.email.checkValidity(), "Please enter a valid email address", errors.email);
}

function validateGender() {
  const isValid = elements.genderInputs.some((input) => input.checked);
  elements.genderInputs.forEach((input, index) => {
    input.setCustomValidity(index === 0 && !isValid ? "Please select a gender" : "");
  });
  setFieldError(errors.gender, isValid ? "" : "Please select a gender");
  return isValid;
}

function validateMobile() {
  const digitsOnly = elements.mobile.value.replace(/\D/g, "");
  if (elements.mobile.value !== digitsOnly) {
    elements.mobile.value = digitsOnly;
  }

  if (!digitsOnly) {
    return setValidity(elements.mobile, false, "Please enter your mobile number", errors.mobile);
  }

  return setValidity(
    elements.mobile,
    digitsOnly.length === 10,
    "Mobile number must contain exactly 10 digits",
    errors.mobile
  );
}

function validateDateOfBirth() {
  const normalized = normalizeDateInput(elements.dateOfBirth.value);
  if (elements.dateOfBirth.value !== normalized) {
    elements.dateOfBirth.value = normalized;
  }

  if (!elements.dateOfBirth.value.trim()) {
    return setValidity(elements.dateOfBirth, false, "Please enter your date of birth", errors.dateOfBirth);
  }

  return setValidity(
    elements.dateOfBirth,
    /^\d{2}\.\d{2}\.\d{2}$/.test(elements.dateOfBirth.value),
    "Use format DD.MM.YY, for example 01.01.01",
    errors.dateOfBirth
  );
}

function findSubjectMatches(filter = "") {
  const normalized = filter.trim().toLowerCase();
  return subjectOptions.filter((subject) => {
    return !state.selectedSubjects.includes(subject) && subject.toLowerCase().includes(normalized);
  });
}

function renderSubjects(filter = "") {
  const normalized = filter.trim().toLowerCase();
  const matches = findSubjectMatches(filter);

  elements.subjectsList.innerHTML = "";
  if (!normalized || matches.length === 0) {
    elements.subjectsList.classList.remove("show");
    elements.subjectsInput.setAttribute("aria-expanded", "false");
    return;
  }

  matches.forEach((subject, index) => {
    const item = document.createElement("li");
    item.textContent = subject;
    item.role = "option";
    item.dataset.value = subject;
    if (index === 0) item.classList.add("active");
    item.addEventListener("mousedown", (event) => {
      event.preventDefault();
      addSubject(subject);
    });
    elements.subjectsList.appendChild(item);
  });

  elements.subjectsList.classList.add("show");
  elements.subjectsInput.setAttribute("aria-expanded", "true");
}

function validateSubjects() {
  const typedValue = elements.subjectsInput.value.trim();

  if (typedValue) {
    return setValidity(elements.subjectsInput, false, "Please choose a subject from the list", errors.subjects);
  }

  return setValidity(
    elements.subjectsInput,
    state.selectedSubjects.length > 0,
    "Please select at least one subject",
    errors.subjects
  );
}

function refreshSubjectChips() {
  elements.subjectsBox.querySelectorAll(".chip").forEach((chip) => chip.remove());

  state.selectedSubjects.forEach((subject) => {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `${subject}<button type="button" aria-label="Remove ${subject}">&times;</button>`;
    chip.querySelector("button").addEventListener("click", () => {
      const index = state.selectedSubjects.indexOf(subject);
      if (index >= 0) state.selectedSubjects.splice(index, 1);
      refreshSubjectChips();
      validateSubjects();
      renderSubjects(elements.subjectsInput.value);
    });
    elements.subjectsBox.insertBefore(chip, elements.subjectsInput);
  });
}

function addSubject(subject) {
  if (!state.selectedSubjects.includes(subject)) {
    state.selectedSubjects.push(subject);
    refreshSubjectChips();
  }
  validateSubjects();
  elements.subjectsInput.value = "";
  renderSubjects("");
  elements.subjectsInput.focus();
}

function validateHobbies() {
  const isValid = elements.hobbyInputs.some((input) => input.checked);
  elements.hobbyInputs.forEach((input, index) => {
    input.setCustomValidity(index === 0 && !isValid ? "Please select at least one hobby" : "");
  });
  setFieldError(errors.hobbies, isValid ? "" : "Please select at least one hobby");
  return isValid;
}

function syncPictureSummary(message = "") {
  if (state.selectedPictures.length === 0) {
    elements.fileName.textContent = "No file selected";
    elements.picturePreviewStatus.textContent = message || "No images selected";
    elements.picturePreviewBox.hidden = true;
    return;
  }

  elements.fileName.textContent = `${state.selectedPictures.length} image(s) selected`;
  elements.picturePreviewStatus.textContent = message || "Unique images selected";
  elements.picturePreviewBox.hidden = false;
}

function validatePicture() {
  return setValidity(null, state.selectedPictures.length > 0, "Please upload at least one picture", errors.picture);
}

function renderPictureGallery() {
  elements.picturePreviewGrid.innerHTML = "";

  state.selectedPictures.forEach((picture, index) => {
    const card = document.createElement("div");
    card.className = "picture-card";
    card.setAttribute("data-testid", `picture-card-${index + 1}`);

    const image = document.createElement("img");
    image.src = picture.url;
    image.alt = picture.name;
    image.setAttribute("data-testid", `picture-preview-${index + 1}`);

    const meta = document.createElement("div");
    meta.className = "picture-meta";

    const name = document.createElement("div");
    name.className = "picture-name";
    name.textContent = picture.name;

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "picture-remove";
    removeButton.textContent = "Remove";
    removeButton.setAttribute("data-testid", `remove-picture-${index + 1}`);
    removeButton.addEventListener("click", () => removePicture(picture.name));

    meta.append(name, removeButton);
    card.append(image, meta);
    elements.picturePreviewGrid.appendChild(card);
  });
}

function removePicture(name) {
  const pictureIndex = state.selectedPictures.findIndex((picture) => picture.name === name);
  if (pictureIndex === -1) return;

  URL.revokeObjectURL(state.selectedPictures[pictureIndex].url);
  state.selectedPictures.splice(pictureIndex, 1);
  renderPictureGallery();
  syncPictureSummary();
  validatePicture();
}

function handlePictureChange() {
  const files = Array.from(elements.picture.files || []);
  let duplicateCount = 0;

  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;
    if (state.selectedPictures.some((picture) => picture.name === file.name)) {
      duplicateCount += 1;
      return;
    }

    state.selectedPictures.push({
      name: file.name,
      url: URL.createObjectURL(file)
    });
  });

  renderPictureGallery();
  syncPictureSummary(duplicateCount > 0 ? `${duplicateCount} duplicate image(s) skipped` : "");
  validatePicture();
  elements.picture.value = "";
}

function validateAddress() {
  return setValidity(
    elements.address,
    Boolean(elements.address.value.trim()),
    "Please enter your current address",
    errors.address
  );
}

function fillCities(stateValue) {
  elements.city.innerHTML = '<option value="">Select City</option>';
  (citiesByState[stateValue] || []).forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    elements.city.appendChild(option);
  });
}

function validateStateCity() {
  const stateSelected = Boolean(elements.state.value);
  const citySelected = Boolean(elements.city.value);
  const isValid = stateSelected && citySelected;

  if (isValid) {
    clearCustomValidity([elements.state, elements.city]);
    setFieldError(errors.stateCity, "");
    return true;
  }

  elements.state.setCustomValidity(stateSelected ? "" : "Please select a state");
  elements.city.setCustomValidity(citySelected ? "" : "Please select a city");
  setFieldError(errors.stateCity, "Please select both state and city");
  return false;
}

function toggleDirections() {
  const isExpanded = elements.directionsToggle.getAttribute("aria-expanded") === "true";
  elements.directionsToggle.setAttribute("aria-expanded", String(!isExpanded));
  elements.directionsPanel.hidden = isExpanded;
}

function submitForm(event) {
  event.preventDefault();

  const allValid = [
    validateName(),
    validateEmail(),
    validateGender(),
    validateMobile(),
    validateDateOfBirth(),
    validateSubjects(),
    validateHobbies(),
    validatePicture(),
    validateAddress(),
    validateStateCity()
  ].every(Boolean);

  if (!allValid || !elements.form.reportValidity()) {
    return;
  }

  const gender = elements.form.querySelector('input[name="gender"]:checked')?.value || "";
  const hobbies = getCheckedValues("hobbies").join(", ");
  const picture = state.selectedPictures.map((item) => item.name).join(", ");
  const stateValue = elements.state.value;
  const cityValue = elements.city.value;

  elements.resultBody.innerHTML = "";
  elements.resultBody.append(
    createRow("Student Name", `${elements.firstName.value} ${elements.lastName.value}`.trim()),
    createRow("Student Email", elements.email.value),
    createRow("Gender", gender),
    createRow("Mobile", elements.mobile.value),
    createRow("Date of Birth", elements.dateOfBirth.value),
    createRow("Subjects", state.selectedSubjects.join(", ")),
    createRow("Hobbies", hobbies),
    createRow("Picture", picture),
    createRow("Address", elements.address.value),
    createRow("State and City", [stateValue, cityValue].filter(Boolean).join(" "))
  );

  elements.modal.classList.add("open");
  elements.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  elements.modal.classList.remove("open");
  elements.modal.setAttribute("aria-hidden", "true");
}

function bindEvents() {
  elements.subjectsInput.addEventListener("input", () => {
    const typedValue = elements.subjectsInput.value.trim();
    if (typedValue && findSubjectMatches(typedValue).length === 0) {
      elements.subjectsInput.value = "";
      setValidity(elements.subjectsInput, false, "Please choose a subject from the list", errors.subjects);
      renderSubjects("");
      return;
    }

    renderSubjects(elements.subjectsInput.value);
    validateSubjects();
  });

  elements.subjectsInput.addEventListener("focus", validateSubjects);
  elements.subjectsInput.addEventListener("blur", () => {
    setTimeout(() => {
      if (elements.subjectsInput.value.trim()) {
        elements.subjectsInput.value = "";
      }
      validateSubjects();
      renderSubjects("");
    }, 0);
  });

  elements.subjectsInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const first = elements.subjectsList.querySelector("li");
      if (first) {
        event.preventDefault();
        addSubject(first.dataset.value);
      }
    }

    if (event.key === "Backspace" && !elements.subjectsInput.value && state.selectedSubjects.length) {
      state.selectedSubjects.pop();
      refreshSubjectChips();
      validateSubjects();
    }
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".subject-input")) {
      renderSubjects("");
    }
  });

  [elements.firstName, elements.lastName].forEach((input) => {
    input.addEventListener("blur", validateName);
    input.addEventListener("input", validateName);
  });

  elements.email.addEventListener("blur", validateEmail);
  elements.email.addEventListener("input", validateEmail);

  elements.genderInputs.forEach((input) => {
    input.addEventListener("change", validateGender);
    input.addEventListener("blur", validateGender);
  });

  elements.mobile.addEventListener("input", validateMobile);
  elements.mobile.addEventListener("blur", validateMobile);

  elements.dateOfBirth.addEventListener("input", validateDateOfBirth);
  elements.dateOfBirth.addEventListener("blur", validateDateOfBirth);

  elements.hobbyInputs.forEach((input) => {
    input.addEventListener("change", validateHobbies);
    input.addEventListener("focus", validateHobbies);
  });

  elements.picture.addEventListener("change", handlePictureChange);

  elements.address.addEventListener("blur", validateAddress);
  elements.address.addEventListener("input", validateAddress);

  elements.state.addEventListener("change", () => {
    fillCities(elements.state.value);
    validateStateCity();
  });
  elements.state.addEventListener("blur", validateStateCity);
  elements.city.addEventListener("change", validateStateCity);
  elements.city.addEventListener("blur", validateStateCity);

  elements.directionsToggle.addEventListener("click", toggleDirections);
  elements.form.addEventListener("submit", submitForm);

  elements.closeButtons.forEach((button) => button.addEventListener("click", closeModal));
  elements.modal.addEventListener("click", (event) => {
    if (event.target === elements.modal) {
      closeModal();
    }
  });
}

bindEvents();
