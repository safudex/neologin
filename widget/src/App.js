import React from 'react';
import './App.css';
import './conn'

import PaymentResultView from './fiat/PaymentResultView'

function App() {
  var url_string = window.location.href
  var url = new URL(url_string);
  var success = url.searchParams.get("success");
  return (
    <>
      {
        success ?
          <PaymentResultView url={url} success={success} />
          :
          <div id="content"></div>
      }
    </>
  );
}

export default App;
