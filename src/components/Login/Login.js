import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';
import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from "../../store/auth-context"
import Input from "../UI/Input/Input"

const emailReducer = (state, action) => {

  if (action.type === "USER_INPUT") {
    return {
      value: action.value, 
      isValid: action.value.includes('@')
    }
  }

  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.includes('@')
    }
  }

  return {
    value: '', 
    isValid: false
  }
}

const passwordReducer = (state, action) => {

  if (action.type === "USER_INPUT") {
    return {
      value: action.value, 
      isValid: action.value.trim().length > 6
    }
  }

  if (action.type === "INPUT_BLUR") {
    return {
      value: state.value,
      isValid: state.value.trim().length > 6
    }
  }

  return {
    value: '', 
    isValid: false
  }
}

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {value: '', isValid: false})
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {value: '', isValid: false})

  const authContext = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const { isValid: emailIsValid } = emailState
  const { isValid: passwordIsValid } = passwordState

  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log('Checking form validity!');
      setFormIsValid(
        emailIsValid && passwordIsValid
      );
    }, 500);

    return () => {
      console.log('CLEANUP');
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({type: "USER_INPUT", value: event.target.value})
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: "USER_INPUT", value: event.target.value})
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: "INPUT_BLUR"})
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: "INPUT_BLUR"})
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (formIsValid) {
      authContext.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
    
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input 
          ref={emailInputRef}
          id="email" 
          label="E-Mail" 
          type="email" 
          isValid={emailIsValid} 
          value={emailState.value} 
          onChange={emailChangeHandler} 
          onBlur={validateEmailHandler}
        />
        <Input 
          ref={passwordInputRef}
          id="password" 
          label="Password" 
          type="password" 
          isValid={passwordIsValid} 
          value={passwordState.value} 
          onChange={passwordChangeHandler} 
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;