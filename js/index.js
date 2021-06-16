var firebaseConfig = {
  apiKey: "AIzaSyA5n335oOYAkEC_gKCMNlGrMZpbadwo9i4",
  authDomain: "parking-cbf0a.firebaseapp.com",
  projectId: "parking-cbf0a",
  storageBucket: "parking-cbf0a.appspot.com",
  messagingSenderId: "552293832886",
  appId: "1:552293832886:web:597b8220eaa57bb7a9ae17",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
// db.collection("clients").get().then((clients) => {
//     clients.forEach((client) => {
//         console.log(client.id, " => ", client.data().username);
//     });
// });

loggedInUser = window.localStorage.getItem("user");
console.log(loggedInUser);

function signup() {
  var last_name = document.getElementById("signUplastname").value;
  var first_name = document.getElementById("signUpfirstname").value;
  var email = document.getElementById("signUpEmail").value;
  var numero = document.getElementById("signUpNum").value;
  var Password = document.getElementById("signUpPassword").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, Password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      db.collection("Personnes")
        .doc(email)
        .set({
          last_name,
          first_name,
          email,
          numero,
          role: "client",
        })
       
        .then((resp) => {
          console.log({ resp });
           window.localStorage.setItem("user", email);
           window.localStorage.setItem(
            "userrr",
            JSON.stringify({
           last_name,
           first_name,
           email,
           numero,
            })
          )
          
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              window.location.href = "signe.up.html";
            }
          });
        })

        .catch((err) => {
          console.error(err);
        });
        
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
      // ..
    });
}
function signin() {
  var email = document.getElementById("loginEmail").value;
  var Password = document.getElementById("loginPassword").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(email, Password)
    .then((userCredential) => {
      console.log("userCredential =>", userCredential);
      // Signed in
      var docRef = db.collection("Personnes").doc(email);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            window.localStorage.setItem("user", email);
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
          var user = userCredential.user;
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              window.location.href = "index.html";
            }
          });
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });

      //   db.collection("clients")
      //     .get()
      //     .then((clients) => {
      //       clients.forEach((client) => {
      //         console.log(client.id, " => ", client.data().username);
      //       });
      //     });
      // ...
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
      // ..
    });
}
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    console.log(user)
    var resr= document.getElementById("reserverr")
    var logoutButton = document.getElementById("userr");
    if (logoutButton !== null && resr!==null) {
      logoutButton.innerHTML = "Se déconnecter";
      resr.innerHTML = ` <button class="downloadButton">Réservez</button>`;
      logoutButton.addEventListener("click", logout);
    }
  }
  else{
    var resr= document.getElementById("reserverrr")
    if (resr!==null) {
      resr.innerHTML = ` <button class="downloadButton">Se connecter / S'inscrire</button>`;

    }
  }
  function logout(event) {
    event.preventDefault();
    firebase
      .auth()
      .signOut()
      .then(() => {
        window.location.href = "index.html";
      })
      .catch((error) => {});
  }
});
firebase.auth().onAuthStateChanged(function (user) {
  console.log("fffff");
  if (user && window.location.replace == "signe.up.html") {
    console.log("ccccc");

    window.history.back();
  }
});
function reserv(event) {
  event.preventDefault();
    


  
  var matricules = document.getElementById("matricules").value;
  var date_resrvation = document.getElementById("dresrve").value;
  var heure_resrvation = document.getElementById("hresrve").value;
  var heur_recuperation = document.getElementById("hrecuperation").value;
  var a = heure_resrvation.split(":"); // split it at the colons
  var b = heur_recuperation.split(":"); // split it at the colons

  // minutes are worth 60 seconds. Hours are worth 60 minutes.
  var heuree_resrvation = +a[0] * 60 + +a[1];
  var heure_recuperation = +b[0] * 60 + +b[1];

  //
  var prix = ((heure_recuperation - heuree_resrvation) * 100) / 60;


  if (heuree_resrvation < heure_recuperation ){
  db.collection("nombre-places").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {  
      var nombre = doc.data().nombre_places;
        var  nombre1 = doc.data().nombre_places_reserver;
        var id = doc.id;
        console.log(nombre,nombre1)
        if (nombre>nombre1){
          nombre1= nombre1 + 1 ;
         
           db.collection("nombre-places").doc(id)
          .update({
            nombre_places_reserver : nombre1,
          })
          window.localStorage.setItem(
            "info",
            JSON.stringify({
              matricules,
              date_resrvation,
              heure_resrvation,
              heur_recuperation,
              prix,
            })
          );
          window.location.href = "payment.html";
        }
        else{
          console.log(nombre,nombre1)
      
          alert("désolé notre parking est plein! revenez plus tard");
        }
    });
    
});
}
else {
  alert("verifier l'heure de reservation");

}

  
}
async function reservation(event) {
  event.preventDefault();

  var Cardholder = document.getElementById("name").value;
  var expiry = document.getElementById("expiry-date").value;
  var cvv = document.getElementById("cvv").value;

  loggedInUser = window.localStorage.getItem("user");
  var inforeserv = JSON.parse(window.localStorage.getItem("info"));
  var infouser = JSON.parse(window.localStorage.getItem("userrr"));

  console.log({ loggedInUser });
  if (Cardholder!= "" && expiry!="" && cvv!=""){
  var ref =   db.collection("Personnes")
    .doc(loggedInUser)
    .collection("Reservations")
    .doc();
    console.log("ref=>", ref.id);

    window.localStorage.setItem("lastItem", "");
    window.localStorage.setItem("lastItem", ref.id);



    await ref.set({
      ...infouser,
      ...inforeserv,
      Cardholder,
      expiry,
      cvv,
      payment:"paid",
      id: ref.id

    })

    
    
    var facture = document.getElementById("facture");
    facture.innerHTML = `<button type="submit" class="submit-button" id="loginSubmitBtn" onclick="facture(event)">facture</button>`
  }
  else{
     var ref =   db.collection("Personnes")
    .doc(loggedInUser)
    .collection("Reservations")
    .doc();
    console.log("ref=>", ref.id);

    window.localStorage.setItem("lastItem", "");
    window.localStorage.setItem("lastItem", ref.id);

    await ref
    .set({
      ...infouser,
      ...inforeserv,
      payment:"not paid",
      id: ref.id
    })
    
    .then(() => {
      console.log("*********************done*******************");
      var facture = document.getElementById("facture");
      facture.innerHTML = `<button type="submit" class="submit-button" id="loginSubmitBtn" onclick="facture(event)">facture</button>`
    });

  }
}
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    var id = window.localStorage.getItem("user");
    db.collection("Personnes")
      .doc(id)
      .get()
      .then((personne) => {
        console.log(({personne}))
        const role = personne.data().role
        
        if (role == "admin") {
          var adminButton = document.getElementById("admin");
          var employerButton = document.getElementById("employer");
          if (adminButton !== null) {
            adminButton.innerHTML = "Ajouter employer";
            employerButton.innerHTML = "Ajouter client";
          }
        }
        if (role == "employer") {
          var employerButton = document.getElementById("employer");
          var libre = document.getElementById("myBtn")
          var modif = document.getElementById("mod")
          if (employerButton !== null && libre !== null && modif !==null) {
            employerButton.innerHTML = "Ajouter client";
            libre.innerHTML = `<button class="downloadButton">libirer place</button>`
            modif.innerHTML = "Modifier Resrvation"
          }
        }
      });
  }
});

