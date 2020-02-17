// TODO :
// 
// - error as helper text through materialize
// - add and edit by pressing ENTER (key code 13)
// - add local storage functionality


//Storage Controller
// const StorageCtrl = (function(){
  
// })();

//UI Controller
const UICtrl = (function() {
  
  const elements = {
    output: '#items-output',
    nameInput: '#meal-input',
    caloriesInput: '#calories-input',
    clearBtn: '#clear-btn',
    addBtn: '#add-btn',
    editBtn: '#edit-btn',
    deleteBtn: '#delete-btn',
    backBtn: '#back-btn',
    errorOutput: '#error-msg',
    errorCard: '#error-card',
    caloriesCount: '#calories-count',
    editItem: '.data-item',
  };
    
  function drawItems({totalCalories, items}) {    
    let tmpHTML = '';
    
    items.forEach(item => {
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
  
  function clearItems() {
    document.querySelector(elements.output).innerHTML = '';
  }
  
  function clearAll() {
    clearItems();
    updateTotalCalories(0);
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
    document.querySelector(elements.addBtn).classList.add('hide');
    document.querySelector(elements.editBtn).classList.remove('hide');
    document.querySelector(elements.deleteBtn).classList.remove('hide');
    document.querySelector(elements.backBtn).classList.remove('hide');
    document.querySelector(elements.nameInput).value = currItem.name;
    document.querySelector(elements.caloriesInput).value = currItem.calories;
  }
  
  function addState() {
    document.querySelector(elements.addBtn).classList.remove('hide');
    document.querySelector(elements.editBtn).classList.add('hide');
    document.querySelector(elements.deleteBtn).classList.add('hide');
    document.querySelector(elements.backBtn).classList.add('hide');
    clearInput();
  }
  
  
  return {
    selectors: elements,
    clearItems,
    drawItems,
    getInput,
    showError,
    hideError,
    clearInput,
    clearAll,
    editState,
    addState
  }
})();

// Item Controller
const ItemCtrl = (function() {
  
  let data = {
    totalCalories: 0,
    currItem: null,
    items: []
  }
  
  let error = '';
  
  // Item constructor
  function Item(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  }
  
    function setItem(item) {
    let tempItem = item;
    let id = getId();
    tempItem.id = id;
    data.items.push(tempItem);
    updateCalories();      
  }
  
  function updateCalories() {
    data.totalCalories = 0;
    data.items.forEach(item => data.totalCalories += item.calories);
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
  
  function getData() {
    return data;
  }
  
  function getError() {
    return error;
  }
  
  function logData() {
    console.log(data);
  }
  
  function setCurrentItem(id) {
    data.currItem = data.items.find(item => item.id == id);
    console.log(data.currItem);
  }
  
  function updateItem(item) {
    data.items.forEach(meal => {
      if (meal.id == data.currItem.id) {
        meal.name = item.name;
        meal.calories = item.calories;
      }
    });
    data.currItem = null;
    updateCalories();
  }
  
  function clearData() {
    data = {
      totalCalories: 0,
      currItem: null,
      items: []
    }    
  }
  
  function deleteCurrentItem() {
    data.items = data.items.filter(item => {
      if (item.id == data.currItem.id) {
        
        return false;        
      } else {
        
        return true;        
      }      
    });
    updateCalories();
  }
  
  return {
    logData,
    getData,
    setItem,
    verifyItem,
    setCurrentItem,
    updateItem,
    clearData,
    deleteCurrentItem
  }
})();

// App Controller
const App = (function(UICtrl, ItemCtrl) {
  // Event Listeners 
  const eventListeners = function eventListeners() {
    document.querySelector(UICtrl.selectors.addBtn).addEventListener('click', addMeal);
    document.querySelector(UICtrl.selectors.clearBtn).addEventListener('click', clearMeals);
    document.querySelector(UICtrl.selectors.output).addEventListener('click', editItem);
    document.querySelector(UICtrl.selectors.editBtn).addEventListener('click', updateMeal);
    document.querySelector(UICtrl.selectors.deleteBtn).addEventListener('click', deleteMeal);
    document.querySelector(UICtrl.selectors.backBtn).addEventListener('click', returnToAdd);  
  }
  
  function returnToAdd(event) {
    event.preventDefault();
    UICtrl.addState();
  }
  
  function deleteMeal(event) {
    event.preventDefault();    
       
    UICtrl.hideError();
    ItemCtrl.deleteCurrentItem();
    ItemCtrl.logData();
    UICtrl.clearItems();
    UICtrl.drawItems(ItemCtrl.getData());
    UICtrl.clearInput();     
    UICtrl.addState();
    
  }
  
  function clearMeals(event) {
    event.preventDefault();
    UICtrl.clearAll();
    ItemCtrl.clearData();
  }
  
  function updateMeal(event) {
    event.preventDefault();
    
    let input = UICtrl.getInput();
    const verification = ItemCtrl.verifyItem(input);
    if (verification.isVerified) {
      UICtrl.hideError();
      ItemCtrl.updateItem(input);
      UICtrl.clearItems();
      UICtrl.drawItems(ItemCtrl.getData());
      UICtrl.clearInput();     
      UICtrl.addState();
    } else {
      UICtrl.showError(verification.errorMsg);
    }
  }
  
  function editItem(event) {
    event.preventDefault();
    
    if (event.target.classList.contains('data-item')) {
      const id = event.target.getAttribute('data-id');
      
      ItemCtrl.setCurrentItem(id);
      UICtrl.editState(ItemCtrl.getData());
    }
  }
  
  function addMeal(event) {
    event.preventDefault();
     
    let input = UICtrl.getInput();
    // Verify input
    const verification = ItemCtrl.verifyItem(input);
    console.log(verification); // TODO for TEST ONLY
    
    if (verification.isVerified) {
      UICtrl.hideError();
      ItemCtrl.setItem(input);     
      UICtrl.clearItems();
      UICtrl.drawItems(ItemCtrl.getData());
      UICtrl.clearInput();
    } else {
      UICtrl.showError(verification.errorMsg);
    }
  }
  
  function init() {
    //Load event listeners
    eventListeners();
    
    UICtrl.clearItems();
    UICtrl.drawItems(ItemCtrl.getData());       
    
  }
  return {
    init
  }
})(UICtrl, ItemCtrl);

App.init();

