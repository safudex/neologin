import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { withTranslation } from 'react-i18next';

function VerifyEmail({ verifyCode, navigateBack, wrongEmailCode, t }) {

  const [input, setInput] = useState('');

  function handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    setInput(value)
  }

  return (
    <>
      <span style={{ fontSize: '2rem', marginBottom: '2rem' }}>{t("tittle")}</span>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        key="emailCode"
        id="emailCode"
        label={t("label_verificationCode")}
        name="emailCode"
        autoFocus
        error={wrongEmailCode ? true : null}
        helperText={wrongEmailCode ? t("helperWrongEmailCode") : t("helperCode")}
        onChange={handleInputChange}
      />
<button className='buttonContinue' type="submit" style={{ margin: '1rem 0' }} onClick={() => verifyCode(input)}>{t("button_verify")}</button>
      <button className='buttonContinue buttonBack' onClick={() => navigateBack()}>{t("button_goBack")}</button>
    </>
  );
}

export default withTranslation("verifyEmail")(VerifyEmail)