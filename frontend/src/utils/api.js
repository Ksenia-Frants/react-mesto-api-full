class Api {
  constructor(data) {
    this._url = data.url;
    this._headers = null;
  }
  // Обработчик статуса
  _errorHandler(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }
  _setHeaders(token) {
    this._headers = {
      authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  // Запрос информации о пользователе
  getUser(token) {
    this._setHeaders(token);
    return fetch(`${this._url}users/me`, {
      headers: this._headers,
    }).then((res) => this._errorHandler(res));
  }
  // Запрос карточек с сервера
  getinitialCards() {
    return fetch(`${this._url}cards`, {
      headers: this._headers,
    }).then((res) => this._errorHandler(res));
  }
  // Редактирование профиля
  editProfile(name, about) {
    return fetch(`${this._url}users/me`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        about: about,
      }),
    }).then((res) => this._errorHandler(res));
  }
  // Добавление карточки
  addCard(name, link) {
    return fetch(`${this._url}cards`, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        name,
        link,
      }),
    }).then((res) => this._errorHandler(res));
  }
  // Лайк карточке
  addLike(id) {
    return fetch(`${this._url}cards/${id}/likes`, {
      method: "PUT",
      headers: this._headers,
    }).then((res) => this._errorHandler(res));
  }
  // Удаление лайка
  deleteLike(id) {
    return fetch(`${this._url}cards/${id}/likes`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._errorHandler(res));
  }
  // Удаление карточки
  deleteCard(id) {
    return fetch(`${this._url}cards/${id}`, {
      method: "DELETE",
      headers: this._headers,
    }).then((res) => this._errorHandler(res));
  }
  // Редактирование аватара
  editAvatar(avatar) {
    return fetch(`${this._url}users/me/avatar`, {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar,
      }),
    }).then((res) => this._errorHandler(res));
  }
  // Добавление лайка карточке
  changeLikeCardStatus(id, isLiked) {
    return fetch(`${this._url}cards/${id}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: this._headers,
    }).then((res) => this._errorHandler(res));
  }
}

const api = new Api({
  url: "http://localhost:3000/"
});

export default api;
