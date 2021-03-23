auth.onAuthStateChanged(function(user){
    if(user){
        let record = document.getElementById("record");
        record.innerHTML = "";
        firebase.firestore().collection("order").where("email","==",user.email).get().then((querySnapshot)=>{
            querySnapshot.forEach((doc) => {
                let data = doc.data();
                let proData = Object.values(data).filter(obj=> typeof obj === 'object' );
                let promiseArr = [];
                for(let e of proData){
                    let quantity = e.quantity;
                    let id = e.productID;
                    let promise = firebase.firestore().collection("product").doc(id).get().then((d)=>{
                        let pro = d.data();
                        let isSale = pro.sale != ''? true : false;
                        record.innerHTML += `
                            <tr>
                                <th class="img-contain h-100"
                                    style="min-width:120px; background-image: url(${pro.img});">
                                </th>
                                <th>
                                    <div class="mb-2">${pro.name}</div>
                                    <div class="d-flex align-items-end">
                                        <span class="mr-3 ${isSale?"":"d-none"}">$${pro.sale}</span>
                                        <span class="${isSale?"d-none":""}">$${pro.price}</span>
                                    </div>
                                </th>
                                <th class="h-100">
                                    <div class="">${quantity}</div>
                                </th>
                                <th class="singleTotal">$${pro.sale==""?pro.price*quantity:pro.sale*quantity}</th>
                            </tr>
                        `;
                    })
                    promiseArr.push(promise);
                }
                Promise.all(promiseArr).then(()=>{
                    record.innerHTML += `
                    <tr>
                        <th colspan="4"><hr></th>
                    </tr>
                `;
                })
                
            });

        })
    }else{
        alert("未登入狀態 查無資料");

    }
});