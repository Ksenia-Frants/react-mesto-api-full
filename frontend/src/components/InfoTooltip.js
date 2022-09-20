import React from "react";
import success from "../images/Union-yes.svg";
import fail from "../images/Union-no.svg";

function InfoTooltip({ isOpen, onClose, type }) {
  return (
    <div className={`popup ${isOpen && "popup_opened"}`}>
      <div className="popup__container">
        <button className="popup__close" onClick={onClose}></button>
        <div className="popup__status-container">
          <img className="popup__tooltip-image" src={type ? success : fail} />
          <p className="popup__tooltip-title">
            {type
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoTooltip;
