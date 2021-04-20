

function init2() {
    c3js()
}
init2();

function c3js(){
    // C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
            ['Louvre 雙人床架', 1],
            ['Antony 雙人床架', 2],
            ['Anty 雙人床架', 3],
            ['其他', 4],
        ],
        colors: {
            "Louvre 雙人床架": "#DACBFF",
            "Antony 雙人床架": "#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
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
            console.log(response);
            //   console.log(response.data.orders);
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
function mdiSoneOneOrder(e){
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
            "paid":orderStatus
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