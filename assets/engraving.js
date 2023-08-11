$(document).ready(function () {
  const productForm = $(".product-single__form");
  const productFormSubmit = $(".add-to-cart");
  const productFormSubmitBtn = $(".add-to-cart span");
  const engravingInput = $(".product-page-engraving-input");
  const engravingProductID = theme.engraving.engraving_var_id;
  let hiddenFieldsAdded = false;
  
  if (engravingInput.length) {
    engravingInput.on('input', function () {
      let engravingValue = engravingInput.val();
      let field = $(this);
  
      field.val(field.val().toUpperCase());
  
      if (engravingValue !== '') {
        productFormSubmitBtn.html('<span>ADD TO CART + ENGRAVING</span>');
      } else if (engravingValue === '') {
        productFormSubmitBtn.html('<span>ADD TO CART</span>');
      }
    });
  }

  productFormSubmit.on('click', function (event) {
    // Prevent the default form submission
    event.preventDefault();
  
    let engravingValue = engravingInput.val();
  
    if (engravingValue !== '') {
      $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: {
          quantity: 1,
          id: engravingProductID
        },
        dataType: 'json',
        success: function (data) {
          // Handle success if needed
          productForm.submit();
        },
        error: function (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error adding engraving product to the cart!'
          })
        }
      });
    }
    else {
      // Submit the form programmatically
      productForm.submit();
    }
  });
  $(document).on('click', '.cart__remove a', function (event) {
    event.preventDefault();
    var $this = $(this);
    var $remove_url = $(this).attr('href');
    if($(this).parents('.cart__item').find('.engraving_p').val() == 'true') {
      // Get the current cart items
      $.ajax({
        type: 'GET',
        url: '/cart.js',
        dataType: 'json',
        success: function (cartData) {
          // Find the item with the engraving product ID in the cart
          var itemToUpdate = cartData.items.find(function (item) {
            return item.variant_id === engravingProductID;
          });
    
          if (itemToUpdate) {
            // Decrease the quantity of the engraving product by 1
            var newQuantity = itemToUpdate.quantity - 1;
    
            // Make an AJAX request to update the quantity of the engraving product
            $.ajax({
              type: 'POST',
              url: '/cart/change.js',
              data: {
                quantity: newQuantity,
                id: itemToUpdate.id,
              },
              dataType: 'json',
              success: function (data) {
                window.location.href = $remove_url;
              },
              error: function (error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: 'Error!'
                })
              }
            });
          }
        },
        error: function (error) {
          // Handle error if needed
          console.error('Error fetching cart data:', error);
        }
      });
    }
    else {
      window.location.href = $remove_url;
    }
  });
  $(document).on('click', '.add-engraving-inline-button', function (e) {
    e.preventDefault();
    var text = '';
    var key = $(this).attr('data-key');
    var line = $(this).attr('data-line');
    editEngraving(text, key, line, true);
  });
  // Handle click event on elements with class "edit-engraving-btn"
  $(document).on('click', '.edit-engraving-btn', function (e) {
    e.preventDefault();
    var text = $(this).attr('data-text');
    var key = $(this).attr('data-key');
    var line = $(this).attr('data-line');
    editEngraving(text, key, line, false);
  });

  // Handle click event on elements with class "delete-engraving-btn"
  $(document).on('click', '.delete-engraving-btn', function (e) {
    e.preventDefault();
    var key = $(this).attr('data-key');
    var itemLine = $(this).attr('data-line');
    deleteEngraving(key, itemLine);
    removeEngravingProduct();
  });

  //handle adding engraving product
  document.addEventListener('ajaxProduct:added', function (evt) {
    // Get the added product information
    var addedProduct = evt.detail.product;
    
    // Check if the added product has engraving properties
    if (addedProduct.properties && addedProduct.properties['engraving']) {
      var engravingValue = addedProduct.properties['engraving'];

      // Check if the engraving property has a value
      if (engravingValue) {
        // Replace 'ENGRAVING_PRODUCT_ID' with the actual product ID of the engraving product
        var engravingProductID = theme.engraving.engraving_var_id;

        // Add the engraving product to the cart
        $.ajax({
          type: 'POST',
          url: '/cart/add.js',
          data: {
            quantity: 1,
            id: engravingProductID
          },
          dataType: 'json',
          success: function (data) {
            // Handle success if needed
            document.dispatchEvent(new CustomEvent('cart:build'));
            document.dispatchEvent(new CustomEvent('cart:open'));
          },
          error: function (error) {
            // Handle error if needed
            document.dispatchEvent(new CustomEvent('cart:close'));
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error adding engraving product to the cart!'
            })
          }
        });
      }
    }
  });
});

