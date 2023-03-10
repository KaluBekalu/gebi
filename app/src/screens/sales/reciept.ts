module.exports = arg => {
  const {customerName, createdBy, date, paymentMethod, invoiceNumber, organization} =
    arg.data;
  const {sum, tax, total} = arg;
  const items = arg.data.items;

  return ` 
<style>
h1,
h2,
h3,
p {
  margin: 0;
}

.box-shadow {
  box-shadow: rgba(54, 53, 114, 0.1) 0px 5px 5px;
}

.border-radius {
  border-radius: 5px;
}

.container {
  width: 350px;
  margin:auto;
  border: 1px solid #00000030;
  padding: 20px;
  font-family: monospace;
  border-radius:10px;
  padding-bottom:50px;
}
.qrCode {
  // background-color: aquamarine;
  height: 200px;
  width: 100%;
  display:flex;
  align-items: center;
  justify-content: center;
}

.heading {
  margin-right: 20px;
  font-weight: 300;
  font-size: 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.reciept-head {
  display:flex;
  justify-content: space-between;
  margin-block: 10px;
}

.heading div:nth-child(2) {
  text-align: end;
}

.heading div > p:nth-child(2) {
  font-size: 13px;
  color: rgb(144 144 144);
}

.card-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-left: 5px;
  margin: 10px 0 10px 0;
}

.card-info div {
  display: flex; 
  align-items: center;
  gap: 10px;
}
.card-info h2 {
  margin-right: 20px;
  font-weight: 600;
  font-size: 20px;
}
.card-info h3 {
  font-weight: 300;
  font-size: 18px;
}
.items {
  border: 1px solid #00000015;
}

.padding {
  padding: 15px;
}
.items h2 {
  margin: 0 0 15px 0;
  font-size: 20px;
  font-weight: 700;
}

.item {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #00000015;
}

.item-left p {
  margin: 0;
  margin-bottom: 5px;
}

.price {
  margin-top: 20px;
  border: 1px solid #00000015;
}

.price-div div {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.total {
  font-size: 15px;
  font-weight: 700;
}
.payment-type {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.payment-type p:nth-child(2) {
  font-size: 15px;
  font-weight: 700;
}

</style>
  
<div class="container box-shadow">
  <div class="reciept-head">
    <h2 class="title">???????????? ????????????</h2>
    <h2 class="organization-name">${organization}</h2>
  </div>
  <div class="heading">
    <div class="date">
      <p>${date}</p>
      <p>???????????? ??????????????? ??????</p>
    </div>
    <div class="invoice-number">
      <p>${invoiceNumber}</p>
      <p>??????????????? ?????????</p>
    </div>
  </div>

  <div class="qrCode">
  <h1> << QR CODE >> </h1>
  </div>
  <div class="details-container"> 
  <div class="card-info">
    <div>
      <h2>????????????</h2>
      <h3>${customerName}</h3>
    </div>
  </div>

    </div>
    <div class="items padding box-shadow border-radius">
      <h2>??????????????? ????????????</h2>
      ${Object.getOwnPropertyNames(items).map(i => {
        return `<div class="item">
          <div class="item-left">
            <p>${items[i].itemName}</p>
            <p>${items[i].quantity} ?????????</p>
          </div>
          <p class="item-right">${items[i].unitPrice} ??????</p>
        </div>`;
      })}
      
    </div>
    <div class="price padding box-shadow border-radius">
      <div class="price-div">
        <div>
          <p>?????????</p>
          <p>${sum} ??????</p>
        </div>
        <div>
          <p>????????? (15% ??????)</p>
          <p>${tax} ??????</p>
        </div>
      </div>
      <hr />
      <div class="price-div">
        <div class="total">
          <p>??????????????? ?????????</p>
          <p>${total} ??????</p>
        </div>
      </div>
    </div>
    <div class="payment-type padding box-shadow">
      <p>???????????? ????????????</p>
      <p>${paymentMethod}</p>
    </div>
  </div>
</div>
`;
};
