window.onload = () =>{
    var storageList = JSON.parse(localStorage.getItem("list"));
    var proCheckMenu = document.getElementById("proCheckMenu");
    printCartMenu(storageList,(doc,quantity)=>{       //方法自己定義要印神麼html
        var pro = doc.data();
        var singleTotalPrice = pro.sale != ''? pro.sale*quantity : pro.price*quantity;

        proCheckMenu.innerHTML += `
            <div class="d-flex ">
                <div class="img-contain"
                    style="min-height: 90px; min-width: 90px; background-image: url(${pro.img});">
                </div>
                <div class="p-2 w-100 d-flex flex-column justify-content-between">
                    <div class="mb-2" style="font-size: 1rem;">${pro.name}</div>
                    <div class="d-sm-flex d-block align-items-end ">
                        <div class="mr-3 text-info mr-auto">數量<span>${quantity}</span></div>
                        <span class="h5 mb-0 ">$${singleTotalPrice}</span>
                    </div>     
                </div>
            </div>
        `;
        return singleTotalPrice;
    }).then((data)=>{
        var total = data.reduce((a,b)=>a+b);
        var proCheckMenuTotal = proCheckMenu.nextElementSibling.nextElementSibling.children[1];
        proCheckMenuTotal.innerText = "$"+total;
        document.getElementById("totalPrice").innerText = "$"+total;
        updatedropdownCart();
    });
}


var finalCheck = document.getElementById("finalCheck");  //最終確認訂單
finalCheck.addEventListener("click",()=>{
    auth.onAuthStateChanged(function(user){
        var storageList = JSON.parse(localStorage.getItem("list"));
        let order = {};
        for(let e of storageList){
            order[e.productID] = {
                productID: e.productID,
                quantity : e.quantity
            }
        }
        order.email = user.email;
        localStorage.removeItem('list');
        firebase.firestore().collection("order").add(order).then(()=>{
            alert("已確認訂單");
            location.replace("/index.html");
            console.log("成功存入");
        })
    }); 
})