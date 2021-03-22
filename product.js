var query = location.search;
var id = query.split('?id=')[1];


var byIdPromise = firebase.firestore().collection("product").doc(id).get();
byIdPromise.then((doc) => {
    var pro = doc.data();   //取得對應ID的物件
    var productPage = document.getElementById('productPage');
    var isSale = pro.sale != ''? true : false;
    productPage.innerHTML += `
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb bg-transparent">
                <li class="breadcrumb-item"><a href="/index.html">所有商品</a></li>
                <li class="breadcrumb-item"><a href="/type.html?${pro.type}">${pro.type}</a></li>
                <li class="breadcrumb-item active" aria-current="page">${pro.name}</li>
            </ol>
        </nav>
        <div class="row no-gutters">
            <div class="col-md-6" style="min-height:360px">
                <div class="card border-0 h-100" >
                    <div class="img-contain h-100"
                        style="background-image: url(${pro.img});">
                    </div>
                </div>

            </div>
            <div class="col-md-6">
                <div class="card text-left h-100 border-0">
                    <div class="card-body">
                        <h5 class="card-title">${pro.name}</h5>
                        <p class="card-text">
                            <ul class="text-dark pl-3"><li>。${pro.comment.split("&").join("</li><li>。")}</li>  
                            </ul>
                        </p>
                        <div class="input-group input-group-sm mb-3 ml-4" style="width : 90px">
                            <div class="input-group-prepend">
                                <label class="input-group-text" for="quantity">數量</label>
                            </div>
                            <select class="custom-select" id="quantity">
                                <option value="1" selected>1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>
                        <hr>
                        <div class="text-secondary text-right">
                            <i class="fa fa-cc-visa " aria-hidden="true"></i>
                            <i class="fa fa-address-card " aria-hidden="true"></i>
                            <i class="fa fa-cc-mastercard " aria-hidden="true"></i>
                            <i class="fa fa-cc-paypal" aria-hidden="true"></i>
                        </div>
                        <div class="d-flex align-items-end ml-4">
                            <div class="${isSale?"":"d-none"} mr-3 mb-0">
                                <span>促銷價</span>
                                <span class="h3 text-danger">${pro.sale}</span>
                                <span>元</span>
                            </div>
                            <div>
                                <span class="${isSale?"d-none":""}">建議售價</span>
                                <span class="mb-0 ${isSale?"text-line-through":"h4"}">${pro.price}</span>
                                <span>元</span>
                            </div>
                        </div>
                        <button class="btn btn-primary btn-block mt-3 addToCart">加入購物車</button>
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <section class="text-center my-5">
            <div class="h3 mb-4">商品資訊</div>
            <img src="${pro.info}"
                class="w-100">
            </img>
        </section> 
    `;
    
    return new Promise((resolve)=>{
        resolve();
    })
    

}).then(() =>{
    var buttonCart = document.getElementsByClassName("addToCart")[0];
    var quantityElement = document.getElementById("quantity");
    buttonCart.addEventListener("click",()=>addCartToStorage(quantityElement));
})





function addCartToStorage(quantityElement){    //加入購物車資訊到storage(含商品ID以及數量)
    var quantity = quantityElement.value;
    var order = {
        productID:id,
        quantity:quantity
    }
    var cartData = JSON.parse(localStorage.getItem("list"));
    if(cartData){
        var isReapt = false;
        cartData.forEach(pro=>{
            if(pro.productID == id){
                pro.quantity = parseInt(quantity)+parseInt(pro.quantity);
                isReapt = true;
                return ;
            }
        })
        if(!isReapt) cartData.push(order);
    }else{
        cartData = [];
        cartData.push(order);
    }
    localStorage.setItem('list',JSON.stringify(cartData));
    updatedropdownCart();
}






