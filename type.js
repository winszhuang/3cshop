var typeQuantity = document.getElementById("typeQuantity");
var formCheck = document.getElementById("formCheck");
var query = location.search;
var type = query.split('?')[1];
document.getElementById("type").innerHTML += type;
document.getElementById("typeTitle").innerHTML += type;
var queryFromType = firebase.firestore().collection("product").where("type","==",type);    //後面可繼續接要where甚麼東西

Array.from(document.getElementById("selectType").children).forEach(    //遍歷種類底下的不同標籤
    e=>{
        var isCurrent = e.id == type;
        if(isCurrent){
            e.className += "disable text-primary" //顯示當前頁面種類，並高亮藍字
        }else{
            e.onclick = function(){
                window.location.search = e.id;    //跳頁更換URL的?後面的id
            }
        }  
    }
)

const url = {                                           //不同種類對應的不同主題圖
    usb : "https://media.kingston.com/kingston/hero/ktc-hero-usb-ironkey-s1000-lg.jpg",
    hdd : "https://academy.avast.com/hubfs/New_Avast_Academy/SSD%20vs%20HDD/SSD_vs_HDD-which_should_you_buy-Hero.png",
    mouse : "https://media.kingston.com/hyperx/key-features/hx-keyfeatures-mouse-pulsefire-haste-2-lg.jpg",
    keyboard : "https://storage-asset.msi.com/global/picture/image/feature/multimeda/keyboard/GK20/gk20-main-visual.jpg"
}
const currentType = window.location.search.split("?")[1];
const titleImg = document.getElementById("titleImg");
titleImg.style.backgroundImage = `url(${url[currentType]})`;


const proList = list();                                   //屬於此分類的所有產品資訊
const brandList = list();                                 //存此頁面商品有的品牌
queryFromType.get().then(function(querySnapshot) {        //初始產品頁面
    querySnapshot.forEach(function(doc) {
        let pro = doc.data();
        brandList.add(pro.brand);
        proList.add(pro);
        printProduct(pro);
    });
}).then(()=>{
    typeQuantity.innerText = proList.size();
    for(let brand of brandList.get()){
        formCheck.innerHTML += `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="${brand}" >
                <label class="form-check-label" for="${brand}">${brand}</label>
            </div>
        `
    }
});


var filters = {             //過濾器，裡面放要過濾的屬性的條件
    brand : [],
    price : []
}

formCheck.addEventListener("click",(e)=>{         //確認勾選到哪個品牌來做產品篩選，可複合篩選
    if(e.target.classList.contains("form-check-label")) return ;
    let brandName = e.target.nextElementSibling.innerText;
    let isCheck = e.target.checked;
    if(isCheck){
        filters.brand.push(brandName);
    }else{
        filters.brand = filters.brand.filter(e=>e!== brandName);
    }
    updateFilterPros(proList.get(),filters);
})

var priceFilter = document.getElementById("priceFilter");     //輸入最低最高價錢來篩選，可複合篩選
priceFilter.addEventListener("click",(e)=>{
    let target = e.target;
    const minPrice = document.getElementById("minPrice");
    const maxPrice = document.getElementById("maxPrice");
    if(target.innerText == "取消"){
        minPrice.value = "";
        maxPrice.value = "";
        filters.price = [];
        updateFilterPros(proList.get(),filters);
        return ;
    }
    if(target.innerText == "篩選"){
        if(minPrice.value && maxPrice.value){
            if(parseInt(minPrice.value) >= parseInt(maxPrice.value)){
                alert("請正確輸入最低最高價錢");
                minPrice.value = "";
                maxPrice.value = "";
                return ;
            }
        }
        let tmpMin = parseInt(minPrice.value);
        let tmpMax = parseInt(maxPrice.value);
        if(!tmpMin){
            tmpMin = 0;
        }
        if(!tmpMax){
            tmpMax = 100000;
        }
        filters.price = [tmpMin,tmpMax];
        updateFilterPros(proList.get(),filters);
    }
})

function updateFilterPros(pros,filters){  //更新產品資訊卡
    removeAllProduct();
    let filterPros = multifilter(pros,filters);
    filterPros.forEach((pro)=>{
        printProduct(pro);     //增加產品欄位
    })
    typeQuantity.innerText = filterPros.length;
}

function multifilter(arr,filters){        //多重條件篩選器
    const filterKeys = Object.keys(filters);
    return arr.filter(pro=>{
        return filterKeys.every(key=>{    
            if(filters[key].length == 0) return true;
            if(key == "price"){
                let proPrice = pro.sale == ""? pro.price : pro.sale;
                return proPrice >= filters.price[0] && proPrice <= filters.price[1];
            }
            return filters[key].includes(pro[key]);
        })
    })
    
}

