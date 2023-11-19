AFRAME.registerComponent("create-markers", {
  
    init: async function() {
  
      var mainScene = document.querySelector("#main-scene");
  
      //get the toys collection from firestore database
      var toys = await this.getToys();
     
      toys.map(toys => {
        var marker = document.createElement("a-marker");   
        marker.setAttribute("id", toys.id);
        marker.setAttribute("type", "pattern");
        marker.setAttribute("url", toys.marker_pattern_url);
        marker.setAttribute("cursor", {
          rayOrigin: "mouse"
        });
  
        //set the markerhandler component
        marker.setAttribute("markerhandler", {});
        mainScene.appendChild(marker);
  
        // Adding 3D model to scene
        var model = document.createElement("a-entity");    
       
        model.setAttribute("id", `model-${toys.id}`);
        model.setAttribute("position", toys.model_geometry.position);
        model.setAttribute("rotation", toys.model_geometry.rotation);
        model.setAttribute("scale", toys.model_geometry.scale);
        model.setAttribute("gltf-model", `url(${toys.model_url})`);
        model.setAttribute("gesture-handler", {});
        marker.appendChild(model);
  
        // Parts Container
        var mainPlane = document.createElement("a-plane");
        mainPlane.setAttribute("id", `main-plane-${toys.id}`);
        mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
        mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
        mainPlane.setAttribute("width", 1.7);
        mainPlane.setAttribute("height", 1.5);
        marker.appendChild(mainPlane);
  
        // Toys title background plane
        var titlePlane = document.createElement("a-plane");
        titlePlane.setAttribute("id", `title-plane-${toys.id}`);
        titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
        titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        titlePlane.setAttribute("width", 1.69);
        titlePlane.setAttribute("height", 0.3);
        titlePlane.setAttribute("material", { color: "#F0C30F" });
        mainPlane.appendChild(titlePlane);
  
        // Toys title
        var toysTitle = document.createElement("a-entity");
        toysTitle.setAttribute("id", `toys-title-${toys.id}`);
        toysTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
        toysTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        toysTitle.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 1.8,
          height: 1,
          align: "center",
          value: toys.toys_name.toUpperCase()
        });
        titlePlane.appendChild(toysTitle);
  
        // Parts List
        var parts = document.createElement("a-entity");
        parts.setAttribute("id", `parts-${toys.id}`);
        parts.setAttribute("position", { x: 0.3, y: 0, z: 0.1 });
        parts.setAttribute("rotation", { x: 0, y: 0, z: 0 });
        parts.setAttribute("text", {
          font: "monoid",
          color: "black",
          width: 2,
          align: "left",
          value: `${toys.parts.join("\n\n")}`
        });
        mainPlane.appendChild(parts);

        
      });

      var pricePlane = document.createElement("a-image");
      pricePlane.setAttribute("id", `price-plane-${toys.id}`);
      pricePlane.setAttribute(
        "src",
        "https://raw.githubusercontent.com/whitehatjr/menu-card-app/main/black-circle.png"
      );
      pricePlane.setAttribute("width", 0.8);
      pricePlane.setAttribute("height", 0.8);
      pricePlane.setAttribute("position", { x: -1.3, y: 0, z: 0.3 });
      pricePlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });

      //Price of the toys
      var price = document.createElement("a-entity");
      price.setAttribute("id", `price-${toys.id}`);
      price.setAttribute("position", { x: 0.03, y: 0.05, z: 0.1 });
      price.setAttribute("rotation", { x: 0, y: 0, z: 0 });
      price.setAttribute("text", {
        font: "mozillavr",
        color: "white",
        width: 3,
        align: "center",
        value: `Only\n $${toys.price}`
      });

      pricePlane.appendChild(price);
      marker.appendChild(pricePlane);
    
         var ratingPlane = document.createElement("a-entity");
         ratingPlane.setAttribute("id", `rating-plane-${toy.id}`);
         ratingPlane.setAttribute("position", { x: 2, y: 0, z: 0.5 });
         ratingPlane.setAttribute("geometry", {
           primitive: "plane",
           width: 1.5,
           height: 0.3
         });
 
         ratingPlane.setAttribute("material", {
           color: "#F0C30F"
         });
         ratingPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
         ratingPlane.setAttribute("visible", false);
 
         // Ratings
         var rating = document.createElement("a-entity");
         rating.setAttribute("id", `rating-${toy.id}`);
         rating.setAttribute("position", { x: 0, y: 0.05, z: 0.1 });
         rating.setAttribute("rotation", { x: 0, y: 0, z: 0 });
         rating.setAttribute("text", {
           font: "mozillavr",
           color: "black",
           width: 2.4,
           align: "center",
           value: `Customer Rating: ${toy.last_rating}`
         });
 
         ratingPlane.appendChild(rating);
         marker.appendChild(ratingPlane);
 
         var reviewPlane = document.createElement("a-entity");
         reviewPlane.setAttribute("id", `review-plane-${toy.id}`);
         reviewPlane.setAttribute("position", { x: 2, y: 0, z: 0 });
         reviewPlane.setAttribute("geometry", {
           primitive: "plane",
           width: 1.5,
           height: 0.5
         });
 
         reviewPlane.setAttribute("material", {
           color: "#F0C30F"
         });
         reviewPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
         reviewPlane.setAttribute("visible", false);
 
         var review = document.createElement("a-entity");
         review.setAttribute("id", `review-${toy.id}`);
         review.setAttribute("position", { x: 0, y: 0.05, z: 0.1 });
         review.setAttribute("rotation", { x: 0, y: 0, z: 0 });
         review.setAttribute("text", {
           font: "mozillavr",
           color: "black",
           width: 2.4,
           align: "center",
           value: `Customer Review: \n${toy.last_review}`
         });
         
         reviewPlane.appendChild(review);
         marker.appendChild(reviewPlane);
       }
     });
   
    //function to get the toys collection from firestore database
    getToys, async function() {
      return await firebase
        .firestore()
        .collection("toys")
        .get()
        .then(snap => {
          return snap.docs.map(doc => doc.data());
        });
    }
  
  