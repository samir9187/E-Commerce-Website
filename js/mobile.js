// Import Firebase and sample mobile phone data

// import sampleMobilePhones from "./sample_mobile_phones.js";

// Firebase configuration

// Function to fetch mobile phones from Firestore
function fetchMobilePhones() {
  db.collection("mobilePhones")
    .orderBy("name", "asc")
    .onSnapshot((snapshot) => {
      const mobilePhones = snapshot.docs.map((doc) => doc.data());
      renderMobilePhones(mobilePhones);
    });
}

// Function to render mobile phones on the page
function renderMobilePhones(mobilePhones) {
  const mobilePhonesContainer = document.querySelector(".mobilePhonesWrapper");
  let html = "";
  mobilePhones.forEach((phone) => {
    html += `
      <div class="mobile">
        <div class="card">
          <div class="card-image waves-effect waves-block waves-light">
            <img class="activator" src="${phone.image}">
          </div>
          <div class="card-content">
            <span class="card-title activator black-text text-darken-1"><h6>${phone.name}</h6><i class="material-icons three-dots right">more_vert</i></span>
            <h6>₹. ${phone.price}</h6>
            <button class="btn btn-add-to-cart" type="submit" name="action" onClick="addToCart('${phone.name}', '${phone.price}', '${phone.image}')">Add to cart
              <i class="material-icons right">shopping_cart</i>
            </button>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">Specs<i class="material-icons right">close</i></span>
            <label>Color:</label>
            <li>${phone.color}</li>
            <label>Storage:</label>
            <li>${phone.storage}</li>
            <label>Processor:</label>
            <li>${phone.processor}</li>
            <label>Rear-Camera:</label>
            <li>${phone.rearcamera}</li>
            <label>Front-Camera:</label>
            <li>${phone.frontcamera}</li>
            <label>Battery:</label>
            <li>${phone.battery}</li>
          </div>
        </div>
      </div>`;
  });
  mobilePhonesContainer.innerHTML = html;
}

// Function to add a mobile phone to the cart
function addToCart(name, price, image) {
  var user = firebase.auth().currentUser;
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
    M.toast({ html: "Please Login or Signup" });
  }

  db.doc(`users/${user.email}`)
    .collection("usercart")
    .doc(`${name}`)
    .get()
    .then((doc) => {
      console.log(doc.exists);
      if (doc.exists) {
        M.toast({ html: "Item already added to your cart" });
      } else {
        db.doc(`users/${user.email}`)
          .collection(`usercart`)
          .doc(`${name}`)
          .set({
            useruid: user.uid,
            name: name,
            price: Number(price),
            image: image,
          })
          .then(() => {
            M.toast({ html: "Item added to your cart" });
          });
      }
    });
}

// Call the fetchMobilePhones function when the DOM content is loaded
document.addEventListener("DOMContentLoaded", fetchMobilePhones);

// Function to search mobile phones
function searchMobilePhonesByBrand(brand) {
  db.collection("mobilePhones")
    .where("brand", "==", brand)
    .orderBy("name", "asc")
    .get()
    .then((querySnapshot) => {
      const mobilePhones = querySnapshot.docs.map((doc) => doc.data());
      renderMobilePhones(mobilePhones);
    })
    .catch((error) => {
      console.error("Error searching mobile phones:", error);
    });
}

// Event listener for search form submission
document
  .querySelector(".search-mobile-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const searchTerm = document
      .querySelector(".search-mobile")
      .value.toLowerCase();

    // Call the searchMobilePhonesByBrand function with the search term
    searchMobilePhonesByBrand(searchTerm);
  });

// Close search event listener
const closeSearch = document.querySelector(".close");
closeSearch.addEventListener("click", (e) => {
  console.log("close Search");
  location.reload();
});
