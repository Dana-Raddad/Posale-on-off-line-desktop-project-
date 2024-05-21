import React from 'react';
import 'primereact/resources/themes/saga-orange/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../../Style/Index.css';
import '../../../Style/Header.css';
import { Tooltip } from 'primereact/tooltip';
import { PrimeIcons } from 'primereact/api';
import {  Link } from 'react-router-dom';
import { Button } from 'primereact/button';

export default function Permission(){  


     return(
    < React.Fragment>
    <div className="Permission">
    <a href={`https://posales.rashid.cc/login`}  >
           <Button  style={{width:"3vw",height:"3vw"}}  tooltip="تسجيل الخروج" tooltipOptions={{position: 'right'}}  className="p-button-secondary"><i style={{fontSize: '2vw'}} className="pi pi-sign-out" ></i></Button>
    </a>
    <a href={`https://posales.rashid.cc/`}  >
             <Button className="p-button-secondary"  tooltip="المتجر"  tooltipOptions={{position: 'bottom'}}  style={{width:"3vw",paddingRight:"5px",height:"3vw" }}><i style={{fontSize: '2vw'}} className="pi pi-home" ></i></Button>
    </a>
    <a href={`https://posales.rashid.cc/sales`}  >
           <Button  style={{width:"3vw",height:"3vw"}}  tooltip="الفواتير" tooltipOptions={{position: 'bottom'}}  className="p-button-secondary"><i className="icon_1 invoice" ></i></Button>
    </a>
    <a href={`https://posales.rashid.cc/srecalls`}  >
           <Button  style={{width:"3vw",paddingRight:"2rem",height:"3vw"}}   tooltip="مردودات المبيعات" tooltipOptions={{position: 'bottom'}}  className=" p-button-secondary"><i  style={{fontSize: '2.3vw'}}  className="pi pi-replay"></i></Button>
    </a>
    <a href={`https://posales.rashid.cc/customers`}  >
          <Button   style={{width:"3vw",height:"3vw"}}  tooltip="العملاء"  tooltipOptions={{position: 'bottom'}} className="p-button-secondary"><i className="icon_1 customer" ></i></Button>
     </a>
   
          <Button  style={{width:"3vw",paddingRight:"0.4rem",height:"3vw"}} className="hidebutton"><i style={{fontSize: '2vw'}}  className="pi pi-file-excel" ></i></Button>
    
    
    </div>
    
    </React.Fragment>
 )
}
