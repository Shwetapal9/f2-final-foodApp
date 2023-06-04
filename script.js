let menubtn=document.getElementsByClassName("menu-btn");
menubtn[0].style.opacity='0';
let listitems = document.getElementsByTagName("div")[1];
async function fetchData(){
  try{
      menubtn[0].style.opacity='0';
      let res = await fetch("https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json")
      let data =await res.json()
      getMenu(data);
      return new Promise((resolve,reject)=> resolve(data));
  }catch(err){
      console.log(err.message);
  }
}
fetchData()
    .then((data)=>takeOrder(data))
    .then((burgers3)=>orderPrep(burgers3))
    .then((order)=>payOrder(order))
    .then((order)=>thankYou(order))
    .catch((err)=>console.log(err))

function getMenu(items){       
        listitems.innerHTML=''
        let list = document.createElement('ul')
        list.className = "menu-items"
        let headertext = document.createElement('h2');
        headertext.textContent ='MENU ITEMS';
        items.forEach((item) =>{
        let innerdata =`
        <img src="${item.imgSrc}">
                <span>${item.name}</span>
                <span>${item.price}$</span>
            `
            let innerlist = document.createElement('li');
            innerlist.innerHTML=innerdata;
            list.appendChild(innerlist);
          });
          listitems.appendChild(headertext);
         listitems.appendChild(list);
         menubtn[0].style.opacity='0';
  }

function takeOrder (data) {  
  menubtn[0].style.opacity='1';
  return new Promise((resolve,reject)=>{
      setTimeout(async()=>{
          let selectedBurgers;
         try{
              selectedBurgers = select3Burgers(data);
              displaySelectedBurgers(selectedBurgers);
         }
         catch(e){
          console.log(e);
         }
         resolve(selectedBurgers);
      },2500);
  })
}
function select3Burgers (burgers) {
  let arr=[];
  arr.length=3;
  for(let i=0;i<3;i++){
      let rdnNum = randomNum(burgers.length);
      arr[i]=rdnNum;
      for(let j=0;j<i;j++){
          if(arr[i]==arr[j]){ 
              i--;
          }
      }
  }
  function randomNum(max){
    return Math.floor(Math.random()*max);
 }
  let selectedFood=[];
  arr.map((num)=>{
      selectedFood.push(burgers[num]);
  })
  return selectedFood;
}
function displaySelectedBurgers(burgers){
  listitems.innerHTML=''
  console.log(burgers);
  document.querySelector(".modal").style.display="block";
  document.querySelector("#modalHeading").textContent="Selected Food Items";
  burgers.forEach((burger)=>{
      let orderBox=document.createElement("div");
      orderBox.setAttribute("class","orderBox")
      let img=document.createElement("img");
      img.src=`${burger.imgSrc}`;
      let name=document.createElement("p");
      name.innerHTML=`<strong>${burger.name}</strong>`;
      let price=document.createElement("p");
      price.innerHTML=`<strong>Price: </strong>$${burger.price}`
      // let rating=document.createElement("p");
      // rating.innerHTML=`<strong>Rating: </strong>${burger.rate}⭐`;
      orderBox.append(img,name,price);
      document.querySelector(".modal-content").append(orderBox);
  })
}
function orderPrep(data){
  let order={order_status:true, paid:false};
  return new Promise((resolve, reject) => {
    setTimeout(async()=>{
        try{
            orderStatus(data,order);
        }catch(err){
            console.log(err);
        }
        resolve(order);
    },1500);
})
} 

function orderStatus(data,order){
  console.log(order);
  document.querySelector("#orderStatus").innerHTML="";
  let total=0;
  burgers.map((burger)=>total+=burger.price);
  let status=document.createElement("p");
  status.innerHTML=`Make Payment of <strong>$${total}</strong> to place your order`;
  status.style.color="red";
  document.querySelector("#orderStatus").append(status);
}

function payOrder(order){
  foodOrder={...order};
  foodOrder.paid=true;
  return new Promise((resolve,reject)=>{
      setTimeout(async()=>{
          try{
              placeOrder(foodOrder);
          }catch(err){
              console.log(err);
          }
          resolve(foodOrder);
      },1000)
  })
}
function placeOrder(order){
  console.log(order);
  document.querySelector("#orderStatus").innerHTML="";
  let status=document.createElement("p");
  status.innerHTML=`Payment Done🎉! Your order has been placed successfully ✅`;
  status.style.color="green";
  document.querySelector("#orderStatus").append(status);
}

function successMsg(){
  console.log("Thank You");
  alert("Thank You!")
  document.querySelector(".modal").style.display="none";
}

function thankYou(order){
      return new Promise((resolve,reject)=>{
          setTimeout(()=>{
              try {
                  if(order.paid){
                      successMsg();
                      resolve();
                  }
                  else reject(new Error("Payment Failed!"));
              } catch (error) {
                  console.log(error);
              }
          },1000);
      })
}