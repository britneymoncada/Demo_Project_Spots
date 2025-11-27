// ==================================================
// IMPORTS
// ==================================================
import Api from "../utils/Api.js";
import "./index.css";
import { enableValidation, settings } from "../scripts/validation.js";
import Logo from "../images/Logo.svg";
import PencilIcon from "../images/Pencil-icon.svg";
import PlusIcon from "../images/Plus-icon.svg";

// ==================================================
// STATIC ASSETS
// ==================================================
document.querySelector(".header__logo").src = Logo;
document.querySelector(".profile__edit-button img").src = PencilIcon;
document.querySelector(".profile__plus").src = PlusIcon;

// ==================================================
// VALIDATION
// ==================================================
enableValidation(settings);

// ==================================================
// API INSTANCE
// ==================================================
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "def9c0b2-c1f5-4f76-af66-d2a8d245db4a",
    "Content-Type": "application/json",
  },
});

// ==================================================
// GLOBAL STATE
// ==================================================
let selectedCard = null;
let selectedCardId = null;
let isEscListenerActive = false;

// ==================================================
// DOM ELEMENTS
// ==================================================

// Profile
const editProfileBtn = document.querySelector(".profile__edit-button");
const profileAvatar = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Profile modals/forms
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = document.querySelector("#edit-name");
const editProfileDescriptionInput =
  document.querySelector("#describe-yourself");
const editProfileCloseBtn = editProfileModal.querySelector(
  ".modal__close-button"
);

const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarForm = document.querySelector("#edit-avatar-form");
const avatarInput = document.querySelector("#avatar-link");
const editAvatarCloseBtn = editAvatarModal.querySelector(
  ".modal__close-button"
);

// New post
const newPostBtn = document.querySelector(".profile__post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostForm = newPostModal.querySelector(".modal__form");
const imageLink = document.querySelector("#url");
const imageCaption = document.querySelector("#caption-text");

// Cards
const cardsContainer = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template");

// Preview modal
const cardPreviewModal = document.querySelector("#modal__card-preview");
const cardPreviewClose = cardPreviewModal.querySelector(
  ".modal__preview-close"
);
const cardPreviewModalImage = document.querySelector(".modal__link");
const cardPreviewCaption = document.querySelector(".modal__caption");

// Delete modal
const deleteCardModal = document.querySelector("#delete-card-modal");
const deleteCardForm = document.querySelector("#delete-card-form");
const deleteCardConfirmBtn =
  deleteCardModal.querySelector(".modal__delete-btn");
const cancelDeleteBtn = deleteCardModal.querySelector(".modal__cancel-button");
const deleteModalCloseBtn = deleteCardModal.querySelector(
  ".modal__close-delete"
);

// ==================================================
// FETCH: USER + CARDS
// ==================================================
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([user, cards]) => {
    profileName.textContent = user.name;
    profileDescription.textContent = user.about;
    profileAvatar.src = user.avatar;
    window.currentUserId = user._id;

    cards.forEach((cardData) => {
      cardsContainer.prepend(createCard(cardData));
    });
  })
  .catch(console.error);

// ==================================================
// LIKE TOGGLE (NO LIKE COUNT)
// ==================================================
function toggleLike(cardId, likeBtn) {
  const liked = likeBtn.classList.contains("card__like-button-clicked");
  const apiCall = liked ? api.removeLike(cardId) : api.addLike(cardId);

  apiCall
    .then(() => {
      likeBtn.classList.toggle("card__like-button-clicked");
    })
    .catch(console.error);
}

// ==================================================
// MODAL UTILITIES
// ==================================================
function openModal(modal) {
  modal.classList.add("modal_opened");

  if (!isEscListenerActive) {
    document.addEventListener("keydown", handleEscKey);
    isEscListenerActive = true;
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");

  if (!document.querySelector(".modal_opened")) {
    document.removeEventListener("keydown", handleEscKey);
    isEscListenerActive = false;
  }
}

function handleEscKey(evt) {
  if (evt.key === "Escape") {
    const modal = document.querySelector(".modal_opened");
    if (modal) closeModal(modal);
  }
}

// Backdrop click → closes modal
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (evt.target.classList.contains("modal")) closeModal(modal);
  });
});

// ==================================================
// CARD FACTORY FUNCTION
// ==================================================
function createCard(cardData) {
  const element = cardTemplate.content.cloneNode(true);
  const card = element.querySelector(".card");

  const cardImage = card.querySelector(".card__image");
  const cardName = card.querySelector(".card__name");
  const likeBtn = card.querySelector(".card__like-button");
  const deleteBtn = card.querySelector(".card__delete-btn");

  const likesArray = Array.isArray(cardData.likes) ? cardData.likes : [];

  card.dataset.id = cardData._id;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardName.textContent = cardData.name;

  // If user already liked it → paint it red
  if (likesArray.some((u) => u._id === window.currentUserId)) {
    likeBtn.classList.add("card__like-button-clicked");
  }

  // Like button click
  likeBtn.addEventListener("click", () => toggleLike(cardData._id, likeBtn));

  // Delete
  deleteBtn.addEventListener("click", () => {
    selectedCard = card;
    selectedCardId = cardData._id;
    openModal(deleteCardModal);
  });

  // Preview
  cardImage.addEventListener("click", () => {
    cardPreviewCaption.textContent = cardData.name;
    cardPreviewModalImage.src = cardData.link;
    cardPreviewModalImage.alt = cardData.name;
    openModal(cardPreviewModal);
  });

  return element;
}

// ==================================================
// EDIT PROFILE
// ==================================================
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileName.textContent;
  editProfileDescriptionInput.value = profileDescription.textContent;
  openModal(editProfileModal);
});

editProfileForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const saveBtn = editProfileForm.querySelector(".modal__save-button");
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "Saving...";

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => (saveBtn.textContent = originalText));
});

// ==================================================
// EDIT AVATAR
// ==================================================
document
  .querySelector(".profile__avatar-edit-button")
  .addEventListener("click", () => {
    avatarInput.value = profileAvatar.src;
    openModal(editAvatarModal);
  });

editAvatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const saveBtn = editAvatarForm.querySelector(".modal__save-button");
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "Saving...";

  api
    .editAvatar(avatarInput.value.trim())
    .then((data) => {
      profileAvatar.src = data.avatar || "https://i.imgur.com/MZQJZ2V.png";
      closeModal(editAvatarModal);
    })
    .catch(console.error)
    .finally(() => (saveBtn.textContent = originalText));
});

// ==================================================
// ADD NEW CARD
// ==================================================
newPostBtn.addEventListener("click", () => openModal(newPostModal));

newPostForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const saveBtn = newPostForm.querySelector(".modal__save-button");
  const originalText = saveBtn.textContent;
  saveBtn.textContent = "Saving...";

  api
    .addCard({
      name: imageCaption.value.trim(),
      link: imageLink.value.trim(),
    })
    .then((data) => {
      cardsContainer.prepend(createCard(data));
      newPostForm.reset();
      closeModal(newPostModal);
    })
    .catch(console.error)
    .finally(() => (saveBtn.textContent = originalText));
});

// ==================================================
// DELETE CARD
// ==================================================
deleteCardForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  deleteCardConfirmBtn.textContent = "Deleting...";

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteCardModal);
    })
    .catch(console.error)
    .finally(() => (deleteCardConfirmBtn.textContent = "Delete"));
});