function AutoAddEngravingProduct() {
  // Replace 'ENGRAVING_PRODUCT_ID' with the actual product ID of the engraving product
  var engravingProductID = theme.engraving.engraving_var_id;

  $.ajax({
    type: 'POST',
    url: '/cart/add.js',
    data: {
      quantity: 1,
      id: engravingProductID
    },
    dataType: 'json',
    success: function (data) {
      // Handle success if needed
      document.dispatchEvent(new CustomEvent('cart:build'));
      //document.dispatchEvent(new CustomEvent('cart:open'));
    },
    error: function (error) {
      // Handle error if needed
      //document.dispatchEvent(new CustomEvent('cart:close'));
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error!'
      })
    }
  });
}

function removeEngravingProduct() {
  // Replace 'ENGRAVING_PRODUCT_ID' with the actual product ID of the engraving product
  var engravingProductID = theme.engraving.engraving_var_id;

  // Get the current cart items
  $.ajax({
    type: 'GET',
    url: '/cart.js',
    dataType: 'json',
    success: function (cartData) {
      // Find the item with the engraving product ID in the cart
      var itemToUpdate = cartData.items.find(function (item) {
        return item.variant_id === engravingProductID;
      });

      if (itemToUpdate) {
        // Decrease the quantity of the engraving product by 1
        var newQuantity = itemToUpdate.quantity - 1;

        // Make an AJAX request to update the quantity of the engraving product
        $.ajax({
          type: 'POST',
          url: '/cart/change.js',
          data: {
            quantity: newQuantity,
            id: itemToUpdate.id,
          },
          dataType: 'json',
          success: function (data) {
            // Handle success if needed
            document.dispatchEvent(new CustomEvent('cart:build'));
            //document.dispatchEvent(new CustomEvent('cart:open'));
          },
          error: function (error) {
            // Handle error if needed
            //document.dispatchEvent(new CustomEvent('cart:close'));
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Error!'
            })
          }
        });
      }
    },
    error: function (error) {
      // Handle error if needed
      console.error('Error fetching cart data:', error);
    }
  });
}
// Add the _updateCart function
function _updateCart(params) {
  return fetch(params.url, {
    method: 'POST',
    body: JSON.stringify(params.data),
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  .then(response => response.json())
  .then(function(responseData) {
    return responseData;
  });
}

function deleteEngraving(itemKey, itemLine) {
  const newEngravingText = '';

  var data = {
    line: itemLine,
    properties: {
      engraving: newEngravingText
    }
  };
  _updateCart({
    url: '/cart/change.js',
    data: data
  }).then(function(response) {
    // Handle the response data here
    document.dispatchEvent(new CustomEvent('cart:build'));
  });
}
function editEngraving(itemText, itemKey, itemLine, $autoAdd) {
  //document.dispatchEvent(new CustomEvent('cart:close'));
  Swal.fire({
    input: 'text',
    inputValue: itemText,
    inputLabel: 'Engraving Text',
    inputPlaceholder: '20 characters or less',
    inputAttributes: {
      maxlength: 20
    },    
    showCancelButton: true,
    confirmButtonText: 'Save',
  }).then((result) => {
    if (result.isConfirmed) {
      // Get the entered text from the SweetAlert input field
      const newEngravingText = result.value.toUpperCase();

      var data = {
        line: itemLine,
        properties: {
          engraving: newEngravingText
        }
      };
      _updateCart({
        url: '/cart/change.js',
        data: data
      }).then(function(response) {
        if($autoAdd){
          AutoAddEngravingProduct();
        }
        else {
          // Handle the response data here
          document.dispatchEvent(new CustomEvent('cart:build'));
          //document.dispatchEvent(new CustomEvent('cart:open'));
        }
      });

    }
  });
}