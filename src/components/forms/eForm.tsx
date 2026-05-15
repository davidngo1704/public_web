import { InputText } from 'primereact/inputtext';
import { Form, Field } from 'react-final-form';

import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { FormProps } from '../../models/Forms';

import { InputTextControl } from './controls/InputTextControl';

export function EForm(props: FormProps) {

  const formDef = props.formDef;

  const passwordHeader = <h6>Pick a password</h6>;

  const passwordFooter = (
    <React.Fragment>
      <Divider />
      <p className="p-mt-2">Suggestions</p>
      <ul className="p-pl-2 p-ml-2 p-mt-0" style={{ lineHeight: '1.5' }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </React.Fragment>
  );

  const validate = (data: any) => {
    let errors: any = {};

    if (!data.name) {
      errors.name = 'Name is required.';
    }

    if (!data.email) {
      errors.email = 'Email is required.';
    }
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
      errors.email = 'Invalid email address. E.g. example@email.com';
    }

    if (!data.password) {
      errors.password = 'Password is required.';
    }

    if (!data.accept) {
      errors.accept = 'You need to agree to the terms and conditions.';
    }

    return errors;
  };

  const onSubmit = (data: any, form: any) => {

    form.restart();
  };

  const isFormFieldValid = (meta: any) => !!(meta.touched && meta.error);

  const getFormErrorMessage = (meta: any) => {

    return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
  };


  return (
    <div className="card">
      <h5 className="p-text-center">{formDef?.name}</h5>
      <Form
        onSubmit={onSubmit}
        initialValues={
          {
            name: '',
            email: '',
            password: '',
            date: null,
            country: null,
            accept: false
          }
        } validate={validate} render={({ handleSubmit }) => (
          
          <form onSubmit={handleSubmit} className="p-fluid">

            <Field name="name" render={({ input, meta }) => (
              <div className="p-field">
                <span className="p-float-label">

                  <InputTextControl  {...input} />

                  {/* <InputText 
                    id="name" 
                    {...input} 
                    autoFocus 
                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })} 
                  />
                   */}
                  
                  <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Name*</label>
                </span>
                {getFormErrorMessage(meta)}
              </div>
            )} />

            <Field name="email" render={({ input, meta }) => (
              <div className="p-field">
                <span className="p-float-label p-input-icon-right">
                  <i className="pi pi-envelope" />
                  <InputText id="email" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                  <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Email*</label>
                </span>
                {getFormErrorMessage(meta)}
              </div>
            )} />

            <Field name="password" render={({ input, meta }) => (
              <div className="p-field">
                <span className="p-float-label">
                  <Password id="password" 
                    {...input} 
                    toggleMask 
                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })} 
                    header={passwordHeader} footer={passwordFooter} 
                />
                  <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password*</label>
                </span>
                {getFormErrorMessage(meta)}
              </div>
            )} />

            <Field name="date" render={({ input }) => (
              <div className="p-field">
                <span className="p-float-label">
                  <Calendar id="date" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon />
                  <label htmlFor="date">Birthday</label>
                </span>
              </div>
            )} />

            <Field name="country" render={({ input }) => (
              <div className="p-field">
                <span className="p-float-label">
                  <Dropdown id="country" {...input} options={[]} optionLabel="name" />
                  <label htmlFor="country">Country</label>
                </span>
              </div>
            )} />

            <Field name="accept" type="checkbox" render={({ input, meta }) => (
              <div className="p-field-checkbox">
                <Checkbox inputId="accept" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                <label htmlFor="accept" className={classNames({ 'p-error': isFormFieldValid(meta) })}>I agree to the terms and conditions*</label>
              </div>
            )} />

            <Button type="submit" label="Nộp" className="p-mt-2" />

          </form>
        )} />
    </div>
  );
}