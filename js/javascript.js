// variables
const month = document.getElementById('month');
const year = document.getElementById("year");
const cardIcon = document.getElementById("cardIcon");
const cardNumber = document.getElementById("cardNumber");
const cvv = document.getElementById('cvv');
const paymentBtn = document.getElementById("paymentBtn");
const expiryDate = document.getElementById("expiryDate");
const cardErrorMsg = document.getElementById("cardErrorMsg");
const dateErrorMsg = document.getElementById("dateErrorMsg");
const cvvErrorMsg = document.getElementById("cvvErrorMsg");
const overlayLayer = document.getElementById("overlayLayer");
const loaderContainer = document.getElementsByClassName("loaderContainer")[0];
const verification = document.getElementsByClassName("verification")[0];
const info = document.getElementById("info");
const goBack = document.getElementById("goBack");
let cardType="unknown";



// EventListeners

cvv.addEventListener('keyup',(e)=>{
   let value = e.target.value;
   let number = (cardType === "amex")? 4:3;
   if(value.length > number){
      e.target.value = value.slice(0,number)
   }
})


cardNumber.addEventListener("blur",()=>{
    (validateCard() === false )? showError(cardNumber,cardErrorMsg):removeError(cardNumber,cardErrorMsg);
})

expiryDate.addEventListener("blur",()=>{
    (validateDate() === false)?showError(expiryDate, dateErrorMsg) : removeError(expiryDate, dateErrorMsg);
})

cvv.addEventListener("blur",()=>{
    (validateCvv()===false)? showError(cvv, cvvErrorMsg): removeError(cvv, cvvErrorMsg);
})


// btn click eventlistener

paymentBtn.addEventListener('click',(e)=>{
   e.preventDefault();


   if(validateCard() && validateCvv() && validateDate()){
 
       overlayLayer.classList.add('overlay');
       loaderContainer.style.display = "flex";


       setTimeout(()=>{
          
           loaderContainer.style.display="none";
           verification.classList.add("showVeri")
           info.innerText = "Credit Card Number : "+ cleaveCard.getFormattedValue()+"\n\nCard Type : "+cardType+"\n\nExpiration Date : "+ cleaveExpiry.getFormattedValue() + "\n\nCVV : "+cvv.value 

       },2000);

   }else{
       if(validateCard()===false){
           showError(cardNumber,cardErrorMsg)
       }else if(validateDate()===false){
           showError(expiryDate, dateErrorMsg)
       }else{
           showError(cvv, cvvErrorMsg)
       }
   }
  
})


goBack.addEventListener('click',()=>{
   overlayLayer.classList.remove('overlay');
   verification.classList.remove("showVeri");

   
})



// validation functions

const validateCard = ()=>{
   let cardNumberLength = cleaveCard.getRawValue().length;
   let result = true;
   
   if(cardType==="unknown"){
       result = false;
   }else if(cardType === "visa" || cardType === "mastercard" || cardType === "discover" ) {
       (cardNumberLength < 16)?result= false : result= true;
   }
   else if(cardType==="amex" && cardNumberLength < 15 ){
            result = false;
       }
   return result;

}


const validateDate = () =>{

   let minDate = new Date();
   let maxDate = new Date(2080,1)
   let input = cleaveExpiry.getFormattedValue().split('/');
   input = new Date(input[1],input[0]);
   if(input.toString() === 'Invalid Date'){
       return false;
   }

   if(input <= minDate ){
       return false;
   }else if( input > maxDate){
       return false;
   }
   else{
       return true;
   }

   }


const validateCvv = () =>{
   let val = cvv.value;
   let result = true;
   if(cardType === "amex" && val.length != 4 ){
           result = false;
       
   }else if(cardType === "visa" || cardType === "mastercard" || cardType === "discover" ){
       (val.length !== 3)? result = false : result = true;
       
   }
   return result;
}


// cleave js

const cleaveCard = new Cleave("#cardNumber",{
    creditCard: true,
    onCreditCardTypeChanged: function (type){
        cardType = type; 
  
        if(type === "unknown"){
            cardIcon.src ="assets/imgs/credit-card.png"
        }else if(type === "visa"){        
            cardIcon.src="assets/imgs/visa.png"
        }else if(type=== "mastercard"){
            cardIcon.src ="assets/imgs/master.png"
        }
        else if(type=== "discover"){
            cardIcon.src="assets/imgs/discover.png"
        }else if(type==="amex"){
            cardIcon.src ="assets/imgs/amex.png"
        }
        else{
            cardType = "unknown"
        }
    }
})



const cleaveExpiry = new Cleave("#expiryDate",{
        date:true,
        datePattern: ['m','Y']
    }
)


// Helper functions

const showError = (form, msg)=>{
   form.classList.add("error");
   msg.style.opacity = 100;
        
}
const removeError = (form,msg)=>{
   form.classList.remove("error");
   msg.style.opacity = 0;
}



