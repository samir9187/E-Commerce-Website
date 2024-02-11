//get accessories doc from db
// db.collection("accessories").onSnapshot((snapshot) => {
//   fetchAccessories(snapshot.docs);
// });
// const accessoriesData = [
//   {
//     name: "Accessory 1",
//     price: 99,
//     image: "accessory_image_url_1.jpg",
//     color: "Black",
//     description: "Description of Accessory 1",
//   },
// {
//   name: "Accessory 2",
//   price: 49,
//   image: "accessory_image_url_2.jpg",
//   color: "White",
//   description: "Description of Accessory 2",
// },
// {
//   name: "Accessory 3",
//   price: 499,
//   image: "accessory_image_url_3.jpg",
//   color: "Whitee",
//   description: "Description of Accessory 3",
// },
// Add more accessories as needed
// ];
// const db = firebase.firestore();
const addAccessoriesToFirestore = () => {
  accessoriesData.forEach((accessory) => {
    db.collection("accessories")
      .add(accessory)
      .then((docRef) => {
        console.log("Accessory added with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding accessory: ", error);
      });
  });
};

// --------------------fetch accessories from backend --------------------
const accessoriesContainer = document.querySelector(".accessoriesWrapper");

const fetchAccessories = (data) => {
  let html = "";
  data.forEach((doc) => {
    const accessories = doc.data();
    const li = `
    <div class="mobile">
    <div class="card">
    <div class="card-image waves-effect waves-block waves-light">
    <img class="activator" src="${accessories.image}">
    </div>
    <div class="card-content">
          <span class="cad-title activator black-text text-darken-1"><h6>${accessories.name}</h6><i class="material-icons three-dots right">more_vert</i></span>
          <h6>₹. ${accessories.price}</h6>
          <button class="btn btn-add-to-cart" type="submit" name="action" onClick="addToCart('${accessories.name}','${accessories.price}', '${accessories.image}')">Add to cart
          <i class="material-icons right">shopping_cart</i>
          </button>
          </div>
      <div class="card-reveal">
      <span class="card-title grey-text text-darken-4">Specs<i class="material-icons right">close</i></span>
          <label>Color:</label>
             <li>${accessories.color}</li>
             <label>Description:</label>
             <li>${accessories.description}</li>
          </div>
          </div>
          </div>
          `;

    html += li;
  });

  accessoriesContainer.innerHTML = html;
};

// --------------------add to cart from frontend--------------------
function addToCart(name, price, image) {
  var user = firebase.auth().currentUser;

  if (user) {
    // User is signed in.
    console.log("User is signed in:", user.email);

    db.doc(`users/${user.email}`)
      .collection("usercart")
      .doc(`${name}`)
      .get()
      .then((doc) => {
        console.log("Document exists:", doc.exists);

        if (doc.exists) {
          M.toast({ html: "Item already added to your cart" });
        } else {
          db.doc(`users/${user.email}`)
            .collection(`usercart`)
            .doc(`${name}`)
            .set({
              useruid: user.uid,
              name: name,
              price: Number(price), // Ensure that price is a number
              image: image,
            })
            .then(() => {
              M.toast({ html: "Item added to your cart" });
            })
            .catch((error) => {
              console.error("Error adding item to cart:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking if item exists in cart:", error);
      });
  } else {
    // No user is signed in.
    M.toast({ html: "Please Login or Signup" });
  }
}
// addAccessoriesToFirestore();
db.collection("accessories").onSnapshot((snapshot) => {
  fetchAccessories(snapshot.docs);
});
