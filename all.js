
var firebaseConfig = {
    apiKey: "AIzaSyAyZ-ZCfWneQm_vgG--Phjg2RsOMt0yzlc",
    authDomain: "c-product.firebaseapp.com",
    projectId: "c-product",
    storageBucket: "c-product.appspot.com",
    messagingSenderId: "314295380837",
    appId: "1:314295380837:web:3ac3d604503e3614090f8c",
    measurementId: "G-7H28R9HG5G"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


window.onload = () =>{
    updatedropdownCart();
}

const auth = firebase.auth();
auth.onAuthStateChanged(function(user){
    if(user){
        let userCard = document.getElementById("userDropDown").children[0];
        userCard.innerHTML = `
            <div class="text-center">
                <a class="btn btn-sm mb-1 list-group-item-action">購物紀錄</a>
                <a class="btn btn-sm mb-1 list-group-item-action" >登出</a>
            </div>        
        `
    }else{
        if(location.href == "checkout.html"){
            console.log(location.href);
            location.href = "/cart.html";
        } 
    }
});

function signUp(email,password){	
    const promise = auth.createUserWithEmailAndPassword(email,password);
    promise.catch(e => alert(e.message));
}
function signOut(){
    auth.signOut();
    alert("已登出");
}

function signIn(email,password){	
    const promise = auth.signInWithEmailAndPassword(email,password);
    promise.catch(e => {
        alert(e.message);
    });
}

function count(){         //閉包計數器，回傳的物件可使用獲得值、增加、減少、歸零方法
    let value = 0;
    return {
        getValue(){
            return value;
        },
        increase(){
            ++value;
        },
        decrease(){
            --value;
        },
        reset(){
            value = 0;
        }
    }
};

function list(){
    let arr = [];
    return {
        add(value){
            if(arr.includes(value)) return ;
            arr.push(value);
        },
        get(){
            return arr;
        },
        size(){
            return arr.length;
        },
        addList(list){
            let tmp = [...arr];
            for(let doc of list){
                tmp.push(doc);
            }
            arr = tmp;
        },
        removeList(list){
            let tmp = [...arr];
            for(let doc of list){
                tmp = tmp.filter(e=>e!==doc);
            }
            arr = tmp;
        },
        removeAll(){
            arr = [];
        }
    }
}

function change(){         //閉包開關，直接使用此方法當觸發物件，再執行此物件可回傳true或false
    let isOpen = false;
    return function(){
        isOpen = !isOpen;
        return isOpen;
    }
};

var changeIcon1 = change();
var changeIcon2 = change();
var cartIcon = document.getElementById("cartIcon");  
var userIcon = document.getElementById("userIcon");
cartIcon.addEventListener("click",(e)=>{       //點擊右上方小購物車，顯示購物車menu並且更改圖示
    const clickIcon = e.target;
    clickIcon.parentElement.nextElementSibling.classList.toggle("show");
    toggleIcon(changeIcon1(),clickIcon,"fa-shopping-cart","fa-times");
    if(userIcon.classList.contains("fa-times")){
        userIcon.nextElementSibling.classList.toggle("show");
        toggleIcon(changeIcon2(),userIcon,"fa-user-o","fa-times");
    }
})

userIcon.addEventListener("click",(e)=>{       //點擊右上方小使用者，顯示登入頁面或者帳戶資訊，並且更改圖示
    const clickIcon = e.target;
    clickIcon.nextElementSibling.classList.toggle("show");
    toggleIcon(changeIcon2(),clickIcon,"fa-user-o","fa-times");
    if(cartIcon.classList.contains("fa-times")){
        cartIcon.parentElement.nextElementSibling.classList.toggle("show");
        toggleIcon(changeIcon1(),cartIcon,"fa-shopping-cart","fa-times");
    }
})


var userDropDown = document.getElementById("userDropDown");
userDropDown.addEventListener("click",(e)=>{
    e.preventDefault();
    let target = e.target;
    let card = e.currentTarget.children[0];
    if(target.innerText == "創建你的帳戶"){
        signUpHTML(card)

    }else if(target.innerText == "點此登入"){
        signInHTML(card);
        
    }else if(target.innerText == "註冊"){
        let email = document.getElementById("signUpEmail").value;
        let password = document.getElementById("signUpPassword").value;
        signUp(email,password);
    }else if(target.innerText == "登入"){
        let email = document.getElementById("signinEmail").value;
        let password = document.getElementById("signInPassword").value;
        signIn(email,password);
    }else if(target.innerText == "登出"){
        signInHTML(card);
        signOut();
        alert("返回購物車頁面")
        if(location.href.includes("checkout.html"))  location.href = "/cart.html";
    }else if(target.innerText == "購物紀錄"){
        location.href = "/record.html";
    }
})

function signInHTML(card){
    card.innerHTML = `
            <div class="h4">登入帳戶</div>
            <form class="mt-3">
                <div class="form-group">
                    <input type="email" class="form-control" id="signinEmail" placeholder="email"
                        aria-describedby="emailHelp">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" id="signInPassword" placeholder="密碼">
                </div>
                <button type="submit" class="btn btn-primary btn-block mb-2">登入</button>
                <div class="d-flex align-items-end justify-content-center">
                    <span>新用戶? </span>
                    <span class="text-danger btn bg-transparent border-0 p-0"
                        id="createAccount">創建你的帳戶</span>
                </div>
            </form>
        `
}

function signUpHTML(card){
    card.innerHTML = `
            <div class="h4">創建帳戶</div>
            <form class="mt-3">
                <div class="form-group">
                    <input type="email" class="form-control" id="signUpEmail" placeholder="email"
                        aria-describedby="emailHelp">
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" id="signUpPassword" placeholder="密碼">
                </div>
                <button type="submit" class="btn btn-primary btn-block mb-2">註冊</button>
                <div class="d-flex align-items-end justify-content-center">
                    <span>已經有帳戶? </span>
                    <span class="text-danger btn bg-transparent border-0 p-0"
                        id="loginAccount">點此登入</span>
                </div>
            </form>
        `
}


var cartMenu = document.getElementById("dropdownCartMenu");   //購物車menu裡面的+、-、刪除控制，以及回傳data到localStorage
cartMenu.addEventListener("click",(e)=>{                
    var target = e.target;
    var List = JSON.parse(localStorage.getItem("list"));
    var idCard = target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
    var changeQuantity = 0;
    if(target.innerText === "刪除"){
        List.forEach((order,index,object)=>{
            if(order.productID == idCard.id){
                object.splice(index,1);
                return ;
            }
        })
        idCard.remove();
    }else{
        if(target.innerText === "+"){
            var num = parseInt(target.nextElementSibling.innerText);
            changeQuantity = ++num;
            target.nextElementSibling.innerText = changeQuantity;
            
        }else if(target.innerText === "-"){
            var num = parseInt(target.previousElementSibling.innerText);
            changeQuantity = --num;
            target.previousElementSibling.innerText = changeQuantity;
        }
        List.forEach((order)=>{
            if(order.productID == idCard.id){
                order.quantity = changeQuantity;
                return ;
            }
        })
    }
    localStorage.setItem("list",JSON.stringify(List));
    printCartMenu(List,(doc,quantity)=>{
        var pro = doc.data();
        var isSale = pro.sale != ''? true : false;
        return isSale? pro.sale*quantity : pro.price*quantity;
    }).then((price)=>{
        var downCrat = document.getElementById("dropdownCartMenuTotal");
        var totalPrice = 0;
        for(let p of price){
            totalPrice += p;
        }
        downCrat.innerText = "$"+ totalPrice;
    });
    updateBadgeQuantity(List);
});


function updatedropdownCart(){
    var storageList = JSON.parse(localStorage.getItem("list"));
    var cartMenu = document.getElementById("dropdownCartMenu");
    cartMenu.innerHTML = "";
    if(storageList == null){
        updateBadgeQuantity(storageList);
        return;
    } 

    printCartMenu(storageList,(doc,quantity)=>{       
        var pro = doc.data();
        var isSale = pro.sale != ''? true : false;
        cartMenu.innerHTML += `
            <div class="card w-100 border-top-0 border-right-0 border-left-0" id="${doc.id}">
                <div class="row no-gutters pb-2">
                    <div class="col-md-3">
                        <div class="img-contain h-100"
                            style="background-origin: content-box; background-image: url(${pro.img});">
                        </div>
                    </div>
                    <div class="col-md-9">
                        <div class="py-2 pr-2">
                            <span class="h6">${pro.name}</span>
                            <div class="d-flex  mt-2">
                                <div class="d-flex align-items-end mr-auto">
                                    <span class="text-danger mr-2 ${isSale?"font-weight-bold":"d-none"}">$${pro.sale}</span>
                                    <span class="${isSale?"text-line-through font-weight-normal":"font-weight-bold"} ">$${pro.price}</span>
                                </div>
                                <div>
                                    <div class="btn-group btn-group-sm mr-3" role="group"
                                        aria-label="Basic example">
                                        <button type="button" class="btn btn-outline-secondary" id="increaseMenu">+</button>
                                        <button type="" class="btn btn-outline-secondary disabled"
                                            disabled>${quantity}</button>
                                        <button type="button" class="btn btn-outline-secondary" id="decreaseMenu">-</button>
                                        <button type="button" class="btn btn-outline-secondary">刪除</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return isSale? pro.sale*quantity : pro.price*quantity;
    }).then((price)=>{
        var totalPrice = 0;
        for(let p of price){
            totalPrice += p;
        }
        cartMenu.nextElementSibling.children[0].children[1].innerText = "$" +totalPrice;
        updateBadgeQuantity(storageList);
    });
}

function printCartMenu(storageList,callback){   //callback方法自己定義要印什麼html
    if(!storageList){
        return new Promise((reject)=>{
            reject();
        })
    }
    let promiseArr = [];
    for(let e of storageList){
        let id = e.productID;
        let quantity = e.quantity;
        let promise = firebase.firestore().collection("product").doc(id).get().then((doc)=>{
            return (callback(doc,quantity));
        }) 
        promiseArr.push(promise);
    }
    return Promise.all(promiseArr);
}

function printMenu(storageList,fsPromise,callback){   //通用版，自己定義要用firestore取某資料範圍的Promise  callback定義要打印什麼html
    let promiseArr = [];
    for(let e of storageList){
        let id = e.productID;
        let quantity = e.quantity;
        let promise = fsPromise.then((doc)=>{
            return (callback(doc,quantity));
        }) 
        promiseArr.push(promise);
    }
    return Promise.all(promiseArr);
}

function updateBadgeQuantity(storageList){
    let cartQuantity = document.getElementById("cartQuantity");
    let count = 0;
    if(storageList != null){
        for(let e of storageList){
            count += parseInt(e.quantity);
        }
    }
    cartQuantity.innerText = count;
}

function toggleIcon(boolean,clickIcon,openIcon,closeIcon){
    if(boolean){
        clickIcon.classList.remove(openIcon);
        clickIcon.classList.add(closeIcon);
    }else{
        clickIcon.classList.remove(closeIcon);
        clickIcon.classList.add(openIcon);
    }
}








