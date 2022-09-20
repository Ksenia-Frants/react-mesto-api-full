import { useState, useEffect } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeletePopup from './DeletePopup';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import * as auth from '../utils/auth';

function App() {
  //Определяем сотояния
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isTooltipPopupOpen, setIsTooltipPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({
    isOpen: false,
    element: {},
  });
  const [deletedCard, setDeletedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({
    name: '',
    about: '',
  });
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isRegisterOk, setIsRegisterOk] = useState(false);
  const [userEmail, setUserEmail] = useState('lalala@mail.ru');
  const history = useHistory();

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      auth
        .getContent(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            setUserEmail(res.email);
            history.push('/');
          }
        })
        .catch((err) => console.log(err));
    }
  }, [history])

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (loggedIn && jwt) {
      api
      .getUser(jwt)
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      api
      .getinitialCards()
      .then((res) => {
        setCards(res.reverse());
      })
      .catch((err) => console.log(err));
    }
  }, [loggedIn]);


  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardClick(card) {
    setSelectedCard({ ...selectedCard, isOpen: true, element: card });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({ ...selectedCard, isOpen: false });
    setIsDeletePopupOpen(false);
    setIsTooltipPopupOpen(false);
  }

  function handleUpdateUser(data) {
    setLoading(true);
    const { name, about } = data;
    api
      .editProfile(name, about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  function handleUpdateVatar(data) {
    setLoading(true);
    const { avatar } = data;
    api
      .editAvatar(avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  function handleAddPlaceSubmit(data) {
    setLoading(true);
    const { name, link } = data;
    api
      .addCard(name, link)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }

  function handleDeleteCardPopup(deletedCard) {
    setDeletedCard(deletedCard);
    setIsDeletePopupOpen(true);
  }

  //Логиним пользователя, устанавливаем емайл, сохраняем токен
  function handleLogin({ email, password }) {
    auth
      .authorize(email, password)
      .then((res) => {
        const { token } = res;
        if (token) {
          setLoggedIn(true);
          setUserEmail(email);
          localStorage.setItem('jwt', token);
          history.push('/');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //Регистрируем пользователя, открываем попап об успешной(или не очень) регистрации
  function handleRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          setIsRegisterOk(true);
          setIsTooltipPopupOpen(true);
          history.push('/sign-in');
        }
      })
      .catch((err) => {
        setIsRegisterOk(false);
        setIsTooltipPopupOpen(true);
        console.log(err);
      });
  }

  //Выходим из системы, удаляем токен, перенаправляем на страницу входа
  function handleSignOut() {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        <Header email={userEmail} onSignOut={handleSignOut} />
        <Switch>
          <ProtectedRoute
            exact
            path='/'
            loggedIn={loggedIn}
            component={Main}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleDeleteCardPopup}
          />
          <Route path='/sign-up'>
            <Register onRegister={handleRegister} />
          </Route>
          <Route path='/sign-in'>
            <Login onLogin={handleLogin} />
          </Route>
          <Route>{loggedIn ? <Redirect to='/' /> : <Redirect to='/sign-in' />}</Route>
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoading={loading}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoading={loading}
        />
        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={closeAllPopups}
          onDelete={handleCardDelete}
          card={deletedCard}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateVatar}
          isLoading={loading}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <section className='popup popup_delete'>
          <div className='popup__container'>
            <button className='popup__close'></button>
            <form name='deleteForm' className='popup__form' noValidate>
              <h2 className='popup__title'>Вы уверены?</h2>
              <button type='submit' className='popup__button popup__button_delete'>
                Да
              </button>
            </form>
          </div>
        </section>
        <InfoTooltip isOpen={isTooltipPopupOpen} onClose={closeAllPopups} type={isRegisterOk} />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
