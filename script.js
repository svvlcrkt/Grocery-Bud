// ************ select items ************
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

// edit option
let editElement;
let editFlag = false;
//editFlag about editing
let editID = "";
// ************ event listeners ************
//submit form
form.addEventListener('submit',addItem);
// clear items
clearBtn.addEventListener('click',clearItems);
// load items
window.addEventListener('DOMContentLoaded',setupItems);
// line through items
list.addEventListener('click',addLineTh);



// const deleteBtn = document.querySelector('.delete-btn');
// console.log(deleteBtn);
//we can not acces deleteBtn because it is not in HTML.


// ************ functions ************
function addItem(e){
    e.preventDefault();
    //because form will want to submit it to a server
    //but we don't want
    //its about form submission
    const value = grocery.value;
    // console.log(grocery.value);
    const id = new Date().getTime().toString();
    // console.log(id);

    if(value && !editFlag){ 

        createListItem(id, value);
        //value is not "" and editFlag is false (not editing)
        //I want to add item to my list
        // console.log('add item to the list');

        // display alert
        displayAlert('item added to the list','success');
        // show container
        container.classList.add('show-container');
        //visible after the adding an element
        // add to local storage
        addToLocalStorage(id, value);
        // set back to default
        setBackToDefault();
    }
    else if(value && editFlag){
        //value is not "" and editFlag is true (editing)
        editElement.innerHTML = value;
        displayAlert('value changed','success');
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else{  //when user doesn't enter any kind of value
        // console.log('empty value');
       displayAlert('please enter value', 'danger');
    }
}

// display alert
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    },1000)
}

// clear items
function clearItems(){
    const items = document.querySelectorAll('.grocery-item');
    // console.log(items);

    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        })
    }
    container.classList.remove('show-container');
    // if we delete all items, then container should be hidden
    displayAlert('empty list','danger');
    setBackToDefault();
    localStorage.removeItem('list');
    //delete all items from local storage
}
// edit function
function editItem(e){
    // console.log('edit item');
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling.children[1];
    console.log(editElement);
    //previousElementSibling returns the prior element
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = 'edit';
}
// delete function
function deleteItem(e){
    // console.log('item deleted');
    // for currentTarget, path is specific
    const element = e.currentTarget.parentElement.parentElement;
    // console.log(element);
    const id = element.dataset.id;
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove('show-container');
    }
    displayAlert('item removed','danger');
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

// set back to default 
function setBackToDefault(){
    // console.log('set back to default');
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent = 'submit'; 
}

// add line
function addLineTh(e){
    if(e.target.tagName === 'ARTICLE'){
        e.target.children[0].children[1].classList.toggle('line-thr');
    }
    if(e.target.tagName === 'ARTICLE'){
        e.target.children[0].children[0].classList.toggle('img-visible');
        // classList.toggle('img-visible')
    }

}
// ************ local storage ************
function addToLocalStorage(id, value){
    // console.log('added to local storage');
    const grocery = {
        id:id,
        value:value,
    };
    // console.log(grocery);
    let items = getLocalStorage();
    // console.log(items);
    // whether the item exist or not. If exist, then get me that item with JSON parse. 
    // If not,set items an empty array
    // console.log(items);

    items.push(grocery); //add grocery to items array
    localStorage.setItem('list',JSON.stringify(items));
    // add local storage items array
    // if item wasn't there, then we were setting up.
    // localStorage.setItem()
}
function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter(function(item){
        // console.log(item.id);
        // console.log(id);
        if(item.id !== id){
            //if we click delete button, then start id matches.
            //with filter method, we can get all items
            return item;
        }
    })
    localStorage.setItem('list',JSON.stringify(items));
    //Later, the set operation is performed again with the remaining items.
    //As a result of this project, clicked items will be deleted.
}
function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function(item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    })
    localStorage.setItem('list',JSON.stringify(items));
}
function getLocalStorage(){
    return localStorage.getItem('list')?JSON.parse(localStorage.getItem('list')):[];


}
// localStorage API
// setItem
// getItem
// removeItem
// save as strings
// example of local storage
// localStorage.setItem('orange',JSON.stringify(['item','item 2','slkflskfldkf']));
// const oranges = JSON.parse(localStorage.getItem('orange'));
// console.log(oranges);
// localStorage.removeItem('orange');

// ************ setup items ************
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0){
        items.forEach(function(item){
            createListItem(item.id, item.value);
        })
    }
    container.classList.add('show-container');
}

function createListItem(id, value){
    const element = document.createElement('article');
    // add class
    element.classList.add('grocery-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    // console.log(attr);
    element.setAttributeNode(attr);
    element.innerHTML = `<div class="d"><img src="baseline_task_alt_black_24dp.png" class="image" alt="icon">
    <p class="title">${value}</p></div>
    <div class="btn-container">
        <button type="button" class="edit-btn">
            <i class="fas fa-edit"></i>
        </button>
        <button type="button" class="delete-btn">
            <i class="fas fa-trash"></i>
        </button>
    </div>`
    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');
    deleteBtn.addEventListener('click',deleteItem);
    editBtn.addEventListener('click',editItem);
    // append child
    list.appendChild(element);
    // console.log(list);
}
