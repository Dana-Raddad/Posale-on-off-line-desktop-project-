import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../../Style/Contaner.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import  "../../../Style/Product.css";
import "../../../Style/Header.css";
import { DataView } from 'primereact/dataview';
import React, { useState, useEffect } from 'react';
import {  Link } from 'react-router-dom';
import { AutoComplete } from 'primereact/autocomplete';


export default function Category({getValue,products}){ 

    const [product, setProduct] = useState(null);
    const [layout, setLayout] = useState('list');
    let Categorys=[];

    useEffect(() => {
       
        setProduct(products);
        
       }, [products]); 

    const [filteredCountries, setFilteredCountries] = useState(null);
    
    function searchCountry(data){
      
        setTimeout(() => {
            let filteredCountries;
            if (!data.category.trim().length) {
                
                filteredCountries = [...product];
            }
            else {
                filteredCountries = product.filter((products) => {
                    return products.category.toLowerCase().startsWith(data.category.toLowerCase());
                });
            }
           
            getValue(filteredCountries)
            setFilteredCountries(filteredCountries);
        }, 250);
    }

    const renderListItem = (data) => {
        
        return  <Button onClick={()=>searchCountry(data)}  className="p-button-secondary" ><i className="icon_1 pi pi-tag product-category-icon" style={{color:'#fff'}} ></i><span style={{minWidth:"55px"}}>{data.category}</span></Button>
    }

    const itemTemplate = (products, layout) => {
        if (!products) {
            return;
        }

        if (layout === 'list' ){
            if(!Categorys.includes(products.category ) ){
        
            Categorys=[...Categorys,products.category];
            return renderListItem(products);
        } else {
           
            return <></>;}
        }
    
       
    }
    
    function AllCategory() {
        getValue(product);
    }

    return(
        <div className="Contaner_Categorg">
          
            
            
            <div className="card">
            <div className="p-grid" style={{marginBottom:"6px",paddingTop:"10px" }}><Button  style={{ textRendering: "auto"}} onClick={()=>AllCategory()}  className="minWidth p-button-secondary"><i className="icon_1 pi pi-shopping-cart" style={{color:'#fff'}} ></i><span style={{minWidth:"50px"}}>الكل</span></Button>
            <Button  className="p-button-secondary minWidth"><i className="icon_1 pi pi-star-o" style={{color:'#fff'}} ></i>المفضلة</Button></div>
                <DataView value={product} layout={layout} 
                        itemTemplate={itemTemplate}  rows={1}
                       />
            </div>
       
            
          
        </div>
    )
}
