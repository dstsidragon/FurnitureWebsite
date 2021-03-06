
let sStr = "";
const myCartList = document.getElementById("myCartList");

//初始化
function init() {
  showProduct();
  showShppingCar();
};
init();

//產生產品
const productWrap = document.getElementById("productWrap");
function showProduct() {
  axios.get(`${api_url}/api/livejs/v1/customer/${pathApi}/products`)
    .then(function (response) {
      // console.log('資料有回傳了');  
      // console.log(response.data.products);
      sStr = "";
      response.data.products.forEach(function (item, i) {
        // console.log(item);
        sStr += `<li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="">
      <a href="#" id="addCardBtn${i}" class="addCardBtn" data-id="${item.id}" >加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
  </li>`;
      });

      productWrap.innerHTML = sStr;

      //動態賦予新增商品事件
      response.data.products.forEach(function (item, i) {
        document.getElementById(`addCardBtn${i}`).addEventListener('click', addCart, false)
      });
    });
};


//新增商品至購物車 

function addCart(e) {
  // console.log(1);

  e.preventDefault();
  axios.get(`${api_url}/api/livejs/v1/customer/${pathApi}/carts`)
    .then(function (response) {
      // 成功會回傳的內容
      // console.log(response.data.carts);
      //   console.log("成功");
      let cartObj = {};
      response.data.carts.forEach(function (item, i) {

        // console.log(item.id);
        // console.log(item.quantity);
        cartObj[item.product.id] = item.quantity;
      })
      // console.log(cartObj)
      // console.log(e.target.dataset.id);
      if (cartObj[e.target.dataset.id] == undefined) {
        // console.log(685681)
        axios.post(`${api_url}/api/livejs/v1/customer/${pathApi}/carts`,
          {
            "data": {
              "productId": `${e.target.dataset.id}`,
              "quantity": 1
            }
          })
          .then(function (response) {
            // 成功會回傳的內容
            // console.log(response.data)
            alert("已加入購物車!")

            showShppingCar();
          }).catch(function (error) {
            // 失敗會回傳的內容
            console.log(error);
          })
      } else {
        // console.log(1234)
        // console.log(cartObj[e.target.dataset.id])
        let itemNum = cartObj[e.target.dataset.id];
        axios.post(`${api_url}/api/livejs/v1/customer/${pathApi}/carts`,
          {
            "data": {
              "productId": `${e.target.dataset.id}`,
              "quantity": itemNum + 1
            }
          })
          .then(function (response) {
            // 成功會回傳的內容
            // console.log(response.data)
            alert("已加入購物車!")

            showShppingCar();
          }).catch(function (error) {
            // 失敗會回傳的內容
            console.log(error);
          })
      }




    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })
  // console.log(e.target.dataset.id);



};
//  切換產品下拉選單
const productSelect = document.getElementById("productSelect");
productSelect.addEventListener("change", chgProduct, false)
function chgProduct(e) {
  // console.log(e.target.value)
  axios.get(`${api_url}/api/livejs/v1/customer/${pathApi}/products`)
    .then(function (response) {
      // console.log('資料有回傳了');  
      // console.log(response.data.products);
      sStr = "";
      let j = 0;
      response.data.products.forEach(function (item, i) {
        // console.log(item);
        // console.log(item.category);

        if (e.target.value == "全部") {
          sStr += `<li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="">
      <a href="#" id="addCardBtn${j}" class="addCardBtn" data-id="${item.id}" >加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
  </li>`;
          j++;
        } else if (e.target.value == "床架") {
          if (item.category == "床架") {
            sStr += `<li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="">
      <a href="#" id="addCardBtn${j}" class="addCardBtn" data-id="${item.id}" >加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
  </li>`;
            j++;
          }
        } else if (e.target.value == "窗簾") {
          if (item.category == "窗簾") {
            sStr += `<li class="productCard">
      <h4 class="productType">新品</h4>
      <img src="${item.images}" alt="">
      <a href="#" id="addCardBtn${j}" class="addCardBtn" data-id="${item.id}" >加入購物車</a>
      <h3>${item.title}</h3>
      <del class="originPrice">NT$${item.origin_price}</del>
      <p class="nowPrice">NT$${item.price}</p>
  </li>`;
            j++;
          }
        } else if (e.target.value == "收納") {
          if (item.category == "收納") {
            sStr += `<li class="productCard">
    <h4 class="productType">新品</h4>
    <img src="${item.images}" alt="">
    <a href="#" id="addCardBtn${j}" class="addCardBtn" data-id="${item.id}" >加入購物車</a>
    <h3>${item.title}</h3>
    <del class="originPrice">NT$${item.origin_price}</del>
    <p class="nowPrice">NT$${item.price}</p>
</li>`;
            j++;
          }
        }

      });
      productWrap.innerHTML = sStr;
      const chgDownProduct = document.querySelectorAll(".productCard a");
      //  console.log(chgDownProduct)

      //動態賦予新增商品事件
      chgDownProduct.forEach(function (item, i) {
        // console.log(1)
        document.getElementById(`addCardBtn${i}`).addEventListener('click', addCart, false)
      });
    })
};

