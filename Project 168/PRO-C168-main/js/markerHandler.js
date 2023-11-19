AFRAME.registerComponent("markerhandler", {
    init: async function () {
  
      this.el.addEventListener("markerFound", () => {
        console.log("marker is found")
        this.handleMarkerFound();
      });
  
      this.el.addEventListener("markerLost", () => {
        console.log("marker is lost")
        this.handleMarkerLost();
      });
    },
    handleMarkerFound: function () {
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "flex";
  
      var ratingButton = document.getElementById("rating-button");
      var orderButtton = document.getElementById("order-button");
      var orderSummaryButtton = document.getElementById("order-summary-button");
      var payButton=document.getElementById("pay-button")
     
      // Handling Click Events
      ratingButton.addEventListener("click", () => this.handleRatings(toy));

      orderButtton.addEventListener("click", () => {
        var tNumber;
        tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;
        this.handleOrder(tNumber, toy);

        swal({
          title: "Thanks For Order !",
          text: "Your toy will arrive soon!",
          timer: 2000,
          buttons: false
        });
      });
  
      orderButtton.addEventListener("click", () => {
        swal({
          icon: "https://i.imgur.com/4NZ6uLY.jpg",
          title: "Thanks For Order!",
          text: "You will see your toy soon!"
        });
      });
    },
  
    
      orderSummaryButtton.addEventListener("click", () =>
        this.handleOrderSummary()
      );
      payButton.addEventListener("click",()=>
        this.handlePayment()
      );
    }
  },

  handleOrder: function (tNumber, toy) {
    //Reading current table order details
    firebase
      .firestore()
      .collection("tables")
      .doc(tNumber)
      .get()
      .then(doc => {
        var details = doc.data();

        if (details["current_orders"][toy.id]) {
          //Increasing Current Quantity
          details["current_orders"][toy.id]["quantity"] += 1;

          //Calculating Subtotal of item
          var currentQuantity = details["current_orders"][toy.id]["quantity"];

          details["current_orders"][toy.id]["subtotal"] =
            currentQuantity * toy.price;
        } else {
          details["current_orders"][toy.id] = {
            item: toy.toy_name,
            price: toy.price,
            quantity: 1,
            subtotal: toy.price * 1
          };
        }

        details.total_bill += toy.price;

        // Updating db
        firebase
          .firestore()
          .collection("tables")
          .doc(doc.id)
          .update(details);
      });
  },
  getToys: async function () {
    return await firebase
      .firestore()
      .collection("toys")
      .get()
      .then(snap => {
        return snap.docs.map(doc => doc.data());
      });
  },
  getOrderSummary: async function (tNumber) {
    return await firebase
      .firestore()
      .collection("tables")
      .doc(tNumber)
      .get()
      .then(doc => doc.data());
  },
  handleOrderSummary: async function () {

    //Getting Table Number
    var tNumber;
    tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;

    //Getting Order Summary from database
    var orderSummary = await this.getOrderSummary(tNumber);

    //Changing modal div visibility
    var modalDiv = document.getElementById("modal-div");
    modalDiv.style.display = "flex";

    //Get the table element
    var tableBodyTag = document.getElementById("bill-table-body");

    //Removing old tr(table row) data
    tableBodyTag.innerHTML = "";

    //Get the cuurent_orders key 
    var currentOrders = Object.keys(orderSummary.current_orders);

    currentOrders.map(i => {

      //Create table row
      var tr = document.createElement("tr");

      //Create table cells/columns for ITEM NAME, PRICE, QUANTITY & TOTAL PRICE
      var item = document.createElement("td");
      var price = document.createElement("td");
      var quantity = document.createElement("td");
      var subtotal = document.createElement("td");

      //Add HTML content 
      item.innerHTML = orderSummary.current_orders[i].item;

      price.innerHTML = "$" + orderSummary.current_orders[i].price;
      price.setAttribute("class", "text-center");

      quantity.innerHTML = orderSummary.current_orders[i].quantity;
      quantity.setAttribute("class", "text-center");

      subtotal.innerHTML = "$" + orderSummary.current_orders[i].subtotal;
      subtotal.setAttribute("class", "text-center");

      //Append cells to the row
      tr.appendChild(item);
      tr.appendChild(price);
      tr.appendChild(quantity);
      tr.appendChild(subtotal);

      //Append row to the table
      tableBodyTag.appendChild(tr);
    });

    var totalTR=document.createElement("tr");
    var td1=document.createElement("td");
    td1.setAttribute("class","no-line");
    var td2=document.createElement("td");
    td2.setAttribute("class","no-line");
    var td3=document.createElement("td");
    td3.setAttribute("class","no-line text-center");
    var strongTag=document.createElement("strong");
    strongTag.innerHTML="Total";
    td3.appendChild(strongTag);
    var td4=document.createElement("td");
    td4.setAttribute("class","no-line text-right");
    td4.innerHTML="$"+orderSummary.total_bill;
    totalTR.appendChild(td1);
    totalTR.appendChild(td2);
    totalTR.appendChild(td3);
    totalTR.appendChild(td4);
    tableBodyTag.appendChild(totalTR);
  },

  handlePayment: function () {
    document.getElementById("modal-div").style.display="none";
    var tNumber;
    tableNumber<=9?(tNumber=`T0${tableNumber}`):`T${tableNumber}`;
    firebase.firestore().collection("tables").doc(tNumber).update({
      current_orders:{},
      total_bill:0
    })
    .then(()=>{
      swal({
        icon:"success",
        title:"Thanks for Paying",
        text:"We hope you had fun with your toys.",
        timer:2500,
        buttons:false
      })
    })
  },

  handleRatings: async function (toy) {

    // Getting Table Number
    var tNumber;
    tableNumber <= 9 ? (tNumber = `T0${tableNumber}`) : `T${tableNumber}`;
    
    // Getting Order Summary from database
    var orderSummary = await this.getOrderSummary(tNumber);

    var currentOrders = Object.keys(orderSummary.current_orders);    

    if (currentOrders.length > 0 && currentOrders==toy.id) {
      
      // Close Modal
      document.getElementById("rating-modal-div").style.display = "flex";
      document.getElementById("rating-input").value = "0";
      document.getElementById("feedback-input").value = "";

      //Submit button click event
      var saveRatingButton = document.getElementById("save-rating-button");

      saveRatingButton.addEventListener("click", () => {
        document.getElementById("rating-modal-div").style.display = "none";
        //Get the input value(Review & Rating)
        var rating = document.getElementById("rating-input").value;
        var feedback = document.getElementById("feedback-input").value;

        //Update db
        firebase
          .firestore()
          .collection("toys")
          .doc(toy.id)
          .update({
            last_review: feedback,
            last_rating: rating
          })
          .then(() => {
            swal({
              icon: "success",
              title: "Thanks For Rating!",
              text: "We Hope You Like the Toy !!",
              timer: 2500,
              buttons: false
            });
          });
      });
    } else{
      swal({
        icon: "warning",
        title: "Oops!",
        text: "No toy found to give ratings!!",
        timer: 2500,
        buttons: false
      });
    }

  },
    handleMarkerLost: function () {
      // Changing button div visibility
      var buttonDiv = document.getElementById("button-div");
      buttonDiv.style.display = "none";
    }
  });
  


  