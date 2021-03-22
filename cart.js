
window.onload = () =>{         //初始化印出購物車有的產品資訊     
    var storageList = JSON.parse(localStorage.getItem("list"));
    if(!storageList){
        let checkoutButton = document.getElementById("checkoutButton");
        checkoutButton.disabled = true;
    }
    printCartMenu(storageList,(doc,quantity)=>{       
        var pro = doc.data();
        var cartMenu = document.getElementById("cartTable");
        var isSale = pro.sale != ''? true : false;
        cartMenu.innerHTML += `
            <tr id="?${doc.id}">
                <th class="img-contain h-100"
                    style="min-width:120px; background-image: url(${pro.img});">
                </th>
                <th>
                    <div class="mb-2">${pro.name}</div>
                    <div class="d-flex align-items-end">
                        <span class="text-danger mr-3 ${isSale?"":"d-none"}">$${pro.sale}</span>
                        <span class="${isSale?"text-line-through font-weight-normal":""}">$${pro.price}</span>
                    </div>
                </th>
                <th class="h-100">
                    <div class="btn-group btn-group-sm mr-3" role="group"
                        aria-label="Basic example">
                        <button type="button" class="btn btn-outline-secondary"
                            id="increaseMenu">+</button>
                        <button type="" class="btn btn-outline-secondary disabled"
                            disabled>${quantity}</button>
                        <button type="button" class="btn btn-outline-secondary"
                            id="decreaseMenu">-</button>
                    </div>
                    <span type="button" class="btn ">刪除</span>
                </th>
                <th class="singleTotal">$${pro.sale==""?pro.price*quantity:pro.sale*quantity}</th>
            </tr>
        `;
    }).then(()=>{
        updateTotalPrice();
        updatedropdownCart();
    }).catch(()=>{
        console.log("購物車沒東西");
    });

}

var mainCartMenu = document.getElementById("cartTable");     //+、-、刪除以及存入LocalStorage，並且更新總價以及右上方購物車menu
mainCartMenu.addEventListener("click",(e)=>{                
    var target = e.target;
    var List = JSON.parse(localStorage.getItem("list"));
    var changeQuantity = 0;
    if(target.innerText === "刪除"){
        let trId = target.parentElement.parentElement;
        List.forEach((order,index,object)=>{
            if(order.productID == trId.id.split("?")[1]){
                object.splice(index,1);
                return ;
            }
        })
        trId.remove();
    }else{
        let idCard = target.parentElement.parentElement.parentElement;
        let unitPriceElm = target.parentElement.parentElement.previousElementSibling.children[1];
        let singleTotalElm = target.parentElement.parentElement.nextElementSibling;
        let unitPrice = unitPriceElm.children[0].className.includes("d-none") 
                ? unitPriceElm.children[1].innerText.split("$")[1]
                :unitPriceElm.children[0].innerText.split("$")[1];
        
        if(target.innerText === "+"){
            var num = parseInt(target.nextElementSibling.innerText);
            changeQuantity = ++num;
            target.nextElementSibling.innerText = changeQuantity;
        }else if(target.innerText === "-"){
            var num = parseInt(target.previousElementSibling.innerText);
            changeQuantity = --num;
            target.previousElementSibling.innerText = changeQuantity;  
        }

        singleTotalElm.innerText = `$${unitPrice*changeQuantity}`;
        List.forEach((order)=>{
            if(order.productID == idCard.id.split("?")[1]){
                order.quantity = changeQuantity;
                return ;
            }
        })
    }
    localStorage.setItem("list",JSON.stringify(List))
    updateTotalPrice();
    updatedropdownCart();
});

var checkoutButton = document.getElementById("checkoutButton");
checkoutButton.addEventListener("click",()=>{
    auth.onAuthStateChanged(function(user){
        if(user){
            location.href = "/3cshop/checkout.html";
        }else{
            alert("請先登入帳戶在結帳");
        }
    });
})

function updateTotalPrice(){
    let TotalElm = document.getElementById("totalPrice");
    let totalList = document.getElementsByClassName("singleTotal");
    let totalPrice = 0;
    for(let i of totalList){
        totalPrice += parseInt(i.innerText.split("$")[1]);
    }
    TotalElm.innerText = "$"+totalPrice;
}




