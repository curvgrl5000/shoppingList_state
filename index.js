// module-level global vars

// we're using a single, global state object
var state = {
  items: []
};

var listItemTemplate = (
  '<li>' +
    '<span class="shopping-item">shopping item</span>' +
    '<div class="shopping-item-controls">' +
      '<button class="shopping-item-toggle">' +
        '<span class="button-label">check</span>' +
      '</button>' +
      '<button class="shopping-item-delete">' +
        '<span class="button-label">delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);

// state management
function addItem(state, item) {
  state.items.push({
    displayName: item,
    checkedOff: false
  });
  // we're pushing an object into the array
}

function getItem(state, itemIndex) {
  console.log(state.items[itemIndex]);
  return state.items[itemIndex];
}

function deleteItem(state, itemData) {
  console.log(state.items.splice(itemData,1));
  state.items.splice(itemData, 1);
}

function updateItem(state, itemIndex, newItemState) {
  console.log(state.items[itemIndex] = newItemState);
  state.items[itemIndex] = newItemState;
}

// DOM manipulation
function renderShoppingItem(item, itemId, itemTemplate, itemDataAttr) {
  var element = $(itemTemplate);
  element.find('.shopping-item').text(item.displayName);
  if (item.checkedOff) {
    element.find('.shopping-item').addClass('shopping-item__checked');
  }
  element.find('.shopping-item-toggle');
  element.data(itemDataAttr, itemId);
  return element;
}

function renderShoppingList(state, listElement, itemDataAttr) {
  var itemsHTML = state.items.map(
    function(item, index) {
      return renderShoppingItem(item, index, listItemTemplate, itemDataAttr);
  });
  listElement.html(itemsHTML);
}


// Event listeners
function handleItemAdds(
  formElement, newItemId, itemDataAttr, listElement, state) {

  formElement.submit(function(event) {
    event.preventDefault();
    var newItem = formElement.find(newItemId).val();
    addItem(state, newItem);
    renderShoppingList(state, listElement, itemDataAttr);
    // reset form
    this.reset();
  });
}

function handleItemDeletes(
  formElement, removeId, removeItem, itemDataAttr, listElement, state) {

  listElement.on('click', removeId, function(event) {
    var itemData = $(this).closest('li').data(itemDataAttr);
    deleteItem(state, itemData);
    renderShoppingList(state, listElement, itemDataAttr);
  })
}

function handleItemToggles(
  listElement, toggleId, itemDataAttr, state) {

  listElement.on('click', toggleId, function(event) {
    var itemId = $(event.currentTarget.closest('li')).data(itemDataAttr);
    var oldItem = getItem(state, itemId);

    updateItem(state, itemId, {
      displayName: oldItem.displayName,
      checkedOff: !oldItem.checkedOff
    });
    renderShoppingList(state, listElement, itemDataAttr)
  });
}

$(function() {
  state.items = ['pickles', 'oranges', 'milk', 'bread'].map(function(item) {
    return { displayName: item };
  });
  var formElement = $('#js-shopping-list-form');
  var listElement = $('.shopping-list');
  var newItemId = '#shopping-list-entry'; 
	var itemId = '#shopping-list-id';
  var removeId = '.shopping-item-delete';
  var removeItem = '.shopping-item-delete';
  var itemDataAttr = 'list-item-id';
  var toggleId = '.shopping-item-toggle';

  renderShoppingList(state, listElement, itemDataAttr);

  handleItemAdds(
  formElement, newItemId, itemDataAttr, listElement, state
  );
  
  handleItemDeletes(
    formElement, removeId, removeItem, itemDataAttr, listElement, state
  );
  handleItemToggles(listElement, toggleId, itemDataAttr, state);
  
});

