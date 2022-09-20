import React, { useState } from "react";
import { Link } from "react-router-dom";

function Register({ onRegister }) {
  const [data, setData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = data;
    onRegister({ email, password });
  };

  return (
    <div className="register">
      <form className="register__form" onSubmit={handleSubmit}>
        <h2 className="register__title">Регистрация</h2>
        <label htmlFor="email" className="register__label"></label>
        <input
          type="email"
          className="register__input register__input_email"
          id="email"
          name="email"
          placeholder="Email"
          required
          value={data.email}
          onChange={handleChange}
        />
        <label htmlFor="password" className="register__label"></label>
        <input
          type="password"
          className="register__input register__input_password"
          id="password"
          name="password"
          placeholder="Пароль"
          required
          value={data.password}
          onChange={handleChange}
        />
        <button type="submit" className="register__button">
          Зарегистрироваться
        </button>
      </form>
      <div className="register__signin-container">
        <p className="register__text">Уже зарегистрированы?</p>
        <Link to="/sign-in" className="register__signin">
          Войти
        </Link>
      </div>
    </div>
  );
}

export default Register;
