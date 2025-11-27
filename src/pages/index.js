import "./index.css";
import { enableValidation, settings } from "../scripts/validation.js";
import Logo from "../images/Logo.svg";
import Avatar from "../images/Avatar.svg";
import PencilIcon from "../images/Pencil-icon.svg";
import PlusIcon from "../images/Plus-icon.svg";

document.querySelector(".header__logo").src = Logo;
document.querySelector(".profile__avatar").src = Avatar;
document.querySelector(".profile__edit-button img").src = PencilIcon;
document.querySelector(".profile__plus").src = PlusIcon;

enableValidation(settings);

// ==== 1. DATA (INITIAL CARDS) ==== //

const initialCards = [
  {
    name: "Horizontal Test",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },

  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },

  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },

  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },

  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },

  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },

  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

// ==== 2. DOM ELEMENT SELECTION ==== //

/* ------- EDIT PROFILE MODAL ELEMENTS ---------*/

const editProfileBtn = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#edit-name");
const editProfileDescriptionInput =
  editProfileModal.querySelector("#describe-yourself");
const editProfileCloseBtn = editProfileModal.querySelector(
  ".modal__close-button"
);

/* ------- PROFILE DISPLAY ELEMENTS ---------*/

const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

/* ------- NEW POST MODAL ELEMENTS ---------*/

const newPostBtn = document.querySelector(".profile__post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const imageLink = newPostForm.querySelector("#url");
const imageCaption = newPostForm.querySelector("#caption-text");
const newPostSaveBtn = newPostModal.querySelector(".modal__save-button");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-button");

/* ------- CARDS LIST & TEMPLATE  ---------*/

const cardsContainer = document.querySelector(".cards__list");
const cardTemplate = cardsContainer.querySelector("#card-template");

/*---------- PREVIEW CARD MODAL -----------*/

const cardPreviewModal = document.querySelector("#modal__card-preview");
const cardPreviewClose = cardPreviewModal.querySelector(
  ".modal__preview-close"
);
const cardPreviewModalImage = cardPreviewModal.querySelector(".modal__link");
const cardPreviewCaption = cardPreviewModal.querySelector(".modal__caption");

/*---------- CARD INPUTS -----------*/

const editProfileInputs = Array.from(
  editProfileForm.querySelectorAll(".modal__input")
);
const newPostInputs = Array.from(newPostForm.querySelectorAll(".modal__input"));

/*---------- START VALIDATION  -----------*/

let isEscListenerActive = false;

function handleEscKey(evt) {
  if (evt.key !== "Escape") return;
  const openModalElement = document.querySelector(".modal_opened");
  if (openModalElement) closeModal(openModalElement);
}

// ==== 3. UTILITY FUNCTIONS ==== //

/* --------- REUSABLE OPEN & CLOSE MODALS --------- */

function openModal(modal) {
  modal.classList.add("modal_opened");

  /* --------- ADD ESC LISTENER - 1ST TIME CLICKED --------- */

  if (!isEscListenerActive) {
    document.addEventListener("keydown", handleEscKey);
    isEscListenerActive = true;
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");

  /* --------- REMOVE ESC LISTENER - AFTER ITS CLICKED --------- */
  if (isEscListenerActive && !document.querySelector(".modal_opened")) {
    document.removeEventListener("keydown", handleEscKey);
    isEscListenerActive = false;
  }
}

/*----------- CLOSE MODAL WHEN OUT LAYER CLICKED -------- */

document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) {
      closeModal(modal);
    }
  });
});

// ==== 4. FEATURE-SPECIFIC FUNCTIONS ==== //

/* ------------ UPDATE CARDS FUNCTION ------------- */

function getCardElement(data) {
  const cardElement = cardTemplate.content.cloneNode(true);

  const cardElementImage = cardElement.querySelector(".card__image");
  cardElementImage.src = data.link;
  cardElementImage.alt = data.name;

  const cardElementName = cardElement.querySelector(".card__name");
  cardElementName.textContent = data.name;

  const cardLikeBtn = cardElement.querySelector(".card__like-button");

  cardLikeBtn.addEventListener("click", () => {
    cardLikeBtn.classList.toggle("card__like-button-clicked");
  });

  const cardDeleteBtnElement = cardElement.querySelector(".card__delete-btn");
  cardDeleteBtnElement.addEventListener("click", () => {
    cardDeleteBtnElement.closest(".card").remove();
  });

  cardElementImage.addEventListener("click", () => {
    cardPreviewCaption.textContent = data.name;
    cardPreviewModalImage.src = data.link;
    cardPreviewModalImage.alt = data.name;
    openModal(cardPreviewModal);
  });

  return cardElement;
}

/* ------------ EDIT PROFILE FUNCTION ------------ */

function editProfileSubmit() {
  profileName.textContent = editProfileNameInput.value;
  profileDescription.textContent = editProfileDescriptionInput.value;
}

/* ------------- NEW CARD FUNCTION --------------- */

function openNewCardPost(evt) {
  evt.preventDefault();
  openModal(newPostModal);
}

// ==== 5. EVENT LISTENERS ==== //

/*----------- PREVIEW MODAL CLOSE -------- */

cardPreviewClose.addEventListener("click", () => {
  closeModal(cardPreviewModal);
});

/*----------- EDIT PROFILE MODAL OPEN/CLOSE/SUBMIT -------- */
editProfileBtn.addEventListener("click", () => {
  openModal(editProfileModal);
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  editProfileSubmit();
  closeModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () => {
  closeModal(editProfileModal);
});

/*----------- NEW POST MODAL OPEN/CLOSE/SUBMIT -------- */

newPostBtn.addEventListener("click", (evt) => {
  openNewCardPost(evt);
});

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const data = {
    name: imageCaption.value.trim(),
    link: imageLink.value.trim(),
  };

  const newCard = getCardElement(data);

  cardsContainer.prepend(newCard);

  newPostForm.reset();

  closeModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
  closeModal(newPostModal);
});

// ==== 6. INITIAL RENDERING ==== //

/* STARTING CARDS IN FLEXGRID */

initialCards.forEach((data) => {
  const clonedCard = getCardElement(data);
  cardsContainer.prepend(clonedCard);
});
