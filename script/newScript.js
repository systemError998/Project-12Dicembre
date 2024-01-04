let uri = "https://striveschool-api.herokuapp.com/api/product/"
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTk1MjEwOWMxOGIwNDAwMTg5MmVjNGMiLCJpYXQiOjE3MDQyNzIxMzcsImV4cCI6MTcwNTQ4MTczN30.r2TQIS9v-7EZlz_zXztHqat2mmPNrvc0y6w2tR-EG9E'

let btnPublish = document.querySelector(".publish")

//Per far apparire i prodotti all'apertura della pagina
if(window.location.href.includes("homepage")){
  printProductForUser()
} else if (window.location.href.includes("back-office")) {
  printProduct()
}

//Se il bottone pubblica esiste allora crea il prodotto. 
//Se mi trovo sulla homepage (x users) stampo il prodotto senza i tasti per modificarlo
//Mentre se sono sulla pagina admin stampo i prodotti con i tasti per editare
  btnPublish.addEventListener('click', (e) => {
    e.preventDefault()
    createProduct()
    if(window.location.href.includes("homepage")){
      printProductForUser()
    } else if (window.location.href.includes("back-office")) {
      printProduct()
    }
  })

//Classe prodotto per creare nuovi oggetti
class Product {
  constructor(name, description, price, imageUrl, brand) {
      this.name = name
      this.description = description
      this.price = price
      this.imageUrl = imageUrl
      this.brand = brand
  }
}

//Funzione che crea l'oggetto Prodott0
function createProduct() {
    let name = document.querySelector("#name").value
    let description = document.querySelector("#description").value
    let price = document.querySelector("#price").value
    let imageUrl = document.querySelector("#imageUrl").value
    let brand = document.querySelector("#brand").value

    let newProduct = new Product(name, description, price, imageUrl, brand)
    console.log(newProduct);

    fetch(uri, {
      method: 'POST',
      headers: {
        'Authorization' : `Bearer ${token}`, 
        'Content-Type' : 'application/json'
      },
      body : JSON.stringify(newProduct)
    })
    .then(response => response.json())
    .then(json => console.log('Success:', json))
    .catch(error => console.log('Error: ', error))
}

//Funzione che stampa il prodotto sulla pagina User (DA VEDERE)
function printProductForUser() {
  let productSpace = document.querySelector(".prodotti")
  productSpace.innerHTML = ''

  fetch(uri, {
    method: 'GET',
    headers: {
      'Authorization' : `Bearer ${token}`, 
      'Content-Type' : 'application/json'
    }
  })
  .then (response => response.json())
  .then (json => {
    console.log(json) 
    json.forEach(prodotto => {
      let card = document.createElement('div')
      card.classList.add("card" , "cardProducts")

      card.innerHTML = 
            `
                <img src="${prodotto.imageUrl}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${prodotto.name}</h5>
                    <p class="card-text description">${prodotto.description}</p>
                    <p class="card-text price">${prodotto.price}</p>
                    <p class="card-text price">${prodotto.brand}</p>
                </div>
            `
          let buttonSpace = document.createElement('div')
          buttonSpace.classList.add("d-flex", "justify-content-around", "mb-3")   
          
          let details = document.createElement('button');
          details.className = "btn bg-customBtnSecondary text-white details";
          details.innerHTML = 'Details';
          details.addEventListener('click',() => deleteProduct(prodotto))

          let shopBtn = document.createElement('button');
          shopBtn.className = "btn bg-customBtnSecondary text-white shopBtn";
          shopBtn.innerHTML = 'Shop Now';
          shopBtn.addEventListener('click',() => deleteProduct(prodotto))

          productSpace.appendChild(card)
          card.appendChild(buttonSpace)
          buttonSpace.appendChild(shopBtn)
          buttonSpace.appendChild(details)
    })
  })
}

//Funzione che stampa il prodotto sulla pagina admin
function printProduct() {

  fetch(uri, {
    method: 'GET',
    headers: {
      'Authorization' : `Bearer ${token}`, 
      'Content-Type' : 'application/json'
    }
  })
  .then (response => response.json())
  .then (json => {
    let productSpace = document.querySelector(".prodotti")
    productSpace.innerHTML = ''
    console.log(json) 
    json.forEach(prodotto => {
      let card = document.createElement('div')
      card.classList.add("card" , "cardProducts")

      card.innerHTML = 
            `
                <img src="${prodotto.imageUrl}" class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title">${prodotto.name}</h5>
                    <p class="card-text description">${prodotto.description}</p>
                    <p class="card-text price">${prodotto.price}</p>
                    <p class="card-text price">${prodotto.brand}</p>
                </div>
            `
          let buttonSpace = document.createElement('div')
          buttonSpace.classList.add("d-flex", "justify-content-around", "mb-3")   
          
          let updateBtn = document.createElement('button');
          updateBtn.className = "btn bg-customBtnSecondary text-white updateBtn";
          updateBtn.setAttribute('data-bs-toggle', 'modal')
          updateBtn.setAttribute('data-bs-target', '#updateModal')
          updateBtn.innerHTML = 'Update';
          updateBtn.addEventListener('click',() => updateProduct(prodotto))

          let deleteBtn = document.createElement('button');
          deleteBtn.className = "btn bg-customBtnSecondary text-white deleteBtn";
          deleteBtn.innerHTML = 'Delete';
          deleteBtn.addEventListener('click',() => deleteProduct(prodotto))

          productSpace.appendChild(card)
          card.appendChild(buttonSpace)
          buttonSpace.appendChild(deleteBtn)
          buttonSpace.appendChild(updateBtn)
    })
  })
}

function deleteProduct(prodotto) {
  if(confirm(`Vuoi davvero cancellare il prodotto? ${prodotto.name}`)) {
    fetch(uri + prodotto._id, {
      method: 'DELETE',
      headers: {
        'Authorization' : `Bearer ${token}`, 
        'Content-Type' : 'application/json'
      }
    })  
    .then(response => console.log(response))
    .then(json => printProduct())
    .catch(error => console.log(error))
  }
} 

function updateProduct(prodotto){
  document.querySelector("#_id").value = prodotto._id
  document.querySelector("#brandUpdate").value = prodotto.brand
  document.querySelector("#nomeUpdate").value = prodotto.name
  document.querySelector("#descrizioneUpdate").value = prodotto.description
  document.querySelector("#imageUpdate").value = prodotto.imageUrl
  document.querySelector("#priceUpdate").value = prodotto.price
  /* document.querySelector(".saveBtn").addEventListener('click', () => {
    saveProduct(prodotto._id)
  }) */

  document.querySelector('.saveBtn').addEventListener('click', saveProduct)
}

function saveProduct() {
  // console.log("CIAO GREG");

  let id = document.querySelector("#_id").value

  let modifyProd = new Product(
    document.querySelector("#nomeUpdate").value,
    document.querySelector("#descrizioneUpdate").value,
    document.querySelector("#priceUpdate").value,
    document.querySelector("#imageUpdate").value,
    document.querySelector("#brandUpdate").value
  )
  /* console.log(modifyProd);
  modifyProd._id = id
  console.log(modifyProd);  */
  
    fetch(uri + id, {
      method: 'PUT',
      headers: {
        'Authorization' : `Bearer ${token}`, 
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify(modifyProd)
    })  
    .then(response => response.json())
    .then(json => printProduct())
    .catch(error => console.log(error))
}








  
