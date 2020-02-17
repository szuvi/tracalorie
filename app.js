// TODO :
// - clean up the code, lots of repetition in App module
// - error as helper text through materialize
// - add and edit by pressing ENTER (key code 13)
// - ItemCtrl.setData - needs verification


//==========================================================================
//      Storage Controller Module
//==========================================================================
const StorageCtrl = (function(){
  
  // Updates LS's data object by overwriting the current one
  function updateStorage(data) {
    let tempData = JSON.stringify(data);
    localStorage.setItem('data', tempData);
  }

  // Return object in required form as in ItemCtrl, 
  // if LS is empty returns empty object template
  function getStorage() {
    let data = localStorage.getItem('data');
    
    // getItem on emptied 'data' returns 'undefined' string (since it is JSON)
    // so when comparing with null it doesn't return true
    if (data == null || data == 'undefined') {
      data = {
        totalCalories: 0,
        currItem: null,
        items: []
      };
    } else {      
      data = JSON.parse(data);
    }
    return data;
  }

  return {
    updateStorage,
    getStorage
  }
})();



//==========================================================================
//      UI Controller Module
//==========================================================================
const UICtrl = (function() {
  
  const elements = {
    output: '#items-output',
    caloriesCount: '#calories-count',
    nameInput: '#meal-input',
    caloriesInput: '#calories-input',

    clearBtn: '#clear-btn',
    addBtn: '#add-btn',    
    editBtn: '#edit-btn',
    deleteBtn: '#delete-btn',
    backBtn: '#back-btn',

    errorCard: '#error-card',
    errorOutput: '#error-msg',        
  };
    
  // Takes and data object in a form specified in ItemCtrl and draws it to output
  function drawItems({totalCalories, items}) {  
    // Initial Clear
    document.querySelector(elements.output).innerHTML = '';  

    let tmpHTML = '';
    
    items.forEach(item => {
      // List item template for each meal output
      let li = `<li class="collection-item">
                  <div>
                      <b class="item-name">${item.name}:</b> 
                      ${item.calories} Calories
                      <a href="#!" class="secondary-content" >
                        <i data-id="${item.id}" class="material-icons yellow-text text-darken-2 data-item">edit</i>
                      </a>
                  </div>
                </li>`;
      tmpHTML += li;
    });
    
    document.querySelector(elements.output).innerHTML = tmpHTML;
    updateTotalCalories(totalCalories);
  }
  
  function updateTotalCalories(calories) {
    document.querySelector(elements.caloriesCount).innerText = calories;
  }
  

  

  
  function getInput() {
    let name = document.querySelector(elements.nameInput).value;
    let calories = document.querySelector(elements.caloriesInput).value;
    calories = parseInt(calories);
    return {name, calories};
  }
  
  function showError(error) {
    document.querySelector(elements.errorOutput).innerHTML = error;
    document.querySelector(elements.errorCard).classList.remove('hide');
  }
  
  function hideError() {
    document.querySelector(elements.errorCard).classList.add('hide');
  }
  
  function clearInput() {
    document.querySelector(elements.nameInput).value = '';
    document.querySelector(elements.caloriesInput).value = '';
  }
  
  function editState({currItem}) {
    hideError();
    document.querySelector(elements.addBtn).classList.add('hide');
    document.querySelector(elements.editBtn).classList.remove('hide');
    document.querySelector(elements.deleteBtn).classList.remove('hide');
    document.querySelector(elements.backBtn).classList.remove('hide');
    document.querySelector(elements.nameInput).value = currItem.name;
    document.querySelector(elements.caloriesInput).value = currItem.calories;
  }
  
  function addState() {
    hideError();
    document.querySelector(elements.addBtn).classList.remove('hide');
    document.querySelector(elements.editBtn).classList.add('hide');
    document.querySelector(elements.deleteBtn).classList.add('hide');
    document.querySelector(elements.backBtn).classList.add('hide');
    clearInput();
  }
  
  
  return {
    selectors: elements,
    drawItems,
    getInput,
    showError,
    hideError,
    clearInput,
    editState,
    addState
  }
})();


