import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import QRCode from 'qrcode'
import { withTranslation } from 'react-i18next';

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

function TOTPQR({ secretTOTP, navigateBack, verifyCode, wrongMFACode, email, t }) {

  const [input, setInput] = useState('');

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    setInput(value)
  }

  useEffect(() => drawQR(secretTOTP, email), [])

  return (
    <>
      <span style={{ fontSize: '2rem', marginBottom: '2rem' }}>{t("tittle")}</span>
      <canvas id="secretqr" />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        key="MFACode"
        id="MFACode"
        label={t("label_totp")}
        name="MFACode"
        autoFocus
        error={wrongMFACode ? true : null}
        helperText={wrongMFACode ? t("helper_wrongMFA") : "Input the the time-based code from your authenticator App"}
        onChange={handleInputChange}
      />
      <button className='buttonContinue' type="submit" style={{ margin: '1rem 0' }} onClick={() => verifyCode(input)}>{t("button_verify")}</button>
      <button className='buttonContinue buttonBack' onClick={() => navigateBack()}>{t("button_goBack")}</button>
    </ >
  );
}

export default withTranslation("TOTPQR")(TOTPQR)