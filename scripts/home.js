firebase.firestore().collection("product").where("sale","!=","").get().then(function(querySnapshot) {  //查詢用
    querySnapshot.forEach(function(doc) {
        var pro = doc.data();
        var saleRow = document.getElementById("sale");
        saleRow.innerHTML += `
                <div class="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
                    <div class="card h-100" id="${pro.id}" >
                        <a class="card-img-top img-contain btn" href="/3cshop/product.html?id=${pro.id}"
                            style="min-height: 200px; background-image: url(${pro.img});">
                        </a>
                        <div class="card-body " style="bottom: 0;">
                            <div class="card-title text-info font font-weight-bold">${pro.name}</div>
                            <div class="card-text d-flex align-items-end">
                                <span class="h3 text-danger mr-3 mb-0">$${pro.sale}</span>
                                <span class="mb-0 text-line-through">$${pro.price}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    });
})

// firebase.firestore().collection("product").doc("keyboard7").set(   //創建用
//     {
//         "type":"keyboard",
//         "name":"Logitech羅技 G413 機械式背光電競鍵盤-SILVER (銀)",
//         "price":"1990",
//         "sale":"",
//         "img":"https://diz36nn4q02zr.cloudfront.net/webapi/imagesV3/Original/SalePage/4264468/0/637501594284570000?v=1",
//         "number":125,
//         "comment": "Romer-G 鍵軸&LED白色背光&鋁鎂合金頂蓋、懸浮按鍵設計&腳架可調高度&底部線材收納設計",
//         "info":"https://diz36nn4q02zr.cloudfront.net/webapi/images/r/SalePageDesc/4264468/image0.jpeg?ts=133839",
//         "brand":"Logitech"
//     }
// );