function printProduct(pro){    //印出商品資訊 需傳入單個商品文件doc
    var productRow = document.getElementById("productRow");
    var isSale = pro.sale != ''? true : false;

    productRow.innerHTML += `
            <div class="col-xl-3 col-lg-4 col-sm-6" id="${pro.id}">
                <div class="card border-left-0 border-top-0 h-100">
                    <a class="card-img-top img-contain btn" href="/3cshop/product.html?id=${pro.id}"
                        style="background-image: url(${pro.img}); height: 200px;">
                    </a>
                    <div class="card-body" style="height:110px">
                        <h5 class="card-title" style="font-size: 0.9rem;">${pro.name}</h5>
                        <div class="position-absolute" style="bottom:10px">
                            <div class="d-flex align-items-end">
                                <div class=" mr-3 mb-0 ${isSale?"":"d-none"}">
                                    <span class="h4 text-danger">$${pro.sale}</span>
                                </div>
                                <span class="mb-0 ${isSale?"text-line-through":"h4"}">$${pro.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `      
}

function removeAllProduct(){
    document.getElementById("productRow").innerHTML = '';
}


// 舊寫法
// const checkboxCounter = count();   //創一個checkbox勾選計數器
// formCheck.addEventListener("click",(e)=>{     //確認勾選到哪個品牌來做產品篩選
//     let isCheck = e.target.checked;
//     let brandName = e.target.nextElementSibling.innerText;
//     let updateList = proList.get().filter(doc=>doc.data().brand === brandName);    //每次觸發，先挑出某廠牌的商品，後續再去增加或刪除所有清單
    
//     if(isCheck){
//         checkboxCounter.increase();
//         if(checkboxCounter.getValue() == 1){
//             removeAllProduct();
//             tmpList.removeAll();
//         }
//         tmpList.addList(updateList);
//     }else{
//         checkboxCounter.decrease();
//         if(checkboxCounter.getValue() == 0){
//             tmpList.removeAll();
//             tmpList.addList(proList.get());
//         }else{
//             tmpList.removeList(updateList);
//         }
//     }
//     removeAllProduct();
//     tmpList.get().forEach((doc)=>{
//         printProduct(doc);     //增加產品欄位
//     })
//     typeQuantity.innerText = tmpList.size();
// });


// var priceFilter = document.getElementById("priceFilter");     //此段用來印當前情況有的商品欄目(輸入最低最高價錢來篩選)
// priceFilter.onclick = function(){
//     var minPrice = document.getElementById("minPrice").value;
//     var maxPrice = document.getElementById("maxPrice").value;
//     if(minPrice && maxPrice){
//         if(minPrice >= maxPrice){
//             alert("最低最高看不懂?");
//             document.getElementById("minPrice").value = "";
//             document.getElementById("maxPrice").value = "";
//         }else{
//             removeAllProduct();
//             proPromise.then(function(querySnapshot) {  
//                 querySnapshot.forEach(function(doc) {
//                     var pro = doc.data();
//                     if(pro.sale==""){
//                         if(pro.price<maxPrice && pro.price>minPrice){
//                             printProduct(doc);
//                         }
//                     }else{
//                         if(pro.sale<maxPrice && pro.sale>minPrice){
//                             printProduct(doc);
//                         }
//                     }
//                 });
//             }) 
//         }
//     }else if(minPrice){
//         removeAllProduct();
//         proPromise.then(function(querySnapshot) {  
//             querySnapshot.forEach(function(doc) {
//                 var pro = doc.data();
//                 if(pro.sale==""){
//                     if(pro.price>minPrice){
//                         printProduct(doc);
//                     }
//                 }else{
//                     if(pro.sale>minPrice){
//                         printProduct(doc);
//                     }
//                 }
//             });
//         }) 
//     }else{
//         removeAllProduct();
//         proPromise.then(function(querySnapshot) {  
//             querySnapshot.forEach(function(doc) {
//                 var pro = doc.data();
//                 if(pro.sale==""){
//                     if(pro.price<maxPrice){
//                         printProduct(doc);
//                     }
//                 }else{
//                     if(pro.sale<maxPrice){
//                         printProduct(doc);
//                     }
//                 }
//             });
//         }) 
//     }
// }

// var cancerFilter = document.getElementById("cancerFilter");
// cancerFilter.onclick = function(){
//     document.getElementById("minPrice").value = "";
//     document.getElementById("maxPrice").value = "";
//     removeAllProduct();
//     proPromise.then(function(querySnapshot) {  
//         querySnapshot.forEach(function(doc) {
//             printProduct(doc);
//         });
//     }).then(()=>{

//     })
// }





