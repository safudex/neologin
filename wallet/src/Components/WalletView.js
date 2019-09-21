import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';

import walletIMG from '../imgs/wallet.png'


export default function ButtonBases( {icon, onClick}) {

  return (
    <div className="iconbg" onClick={onClick} >
      <img className="iconst" src={icon}></img>
    </div>

  );
}