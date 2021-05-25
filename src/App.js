import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from './dashboard';

export default function App() {
  
  //BBMP - 294
  //B rural - 276
  //B urban - 265
  return (<div className="fl center">
    <div className="app-title">CoWin 18+ Slot Tracker</div>
    <Dashboard districtId="294" title="BBMP" />
    <Dashboard districtId="265" title="B Urban" />
    <Dashboard districtId="276" title="B Rural" />
    </div>
  );
}
