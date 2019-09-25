import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function VerifyEmail({ verifyCode, navigateBack, wrongEmailCode }) {

  const [input, setInput] = useState('');

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    setInput(value)
  }

  return (
    <>
      <span style={{ fontSize: '2rem', marginBottom: '2rem' }}>Verify email address</span>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        key="emailCode"
        id="emailCode"
        label="Verification code"
        name="emailCode"
        autoFocus
        error={wrongEmailCode ? true : null}
        helperText={wrongEmailCode ? "Wrong code" : "Input the the code sent to your email"}
        onChange={handleInputChange}
      />
      <button className='buttonContinue' type="submit" style={{ margin: '1rem 0' }} onClick={() => verifyCode(input)}>Verify</button>
      <button className='buttonContinue buttonBack' onClick={() => navigateBack()}>Back to settings</button>
    </>
  );
}