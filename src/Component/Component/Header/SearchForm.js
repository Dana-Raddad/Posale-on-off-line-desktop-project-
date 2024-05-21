import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import '../../../Style/Header.css';
import 'primereact/resources/themes/saga-orange/theme.css';
import BarcodeReader from 'react-barcode-reader';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

export default function SearchForm({getValue,getBarcode,resetBarcode,products}){

    const [value1, setValue1] = useState('');
    const [Product, setProduct] = useState([]);
    const [selectedCountry1, setSelectedCountry1] = useState(null);
    const [filteredProduct, setFilteredProduct] = useState(null);
   

    useEffect(() => {
          setProduct(products);
      
    }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
       setValue1("")

   }, [resetBarcode]); 
      
     useEffect(()=>{
        
       if(selectedCountry1==''){
           
        getValue(products);
       }
     },[selectedCountry1])

    const ProductNameFiltered = (event) => {
       
        setTimeout(() => {
            let filteredProduct;
            if (!event.query.trim().length) {
                filteredProduct = [...Product];
            }
            else {
                filteredProduct = Product.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            
            getValue(filteredProduct)
            setFilteredProduct(filteredProduct);
        }, 250);
    }
   /* const CodeFiltered= (event) => {
   
        setTimeout(() => {
            let filteredProduct;
            if (!event.query.trim().length) {
                filteredProduct = [...Product];
            }
            else {
                filteredProduct = Product.filter((country) => {
                    console.log(country.code.toLowerCase().startsWith(event.query.toLowerCase()))
                    return country.code.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
            if(filteredProduct.length===1){
              getBarcode(filteredProduct);
            }else{
             getValue(filteredProduct)
             setFilteredProduct(filteredProduct);}
        }, 250);
    }*/
    function BarCodeInput() {
       
       const temp= Product.filter((products) => products.code == value1)
       if(JSON.stringify(temp)==='[]'){
        setValue1("");
        showWarn();
       }else{
        getBarcode(temp);
       }
       
        
    }
     
    ////////////////// barcode scan ////////////////
     const  handleScan=(data)=>{
       
        
        const temp= Product.filter((products) => products.code == data)
        
       if(JSON.stringify(temp)==='[]'){
        setValue1("");
        showWarn();
       }else{
        getBarcode(temp);
       }
       
      }
     const handleError=(err)=>{
       // if(err != 'K'){ if(err != 'C'){ if(err != 'E'){ if(err != 'U'){ if(err != 'B'){if(err != '\r'){showError();}}}}}}
       
      }
    
     
     const toast = React.useRef(null);
     const showError = () => {
            toast.current.show({severity:'error', summary: '!!تنبيه ', detail:'عذرا يوجد خلل في قراءة الباركود', life: 1000});
        }

      const showWarn = () => {
            toast.current.show({severity:'warn', summary: '!!تنبيه ', detail:'عذرا المنتج غير متوفر...', life: 1000});
        }

  ///////////////////////// enter ////////
  
 
    return(
  
        <React.Fragment>
             
         <form className="search-form header-options"  >
         {/*<AutoComplete 
           type="text"
           field="code"
           value={value1}
          // onBlur={ ()=>setValue1(null)}
           onChange={(e)=>setValue1(e.value) } 
           completeMethod={CodeFiltered} 
           className="input Barcode "
           placeholder="باركود ..."
         />*/}
         <InputText
           type="text"
           field="code"
           value={value1}
           onChange={(e)=>setValue1(e.target.value) } 
           className="input Barcode "
           placeholder="باركود ..."
           style={{paddingRight:"20px"}}
           onKeyPress={(e)=> e.code==="Enter" ? BarCodeInput() : null }
         />
         <BarcodeReader
           onError={(e)=>handleError(e)}
           onScan={(e)=>handleScan(e)}
          />
          
       
         <AutoComplete 
            placeholder='البحث ...'
            size={30}
		    minLength={1}
            value={selectedCountry1}
            className="input search"
            completeMethod={ProductNameFiltered } 
            field="name"
            onChange={(e)=>setSelectedCountry1(e.value) } />

         </form>
        
        <Toast ref={toast} position='top-center' />
        
         </React.Fragment>
    )
}
//<input type="text"   className="input Barcode " placeholder="باركود ..."/>