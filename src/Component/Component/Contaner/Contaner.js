import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../../../Style/Header.css";
import "../../../Style/Contaner.css";
import "primeicons/primeicons.css";
import "../../../Style/Bill.css";
import { Button } from "primereact/button";
import "primeicons/primeicons.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "../../../Style/Product.css";
import { Toast } from 'primereact/toast';
import { Tooltip } from 'primereact/tooltip';
import React, { useState, useEffect } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Checkbox } from "primereact/checkbox";
import { InputMask } from 'primereact/inputmask';
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from 'primereact/dialog';
import { DataView } from 'primereact/dataview';
import axios from 'axios';
import CreditCardInput from 'react-credit-card-input';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useHotkeys } from 'react-hotkeys-hook';
import CustomerService from '../Service/customer.js';
import BanksService from '../Service/banks.js';
import SettingService from '../Service/setting.js';
import userService from '../Service/user.js'; 



const CustomService = new CustomerService();
const BankService = new BanksService();
const SettingsService = new SettingService();
const UserService = new userService();

export default function Contaner({ setPressed, setValueBill,setValue,getPressed ,reSetBarcode}) {

  
  const toast = React.useRef(null);
  const theme = createMuiTheme({
    direction: 'rtl',
  });

  const [TempBanks,setTempBanks]=useState([]);
  var BanksTemp=[];
  
  let randomIdCustomer=0;
  let taxamount=0;
  let discountamount=0;
  const [taxInput, setTaxInput] = useState(0);//الضريبة المدخلة
  const [discount, setDiscount] = useState(0);//قيمة الخصم
  let Tax= 0;//النظام الضريبي
  const [ONCount, setONCount] = useState(0);//على الحساب
  const [BillNote, setBillNote] = useState('');//الملاحظات
  const [checked, setChecked] = useState(false);//شامل الضريبة
  let holeTotal = 0;//الحاصل الاجمالي
  var sale_item = [];//منتجات الفاتورة 
  var sales={};//معلومات الفاتورة
  const [New_Sale_id,setNew_Sale_id]=useState('');//رقم الفاتورة الحالية
  let cheques={}//شيكات 
  const [tempcustomer,setTempCustomer]=useState(null);
  const [SaveSale,setSaveSale]=useState(null);
  const [faillSendBill,setfaillSendBill]=useState(null);

  const [displayBasic1, setDisplayBasic1] = useState(false);
  const [displayBasic2, setDisplayBasic2] = useState(false);
  const [displayBasic3, setDisplayBasic3] = useState(false);
  const [displayBasic4, setDisplayBasic4] = useState(false);
  const [displayBasic5, setDisplayBasic5] = useState(false);
  const [position, setPosition] = useState('center');

  const [Customer, setCustomer] = useState([]);
  const [Banks, setBanks] = useState([]);
  const [SelectedCustomer, setSelectedCustomer] = useState('');
  const [SelectedBanks, setSelectedBanks] = useState('');
  const [filteredCustomer, setFilteredCustomer] = useState(null);
  const [filteredBank, setFilteredBank] = useState(null);
   ///////////معلومات العميل الجديد
  const [CustomerName,setCustomerName] =useState('');
  const [CustomerID,setCustomerID] =useState('');
  const [CustomerEmail,setCustomerEmail] =useState('');
  const [CustomerTel,setCustomerTel] =useState('');
  const [CustomerPhone,setCustomerPhone] =useState('');
  const [CustomerDiscount,setCustomerDiscount] =useState('');
  //معلومات الشيك
  const [SheckDate,setSheckDate]=useState('');
  const [Sheck_NO,setSheck_NO]=useState('');
  const [Sheck_Writter,setSheck_Writter]=useState('');
  //معلومات المحل التجاري
  const [setting,setSetting]=useState({});
  ////////////معلومات المستخدم
  const [User,setUser]=useState('');
  ////الريسبونس الراجعمن مزامنة العملاء
  let resCustomersId=[];

  const ErrorShow= () => {
     toast.current.show({ severity: 'error', summary: "عذرا !! ", detail: "حدث خلل اعد المحاولة", life: 1500 });
   }
  const SuccessShow= (e) => {
    toast.current.show({ severity: 'success', summary: "تم التخزين ", detail: e, life: 1500 });
   }

async function sendCustomers(savecustomers) {
   
  
  return await  axios.post(`https://posales.rashid.cc/Json/savecustomers`, { savecustomers })
 
  .then((res) => {
    
    resCustomersId=res.data;//في حال انشاء فواتير لعملاء جدد لتجديد id 
   

    if(res.data){
    localStorage.setItem('NewCustomers', JSON.stringify(null));
    }
    SuccessShow(" تمت عملية اضافة عميل بنجاح");
    setTempCustomer(null);
    CustomService.getProducts().then(data => {setCustomer(data);});    

    })
    .catch(() => {  
     
     ErrorShow();
    })
     
}
   ////////////////////////////////////////////////////////////// البدايةةةة جلب البيانات
   let currency="₪";
   let setting_isGet="no";
   let succes_sync="yes";
   useEffect(() => {

    CustomService.getProducts().then(data => setCustomer(data));
    UserService.getUser().then(data => setUser(data));
    //BankService.getBanks().then(data => setTempBanks(data));
    /*setTempBanks([{"id":1,"name":"بنك فلسطين م.ع.م","branch":"الإدارة العامة","phone":"2832800","address":"شارع عمر المختار"},{"id":78,"name":"البنك الوطني","branch":"الإدارة العامة","phone":"02-2946090","address":"محمود درويش"},{"id":104,"name":"بنك الإستثمار الفلسطيني","branch":"الإدارة العامة","phone":"02-2943500","address":"شارع الارسال"},{"id":124,"name":"مصرف الصفا","branch":"الإدارة العامة","phone":"02-2941333","address":"شارع الجهاد 16"},{"id":129,"name":"البنك العربي","branch":"الإدارة الإقليمية ","phone":"02-2978100","address":"فندق جراند بارك"},{"id":161,"name":"بنك القاهرة عمان","branch":"الإدارة الإقليمية","phone":"02-2977230","address":"شارع خليل الوزير "},{"id":183,"name":"بنك الإسكان للتجارة والتمويل","branch":"الإدارة الإقليمية","phone":"02- 2945500","address":"الماصيون \/ عمارة باديكو "},{"id":199,"name":"بنك الأردن","branch":"الإدارة الإقليمية ","phone":"2411466","address":"شارع المعارف"},{"id":231,"name":"البنك الأهلي الأردني","branch":"الإدارة الإقليمية ","phone":"02-2959345","address":"شارع ناجي العلي ـ الماسيون"},{"id":241,"name":"البنك التجاري الأردني","branch":"الإدارة الإقليمية ","phone":"02- 2980561","address":"شارع برلين"},{"id":247,"name":"بنك القدس","branch":"الإدارة العامة","phone":"02-2979555","address":"شارع القدس - الماصيون "},{"id":288,"name":"البنك العقاري المصري العربي","branch":"الإدارة الإقليمية","phone":"2958421","address":"شارع القدس"},{"id":296,"name":"البنك الإسلامي الفلسطيني","branch":"الإدارة العامة","phone":"02-2949797","address":"شارع حديقة الامم "},{"id":336,"name":"البنك الإسلامي العربي","branch":"الإدارة العامة","phone":"02-2407060","address":"شارع نابلس"},{"id":358,"name":"الصفا","branch":"نابلس","phone":"0599366242","address":"nablus street alrahbat"},{"id":359,"name":"بنك ياهف","branch":"القدس","phone":"02-5009911","address":"القدس"},{"id":360,"name":"بنك ياهف","branch":"تل ابيب","phone":"02-5009911","address":"تل ابيب"},{"id":361,"name":"بنك ياهف","branch":"مودعين","phone":"02-5009911","address":"مودعين"},{"id":362,"name":"بنك ياهف","branch":"حيفا","phone":"02-5009911","address":"حيفا"},{"id":363,"name":"بنك لئومي","branch":"حيفا","phone":"03-9544555","address":"حيفا"},{"id":364,"name":"بنك لئومي","branch":"القدس","phone":"03-9544555","address":"القدس"},{"id":365,"name":"بنك لئومي","branch":"تل ابيب","phone":"03-9545522","address":"تل ابيب"},{"id":366,"name":"بنك ديسكونت","branch":"تل ابيب","phone":"","address":"تل ابيب"},{"id":367,"name":"بنك ديسكونت","branch":"القدس","phone":"076-8052770","address":"القدس"},{"id":368,"name":"بنك ديسكونت","branch":"حيفا","phone":"","address":"حيفا"},{"id":369,"name":"بنك هبوعليم","branch":"تل ابيب","phone":"03-7140777","address":"تل ابيب"},{"id":370,"name":"بنك هبوعليم","branch":"حيفا","phone":"03-7140300","address":"حيفا"},{"id":371,"name":"بنك هبوعليم","branch":"القدس","phone":"02-5315222","address":"القدس"},{"id":372,"name":"بنك ايجود","branch":"القدس","phone":"1-599-599-05","address":"القدس"},{"id":373,"name":"بنك ايجود","branch":"تل ابيب","phone":"1-599-599-06","address":"تل ابيب"},{"id":374,"name":"بنك ايجود","branch":"حيفا","phone":"1-599-599-08","address":"حيفا"},{"id":375,"name":"بنك مركنتيل","branch":"تل ابيب","phone":"076-8044582","address":"تل ابيب"},{"id":376,"name":"بنك مركنتيل","branch":"القدس","phone":"076-8063500","address":"القدس"},{"id":377,"name":"بنك مركنتيل","branch":"حيفا","phone":"076-8067900","address":"حيفا"},{"id":378,"name":"بنك مزراحي","branch":"القدس","phone":"076-8040010","address":"القدس"},{"id":379,"name":"بنك مزراحي","branch":"تل ابيب","phone":"076-8040100","address":"تل ابيب"},{"id":380,"name":"بنك مزراحي","branch":"حيفا","phone":"076-8040410","address":"حيفا"},{"id":381,"name":"بنك هبنلئومي","branch":"حيفا","phone":"04-8811200","address":"حيفا"},{"id":382,"name":"بنك هبنلئومي","branch":"القدس","phone":"02-6756888","address":"القدس"},{"id":383,"name":"بنك هبنلئومي","branch":"تل ابيب","phone":"03-5110200","address":"تل ابيب"},{"id":384,"name":"بنك مساد","branch":"تل ابيب","phone":"03-5641411","address":"تل ابيب"},{"id":385,"name":"بنك مساد","branch":"حيفا","phone":"04-8659200","address":"حيفا"},{"id":386,"name":"بنك مساد","branch":"القدس","phone":"02-6237200","address":"القدس"},{"id":387,"name":"بنك يروشلايم","branch":"القدس","phone":"076-8095026","address":"القدس"},{"id":388,"name":"بنك يروشلايم","branch":"حيفا","phone":"076-8085052","address":"حيفا"}])
    TempBanks.map((item, i) => {
      var tempBank = {['bank']:item.name+" "+item.branch+" "+item.phone+" "+item.address,['id']:item.id};
      BanksTemp.push(tempBank);
      
    });*/
      
      setBanks([{"bank":"بنك فلسطين م.ع.م الإدارة العامة 2832800 شارع عمر المختار","id":1},{"bank":"البنك الوطني الإدارة العامة 02-2946090 محمود درويش","id":78},{"bank":"بنك الإستثمار الفلسطيني الإدارة العامة 02-2943500 شارع الارسال","id":104},{"bank":"مصرف الصفا الإدارة العامة 02-2941333 شارع الجهاد 16","id":124},{"bank":"البنك العربي الإدارة الإقليمية  02-2978100 فندق جراند بارك","id":129},{"bank":"بنك القاهرة عمان الإدارة الإقليمية 02-2977230 شارع خليل الوزير ","id":161},{"bank":"بنك الإسكان للتجارة والتمويل الإدارة الإقليمية 02- 2945500 الماصيون / عمارة باديكو ","id":183},{"bank":"بنك الأردن الإدارة الإقليمية  2411466 شارع المعارف","id":199},{"bank":"البنك الأهلي الأردني الإدارة الإقليمية  02-2959345 شارع ناجي العلي ـ الماسيون","id":231},{"bank":"البنك التجاري الأردني الإدارة الإقليمية  02- 2980561 شارع برلين","id":241},{"bank":"بنك القدس الإدارة العامة 02-2979555 شارع القدس - الماصيون ","id":247},{"bank":"البنك العقاري المصري العربي الإدارة الإقليمية 2958421 شارع القدس","id":288},{"bank":"البنك الإسلامي الفلسطيني الإدارة العامة 02-2949797 شارع حديقة الامم ","id":296},{"bank":"البنك الإسلامي العربي الإدارة العامة 02-2407060 شارع نابلس","id":336},{"bank":"الصفا نابلس 0599366242 nablus street alrahbat","id":358},{"bank":"بنك ياهف القدس 02-5009911 القدس","id":359},{"bank":"بنك ياهف تل ابيب 02-5009911 تل ابيب","id":360},{"bank":"بنك ياهف مودعين 02-5009911 مودعين","id":361},{"bank":"بنك ياهف حيفا 02-5009911 حيفا","id":362},{"bank":"بنك لئومي حيفا 03-9544555 حيفا","id":363},{"bank":"بنك لئومي القدس 03-9544555 القدس","id":364},{"bank":"بنك لئومي تل ابيب 03-9545522 تل ابيب","id":365},{"bank":"بنك ديسكونت تل ابيب  تل ابيب","id":366},{"bank":"بنك ديسكونت القدس 076-8052770 القدس","id":367},{"bank":"بنك ديسكونت حيفا  حيفا","id":368},{"bank":"بنك هبوعليم تل ابيب 03-7140777 تل ابيب","id":369},{"bank":"بنك هبوعليم حيفا 03-7140300 حيفا","id":370},{"bank":"بنك هبوعليم القدس 02-5315222 القدس","id":371},{"bank":"بنك ايجود القدس 1-599-599-05 القدس","id":372},{"bank":"بنك ايجود تل ابيب 1-599-599-06 تل ابيب","id":373},{"bank":"بنك ايجود حيفا 1-599-599-08 حيفا","id":374},{"bank":"بنك مركنتيل تل ابيب 076-8044582 تل ابيب","id":375},{"bank":"بنك مركنتيل القدس 076-8063500 القدس","id":376},{"bank":"بنك مركنتيل حيفا 076-8067900 حيفا","id":377},{"bank":"بنك مزراحي القدس 076-8040010 القدس","id":378},{"bank":"بنك مزراحي تل ابيب 076-8040100 تل ابيب","id":379},{"bank":"بنك مزراحي حيفا 076-8040410 حيفا","id":380},{"bank":"بنك هبنلئومي حيفا 04-8811200 حيفا","id":381},{"bank":"بنك هبنلئومي القدس 02-6756888 القدس","id":382},{"bank":"بنك هبنلئومي تل ابيب 03-5110200 تل ابيب","id":383},{"bank":"بنك مساد تل ابيب 03-5641411 تل ابيب","id":384},{"bank":"بنك مساد حيفا 04-8659200 حيفا","id":385},{"bank":"بنك مساد القدس 02-6237200 القدس","id":386},{"bank":"بنك يروشلايم القدس 076-8095026 القدس","id":387},{"bank":"بنك يروشلايم حيفا 076-8085052 حيفا","id":388}]);

      if(JSON.parse(localStorage.getItem('savesale'))===null){

          SettingsService.getSetting().then(data => setSetting(data));
          setting_isGet="yes";
         currency=( setting.currency==="شيكل" ? "₪" :setting.currency==="دينار" ? "JD":setting.currency==="دولار"  ? "$": setting.currency)
      }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  

   ////////////////////////////////////////////////////////////// البحث عن عميل عشوائي 
  const CustomerFiltered = (event) => {

    setTimeout(() => {
      let filteredCustomer;
      if (!event.query.trim().length) {
        filteredCustomer = [...Customer];
      }
      else {
        filteredCustomer = Customer.filter((country) => {

          return country.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredCustomer(filteredCustomer);
    }, 250);
  }
  const BanksFiltered = (event) => {

    setTimeout(() => {
      let filteredBank;
      if (!event.query.trim().length) {
      filteredBank = [...Banks];
      
     }
    else 
      {
        filteredBank = Banks.filter((country) => {
         
          return country.bank.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredBank(filteredBank);
    }, 250);
  }
/////////////////////////////////////////////// الطباعة
function PrintTable() {
  var printWindow = window.open('', '', 'height=600,width=400');
  printWindow.document.write(`<html><head><title>${setting.companyname}</title>`);

  //Print the Table CSS.
  var table_style = document.getElementById("table_style").innerHTML;
  printWindow.document.write('<style type = "text/css">');
  printWindow.document.write(table_style);
  printWindow.document.write('</style>');
  printWindow.document.write('</head>');

  //Print the DIV contents i.e. the HTML Table.
  printWindow.document.write('<body><span class="printBody center">');
  var divContents = document.getElementById("dvContents").innerHTML;
  printWindow.document.write(`<p>${setting.receiptheader}</p>`);
  printWindow.document.write(`<img src={https://mix.rashid.cc/files/setting/${setting.logo}}></img>`);
  printWindow.document.write(`<span class="printContents center">${divContents}</span>`);
  printWindow.document.write(`<p>البائع:${User.firstname+" "+User.lastname}</p>`);
  printWindow.document.write(`<p>${setting.receiptfooter}</p>`);
  printWindow.document.write('</span></body>');
  printWindow.document.write('</html>');
  printWindow.document.close();
  printWindow.print();
}
///////////////////////////////////////////////////////// تحديث رقم الفاتورة

if(JSON.parse(localStorage.getItem('savesale'))===null){ localStorage.setItem('savesale', JSON.stringify(SaveSale))}


function addPaments(){
  var whowPaments=document.getElementById("whowPaments");
  whowPaments.append();
}

function updateBill_id(){

  document.getElementById("sendDateBill").disabled = true;
 
  if(New_Sale_id===''){
         setNew_Sale_id(1+setting.lastsaleid);
  }else{
         setNew_Sale_id(New_Sale_id+1)
  }
  
  const time = require('node-get-time');//تاريخ اليوم والساعة 
    var dateandtime = null;
    time.gettime(function (time) {
      dateandtime = time.dateTime;
    }); 
  
  let TempStatus=0;
  if((ONCount - t)===0){ TempStatus= 0;//"مدفوع" 
      }else if((ONCount - t)===(-t)){TempStatus= 1;//"غير مدفوع"
       }else
       {
         TempStatus= 2;/*"مدفوع جزئي"*/}

  let tempCustom=JSON.stringify(SelectedCustomer.name)
  tempCustom===undefined? tempCustom='عميل عشوائي' :tempCustom=SelectedCustomer.name
 
  let  tempIdCustom=''
  tempCustom===undefined? tempIdCustom='' :tempIdCustom=Customer.filter((Custom) => Custom.name === tempCustom)
  
  //تخزين بيانات الشيك
  let tempIdBank=Banks.filter((bank) => bank.bank === SelectedBanks.bank)

  if(selectedPaymentMethod.code=== '3'){cheques={['sales_id']:New_Sale_id===''? 1+setting.lastsaleid : 1+New_Sale_id,//رقم الفاتورة
                                                 ['sale_reg']:setting.register,//رقم السجل
                                                 ['ChequeNum']:Sheck_NO,//رقم الشيك
                                                 ['resieptdate']:dateandtime,
                                                 ['deudate']:SheckDate,//تاريخ الاستحقاق
                                                 ['bank']:JSON.stringify(tempIdBank) === '[]'?'':tempIdBank[0].id,
                                                 ['from_']:tempCustom,//حامل الشيك
                                                 ['account']:Sheck_Writter,//كاتب الشيك
                                                 ['value']:ONCount,//قيمة الشيك
                                                 ['created_by']: User.firstname+" "+User.lastname}}
  

  sales={       
                 ['register_id']:setting.register,//رقم السجل
                 ['created_at']:dateandtime,//تاريخ انشاء الفاتورة
                 ['clientname']:tempCustom,//اسم الزبون
                 ['client_id']: tempCustom === 'عميل عشوائي' ? '' : tempIdCustom[0].id !== undefined ? tempIdCustom[0].id : tempIdCustom[0].tempid,
                 ['totalitems']:ItemsNO.reduce((a, b) => a + b, 0),//عدد عناصر السلة
                 ['subtotal']:holeTotal,//الحاصل الاجمالي
                 ['discount']:discount,//الخصم
                 ['discountamount']:discountamount,
                 ['tax']:taxInput,//قيمة الضريبة
                 ['taxamount']: (/^(\d+|(\.\d+))(\.\d+)?%$/.test(taxInput)) ? getTotal((parseFloat(taxInput.replace("%","")) * t) / 100 ): taxInput ,
                 ['total']:t,//المجموع
                 ['paid']:ONCount,//المدفوع
                 ['firstpayement']:ONCount,//المدفوع
                 ['paidmethod']: selectedPaymentMethod.code==='1' ? 0 :selectedPaymentMethod.code==='3' ? `2~${Sheck_NO}`:'',//طريقة الدفع
                 ['status']:TempStatus,
                 ['note']:BillNote,//الملاحظات
                 ['created_by']: User.firstname+" "+User.lastname//اسم البائع
                } 

                products.map((item, i) => {
                  var tempBill = {['sale_id']:New_Sale_id===''? 1+setting.lastsaleid : 1+New_Sale_id,
                                  ['product_id']:item.id,
                                  ['name']: item['name'], 
                                  ['qt']: quantity[item.name],
                                  ['price']:prices[item.name],
                                  ['subtotal']: quantity[item.name] * prices[item.name],
                                  ['date']:dateandtime,
                                  ['tax']:Tax,//قيمة الضريبة 
                                } ;
                  sale_item.push(tempBill);});
                   
                //  localStorage.setItem("sale_item", JSON.stringify(removeDuplicatesFromArrayByProperty(sale_item, 'product_id')));
                
  if(navigator.onLine){//في حال وجود انترنت
    let temp0=removeDuplicatesFromArrayByProperty(sale_item, 'product_id')
    let temp =[{sales,temp0,cheques}];
    sendBill(temp,'online');

  }else{//في حال انقطاع الانترنت
   
    showWarn('...الانترنت ضعيف سيتم مزامنة البيانات عند عودة الانترنت');
   
    let temp0= removeDuplicatesFromArrayByProperty(sale_item, 'product_id');
    var temp = {sales,temp0,cheques};
   
    if(SaveSale===null){
       setSaveSale([temp]);
       
       localStorage.setItem('savesale', JSON.stringify(SaveSale));
    }else{
       setSaveSale([...SaveSale,temp]);
       localStorage.setItem('savesale', JSON.stringify(null));
      // localStorage.setItem('savesale', JSON.stringify(SaveSale));
      }
     
      onClick('displayBasic3');//استدعاء الفاتورة
     
  }

 
}
////////////////////////////////////////////////////////////// ارسال بيانات الفاتورة
async function sendBill(temp,ONorOff,index){
    
 
     await axios.post(`https://posales.rashid.cc/Json/savesale`, {temp})
    .then(() => {

              
              if(ONorOff==='online'&& setting_isGet==="yes" && succes_sync==="yes"){
              onClick('displayBasic3');
              setSaveSale(null);
              localStorage.setItem('savesale', JSON.stringify(null))
              //"الستورج فارغة"
            }
            if(ONorOff==='online'&& setting_isGet==="no" && succes_sync==="yes"){
              //"بعد المزامنة "
              
              SettingsService.getSetting().then(data => setSetting(data));
              setting_isGet="yes";
              currency=( setting.currency==="شيكل" ? "₪" :setting.currency==="دينار" ? "JD":setting.currency==="دولار"  ? "$": setting.currency)
              onClick('displayBasic3');
              setSaveSale(null);
              localStorage.setItem('savesale', JSON.stringify(null))
            }
            if(ONorOff==="offline" ){ 
              SuccessShow("تمت عملية تخزين الفاتورة بنجاح");
              succes_sync="yes";
              SettingsService.getSetting().then(data => setSetting(data));
              setting_isGet="yes";
              currency=( setting.currency==="شيكل" ? "₪" :setting.currency==="دينار" ? "JD":setting.currency==="دولار"  ? "$": setting.currency)
              setSaveSale(null);
              localStorage.setItem('savesale', JSON.stringify(null));
            }
           
            if(succes_sync=== "no" && ONorOff==='online'){
              ErrorShow(); 
              setSetting({});
              setting_isGet="no";
            }
          
           })
    .catch(() =>  { ErrorShow(); 
                    if(ONorOff==="offline"){
                      succes_sync="no";

                      if(faillSendBill===null){ setfaillSendBill([temp])
                      }else{
                       
                        setfaillSendBill([...faillSendBill,{['sales']:JSON.parse(temp[0].sales),['temp0']:JSON.parse(temp[0].temp0),['cheques']:JSON.parse(temp[0].cheques)}]);
                      }
                      
                    }
                   

    } );
     

}
/////////////////////////////////////////////////////////////////////
  const paymentMethod = [
    { name: 'نقدا', code: '1' },
    { name: 'بطاقة الائتمان', code: '2' },
    { name: 'شيك', code: '3' },
  ];
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod[0]);
  const onMethodChange = (e) => {
    setSelectedPaymentMethod(e.value);
  }
  const dialogFuncMap = {
    'displayBasic1': setDisplayBasic1,
    'displayBasic2': setDisplayBasic2,
    'displayBasic3': setDisplayBasic3,
    'displayBasic4': setDisplayBasic4,
    'displayBasic5': setDisplayBasic5,
  }
  const onClick = (name, position) => {
    dialogFuncMap[`${name}`](true);
    if (position) {
      setPosition(position);
    }
  }
  const onHide = (name) => {
    dialogFuncMap[`${name}`](false);
  }

  const removeDuplicatesFromArrayByProperty = (arr, prop) => arr.reduce((accumulator, currentValue) => {
    if(!accumulator.find(obj => obj[prop] === currentValue[prop])){
      accumulator.push(currentValue);
    }
    return accumulator;
  }, [])



  const renderFooter = (name) => {

    const time = require('node-get-time');
    var dateandtime = null;
    time.gettime(function (time) {
      dateandtime = time.dateTime;
    }); 

    return (
      <div>
        
        {/*<Button  label="اضف دفعة" icon="pi pi-check" onClick={() => { addPaments()}} autoFocus className="send" />*/}
        <Button  label="ارسال" id="sendDateBill" icon="pi pi-check" onClick={() => { updateBill_id()}} autoFocus className="send" />
        <Button  label="إغلاق" icon="pi pi-times" onClick={() => {onHide(name);}}  className="exit" style={{backgroundColor:'#dc3545',borderColor:'#dc3545'}} />
        <span dir="rtl">
          <Dialog  header="وصل" visible={displayBasic3} style={{ width: '380px' }} footer={renderFooter1('displayBasic3')} onHide={() => { onHide('displayBasic3');setProducts([]);
                                                                                                                                          setQuantity({ [initQ]: 0 });
                                                                                                                                          localStorage.setItem(setValueBill, '')
                                                                                                                                          onHide('displayBasic1')
                                                                                                                                          onHide('displayBasic2')
                                                                                                                                          setDiscount(0);
                                                                                                                                          setSelectedCustomer('');
                                                                                                                                          setSheckDate('');
                                                                                                                                          setSheck_NO('');
                                                                                                                                          setSelectedBanks('');
                                                                                                                                          setSheck_Writter('');
                                                                                                                                          setChecked(false);
                                                                                                                                          setBillNote('');}}>
            <ThemeProvider theme={theme}>
              <span id="dvContents" >
                <span className="center">
              <div className="p-field p-grid" >
                <div className="p-col">
                  <h6 >رقم فاتورة المبيعات : {New_Sale_id}</h6>
                </div>
              </div>
              <div className="p-field p-grid" dir="rtl">
                <div className="p-col">
                  <label id="lastname3" type="text">{dateandtime}</label>
                </div>
              </div>
              <div className="p-field p-grid" dir="rtl">
                <div className="p-col">
                  
                  <label id="lastname3" type="text">{SelectedCustomer === '' ? " عميل عشوائي " : JSON.stringify(SelectedCustomer.name)}</label>
                </div>
              </div>
              </span>
              <div className="card" dir="rtl">
                <table style={{ width: "100%" }} role="grid" dir="rtl">
                  <thead className="p-datatable-wrapper">
                    <tr>
                      <th style={{ display: "table-cell", verticalAlign: "inherit" }}> <span className="p-column-title">#</span></th>
                      <th style={{ display: "table-cell", verticalAlign: "inherit" }}> <span className="p-column-title">المنتج</span></th>
                      <th style={{ display: "table-cell", verticalAlign: "inherit" }}> <span className="p-column-title">الكمية</span></th>
                      <th style={{ display: "table-cell", verticalAlign: "inherit" }}> <span className="p-column-title">المجموع</span></th>
                    </tr>
                  </thead>
                  <tbody className="p-datatable-tbody">
                    {products.map((item, i) => {
                     
                      return <tr key={i} dir="rtl">
                        <td style={{ display: "table-cell", verticalAlign: "inherit" }}>{i + 1}</td>
                        <td style={{ display: "table-cell", verticalAlign: "inherit" }}>{item['name']}</td>
                        <td style={{ display: "table-cell", verticalAlign: "inherit" }}>{quantity[item.name]}</td>
                        <td style={{ display: "table-cell", verticalAlign: "inherit" }}>{quantity[item.name] * prices[item.name]}</td></tr>
                    })}
                  </tbody>
                </table>

              </div>
              <div className="p-field p-grid" dir="rtl">
                <label htmlFor="firstname3" className="p-col-fixed  labelWidth">مجموع الوحدات	: </label>
                <div className="p-col">
                  <label id="firstname3" type="text">{ItemsNO.reduce((a, b) => a + b, 0)}</label>
                </div>
                </div>
                <div className="p-field p-grid" dir="rtl">
                <label htmlFor="firstname3" className="p-col-fixed labelWidth">الحاصل الاجمالي قبل الضريبة والخصم	: </label>
                <div className="p-col" style={{paddingTop:"20px"}}>
                  <label id="firstname3" type="text">{getTotal(holeTotal)} {currency}</label>
                </div>
                </div>
                {selectedPaymentMethod.code=== '3' ? 
                  <div className="p-field p-grid" dir="rtl"> <label htmlFor="firstname3" className="p-col-fixed labelWidth" > رقم الشيك	: </label>
                    <div className="p-col">
                      <label id="firstname3" type="text">{Sheck_NO}</label>
                    </div></div>
                  :
                  <></>
                }
                {discount !==0 ?
                  <div className="p-field p-grid" dir="rtl"> <label htmlFor="firstname3" className="p-col-fixed labelWidth" >الخصم	: </label>
                    <div className="p-col">
                      <label id="firstname3" type="text">{discount} {currency}</label>
                    </div></div>
                  :
                  <></>
                }
                
                {taxInput != 0 ?
                  <div className="p-field p-grid" > <label htmlFor="firstname3" className="p-col-fixed labelWidth" >قيمة الضريبة	: </label>
                    <div className="p-col">
                      <label id="firstname3" type="text">{taxInput} {currency}</label>
                    </div></div>
                  :
                  <></>
                }
              
              <div className="p-field p-grid" >
                <label htmlFor="firstname3" className="p-col-fixed labelWidth">المجموع بعد الضريبة والخصم	: </label>
                <div className="p-col" style={{paddingTop:"20px"}}>
                  <label id="firstname3" type="text" >{getTotal(t)} {currency}</label>
                </div>
              </div>
              <div className="p-field p-grid" >
                <label htmlFor="firstname3" className="p-col-fixed labelWidth"> المدفوع	: </label>
                <div className="p-col">
                  <label id="firstname3" type="text">{getTotal(ONCount)} {currency}</label>
                </div>
              </div>
              <div className="p-field p-grid" >
                <label htmlFor="firstname3" className="p-col-fixed labelWidth"> الباقي	: </label>
                <div className="p-col">
                  <label id="firstname3" type="text">{getTotal((ONCount - t))} {currency}</label>
                </div>
              </div>
              
              <div className="p-field p-grid" >

                <div className="p-col">
                  <h6 >{setting.companyname}</h6>
                  <h6 >الهاتف : {setting.phone}</h6>
                </div>
              </div>
              </span>
            </ThemeProvider>
          </Dialog>
        </span>
      </div>
    );
  }
  const renderFooter1 = (name) => {
    return (
      <div>
        <Button label="طباعة" onClick={() => {setProducts([]);
                                               setQuantity({ [initQ]: 0 });
                                               onHide('displayBasic1')
                                               onHide('displayBasic2')
                                               onHide(name)
                                               localStorage.setItem(setValueBill, '')
                                               PrintTable()
                                               return false;
                                               }} autoFocus 
                                               className="send"
                                               />
        <Button label="البريد الالكتروني" onClick={() =>{setProducts([]);
                                                               setQuantity({ [initQ]: 0 });
                                                               onHide('displayBasic1')
                                                               onHide('displayBasic2')
                                                               localStorage.setItem(setValueBill, '')
                                                                onHide(name)}}
                                                                className="send" />
       
        <Button  label="إغلاق" icon="pi pi-times" onClick={() =>{setProducts([]);
                                                               setQuantity({ [initQ]: 0 });
                                                               onHide('displayBasic1')
                                                               onHide('displayBasic2')
                                                               localStorage.setItem(setValueBill, '')
                                                               setDiscount(0);
                                                               setSelectedCustomer('');
                                                               setSheckDate('');
                                                               setSheck_NO('');
                                                               setSelectedBanks('');
                                                               setSheck_Writter('');
                                                               setChecked(false);
                                                               setBillNote('');
                                                                onHide(name)}} className="exit" style={{backgroundColor:'#dc3545',borderColor:'#dc3545'}}  />
      </div>
    );
  }
  /////////////////////////////////////////////////تخزين بيانات العميل الجديد
  const showWarn = (e) => {
    toast.current.show({ severity:'info', summary: '!!تنبيه ', detail: e, life: 3000 });
  }

if(JSON.parse(localStorage.getItem('NewCustomers'))===null){ localStorage.setItem('NewCustomers', JSON.stringify(tempcustomer));}

  function NewCustomer() {
   
    randomIdCustomer = JSON.stringify(Math.floor(Math.random() * 10000));
    document.getElementById("sendCustomData").disabled = true;

    if(navigator.onLine){
       
          sendCustomers([{['name'] :CustomerName,
                         ['identy']:CustomerID,
                         ['email']:CustomerEmail,
                         ['jawal']:CustomerTel,
                         ['phone']:CustomerPhone,
                         ['discount']: CustomerDiscount==='' ? 0 : CustomerDiscount,
                         ['tempid']:randomIdCustomer}])
          
    }else{
      
      showWarn("سيتم مزامنة العملاء عند الاتصال بالانترنت...");
         
          
          var temp = {['name'] :CustomerName,
                      ['identy']:CustomerID,
                      ['email']:CustomerEmail,
                      ['jawal']:CustomerTel,
                      ['phone']:CustomerPhone,
                      ['discount']: CustomerDiscount==='' ? 0 : CustomerDiscount,
                      ['tempid']:randomIdCustomer
                    };
          if(tempcustomer===null){
             setTempCustomer([temp]);
             localStorage.setItem('NewCustomers', JSON.stringify(tempcustomer));

          }else{
             setTempCustomer([...tempcustomer,temp]);
             localStorage.setItem('NewCustomers', JSON.stringify(null));

            // localStorage.setItem('NewCustomers', JSON.stringify(tempcustomer));
            }
           
              setCustomer([...Customer,temp]) //لادخال اسم العميل الجديد الى الباحث لحتى عودة الانترنت      
  }   
    setCustomerName('');
    setCustomerID('');
    setCustomerEmail('');
    setCustomerTel('');
    setCustomerPhone('');
    setCustomerDiscount('');
  }
  ////////////////////////////////////////////////////////// المزامنة
 function synchronization(x){

  if(navigator.onLine===true){
    let temp= JSON.parse(localStorage.getItem('NewCustomers'));
    let temp2= JSON.parse(localStorage.getItem('savesale'));
   
    if(temp!=null){
      
      showWarn('...سيتم الان مزامنة بيانات العملاء الجدد بعد عودة الاتصال بالانترنت'); 
     sendCustomers(temp)

      setTimeout(function(){

       let checkNull=JSON.parse(localStorage.getItem('NewCustomers'));
       
       if(checkNull == null){
        if(temp2!=null){
          showWarn('...سيتم الان مزامنة بيانات الفواتير بعد عودة الاتصال بالانترنت');
          temp2.map((item,index)=>{
            
           let tempBill_client_id=JSON.stringify(item.sales.client_id);
           let tempBill=item;
           resCustomersId.map((item)=>{
           
            if(JSON.stringify(item.tempid)===tempBill_client_id){
              tempBill.sales.client_id=item.id;
              
            }})
           
           sendBill([tempBill],"offline",index);
         })}}
        
      }, 10000);

    }else{
           if(temp2!=null){
           showWarn('...سيتم الان مزامنة بيانات الفواتير بعد عودة الاتصال بالانترنت');
           temp2.map((item,index)=>{
           sendBill([item],"offline",index);
       
        })
        }else{
           if(x==="2"){
            showWarn('لا يوجد بيانات بحاجة الى مزامنة');
           }
         }
        
        }}

    if(faillSendBill!==null){
          localStorage.setItem('savesale', JSON.stringify(faillSendBill));
          setfaillSendBill(null);
          showWarn("عذرا يوجد بيانات بحاجة الى مزامنة لا تخرج قبل ان تتم عملية المزامنة بشكل صحيح");
        }
 }

const MINUTE_MS = 20000 ;

useEffect(() => {
  const interval = setInterval(() => {

    synchronization("1");

  }, MINUTE_MS );

  return () => clearInterval(interval); 
}, [])

useEffect(() => {
 
  synchronization("1");

  }, [] );
  /////////////////////////////////////////////////////////
  const renderFooter2 = (name) => {
    return (
      <div>
        <Button label="تخزين" id="sendCustomData" icon="pi pi-check" onClick={() => {onHide(name);NewCustomer()} } autoFocus className="send"/>
        <Button label="إغلاق" icon="pi pi-times" style={{backgroundColor:'#dc3545',borderColor:'#dc3545'}} onClick={() => onHide(name)} className="exit" />
      </div>
    );
  }
  //////////////////////////////////////////////////////
  const accept = () => {
    setProducts([]);
    setQuantity({ [initQ]: 0 });
    localStorage.setItem(setValueBill, '')
    toast.current.show({ severity: 'success', summary: '!تم الحذف', detail: '.تم حذف البيانات', life: 3000 });
  }
 
  const confirm2 = () => {

    confirmDialog({
      message: '! لن تكون قادر على استرجاع هذه البيانات في وقت لاحق',
      header: 'هل أنت متأكد؟',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept,

    });

  };
  //////////////////////////////// keyBoard///////////////////////////////////////////////////
  useHotkeys('shift+k', () =>{onClick('displayBasic1'); setONCount(document.getElementById('Payed').value)});//to access on button دفغ

  useHotkeys('shift+c', () => {onClick('displayBasic2'); setONCount(0)});//to access on button 7sabat

  useHotkeys('shift+e', () => confirm2());//to access on button exit   الغاء

  useHotkeys('shift+u', () => onClick('displayBasic5'));//to access on button user   

  useHotkeys('shift+b', () => onClick('displayBasic4'));//to access on button bill   
 
  ///////////////////////////////////////////////////////////////////////////
  const [products, setProducts] = useState([]);
  const [layout, setLayout] = useState('list');
  let initQ = 1;

  const [quantity, setQuantity] = useState({ [initQ]: 1 });

  const currencyOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }

  const [prices, setPrices] = useState({ ['price']: 0 });
  ///////////////////////////////////////////////  localStorage //////////////////////////////
  var CryptoJS = require("crypto-js");

  useEffect(() => {
    //تشفير الداتا
    var EncryptProducts = CryptoJS.AES.encrypt(JSON.stringify(products), 'my-secret-key@123').toString();
    var EncryptQuantity = CryptoJS.AES.encrypt(JSON.stringify(quantity), 'my-secret-key@1234').toString();
    window.localStorage.setItem(window.localStorage.getItem('PrevKey'), JSON.stringify({ ['products']: EncryptProducts, ['quantity']: EncryptQuantity }));
    if (!localStorage.getItem(setValueBill)) {
      setProducts([]);
      setQuantity({ [initQ]: 0 });
    } else {
      // فك تشفير الداتا
      const storageData = JSON.parse(window.localStorage.getItem(setValueBill));
      var bytes = CryptoJS.AES.decrypt(storageData['products'], 'my-secret-key@123');
      var decryptedProducts = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      setProducts(decryptedProducts);
      var bytes2 = CryptoJS.AES.decrypt(storageData['quantity'], 'my-secret-key@1234');
      var decryptedQuantity = JSON.parse(bytes2.toString(CryptoJS.enc.Utf8));

      setQuantity(decryptedQuantity);
    }

  }, [setValueBill]);



  ///////////////////////////////////////////////////////

  const showError = () => {
    toast.current.show({ severity: 'error', summary: '!!تنبيه ', detail: 'الكمية غير متوفرة...', life: 1500 });
  }
///////////////////////////////////////////// barcode add to bill ///////
useEffect(() => { 
 
 if(!(JSON.stringify(setValue) === JSON.stringify({}))){
   let temp=setValue[0].stock;
    if (temp !== 0) {

        getPressed([setValue[0], Math.random()]);
        reSetBarcode(Math.random)
    }
    else {

        showError();
        reSetBarcode(Math.random)
    }}
},[setValue]);

////////////////////////////

  useEffect(() => {

    if (setPressed[0] !==undefined) {
       
      if (!products.includes(setPressed[0])) {// المنتج المضاف جديد على السلة
        if (products.length == 0) {//اذا كانت السلة فارغة
          setQuantity({ [setPressed[0].name]: 1 })
          setProducts([setPressed[0]])
          setPrices({ ...prices, [setPressed[0].name]: setPressed[0].price })
        }
        else {//اذا كانت السلة تحتوي على عناصر سابقة واضفت منتج جديد

          setQuantity({ ...quantity, [setPressed[0].name]: 1 });
          setProducts([...products, setPressed[0]]);
          setPrices({ ...prices, [setPressed[0].name]: setPressed[0].price })
        }
      }
      else {//تزداد الكمية اذا ضغط اكثر من مرة على نفس المنتج
        
        let newQ = quantity[setPressed[0].name] + 1;
        if (newQ <= setPressed[0].stock) {

          delete quantity[setPressed[0].name];
          setQuantity({ ...quantity, [setPressed[0].name]: newQ });
          
          
        } else {

          showError()
          
        }

      }
      
    }

  }, [setPressed]); // eslint-disable-line react-hooks/exhaustive-deps

  function getTotal(total) {
    return total.toLocaleString(undefined, currencyOptions)
  }

  function removeItem(data) {// حذف منتج من السلة

    const newList = products.filter((products) => products.name !== data.name);
    setProducts(newList);
    delete quantity[data.name];

  }

  function checkQuantity(e, data) {
    if (e.value <= data.stock) {
      initQ = data.name;

      setQuantity({ ...quantity, [data.name]: e.value });

      document.getElementById(data.name).innerHTML =currency+" " +( User.role === "admin"? prices[data.name]* e.value: data.price * e.value);

    }
    else {//المخزون اقل من المطلوب

      showError();

    }

  }
  function PriceEdite(e,data) {
    delete prices[data.name]
    setPrices({...prices,[data.name]:e.target.value});
    document.getElementById(data.name).innerHTML = currency+" " + e.target.value*quantity[data.name] ;

  }
  
  ////////////////////////////////////////////////////////حساب عدد العناصر والمجموع الكلي

  const ItemsNO = Object.entries(quantity).map(p => p[1])
  let t = Object.entries(quantity).map(p => prices[p[0]] * p[1]);


  if (Number.isNaN(t[0]) && [t].length == 1) {
    t = 0
    
  } else {
    t = t.reduce((a, b) => a + b, 0)
    
  }
  holeTotal = t;
  //قيمة الخصم
  if (/^(\d+|(\.\d+))(\.\d+)?%$/.test(discount)) {
   
    
    t = t - ((parseFloat(discount.replace('%','')) * t) / 100);

    discountamount=getTotal((parseFloat(discount.replace('%','')) * holeTotal) / 100);
   
    if(JSON.stringify(SelectedCustomer.discount)!==undefined){ //اذا كان قيمة الخصم تساوي المخزنة في سجل العميل
      if(SelectedCustomer.discount === discount){
        discountamount = discount;
      }
    }

  } else {
  
  
    if(discount===undefined){
      setDiscount(0);
     
    }else{
      if(discount!==""){
    t = t - parseInt(discount);}
  }
    discountamount= discount;
  }

 

  //قيمة الضريبة

  if (/^(\d+|(\.\d+))(\.\d+)?%$/.test(taxInput)) {
     
    let x = (parseFloat(taxInput.replace('%','')) * t) / 100;
      t = t + x;

    } else {
      if(taxInput!==""){
      t = t + parseInt(taxInput);}
    }
  ////////////////////////////////////////////////////////
 function TaxFunc(e){

  if(e){

    setTaxInput(setting.tax); 
   
    if (/^(\d+|(\.\d+))(\.\d+)?%$/.test(taxInput)) {
       
    let x = (parseFloat(taxInput.replace('%','')) * t) / 100;
      t = t + x;
  
    } else {
      if(taxInput!==""){
      t = t + parseInt(taxInput);}
    }
  }else{
    setTaxInput(0);
  }
 }



  ///////////////////////////////////////////////////////////
  const renderListItem = (data) => {
    
  
    return (


      <div style={{ display: "flex", position: "relative" ,    minWidth: "31.5vw"}} >
        <button className="button_color" onClick={() => removeItem(data)}>
          <i className="pi pi-trash"></i>
        </button>
        <h6 id={data.name} style={{ position: "absolute", left: "6%" }}>{ currency+" " + getTotal( prices[data.name]* quantity[data.name] )}</h6>
        <InputNumber id="stacked"  min={0.25} minFractionDigits={1} showButtons    value={quantity[data.name]} onValueChange={(e) => checkQuantity(e, data)} />
        <div style={{ paddingTop: "10px" }}><InputText id={data.code} type="number" disabled={User.role === "admin"? false : true} value={User.role === "admin"?  prices[data.name]:data.price } onChange={(e) => PriceEdite(e,data)} /></div>
        <h6>{data.name}</h6>
      </div>

    );
  }


  const itemTemplate = (product, layout) => {

    if (!product) {

      return <></>;
    }

    if (layout === 'list') {
      return renderListItem(product);
    }

  }

  ////////////////////////////////////////////////////////////////
  return (
    <div className="Contaner">
      <span className="p-buttonset">
        <div className="card">
          <div className="Box_1_container">
            <Toast ref={toast} position='top-center' />


            {/*////////////////////////////////////////////    اضافة عميل جديد   /////////////////////////////////////////////*/}

           {/*<Button className="p-button-secondary" tooltip="(shift+u)اضافة عميل" tooltipOptions={{ position: 'bottom' }} style={{width:"3vw",paddingRight:"8px",height: "6.6vh",borderRadius: "4px" ,marginLeft:"15px" ,marginRight:"10px"}} onClick={() => onClick('displayBasic5')}><i style={{fontSize: '1.5vw'}} className="pi pi-user-plus" ></i></Button>*/}
            <span dir="rtl">
              <Dialog header="إضافة العميل" visible={displayBasic5} style={{ width: '45vw' }} footer={renderFooter2('displayBasic5')} onHide={() => onHide('displayBasic5')}>
                <ThemeProvider theme={theme}>
                  <h5 dir="rtl">معلومات العميل</h5>
                  <div className="p-fluid p-formgrid p-grid" dir="rtl">
                    <div className="p-field p-col-12 p-md-7">
                      <label htmlFor="name">اسم العميل</label>
                      <InputText id="name" type="text" value={CustomerName} onChange={(e)=>setCustomerName(e.target.value)}></InputText>
                    </div>
                    <div className="p-field p-col-12 p-md-3">
                      <label htmlFor="item">رقم الهوية</label>
                      <InputText id="item" type="text" value={CustomerID} onChange={(e)=>setCustomerID(e.target.value)} />
                    </div>
                  </div>
                  <h5 dir="rtl">معلومات الاتصال</h5>
                  <div className="p-fluid p-formgrid p-grid" dir="rtl">
                    <div className="p-field p-col-12 p-md-10">
                      <label htmlFor="total" >البريد الالكتروني</label>
                      <InputText id="total" type="email" value={CustomerEmail} onChange={(e)=>setCustomerEmail(e.target.value)} />
                    </div>
                    <div className="p-field p-col-12 p-md-5">
                      <label htmlFor="total">الهاتف</label>
                      <InputText id="total" type="number" value={CustomerTel} onChange={(e)=>setCustomerTel(e.target.value)} />
                    </div>
                    <div className="p-field p-col-12 p-md-5">
                      <label htmlFor="total">جوال</label>
                      <InputText id="total" type="number" value={CustomerPhone} onChange={(e)=>setCustomerPhone(e.target.value)} />
                    </div>
                  </div>
                  <h5 dir="rtl">معلومات البيع</h5>
                  <div className="p-fluid p-formgrid p-grid" dir="rtl">
                    <div className="p-field p-col-12 p-md-10">
                      <label htmlFor="total">خصم</label>
                      <InputText id="total" type="text" value={CustomerDiscount} onChange={(e)=>setCustomerDiscount(e.target.value)} />
                    </div>
                  </div>
                </ThemeProvider>
              </Dialog>
            </span>


            { /*/////////////////////////////              الكونتينر                ////////////////////////////*/}
           
          </div>
          <Button onClick={() => synchronization("2")} style={{width:"3vw",paddingRight:"0.4rem",height:"3vw" ,position:'absolute',top: '10px',left: '21.3vw',borderRadius: '4px'}}  tooltip='مزامنة'  tooltipOptions={{position: 'bottom'}}   className="p-button-secondary"><i style={{fontSize: '2vw'}}  className="pi pi-spinner" ></i></Button>
          <div className="Box_3_container" style={{ display: "flex" }}>
            <h6 id="title" style={{ marginRight: "0px" }}>الغاء</h6>
            <h6 id="title" style={{ marginLeft: "25px" }}>المجموع</h6>
            <h6 id="title" style={{ marginLeft: "35px" }}>الكمية</h6>
            <h6 id="title" style={{ marginLeft: "68px" }}>السعر</h6>
            <h6 id="title" style={{ marginLeft: "65px" }}>المنتج</h6>
          </div>
          <div className="Box_4_container">

            <DataView value={products} layout={layout}
              itemTemplate={itemTemplate} rows={1}
            />

          </div>
          <div className="Box_5_container" style={{paddingLeft:"27px"}}>
            <table style={{width:"27.7vw"}} dir="rtl">
              <tbody>
              <tr>
                  <td style={{paddingRight:"1vw"}}>الحاصل الاجمالي قبل الضريبة والخصم</td>
                  <td style={{width:"9vw",paddingRight:"2.8vw"}}>العناصر </td>
              </tr>
              <tr>
                  <td ><InputText id="Payed" placeholder="0.00" value={getTotal(holeTotal)} disabled={true} style={{ width: "100%", color: "black", fontWeight: "bolder" }} /></td>
                  <td><InputText placeholder="0" value={ItemsNO.reduce((a, b) => a + b, 0)} disabled={true} style={{ width: "100%", color: "black", fontWeight: "bolder" }} /></td>
              </tr>
              
              </tbody>
            </table>
          </div>
        </div>
      </span>

      <div className="footer">
        <span className="p-buttonset">

          {/*////////////////////////////////////    الغاء     ////////////////////////////////////*/}

          <Button
            id="buCan"
            className="button_color blakeHoverColor "
            style={{ width: "20%", height: "100%", backgroundPosition: "left" ,color:'#000'}}
            onClick={confirm2}
            icon="pi pi-times"
            label="الغاء"
            tooltip="shift+e"
            tooltipOptions={{ position: 'top' }}
          />


          {/*///////////////////////////////////////////         على الحساب      ///////////////////////*/}


          <Button
            id="buDeb"
            className="button_color blakeHoverColor"
            style={{
              width: "30%",
              height: "100%",
              backgroundPosition: "left",
              backgroundColor: " #eee12c",
              padding: "1px",
              color:'#000'
            }}
            label="على الحساب" icon="pi pi-wallet"
            onClick={() => { onClick('displayBasic2'); setONCount(0) }}
            tooltip="shift+c"
            tooltipOptions={{ position: 'top' }}
          />
          <span dir="rtl">
            <Dialog header="إضافة مبيعات" visible={displayBasic2} style={{ width: '52vw' }} footer={renderFooter('displayBasic2')} onHide={() => onHide('displayBasic2')}>
              <ThemeProvider theme={theme}>

              <div className="p-field p-col-10 p-md-12">     
              <AutoComplete
              field="name"
              id="searchForClient"
              dropdown
              placeholder="عميل عشوائي ..."
              value={SelectedCustomer}
              suggestions={filteredCustomer}
              completeMethod={CustomerFiltered}
              onChange={(e) => { setSelectedCustomer(e.value);
                
                if(JSON.stringify(e.value['discount'])!=="undefined"){ setDiscount(e.value['discount'])}}}
              style={{
                height: "6.8vh", borderColor: " #e6e6e6"
                , borderWidth: "5px",direction:'rtl',position: "relative",
                width:"61.5%"
              }}
              
            />
               
                <Button className="p-button-secondary" tooltip="(shift+u)اضافة عميل" tooltipOptions={{ position: 'bottom' }} style={{width:"2.7vw",paddingRight:"5px",height: "6.6vh",borderRadius: "4px" ,marginLeft:"15px" ,marginRight:"10px",paddingLeft: "12px"}} onClick={() => onClick('displayBasic5')}><i style={{fontSize: '1.5vw'}} className="pi pi-user-plus" ></i></Button>
                
                </div>     
                <div className="p-field p-col-10 p-md-12" dir="rtl">
            <table  style={{width:"44vw"}} dir="rtl">
              <tbody>
                <tr>
                  <td style={{paddingRight:"3.5vw"}}>الخصم</td>
                  <td style={{paddingRight:"4.5vw"}} >النظام الضريبي</td>
                  <td style={{paddingRight:"5.35vw"}}>الملاحظات</td>
                </tr>
               <tr>
                  <td> {/*الخصم*/}
                    <InputText type="number" placeholder="N/A" style={{ width: "100%" }} min={0.00} value={discount} onChange={(e) => setDiscount(e.target.value)} />
                  </td>
                  
                  <td style={{width:"17vw"}}>{/*النظام الضريبي*/}
                  <InputText placeholder={currency} value={taxInput} onChange={e => {setTaxInput(e.target.value);/*Taxes(e.target.value)*/}} disabled={(User.role === "admin" && checked)? false : true} style={{ width: "50%" }} />
                    {/*<InputText placeholder={currency} value={checked ?  Taxes(setting.tax): 0} disabled={true} style={{ width: "50%" }} />*/}
                    <Checkbox inputId="binary" style={{margin:"5px 10px 6px 0px"}} onChange={e => {setChecked(e.checked);TaxFunc(e.checked);}} checked={checked} />
                    <span style={{paddingRight:"10px"}}> {checked ? <span style={{fontSize:"14px"}}>غ . ش . ض</span>:<span style={{fontSize:"14px"}}>ش . ض</span>}</span>
               
                  </td>
                 
                  <td >{/*الملاحظات*/}
                    <InputTextarea value={BillNote} onChange={(e) => setBillNote(e.target.value)} rows={1} cols={40} style={{ width: "100%" }} />
                  </td>
                </tr>
                
              </tbody>
            </table>
          </div>
                <div className="p-fluid p-formgrid p-grid" dir="rtl">

                  <div className="p-field p-col-12 p-md-12">
                    <label htmlFor="state">طريقة الدفع</label>
                    <Dropdown inputId="state" value={selectedPaymentMethod} options={paymentMethod} onChange={onMethodChange} placeholder="" optionLabel="name" style={{width:"93%"}}/>
                  </div>
                  {
                    selectedPaymentMethod.code == 1 ?
                      <>
                      <div className="p-field p-col-10 p-md-3">
                            <label>المجموع (ب. ض. خ.)</label>
                           <InputText placeholder="0.00"  value={getTotal(t)} disabled={true} style={{ width: "100%", color: "black", fontWeight: "bolder" ,borderColor:"#fff"}} />
                             
                            </div>
                        <div className="p-field p-col-12 p-md-5">
                          <label htmlFor="city">المدفوع</label>
                          <InputText id="payedOn" type="text" value={ONCount} onChange={(e) => setONCount(e.target.value)} autoFocus />
                        </div>
                        <div className="p-field p-col-12 p-md-3">
                          <label htmlFor="city">الباقي</label>
                          <InputText id="city" type="text" value={getTotal((ONCount - t))+" "+currency} disabled />
                          { }
                        </div>
                      </>
                      : [
                        selectedPaymentMethod.code == 2 ?
                          <>
                            <div className="p-field p-col-12 p-md-10">
                              <label htmlFor="city">المدفوع</label>
                              <InputText id="city" type="text" value="0" autoFocus />
                            </div>
                            <div className="p-field p-col-12 p-md-10">
                              <label htmlFor="city">رقم بطاقة الائتمان (مرر البطاقة) </label>

                              <CreditCardInput
                                fieldClassName="input"
                                cardCVCInputRenderer={({ handleCardCVCChange, props }) => (
                                  <input
                                    {...props}
                                    onChange={handleCardCVCChange(e => console.log('cvc change', e))}
                                  />
                                )}
                                cardExpiryInputRenderer={({ handleCardExpiryChange, props }) => (
                                  <input
                                    {...props}
                                    onChange={handleCardExpiryChange(e =>
                                      console.log('expiry change', e)
                                    )}
                                  />
                                )}
                                cardNumberInputRenderer={({ handleCardNumberChange, props }) => (
                                  <input
                                    {...props}
                                    onChange={handleCardNumberChange(e =>
                                      console.log('number change', e)
                                    )}
                                  />
                                )}
                              />
                            </div>
                            <div className="p-field p-col-12 p-md-5">
                              <InputText id="city" type="text" placeholder="حامل بطاقة الائتمان" />
                            </div>


                          </>
                          :
                          <>
                          <div className="p-field p-col-10 p-md-3">
                            <label>المجموع (ب. ض. خ.)</label>
                           <InputText placeholder="0.00"  value={getTotal(t)} disabled={true} style={{ width: "100%", color: "black", fontWeight: "bolder" ,borderColor:"#fff"}} />
                             
                            </div>
                            <div className="p-field p-col-12 p-md-5">
                              <label htmlFor="city">المدفوع</label>
                              <InputText id="city" type="text" value={ONCount} onChange={(e) => setONCount(e.target.value)}  autoFocus/>
                            </div>
                            <div className="p-field p-col-12 p-md-3">
                              <label htmlFor="city">الباقي</label>
                              <InputText id="city" type="text" value={getTotal((ONCount - t))+" "+currency} disabled/>
                            </div>
                            <div className="p-field p-col-12 p-md-3">
                              <label htmlFor="city">رقم الشيك</label>
                              <InputText id="city" type="number" value={Sheck_NO} onChange={(e) => setSheck_NO(e.target.value)} />
                            </div>
                            
                            <div className="p-field p-col-12 p-md-5">
                              <label htmlFor="name">كاتب الشيك</label>
                              <InputText id="name" type="text" value={Sheck_Writter} onChange={(e) => setSheck_Writter(e.target.value)} />
                            </div>
                            <div className="p-field p-col-12 p-md-3" dir="ltr">
                              <label htmlFor="city" dir="ltr">تاريخ الاستحقاق</label>
                              <InputMask id="date" dir="ltr" mask="99/99/9999" value={SheckDate} placeholder="mm/dd/yyyy" slotChar="mm/dd/yyyy" onChange={(e) => setSheckDate(e.value)}></InputMask>
                            </div>
                            
                            <div className="p-field p-col-12 p-md-12">
                              <label htmlFor="city">البنك</label>
                              <AutoComplete
                                field="bank"
                                id="searchForBank"
                                dropdown
                                placeholder="اسم البنك ..."
                                value={SelectedBanks}
                                suggestions={filteredBank}
                                completeMethod={BanksFiltered}
                                onChange={(e) => { setSelectedBanks(e.value)}}
                               style={{
                                 height: "6.8vh", borderColor: " #e6e6e6"
                                 , borderWidth: "5px",width:"93%"
                                 }}
                                 />
                            </div>
                            
                           
                          </>
                      ]
                  }
                </div>
              </ThemeProvider>
            </Dialog>
          </span>


          {/*///////////////////////////                الدفع              /////////////////////////////*/}



          <Button id="buPay" className="button_color blakeHoverColor "
            style={{
              width: "50%",
              height: "100%",
              backgroundPosition: "left",
              backgroundColor: " #017514",
              color:'#000'
            }}
            label="الدفع"
            icon="pi pi-money-bill"
            onClick={() => { onClick('displayBasic1'); setONCount(getTotal(holeTotal)) }}
            tooltip="shift+k"
            tooltipOptions={{ position: 'top' }}
            
          />
          <span dir="rtl">
            <Dialog header="إضافة مبيعات" visible={displayBasic1} style={{ width: '52vw' }} footer={renderFooter('displayBasic1')} onHide={() => onHide('displayBasic1')}>
              <ThemeProvider theme={theme}>
                
              <div className="p-field p-col-10 p-md-12" dir="rtl">

              <AutoComplete
              field="name"
              id="searchForClient"
              dropdown
              placeholder="عميل عشوائي ..."
              value={SelectedCustomer}
              suggestions={filteredCustomer}
              completeMethod={CustomerFiltered}
              onChange={(e) => { setSelectedCustomer(e.value);
                
                if(JSON.stringify(e.value['discount'])!=="undefined"){ setDiscount(e.value['discount'])}}}
              style={{
                height: "6.8vh", borderColor: " #e6e6e6"
                , borderWidth: "5px",direction:'rtl',position: "relative",
                width:"61.5%"
              }}
              
            />
             
                <Button className="p-button-secondary" tooltip="(shift+u)اضافة عميل" tooltipOptions={{ position: 'bottom' }} style={{width:"2.7vw",paddingRight:"5px",height: "6.6vh",borderRadius: "4px" ,marginLeft:"15px" ,marginRight:"10px",paddingLeft: "12px"}} onClick={() => onClick('displayBasic5')}><i style={{fontSize: '1.5vw'}} className="pi pi-user-plus" ></i></Button>
                </div>
                <div className="p-field p-col-10 p-md-12" dir="rtl">
            <table  style={{width:"44vw"}}>
              <tbody>
                <tr>
                  <td style={{paddingRight:"3.5vw"}}>الخصم</td>
                  <td style={{paddingRight:"4.5vw"}} >النظام الضريبي</td>
                  <td style={{paddingRight:"5.35vw"}}>الملاحظات</td>
                </tr>
               <tr>
                  <td> {/*الخصم*/}
                    <InputText placeholder="N/A" type="number" style={{ width: "100%" }} value={discount} onChange={(e) => setDiscount(e.target.value)} />
                  </td>
                  <td style={{width:"17vw"}}>{/*النظام الضريبي*/}
                  <InputText placeholder={currency} value={taxInput} onChange={e => {setTaxInput(e.target.value);/*Taxes(e.target.value)*/}} disabled={(User.role === "admin" && checked)? false : true} style={{ width: "50%" }} />
                    {/*<InputText placeholder={currency} value={checked ?  Taxes(setting.tax): 0} disabled={true} style={{ width: "50%" }} />*/}
                    <Checkbox inputId="binary" style={{margin:"5px 10px 6px 0px"}} onChange={e => {setChecked(e.checked);TaxFunc(e.checked);}} checked={checked} />
                    <span style={{paddingRight:"10px"}}> {checked ? <span style={{fontSize:"14px"}}>غ . ش . ض</span>:<span style={{fontSize:"14px"}}>ش . ض</span>}</span>
               
                  </td>
                 
                  <td >{/*الملاحظات*/}
                    <InputTextarea value={BillNote} onChange={(e) => setBillNote(e.target.value)} rows={1} cols={40} style={{ width: "100%" }} />
                  </td>
                </tr>
                
              </tbody>
            </table>
          </div>
                <div className="p-fluid p-formgrid p-grid" dir="rtl">
                
                  <div className="p-field p-col-12 p-md-12">
                    <label htmlFor="state">طريقة الدفع</label>
                    <Dropdown inputId="state" value={selectedPaymentMethod} options={paymentMethod} onChange={onMethodChange} placeholder="" optionLabel="name" style={{width:"93%"}}/>
                  </div>
                  {
                    selectedPaymentMethod.code == 1 ?
                    <>
                      <div id="whowPaments"></div>
                      <div className="p-field p-col-10 p-md-3">
                            <label>المجموع (ب. ض. خ.)</label>
                           <InputText placeholder="0.00" id="total2" value={getTotal(t)} disabled={true} style={{ width: "100%", color: "black", fontWeight: "bolder" ,borderColor:"#fff"}} />
                             
                            </div>
                        <div className="p-field p-col-10 p-md-5">
                          <label htmlFor="city">المدفوع</label>
                          <InputText id="payed" type="text" value={ONCount} onChange={(e) => setONCount(e.target.value)} autoFocus />
                        </div>
                        <div className="p-field p-col-10 p-md-3">
                          <label htmlFor="city">الباقي</label>
                          <InputText id="city" type="text" value={getTotal((ONCount - t))+" "+currency} disabled />
                        </div>
                      </>
                      : [
                        selectedPaymentMethod.code == 2 ?
                          <>
                            <div className="p-field p-col-12 p-md-10">
                              <label htmlFor="city">المدفوع</label>
                              <InputText id="city" type="text" value="" />
                            </div>
                            <div className="p-field p-col-12 p-md-10">
                              <label htmlFor="city">رقم بطاقة الائتمان (مرر البطاقة) </label>

                              <CreditCardInput
                                fieldClassName="input"
                                cardCVCInputRenderer={({ handleCardCVCChange, props }) => (
                                  <input
                                    {...props}
                                    onChange={handleCardCVCChange(e => console.log('cvc change', e))}
                                  />
                                )}
                                cardExpiryInputRenderer={({ handleCardExpiryChange, props }) => (
                                  <input
                                    {...props}
                                    onChange={handleCardExpiryChange(e =>
                                      console.log('expiry change', e)
                                    )}
                                  />
                                )}
                                cardNumberInputRenderer={({ handleCardNumberChange, props }) => (
                                  <input
                                    {...props}
                                    onChange={handleCardNumberChange(e =>
                                      console.log('number change', e)
                                    )}
                                  />
                                )}
                              />
                            </div>

                            <div className="p-field p-col-12 p-md-5">
                              <InputText id="city" type="text" placeholder="حامل بطاقة الائتمان" />
                            </div>

                          </>
                          :
                          <>
                            <div className="p-field p-col-10 p-md-3">
                            <label>المجموع (ب. ض. خ.)</label>
                           <InputText placeholder="0.00"  value={getTotal(t)} disabled={true} style={{ width: "100%", color: "black", fontWeight: "bolder" ,borderColor:"#fff"}} />
                             
                            </div>
                           <div className="p-field p-col-10 p-md-5">
                              <label htmlFor="city">المدفوع</label>
                              <InputText id="payed" type="text" value={ONCount} onChange={(e) => setONCount(e.target.value)} autoFocus />
                           </div>
                           <div className="p-field p-col-10 p-md-3">
                             <label htmlFor="city">الباقي</label>
                             <InputText id="city" type="text" value={getTotal((ONCount - t))+" "+currency} disabled />
                           </div>
                            <div className="p-field p-col-12 p-md-3">
                              <label htmlFor="city">رقم الشيك</label>
                              <InputText type="number" id="city" value={Sheck_NO} onChange={(e) => setSheck_NO(e.target.value)} />
                            </div>
                            <div className="p-field p-col-12 p-md-5">
                              <label htmlFor="name">كاتب الشيك</label>
                              <InputText id="name" type="text" value={Sheck_Writter} onChange={(e) => setSheck_Writter(e.target.value)} />
                            </div>
                            <div className="p-field p-col-12 p-md-3" dir="ltr">
                              <label htmlFor="date" dir="ltr">تاريخ الاستحقاق</label>
                              <InputMask id="date" dir="ltr" mask="99/99/9999" value={SheckDate} placeholder="mm/dd/yyyy" slotChar="mm/dd/yyyy" onChange={(e) => setSheckDate(e.value)}></InputMask>
                            </div>
                          
                          
                            <div className="p-field p-col-12 p-md-12">
                              <label htmlFor="bank">البنك</label>
                              <AutoComplete
                                field="bank"
                                id="searchForBank"
                                dropdown
                                placeholder="اسم البنك ..."
                                value={SelectedBanks}
                                suggestions={filteredBank}
                                completeMethod={BanksFiltered}
                                onChange={(e) => { setSelectedBanks(e.value) }}
                               style={{
                                 height: "6.8vh", borderColor: " #e6e6e6"
                                 , borderWidth: "5px",width:"93%"
                                 }}
                                 />
                            </div>
                            
                            
                          </>
                      ]
                  }
                </div>
              </ThemeProvider>
            </Dialog>
          </span >
        </span>
      </div>
    </div>
  );
}