//取得購物車 顯示在畫面
let cartItem = 0;
function showShppingCar() {
  axios.get(`${api_url}/api/livejs/v1/customer/${pathApi}/carts`)
    .then(function (response) {
      // 成功會回傳的內容
      // console.log(response.data.carts);
      //   console.log("成功");
      cartResponse = response;
      // console.log(cartResponse)
      sStr = ` <tr>
  <th width="40%">品項</th>
  <th width="15%">單價</th>
  <th width="15%">數量</th>
  <th width="15%">金額</th>
  <th width="15%"></th>
</tr>`;

      // let aa =response.data.products.filter(function (item,i,arr){
      //     return arr.indexOf(item) === i;
      // });
      // // console.log(aa);
      let cartListPrice = 0;
      cartItem = 0;
      response.data.carts.forEach(function (item, i) {
        // console.log(item);
        sStr += `<tr >
<td>
    <div class="cardItem-title">
        <img src="${item.product.images}" alt="">
        <p>Antony ${item.product.title}</p>
    </div>
</td>
<td>NT$${item.product.price}</td>
<td><input id="inputNumber${i}" class="inputNumber" type="number" data-id-modi='${item.id}' value="${item.quantity}"></td>
<td>NT$${item.product.price}</td>
<td class="discardBtn" >
    <a href="#" id="deleteSomeOne${i}" class="material-icons " data-id-clear='${item.id}'>
        clear
    </a>
</td>
</tr>`;
        // console.log(response.data)
        //加總金額
        cartListPrice = response.data.finalTotal;
        //紀錄筆數
        cartItem += 1;
      })
      myCartList.innerHTML = sStr;


      sStr = `
 <tr>
   <td>
       <a href="#" id="discardAllBtn" class="discardAllBtn">刪除所有品項</a>
   </td>
   <td></td>
   <td></td>
   <td>
       <p>總金額</p>
   </td>
   <td>NT$${cartListPrice}</td>
 </tr>`;

      //  console.log(sStr);
      myCartList.innerHTML += sStr;


      actListen();
      //刪除購物車全部商品
      let discardAllBtn = document.getElementById("discardAllBtn");
      discardAllBtn.addEventListener('click', delAllCart, false);
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })
};




//刪除購物車單件商品 

//動態賦予監聽事件
function actListen() {
  for (let i = 0; i < cartItem; i++) {

    document.getElementById(`inputNumber${i}`).addEventListener('change', chgInputNumber, false);
    document.getElementById(`inputNumber${i}`).addEventListener('keypress', chgInputNumber, false);
    document.getElementById(`deleteSomeOne${i}`).addEventListener('click', deloneCart, false);
  }

}
function deloneCart(e) {
  // console.log(1);
  e.preventDefault();
  // console.log(e.target.dataset.idClear);
  axios.delete(`${api_url}/api/livejs/v1/customer/${pathApi}/carts/${e.target.dataset.idClear}`)
    .then(function (response) {
      // 成功會回傳的內容
      // console.log(response.data)
      alert("成功刪除 1 筆商品!")
      showShppingCar();

    }).catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })

};




