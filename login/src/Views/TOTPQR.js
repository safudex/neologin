import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

export default function TOTPQR({ secretTOTP, navigateBack, verifyCode, wrongMFACode }) {

  const [input, setInput] = useState('');

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    setInput(value)
  }

  return (
    <>
      <span style={{ fontSize: '2rem', marginBottom: '2rem' }}>Enable TOTP</span>
      <img src={'https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=' + secretTOTP + '&chld=H|1'} />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        key="MFACode"
        id="MFACode"
        label="TOTP code"
        name="MFACode"
        autoFocus
        error={wrongMFACode ? true : null}
        helperText={wrongMFACode ? "Wrong code" : "Input the the time-based code from your authenticator App"}
        onChange={handleInputChange}
      />
      <button className='buttonContinue' type="submit" style={{ margin: '1rem 0' }} onClick={() => verifyCode(input)}>Verify</button>
      <button className='buttonContinue buttonBack' onClick={() => navigateBack()}>Back to settings</button>
    </ >
  );
}