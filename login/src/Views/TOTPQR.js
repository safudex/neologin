import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import QRCode from 'qrcode'

function drawQR(secret, email) {
  let canvas = document.getElementById('secretqr')
  let code = "otpauth://totp/NeoLogin:" + email + "?secret=" + secret + "&issuer=NeoLogin";
  QRCode.toCanvas(canvas, code, (error) => {
    if (error) {
      console.error(error);
      alert(error);
    } else {
      //setTimeout(resolve, 100);
    }
  })
}

export default function TOTPQR({ secretTOTP, navigateBack, verifyCode, wrongMFACode, email }) {

  const [input, setInput] = useState('');

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    setInput(value)
  }

  useEffect(() => drawQR(secretTOTP, email), [])

  return (
    <>
      <span style={{ fontSize: '2rem', marginBottom: '2rem' }}>Enable TOTP</span>
      <canvas id="secretqr" />
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