function employer(event){
  event.preventDefault();

  var firstname = document.getElementById("finame").value;
  var lastname = document.getElementById("laname").value;
  var username = document.getElementById("Username").value;
  var email = document.getElementById("email").value;
  var numero = document.getElementById("numtel").value;
  var Password = document.getElementById("Password").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, Password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      db.collection("Personnes")
        .doc(email)
        .set({
          firstname,
          lastname,
          username,
          email,
          numero,
          role: "employer",
        })
        .then((resp) => {
          firebase.auth().onAuthStateChanged(function (user) {
            var suc = document.getElementById("sucsser");
            suc.innerHTML = "votre employer a été ajouter";
            var firstname = document.getElementById("firstname").value="";
            var lastname = document.getElementById("lastname").value="";
            var username = document.getElementById("username").value="";
            var email = document.getElementById("email").value="";
            var numero = document.getElementById("numero").value="";
            var Password = document.getElementById("Password").value="";
           
          });
        
              // window.location.href = "index.html";
          
        
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
      // ..
    });

}
function client(event){
  event.preventDefault();

  var firstname = document.getElementById("firname").value;
  var lastname = document.getElementById("lanname").value;
  var username = document.getElementById("username").value;
  var email = document.getElementById("emailclient").value;
  var numero = document.getElementById("numte").value;
  var Password = document.getElementById("password").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, Password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;
      // ...
      db.collection("Personnes")
        .doc(email)
        .set({
          firstname,
          lastname,
          username,
          email,
          numero,
          role: "client",
        })
        .then((resp) => {
          console.log({ resp });
          firebase.auth().onAuthStateChanged(function (user) {
            var suc = document.getElementById("sucsser");
            suc.innerHTML = "votre client a été ajouter";
            var firstname = document.getElementById("firname").value="";
            var lastname = document.getElementById("lanname").value="";
            var username = document.getElementById("username").value="";
            var email = document.getElementById("emailclient").value="";
            var numero = document.getElementById("numte").value="";
            var Password = document.getElementById("password").value="";
           
          });
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert(errorMessage);
      // ..
    });

}
async function facture(event){
  event.preventDefault();

  var fac = window.localStorage.getItem("user");
  
 var Reservation = await db.collection("Personnes")
  .doc(fac)
  .collection("Reservations")
  .get();

  console.log(fac);
    console.log(({Reservation}))
    console.log(Reservation.docs);
    let resEls = [];
    Reservation.forEach(element => {
      resEls.push(element.data())

    
    });
    console.log(JSON.stringify(resEls));
    window.localStorage.setItem("reservations", "");
    window.localStorage.setItem("reservations", JSON.stringify(resEls));
  window.location.href = "facture.html";
  
   
}
function libre(event){
  event.preventDefault();
  var span = document.getElementsByClassName("close")[0];
  var modal = document.getElementById("myModal");
  db.collection("nombre-places").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => { 
        var  nombre1 = doc.data().nombre_places_reserver;
        var id = doc.id;
        console.log(nombre1)
        console.log(id)
        if (nombre1>0){
          nombre1= nombre1 - 1 ;
         console.log(nombre1)
          db.collection("nombre-places").doc(id)
          .update({
            nombre_places_reserver : nombre1,
          })
          window.alert("la places a été librer");
          span = modal.style.display = "none";
        }
        else{
          window.alert("toute les places sont libres");
        }
      })
    })
}
function annuler(event){
  event.preventDefault();
  var loggedInUser = window.localStorage.getItem("user");
  var id = window.localStorage.getItem("lastItem");
  var ref =   db.collection("Personnes")
  .doc(loggedInUser)
  .collection("Reservations")
  .doc(id)
  .delete()
  .then(() => {
    console.log("Document successfully deleted!");
    window.alert("Votre reservation aétét annuler");
    window.location.href = "reservation.html";
    })
    .catch((error) => {
    console.error("Error removing document: ", error);
    });

}
function anuler_reservation(event){
  event.preventDefault();
  var search = document.getElementById("id-search").value;

  var data = document.getElementById("data-client");
  data.innerHTML = ""
  db.collection("Personnes").doc(search).collection("Reservations").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      data.innerHTML += `<tr><td data-label="id">  <input type="text" id="ide" name="custId" value="${doc.data().id}"></td>
      <td data-label="date de reservation" > <input type="date" id="dat" name="custId" value="${doc.data().date_resrvation}"></td>
      <td data-label="heure de reservation"> <input type="time" id="he" name="custId" value="${doc.data(). heure_resrvation}"></td>
      <td data-label="heure de recuperation"><input type="time" id="heu" name="custId" value="${doc.data(). heur_recuperation}"></td>
      <td data-label="matricule"><input type="text" id="mt" name="custId" value="${doc.data().matricules}"></td>
      <td data-label="matricule"><button onclick="sup_reservation(event)">suprimer</button></td>
      </tr>`
    });
    var id_d = document.getElementById("ide").value;
    


    window.localStorage.setItem(
      "idd",
      
       search,
      
    )
    window.localStorage.setItem(
      "iddd",
      
       id_d,
      
    )
   
})
firebase.auth().onAuthStateChanged(function (user) {
 
    
    var btn = document.getElementById("btn")
    btn.innerHTML=`<button class="submit-button1" onclick="update(event)">valider</button>`
  
});

}
function sup_reservation(event){
  event.preventDefault();
  var sup = window.localStorage.getItem("idd");
  var sup1 = window.localStorage.getItem("iddd");

  console.log(sup)
  console.log(sup1)


  db.collection("Personnes")
  .doc(sup)
  .collection("Reservations")
  .doc(sup1)
  .delete()
  .then(() => {
    console.log(sup)
  console.log(sup1)
    console.log("Document successfully deleted!");
    window.alert("Votre reservation a étét annuler");
    })
    .catch((error) => {
    console.error("Error removing document: ", error);
    });

}



function update(event){
  event.preventDefault();
  var sup = window.localStorage.getItem("idd");
  var sup1 = window.localStorage.getItem("iddd");
  var dat = document.getElementById("dat").value;
  var he = document.getElementById("he").value;
  var heu = document.getElementById("heu").value;
  var mt = document.getElementById("mt").value;
  db.collection("Personnes").doc(sup).collection("Reservations").doc(sup1)
  .update({
    date_resrvation : dat,
    heure_resrvation: he,
    heur_recuperation : heu,
    matricules : mt,

  })
  .then(() => {
    console.log(he)
  console.log(sup1)
    console.log("Document successfully deleted!");
    window.alert("Votre reservation a étét modifier");
    })
    .catch((error) => {
    console.error("Error removing document: ", error);
    });
}