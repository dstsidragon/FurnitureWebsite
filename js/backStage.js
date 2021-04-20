

function c3js(arr){
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            columns: arr,
            type: "donut"
            
        },
        donut: {
        title: "全品項營收比重"
        }
       
    });
}


let sStr = "";

showBackStageList()
// function init(){
// };

//取得後臺資料 顯示在畫面
const backStageTable = document.getElementById("backStageTable");
function showBackStageList() {

    sStr = ` <thead>
      <tr>
          <th>訂單編號</th>
          <th>聯絡人</th>
          <th>聯絡地址</th>
          <th>電子郵件</th>
          <th>訂單品項</th>
          <th>訂單日期</th>
          <th>訂單狀態</th>
          <th>操作</th>
      </tr>
  </thead>`;
    //取得伺服器訂單資料
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${pathApi}/orders`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            // console.log(response);
            // console.log(response.data.orders);
            let productsInf = [];
            let productsInfAry = [];
            let productsInfObj = {};
            response.data.orders.forEach(function (item, i) {
                // console.log(item.products);

                item.products.forEach(function (item2, i2) {
                    productsInf = [];
                    // console.log(item2.title)
                    // console.log(item2.quantity)
                    productsInf.push(item2.title);
                    productsInf.push(item2.quantity);
                    // console.log(productsInf)
                    productsInfAry.push(productsInf);
                })
            })
            // console.log(productsInfAry);
            productsInfAry.forEach(function (product, i) {
                // console.log(product)
                // console.log(product[0]);

                if (productsInfObj[product[0]] == undefined) {
                    productsInfObj[product[0]] = product[1];
                } else {
                    productsInfObj[product[0]] += product[1];
                }

            })



            // console.log(productsInfObj)

            const itemKeyAry = Object.keys(productsInfObj);
            // console.log(itemKeyAry)
            let sortAry = [];
            itemKeyAry.forEach(function (item, i) {
                // console.log(item)
                let sortObj = {};
                sortObj[`${item}`] = productsInfObj[item]
                sortAry.push(sortObj);
                //    console.log(sortObj)
            })
            //改變排序
            sortAry = sortAry.sort(function (a, b) {
                return a[1] > b[1] ? 1 : -1;
            });

            //判斷訂單資料筆數 
            
            let c3Ary = [];
            if(sortAry.length<4){
                
            // console.log(sortAry)
            //前三的資料
           
            for (let i = 0; i < sortAry.length; i++) {
                let top3Ary = [];
                top3Ary.push(Object.keys(sortAry[i])[0]);
                top3Ary.push(Object.values(sortAry[i])[0]);
                c3Ary.push(top3Ary);
            }
            // console.log(c3Ary)

            }else{
                
            // console.log(sortAry)
            //前三的資料
            for (let i = 0; i < 3; i++) {
                let top3Ary = [];
                // console.log(Object.keys(sortAry[i])[0]);
                // console.log(Object.values(sortAry[i])[0]);
                top3Ary.push(Object.keys(sortAry[i])[0]);
                top3Ary.push(Object.values(sortAry[i])[0]);
                c3Ary.push(top3Ary);
            }
            console.log(c3Ary)
            //PUSH 其他
            let anotherAry = [];
            let anotherTotal =0;
            for (let i = 3; i < sortAry.length; i++) {
                

                // console.log(Object.values(sortAry[i])[0]);
                anotherTotal+= Object.values(sortAry[i])[0]
               
            }
            anotherAry.push("其他");
            anotherAry.push(anotherTotal);
            c3Ary.push(anotherAry);
            // console.log(c3Ary[0][0])

            };
            response.data.orders.forEach(function (item, i) {
                // console.log(item);
                let orderStatus = "";
                if (item.paid == true) { orderStatus = "已處理" } else { orderStatus = "未處理" }
                sStr += `<tr>
    <td>${item.createdAt}</td>
    <td>
        <p>${item.user.name}</p>
        <p>${item.user.tel}</p>
    </td>
    <td>${item.user.address}</td>
    <td>${item.user.email}</td>
    <td>
        <p>${item.products[0].title}</p>
    </td>
    <td>${item.user.date}</td>
    <td class="orderStatus">
        <a href="#" id="orderStatus${i}" data-number="${i}" data-orderId="${item.id}">${orderStatus}</a>
    </td>
    <td>
    <input type="button" id="delOrder${i}" class="delSingleOrder-Btn" data-orderId="${item.id}" value="刪除">
    </td>
</tr>`;

            })
            backStageTable.innerHTML = sStr;

            //動態賦予事件
            response.data.orders.forEach(function (item, i) {
                //動態賦予刪除事件
                document.getElementById(`delOrder${i}`).addEventListener("click", delSoneOneOrder, false);
                document.getElementById(`orderStatus${i}`).addEventListener("click", mdiSoneOneOrder, false);

            })

            //刷新C3
            c3js(c3Ary);

        }).catch(function (error) {
            // 失敗會回傳的內容
            console.log(error);
        })




};


//刪除特定訂單



function delSoneOneOrder() {
    // console.log(this.dataset);
    // console.log(this.dataset.orderid);
    const orderId = this.dataset.orderid;
    axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${pathApi}/orders/${orderId}`, {

        headers: {
            'Authorization': token
        }
    }).then(function (response) {
        console.log(response);
        alert("刪除 1 筆訂單!")
        showBackStageList();
    }).catch(function (error) {
        // 失敗會回傳的內容
        console.log(error);
    })
}

//刪除全部訂單
const discardAllBtn = document.getElementById("discardAllBtn");
// console.log(discardAllBtn)
discardAllBtn.addEventListener("click", delAllOrder, false);
function delAllOrder(e) {
    e.preventDefault();
    //取得伺服器訂單資料
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${pathApi}/orders`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            // console.log(response);
            //    console.log(response.data.orders.length);
            if (response.data.orders.length == 0) { alert("沒有訂單資料!") } else {
                axios.delete(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${pathApi}/orders/`, {
                    headers: {
                        'Authorization': token
                    }
                }).then(function (response) {
                    console.log(response);
                    alert("刪除 全部訂單!")
                    showBackStageList();
                }).catch(function (error) {
                    // 失敗會回傳的內容
                    console.log(error);
                })
            }
        }).catch(function (error) {
            // 失敗會回傳的內容
            console.log(error);
        })




};

//修改訂單狀態
function mdiSoneOneOrder(e) {
    e.preventDefault();
    const orderId = this.dataset.orderid;
    const orderNumber = this.dataset.number;
    // console.log(orderId)
    // console.log(orderNumber)
    //取得伺服器訂單資料
    axios.get(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${pathApi}/orders`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {

            // console.log(response.data.orders);
            let orderStatus = !response.data.orders[orderNumber].paid;
            // console.log(orderStatus);



            //修改伺服器資料
            axios.put(`https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/${pathApi}/orders`,
                {
                    "data": {
                        "id": orderId,
                        "paid": orderStatus
                    }
                },
                {
                    headers: {
                        'Authorization': token
                    }
                }).then(function (response) {
                    alert("已改變 1筆訂單狀態!")
                    showBackStageList();

                }).catch(function (error) {
                    // 失敗會回傳的內容
                    console.log(error);
                })



        }).catch(function (error) {
            // 失敗會回傳的內容
            console.log(error);
        })




}