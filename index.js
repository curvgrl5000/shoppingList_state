// module-level global vars

// we're using a single, global state object
// in this app
var state = {
  items: []
};

var listItemTemplate = (
  '<li>' +
    '<span class="shopping-item">help me nicoloas!</span>' +
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
}

function getItem(state, itemIndex) {
  return state.items[itemIndex];
}

function deleteItem(state, itemData) {
  state.items.splice(itemData, 1);
}

function updateItem(state, itemIndex, newItemState) {
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
  formElement, newItemIdentifier, itemDataAttr, listElement, state) {

  formElement.submit(function(event) {
    event.preventDefault();
    var newItem = formElement.find(newItemIdentifier).val();
    addItem(state, newItem);
    renderShoppingList(state, listElement, itemDataAttr);
    // reset form
    this.reset();
  });
}

function handleItemDeletes(
  formElement, removeIdentifier, removeItem, itemDataAttr, listElement, state) {

  listElement.on('click', removeIdentifier, function(event) {
    var itemData = $(this).closest('li').data(itemDataAttr);
    deleteItem(state, itemData);
    renderShoppingList(state, listElement, itemDataAttr);
  })

  // currentElement.on('click', removeItem, function(event) {
  //   //console.log(currentElement);
  //   //console.log(removeItem);
  //   var item = $(this).closest('li');
  //   deleteMe(item);
  // })
}


function handleItemToggles(
  listElement, toggleIdentifier, itemDataAttr, state) {

  listElement.on('click', toggleIdentifier, function(event) {
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
  var formElement = $('#js-shopping-list-form');
  var listElement = $('.shopping-list');
  
  state.items = ['pickles', 'oranges', 'milk', 'bread'].map(function(item) {
    return { displayName:item };
  });

  // function reply_click(clicked_id){
  //   //alert(clicked_id);
  //   currentElement = document.getElementById(clicked_id);
  //   console.log(currentElement);
  // }

  // from index.html -- it's the id of the input
  // containing shopping list items
  var newItemIdentifier = '#shopping-list-entry'; // #js-new-item
	var itemIdentifier = '#shopping-list-id'; // id's from current ul-list

  // from `listItemTemplate` at top of this file. for each
  // displayed shopping list item, we'll be adding a button
  // that has this class name on it
  var removeIdentifier = '.shopping-item-delete';
  var removeItem = '.shopping-item-delete';

  // we'll use this attribute to store the id of the list item
  var itemDataAttr = 'list-item-id';

  //
  var toggleIdentifier = '.shopping-item-toggle'

  renderShoppingList(state, listElement, itemDataAttr);

  handleItemAdds(
  formElement, newItemIdentifier, itemDataAttr, listElement, state);
  handleItemDeletes(
    formElement, removeIdentifier, removeItem, itemDataAttr, listElement, state);
  handleItemToggles(listElement, toggleIdentifier, itemDataAttr, state);
});

