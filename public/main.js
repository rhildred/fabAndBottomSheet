import "materialize-css";
import config from "./firebase.js";
import firebase from 'firebase/app';
import 'firebase/database';
firebase.initializeApp(config);

document.addEventListener('DOMContentLoaded', () => {
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
    document.getElementById("add_list").addEventListener("click", fINeedThis);
});

function fINeedThis(evt){
    let sName = document.getElementById("item_name").value;
    document.getElementById("item_name").value = "";
    let sStore = document.getElementById("item_store").value;
    document.getElementById("item_store").value = "";
    let sItemID = new Date().toISOString().replace(".", "_");
    firebase.database().ref('groceryitems/' + sItemID).set({
        name: sName,
        store: sStore
    }).then(() => {
        console.log("inserted");
    });

}

function fIboughtThis(evt){
    evt.preventDefault();
    let sId = evt.target.parentNode.id;
    firebase.database().ref('groceryitems/' + sId + "/datePurchased").set(new Date().toISOString(), ()=>{
        console.log("completed " + sId);
    });
}

function fIDontNeedThis(evt){
    evt.preventDefault();
   let sId = evt.target.parentNode.id;
    firebase.database().ref('groceryitems/' + sId).remove(()=>{
        console.log("removed " + sId);
    });
}


firebase.database().ref('groceryitems').on("value", snapshot => {
    // the database has changed
    let oGroceryItems = snapshot.val();
    let oGroceryList = document.getElementById("grocerylist");
    console.log(oGroceryItems);
    oGroceryList.innerHTML = "";
    Object.keys(oGroceryItems).map((key) => {
        //we have an item here let's make a card for it
        let oGroceryItem = oGroceryItems[key];
        let oCard = document.createElement("div");
        oCard.className ="card blue-grey darken-1";

        //card content
        let oCardContent = document.createElement("div");
        oCardContent.className = "card-content white-text";
        if(oGroceryItem.datePurchased){
            oCardContent.innerHTML = "<span class=\"card-title purchased\">" + oGroceryItem.name + "</span>";

        }else{
            oCardContent.innerHTML = "<span class=\"card-title\">" + oGroceryItem.name + "</span>";

        }
        oCardContent.innerHTML += "<p>" + oGroceryItem.store + "</p>";

        oCard.append(oCardContent);

        //card action
        let oCardAction = document.createElement("div");
        oCardAction.className = "card-action";
        oCardAction.id = key;

        //I bought this
        let oIboughtThis = document.createElement("a");
        oIboughtThis.href = "#";
        oIboughtThis.innerHTML = "I bought this";
        oIboughtThis.addEventListener("click", fIboughtThis);
        oCardAction.append(oIboughtThis);

        //I don't need this
        let oIDontNeedThis = document.createElement("a");
        oIDontNeedThis.href = "#";
        oIDontNeedThis.innerHTML = "I don't need this";
        oIDontNeedThis.addEventListener("click", fIDontNeedThis);
        oCardAction.append(oIDontNeedThis);

        oCard.append(oCardAction);


        oGroceryList.prepend(oCard);
    });
});