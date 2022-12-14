import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import { CSSTransition } from 'react-transition-group';

import PopupWithForm from './PopupWithForm';

export default function AddPlacePopup(props) {
  const nodeRef = useRef(null);
  // Use a reference to a DOM node as `findDOMNode` is deprecated
  // which is used in `CSSTransition` internally

  const [values, setValues] = useState({ name: '', link: '' });

  function handleChanges(evt) {
    // extract target input's attributes
    const { name, value } = evt.target;

    // set it's name as key and it's value as value
    setValues({
      ...values,
      [name]: value,
    });
  }

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onSubmit(values);
  }

  useEffect(() => {
    props.isOpen && setValues({ name: '', link: '' });
  }, [props.isOpen]);

  return (
    <CSSTransition
      in={props.isOpen}
      nodeRef={nodeRef}
      timeout={200}
      classNames='popup_opened'
      unmountOnExit>
      <PopupWithForm
        ref={nodeRef}
        formTitle='Новое место'
        popupType='add'
        submitButtonText='Сохранить'
        isOpen={props.isOpen}
        onClose={props.onClose}
        onSubmit={handleSubmit}>
        {/* children */}
        <fieldset className='form__fieldset'>
          <div className='form__input-container'>
            <input
              className='form__input'
              id='photoNameInput'
              name='name'
              type='text'
              minLength='2'
              maxLength='30'
              placeholder='Название'
              onChange={handleChanges}
              value={values.name}
              required
            />
            <span className='form__input-error-hint name-input-error'></span>
          </div>
          <div className='form__input-container'>
            <input
              className='form__input'
              id='photoLinkInput'
              name='link'
              type='url'
              placeholder='Ссылка на картинку'
              onChange={handleChanges}
              value={values.link}
              required
            />
            <span className='form__input-error-hint about-input-error'></span>
          </div>
        </fieldset>
      </PopupWithForm>
    </CSSTransition>
  );
}

AddPlacePopup.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};