//刪除購物車全部
function delAllCart(e) {
  e.preventDefault();
  //確認伺服器購物車資料
  axios.get(`${api_url}/api/livejs/v1/customer/${pathApi}/carts`)
    .then(function (response) {
      // console.log(response.data.carts.length)
      if (response.data.carts.length == 0) { alert("購物車內無任何資料!!") } else {

        //新增購物車訂單//刪除伺服器資料
        axios.delete(`${api_url}/api/livejs/v1/customer/${pathApi}/carts`)
          .then(function (response) {
            // 成功會回傳的內容
            // console.log(response.data)
            alert("成功刪除全部商品!")

            showShppingCar();
          }).catch(function (error) {
            // 失敗會回傳的內容
            console.log(error);
          })


      }
    }).catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })


}


//送出訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn");
// console.log(orderInfoBtn);

orderInfoBtn.addEventListener("click", addOrder, false);

function addOrder(e) {
  e.preventDefault();
  const nameVal = document.getElementById("customerName").value;
  const telVal = document.getElementById("customerPhone").value;
  const emailVal = document.getElementById("customerEmail").value;
  const addressVal = document.getElementById("customerAddress").value;
  const tradessVal = document.getElementById("tradeWay").value;

  // console.log(nameVal);
  // console.log(telVal);
  // console.log(emailVal);
  // console.log(addressVal);
  let Today = new Date();
  // console.log(Today)

  if (nameVal == "" || telVal == "" || emailVal == "" || addressVal == "") {
    alert("必填資料不得為空!!")
  } else {
    //確認伺服器購物車資料
    axios.get(`${api_url}/api/livejs/v1/customer/${pathApi}/carts`)
      .then(function (response) {
        // console.log(response.data.carts.length)
        if (response.data.carts.length == 0) { alert("購物車內無任何資料!!") } else {

          axios.post(`${api_url}/api/livejs/v1/customer/${pathApi}/orders
        `,
            {
              "data": {
                "user": {
                  "name": `${nameVal}`,
                  "tel": `${telVal}`,
                  "email": `${emailVal}`,
                  "address": `${addressVal}`,
                  "payment": `${nameVal}`,
                  // "date":`${ Today.getFullYear()}`+"/"+`${ (Today.getMonth()+1)}`+"/"+`${ Today.getDate() }`
                  "date": `${Today.getFullYear()}/${(Today.getMonth() + 1)}/${Today.getDate()}`
                }
              }
            })
            .then(function (response) {
              // 成功會回傳的內容
              // console.log(response.data)
              alert("已送出訂單資料!")
              orderForm.reset();
              showShppingCar();
            }).catch(function (error) {
              // 失敗會回傳的內容
              console.log(error);
            })



        }
      }).catch(function (error) {
        // 失敗會回傳的內容
        console.log(error);
      })


  }



}


//改變訂單數量
function chgInputNumber(e) {
  // console.log(typeof e.target.value);
  const modiNum =parseInt(e.target.value);
  const modiId = e.target.dataset.idModi;
  // console.log(modiId);
  // //修改伺服器資料
  axios.patch(`${api_url}/api/livejs/v1/customer/${pathApi}/carts`,
  {
    "data": {
      "id": modiId,
      "quantity": modiNum,
    }
  },
  {
      headers: {
          'Authorization': token
      }
  }).then(function (response) {
      showShppingCar();
      //  console.log("成功")
    }).catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    })


};


//back to top
$(function () {

  var $win = $(window);

  var $backToTop = $('.js-back-to-top');

  // 當用戶滾動到離頂部100像素時，展示回到頂部按鈕

  $win.scroll(function () {

    if ($win.scrollTop() > 100) {

      $backToTop.show();

    } else {

      $backToTop.hide();

    }

  });

  // 當用戶點擊按鈕時，通過動畫效果返回頭部

  $backToTop.click(function () {

    $('html, body').animate({ scrollTop: 0 }, 200);

  });

});
