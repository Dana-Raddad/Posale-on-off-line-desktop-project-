import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-orange/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import '../../../Style/Index.css';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import defule_image from '../../../Images/defult_image_5.jpg';//Capture.PNG;//beeWeb.png
import '../../../Style/Product.css';
import useWindowDimensions from './windowDimensions';
import { Tooltip } from 'primereact/tooltip';
import React, { useState, useEffect, Link } from 'react';
import { DataView } from 'primereact/dataview';
import './ProductItem.css';
import { Toast } from 'primereact/toast';
import ProductService from '../Service/ProductService.js';
import SettingService from '../Service/setting.js';
import '../../../Style/Header.css';
const SettingsService = new SettingService();
const productService = new ProductService();
export default function ProductItem({ setValue, getPressed ,setProducts}) {

     //معلومات المحل التجاري
   const [setting,setSetting]=useState('')
   const [product, setProduct] = React.useState(null);
   let currency="₪"
    useEffect(() => {
       
       SettingsService.getSetting().then(data => {setSetting(data);});
       productService.getProducts().then(data =>{ setProduct(data);setProducts(data)});
       currency=( setting.currency==="شيكل" ? "₪" :setting.currency==="دينار" ? "JD":setting.currency==="دولار"  ? "$": setting.currency)
      
      }, []); // eslint-disable-line react-hooks/exhaustive-deps
     

    const { height, width } = useWindowDimensions();
    const [productNO, setproductNo] = React.useState(18);

    
    const [layout, setLayout] = useState('grid');

    const toast = React.useRef(null);
    const showError = () => {
        toast.current.show({ severity: 'error', summary: '!!تنبيه ', detail: '... عذرا المخزون فارغ', life: 1500 });
    }


    React.useEffect(() => {
        if (width <= 477) {
            setproductNo(3)
        }
        else if (width <= 687) {
            setproductNo(6)
        }
        else if (width <= 896) {
            setproductNo(9)
        }
        else if (width <= 1106) {
            setproductNo(12)
        }
        else if (width <= 1317) {
            setproductNo(15)
        }
        else {
            setproductNo(18)
        }


    }, [width]);



    useEffect(() => {
        //if(setValue){}

        setProduct(setValue);
    }, [setValue]); // eslint-disable-line react-hooks/exhaustive-deps

    function onPressed(setValue) {

        if (setValue.stock !== 0) {

            getPressed([setValue, Math.random()]);

        }
        else {

            showError();
        }
    }

    const renderGridItem = (setValue) => {
        return (
            <div className="container_grid">
                <div className="product" onClick={() => onPressed(setValue)}>
                <div id="Tooltip">{setValue.description}</div>
               
                    <Card
                        tooltip="dss" tooltipOptions={{position: 'right'}} 
                        title={setValue.name}
                        id="ProductCard"
                        className="ui-card-shadow ProductCard "
                        header={
                            <span >
                     
                                <span className="badge">{currency+ setValue.price}</span>
                                <img alt="Card"  style={{ padding: "5px " }} src={`https://mix.rashid.cc/files/products/${setValue.photothumb}`} onError={(e) => e.target.src = defule_image} />
                                <Button tooltip={setValue.description} tooltipOptions={{position: 'right'}}  title={setValue.name} icon="pi pi-star-o" className="p-button-rounded   p-button-text starHover" style={{ position: "absolute", left: "-2%", backgroundColor: "#ffc40100", color: 'black' }} />
                               {(setValue.stock <= setValue.alertqt)&&( setValue.stock != 0 ) ?<span style={{ position:"absolute", color:"red" ,fontSize:"9.5px" ,left:"4%",top:"65%" }} >شارف على الانتهاء</span>: <></>}
                               {(setValue.stock === 0 ) ?<span style={{ position:"absolute", color:"red" ,fontSize:"9.5px" ,left:"4%",top:"65%" }} >المخزون فارغ</span>: <></>}
                            </span>
                        }
                        style={{ position: "relative" }}

                    >
                    </Card>
                
                </div>

            </div>
        );
    }

    const itemTemplate = (product, layout) => {
        if (!product) {
            return;
        }

        if (layout === 'grid')
            return renderGridItem(product);
    }



    return (

        <div className="container">

            <div className="card">
                <Toast ref={toast} />
                {<DataView value={product} layout={layout}
                    itemTemplate={itemTemplate} paginator rows={productNO} rowsPerPageOptions={[productNO]} />}
                  
            </div>

        </div>

    )
}