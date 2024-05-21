import React from 'react';
import { BrowserRouter , Route, Switch } from 'react-router-dom';
import Loading from './Component/Component/Loading';
import Header from './Component/Component/Header/Header';
import Contaner from './Component/Component/Contaner/Contaner.js';
import Temp from './Component/Component/Contaner/Temp.js';
import SessionService from './Component/Component/Service/session.js';
import { useIdleTimer } from 'react-idle-timer';

const Session = new SessionService();
const Category =React.lazy(()=>import('./Component/Component/Category/Category.js'));
const Product =React.lazy(()=>import('./Component/Component/Product/ProductItem'));

function App() {
 
  const [products, setProducts] = React.useState(null);
  const [search, setsearch] = React.useState({});
  const [barcode, setBarcode] = React.useState({});
  const [resetBarcode, reSetBarcode] = React.useState(null);
  const [pressedItem, setpressedItem] = React.useState([]);
  const [bill, setBill] = React.useState({});
  const [defaultSesstion,setDefaultSesstion]=React.useState('1');

  React.useEffect(() => {
 
    if(navigator.onLine===true){
      
      Session.getSession().then(data => setDefaultSesstion(JSON.stringify(data)));
     }
    
  }, [navigator.onLine] );

  const handleOnIdle = event => {
    if(navigator.onLine===true){
    Session.getSession().then(data => setDefaultSesstion(JSON.stringify(data)));}
   //console.log('last active at', getLastActiveTime())
   }

  const {  getLastActiveTime } = useIdleTimer({
     timeout: 1000 * 60 *10,
     onIdle: handleOnIdle
   })

  function comp() {
   return   <div className="App">
   <Header products={products} getValue={setsearch} resetBarcode={resetBarcode} getBarcode={setBarcode} getValueBill={setBill} />
   <div style={{display: "flex",width:"100%"}}>
     
     <React.Suspense fallback={<Loading />} >

       <Category products={products} getValue={setsearch}/>
       <Product setProducts={setProducts}  setValue={search} getPressed={setpressedItem}/>
       <Contaner  setPressed={pressedItem} getPressed={setpressedItem} setValueBill={bill} setValue={barcode} reSetBarcode={reSetBarcode}/>
   </React.Suspense>
   
   </div></div>}

  return (
  
    
    
    <BrowserRouter>
       
         {/*  <Temp/>*/}
           
    <Route render={() => defaultSesstion=='1' ? comp(): window.location.href ='https://posales.rashid.cc/login' }/>
       </BrowserRouter>
      
     
   
  );
}

export default App;