//==========================================================================
//      Item Controller Module
//==========================================================================
// Data object template:
//  data = {
//   totalCalories: 123,
//       currItem: {id: 0, name: 'test item that is currently edited', calories: 123},
//       items: [
//         {id: 0, name: 'test item1 that is currently edited', calories: 123},
//         {id: 1, name: 'test item2', calories: 321},
//     ]
// }
const ItemCtrl = (function() {  
  let data = {};  
  
  function clearData() {
    data = {
      totalCalories: 0,
      currItem: null,
      items: []
    }    
  }

  function setData(obj) { // TODO data verification
    data = obj;
  }

  function getData() {
    return data;
  }

  function logData() {
    console.log(data);
  }
  
  function setItem(item) {
    let tempItem = item;
    let id = getId();
    tempItem.id = id;
    data.items.push(tempItem);
    updateTotalCalories();      
  }
  
  function getId() {
    if (data.items.length == 0) {
      return 0;
    }  else {
      let id = null;
      data.items.forEach(item => {
        if (item.id > id) {
          id = item.id
        }
      });
      return id + 1;
    }
  }
  
  function updateTotalCalories() {
    data.totalCalories = 0;
    data.items.forEach(item => data.totalCalories += item.calories);
  }
  
  function verifyItem(item) {
    let response = {
      isVerified: true,
      errorMsg: ''
    };
    
    if (item.name === '') {
      response.isVerified = false;
      response.errorMsg += 'Incorrect meal input. ';
    }
    
    if (isNaN(item.calories) || item.calories < 0) {
      response.isVerified = false;
      response.errorMsg += 'Incorrect calories number input. ';
    }
    
    return response;
  }
    
  function setCurrentItem(id) {
    data.currItem = data.items.find(item => item.id == id);
    console.log(data.currItem); // TODO for test only
  }
  
  function updateItem(item) {
    data.items.forEach(meal => {
      if (meal.id == data.currItem.id) {
        meal.name = item.name;
        meal.calories = item.calories;
      }
    });
    data.currItem = null;
    updateTotalCalories();
  }
  
  function deleteCurrentItem() {
    data.items = data.items.filter(item => {
      if (item.id == data.currItem.id) {
        
        return false;        
      } else {
        
        return true;        
      }      
    });
    updateTotalCalories();
  }

  return {    
    clearData,
    setData,
    getData,
    logData,

    setItem,
    verifyItem,
    setCurrentItem,
    updateItem,    
    deleteCurrentItem
  }
})();


//==========================================================================
//      App Module
//==========================================================================
const App = (function(UICtrl, ItemCtrl) {
  // Event Listeners 
  function loadEventListeners() {
    document.querySelector(UICtrl.selectors.addBtn).addEventListener('click', addMeal);
    document.querySelector(UICtrl.selectors.clearBtn).addEventListener('click', clearMeals);
    document.querySelector(UICtrl.selectors.output).addEventListener('click', editItemState);
    document.querySelector(UICtrl.selectors.editBtn).addEventListener('click', updateMeal);
    document.querySelector(UICtrl.selectors.deleteBtn).addEventListener('click', deleteMeal);
    document.querySelector(UICtrl.selectors.backBtn).addEventListener('click', returnToAdd);  
  }

  function addMeal(event) {
    event.preventDefault();
     
    let input = UICtrl.getInput();
    // Verify input
    const verification = ItemCtrl.verifyItem(input);
    console.log(verification); // TODO for TEST ONLY
    
    if (verification.isVerified) {
      let data;
      UICtrl.hideError();
      ItemCtrl.setItem(input);     
      
      data = ItemCtrl.getData();
      UICtrl.drawItems(data);
      StorageCtrl.updateStorage(data);
      UICtrl.clearInput();
    } else {
      UICtrl.showError(verification.errorMsg);
    }
  }

  function clearMeals(event) {
    event.preventDefault();
    // UICtrl.clearAll();
    ItemCtrl.clearData();    
    let data = ItemCtrl.getData();
    UICtrl.drawItems(data);
    StorageCtrl.updateStorage(data);
  }
  
  function editItemState(event) {
    event.preventDefault();
    
    if (event.target.classList.contains('data-item')) {
      const id = event.target.getAttribute('data-id');
      
      ItemCtrl.setCurrentItem(id);
      UICtrl.editState(ItemCtrl.getData());
    }
  }

  function updateMeal(event) {
    event.preventDefault();
    
    let input = UICtrl.getInput();
    const verification = ItemCtrl.verifyItem(input);
    if (verification.isVerified) {
      UICtrl.hideError();
      ItemCtrl.updateItem(input);      
      let data = ItemCtrl.getData();
      UICtrl.drawItems(data);
      StorageCtrl.updateStorage(data);
      UICtrl.clearInput();     
      UICtrl.addState();
    } else {
      UICtrl.showError(verification.errorMsg);
    }
  }

  function deleteMeal(event) {
    event.preventDefault();    
    
    let data;
    UICtrl.hideError();
    ItemCtrl.deleteCurrentItem();
    ItemCtrl.logData();    
    data = ItemCtrl.getData();
    UICtrl.drawItems(data);
    StorageCtrl.updateStorage(data);
    UICtrl.clearInput();     
    UICtrl.addState();
    
  }

  function returnToAdd(event) {
    event.preventDefault();
    UICtrl.addState();
  }  
  
  function init() {
    // Initialize Data
    ItemCtrl.setData(StorageCtrl.getStorage());

    loadEventListeners();        
    UICtrl.drawItems(ItemCtrl.getData());          
  }
  return {
    init
  }
})(UICtrl, ItemCtrl);

App.init();

