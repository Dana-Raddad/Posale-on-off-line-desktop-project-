import React, { useState } from 'react';
import '../../../Style/Header.css'
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { Toast } from 'primereact/toast';
import {  Link } from 'react-router-dom';

//import '../../index.css';

//import './HeaderRightSide.css';
export default function HeaderRightSide({getValueBill}){  
  var d = new Date()
  const [bill, setItems] = React.useState([{id:1, bill:`فاتورة(1)
   `+d.getHours()+":"+ d.getMinutes()}])
  const [count, setCount] = React.useState(2)
  const [active, setActive] = useState(1);
  const toast = React.useRef(null);
  const showWarn = () => {
    toast.current.show({ severity: 'warn', summary: '!! عذرا ', detail: '... لا يمكن حذف اول فاتورة', life: 1500 });
  }
  
  const handleAddItems = () => {
   let d = new Date()
    setCount(count+ 1)
    setItems([ ...bill, {
      id: count,
      bill: `فاتورة(${count})
        `+d.getHours()+":"+ d.getMinutes()
      
    }])
  }

  const handleRemoveItems = (e) => {
    const activeButton = active;
    if (activeButton == 1){
      showWarn()
    }
    else{
     
      localStorage.setItem(activeButton,'')
      setItems(bill.filter(item => item.id !== activeButton));
    }
  };
  function Active(id) {
    
    window.localStorage.setItem('PrevKey', active);
    getValueBill(id)
    setActive(id)
  }
  

     return(
         <span style={{display:"flex"}}>
           <span style={{width:"3vw",minWidth:"3vw",height:"55px",padding:"5px 5px 10px 5px" ,position:"relative"}}>
           <Button id="plus" style={{width:"2.5vw",paddingLeft:"0.2vw",minWidth:"2.5vw",height:"20px" ,backgroundColor:"#fff",borderColor:"#fff",position:"absolute",color:"#000"}}  onClick ={handleAddItems}><i style={{fontSize: '1.5vw'}} className="pi pi-plus" ></i></Button>
           <Button  id="minuse"style={{width:"2.5vw",paddingLeft:"0.2vw",minWidth:"2.5vw",height:"20px",backgroundColor:"#fff",borderColor:"#fff",position:"absolute",top: "50%",color:"#000"}}  onClick ={handleRemoveItems}><i style={{fontSize: '1.5vw'}} className="pi pi-minus" ></i></Button>
           </span>
         <span dir="rtl"  className="HeaderRightSide">
      
           <Toast ref={toast} position='top-center' />
     {bill.map((x, i) => {
       return (
        <Button key={i}  onClick={()=>Active(x.id) } className="p-button-text BillLable blakeHoverColor" label={x.bill} style={{color:"#000",padding: "2px",width: "75px",minWidth:"75px" ,backgroundColor:"#04b6d160", border:"0.08px solid #49494b34"}}/>)
     })}
     
 </span>
 </span>
          
           )
    }
/*  <CardsLists/>
                    <div><h3></h3></div>
                    <PlusButton/>*/