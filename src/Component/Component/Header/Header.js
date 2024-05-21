import React from 'react';
import SearchForm from './SearchForm';
import Permission from './Permission';
import HeaderRightSide from './HeaderRightSide'
import '../../../Style/Header.css';


export default function Hearder({getValue,getValueBill,getBarcode,resetBarcode,products}){

    return(
        <React.Fragment>
            <div className='Header_Bar'>
                <div className="Header_LeftSide">
                    <div className="Header_Form">
                    <Permission/>
                    <SearchForm products={products} getValue={getValue} getBarcode={getBarcode} resetBarcode={resetBarcode}/>
                   
                    </div></div>
                <div className="Header_RightSide" >
                <HeaderRightSide getValueBill={getValueBill} style={{display:"flex"}} />
                    
                </div>
                
            </div>
        </React.Fragment>
    )
}