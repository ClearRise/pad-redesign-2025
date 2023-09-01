$(document).ready(function () {
  const productForm = $(".product-single__form");
  const productFormSubmit = $(".add-to-cart");
  const productFormSubmitBtn = $(".add-to-cart span");
  const engravingInput = $(".product-page-engraving-input");
  const protectField = $(".protection-plan");
  let protectionInput = "";
  const engravingProductID = theme.engraving.engraving_var_id;
  let hiddenFieldsAdded = false;

  if (engravingInput.length) {
    engravingInput.on("input", function () {
      let engravingValue = engravingInput.val();
      let field = $(this);

      // field.val(field.val().toUpperCase());

      if (engravingValue !== "") {
        productFormSubmitBtn.html("<span>ADD TO CART + ENGRAVING</span>");
      } else if (engravingValue === "") {
        productFormSubmitBtn.html("<span>ADD TO CART</span>");
      }
    });
  }

  protectField.click(function () {
    if ($(this).is(":checked")) {
      protectionInput = $(this).attr("data-protection");
    } else {
      protectionInput = "";
    }
    console.log(protectionInput);
  });

  function ProtectionPlanAjaxAdd(productId) {
    $.ajax({
      type: "POST",
      url: "/cart/add.js",
      data: {
        quantity: 1,
        id: productId,
      },
      dataType: "json",
      success: function (data) {
        // Handle success if needed
        productForm.submit();
      },
      error: function (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Plan error!",
        });
      },
    });
  }

  productFormSubmit.on("click", function (event) {
    // Prevent the default form submission
     $('.pg_overlay').show();
    event.preventDefault();
   
    let engravingValue = engravingInput.val();

    if (engravingInput.length > 0){
      $.ajax({
        type: "POST",
        url: "/cart/add.js",
        data: {
          quantity: 1,
          id: engravingProductID,
        },
        dataType: "json",
        success: function (data) {
          // Handle success if needed
          if (protectionInput !== "") {
            ProtectionPlanAjaxAdd(protectionInput);
          } else {
            productForm.submit();
          }
        },
        error: function (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error adding engraving product to the cart!",
          });
        },
      });
    } else {
      // Submit the form programmatically
      if (protectionInput !== "") {
        ProtectionPlanAjaxAdd(protectionInput);
      } else {
        productForm.submit();
      }
    }
  });

  
  // $(document).on("click", ".cart__remove a", function (event) {
  //   event.preventDefault();
  //   var $this = $(this);
  //   var $remove_url = $(this).attr("href");
  //   var $productId = '';

  //    if (($(this).parents(".cart__item").find(".engraving_p").val() == "true") && ($(this).parents(".cart__item").find(".Protection_p").val() == "true")) {
       
  //    }
  //    else if ($(this).parents(".cart__item").find(".engraving_p").val() == "true") {
  //      $productId = engravingProductID;
  //    }
  //    else if ($(this).parents(".cart__item").find(".Protection_p").val() == "true") {
  //      console.log('inside');
  //      $productId = $(this).parents(".cart__item").find(".Protection_p").attr('data-product-id');
  //    }
  //   else {
  //     $productId = '';
  //   }

    
  //   if ($productId != '') {

  //     console.log($productId);
  //     // Get the current cart items
  //     $.ajax({
  //       type: "GET",
  //       url: "/cart.js",
  //       dataType: "json",
  //       success: function (cartData) {

  //         console.log(cartData);
  //         // Find the item with the engraving product ID in the cart
  //         var itemToUpdate = cartData.items.find(function (item) {
  //           return item.variant_id === parseInt($productId);
  //         });

  //         console.log(itemToUpdate);
          
  //         if (itemToUpdate) {
  //           // Decrease the quantity of the engraving product by 1
  //           var newQuantity = itemToUpdate.quantity - 1;

  //           // Make an AJAX request to update the quantity of the engraving product
  //           $.ajax({
  //             type: "POST",
  //             url: "/cart/change.js",
  //             data: {
  //               quantity: newQuantity,
  //               id: itemToUpdate.id,
  //             },
  //             dataType: "json",
  //             success: function (data) {
  //               window.location.href = $remove_url;
  //             },
  //             error: function (error) {
  //               Swal.fire({
  //                 icon: "error",
  //                 title: "Oops...",
  //                 text: "Error!",
  //               });
  //             },
  //           });
  //         }
  //       },
  //       error: function (error) {
  //         // Handle error if needed
  //         console.error("Error fetching cart data:", error);
  //       },
  //     });
  //   } else {
  //     window.location.href = $remove_url;
  //   }
  // });

 $(document).on("click", ".cart__remove a", function (event) {
    event.preventDefault();
    var $this = $(this);
    var $remove_url = $(this).attr("href");
    var $productId = '';
    var itemQuantity = $(this).parents(".cart__item").attr('data-quantity');
    $('.overlay').show();
     if (($(this).parents(".cart__item").find(".engraving_p").val() == "true") && ($(this).parents(".cart__item").find(".Protection_p").val() == "true")) {
       $productId = $(this).parents(".cart__item").find(".Protection_p").attr('data-product-id');
       removeEngrageShippingItems($productId, $remove_url, itemQuantity);
       removeEngrageShippingItems(engravingProductID, $remove_url, itemQuantity);
     }
     else if ($(this).parents(".cart__item").find(".engraving_p").val() == "true") {
       removeEngrageShippingItems(engravingProductID, $remove_url, itemQuantity);
      
     }
     else if ($(this).parents(".cart__item").find(".Protection_p").val() == "true") {
       $productId = $(this).parents(".cart__item").find(".Protection_p").attr('data-product-id');
       removeEngrageShippingItems($productId, $remove_url, itemQuantity);
     }
    else {
      $productId = '';
      window.location.href = $remove_url;
    } 
    setTimeout(function(){
      $('.overlay').hide();
      window.location.href = $remove_url;
    }, 2000);
   
  });


function removeEngrageShippingItems($productId, $remove_url, itemQuantity){
   if ($productId != '') {
      // Get the current cart items
      $.ajax({
        type: "GET",
        url: "/cart.js",
        dataType: "json",
        success: function (cartData) {

          console.log(cartData);
          // Find the item with the engraving product ID in the cart
          var itemToUpdate = cartData.items.find(function (item) {
            return item.variant_id === parseInt($productId);
          });
          
          if (itemToUpdate) {
            // Decrease the quantity of the engraving product by 1
            var newQuantity = itemToUpdate.quantity - 1*itemQuantity;

            // Make an AJAX request to update the quantity of the engraving product
            $.ajax({
              type: "POST",
              url: "/cart/change.js",
              data: {
                quantity: newQuantity,
                id: itemToUpdate.id,
              },
              dataType: "json",
              success: function (data) {
                console.log('success');
              //  window.location.href = $remove_url;
              },
              error: function (error) {
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: "Error!",
                });
              },
            });
          }
        },
        error: function (error) {
          // Handle error if needed
          console.error("Error fetching cart data:", error);
        },
      });
    } else {
    //  window.location.href = $remove_url;
    }
}

  
  $(document).on("click", ".add-engraving-inline-button", function (e) {
    e.preventDefault();
    var text = "";
    var key = $(this).attr("data-key");
    var line = $(this).attr("data-line");
    var itemQuantity = $(this).attr("data-quantity");
    editEngraving(text, key, line, itemQuantity, true);
  });
  // Handle click event on elements with class "edit-engraving-btn"
  $(document).on("click", ".edit-engraving-btn", function (e) {
    e.preventDefault();
    var text = $(this).attr("data-text");
    var key = $(this).attr("data-key");
    var line = $(this).attr("data-line");
    var itemQuantity = $(this).attr("data-quantity");
    editEngraving(text, key, line, itemQuantity, false);
  });

  // Handle click event on elements with class "delete-engraving-btn"
  $(document).on("click", ".delete-engraving-btn", function (e) {
    e.preventDefault();
    var key = $(this).attr("data-key");
    var itemLine = $(this).attr("data-line");
    var itemQuantity = $(this).attr("data-quantity");
    deleteEngraving(key, itemLine, itemQuantity);
    removeEngravingProduct(itemQuantity);
  });

  //handle adding engraving product
  /*document.addEventListener('ajaxProduct:added', function (evt) {
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
  });*/
});

function AutoAddEngravingProduct(itemQuantity) {
  // Replace 'ENGRAVING_PRODUCT_ID' with the actual product ID of the engraving product
  var engravingProductID = theme.engraving.engraving_var_id;

  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    data: {
      quantity: 1*itemQuantity,
      id: engravingProductID,
    },
    dataType: "json",
    success: function (data) {
      // Handle success if needed
      setTimeout(function(){
        document.dispatchEvent(new CustomEvent("cart:build"));
      }, 1000);
      //document.dispatchEvent(new CustomEvent('cart:open'));
    },
    error: function (error) {
      // Handle error if needed
      //document.dispatchEvent(new CustomEvent('cart:close'));
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error!",
      });
    },
  });
}

function removeEngravingProduct(itemQuantity) {
  // Replace 'ENGRAVING_PRODUCT_ID' with the actual product ID of the engraving product
  var engravingProductID = theme.engraving.engraving_var_id;
$('.overlay').show();
  // Get the current cart items
  $.ajax({
    type: "GET",
    url: "/cart.js",
    dataType: "json",
    success: function (cartData) {
      // Find the item with the engraving product ID in the cart
      var itemToUpdate = cartData.items.find(function (item) {
        return item.variant_id === engravingProductID;
      });

      if (itemToUpdate) {
        // Decrease the quantity of the engraving product by 1
        var newQuantity = itemToUpdate.quantity - 1*itemQuantity;

        // Make an AJAX request to update the quantity of the engraving product
        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          data: {
            quantity: newQuantity,
            id: itemToUpdate.id,
          },
          dataType: "json",
          success: function (data) {
            // Handle success if needed
            setTimeout(function(){
              $('.overlay').hide();
              document.dispatchEvent(new CustomEvent("cart:build"));
            }, 1000);
            
            //document.dispatchEvent(new CustomEvent('cart:open'));
          },
          error: function (error) {
            // Handle error if needed
            //document.dispatchEvent(new CustomEvent('cart:close'));
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error!",
            });
          },
        });
      }
    },
    error: function (error) {
      // Handle error if needed
      console.error("Error fetching cart data:", error);
    },
  });
}
// Add the _updateCart function
function _updateCart(params) {
  return fetch(params.url, {
    method: "POST",
    body: JSON.stringify(params.data),
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
  })
    .then((response) => response.json())
    .then(function (responseData) {
      return responseData;
    });
}

function _getCart() {
  var url = "".concat(theme.routes.cart, "?t=").concat(Date.now());
  return fetch(url, {
    credentials: "same-origin",
    method: "GET",
  }).then((response) => response.json());
}

function deleteEngraving(itemKey, itemLine, itemQuantity) {
  
  const newEngravingText = "";
  $.ajax({
    type: "GET",
    url: "/cart.js",
    dataType: "json",
    success: function (cartData) {
      var lineItemToUpdate = cartData.items.find(function (item) {
        return item.key === itemKey;
      });

      if (lineItemToUpdate) {
        // Preserve existing properties and update engraving
        var updatedProperties = Object.assign({}, lineItemToUpdate.properties, {
          engraving: newEngravingText,
        });

        var data = {
          id: itemKey,
          quantity: itemQuantity,
          properties: updatedProperties,
        };

        _updateCart({
          url: "/cart/change.js",
          data: data,
        }).then(function (response) {
          // Handle the response data here
          setTimeout(function(){
            document.dispatchEvent(new CustomEvent("cart:build"));
          }, 1000);
        });
      }
    },
    error: function (error) {
      // Handle error
    },
  });
  
  
  // var data = {
  //   line: itemLine,
  //   properties: {
  //     engraving: newEngravingText,
  //   },
  // };
  // _updateCart({
  //   url: "/cart/change.js",
  //   data: data,
  // }).then(function (response) {
  //   // Handle the response data here
  //   document.dispatchEvent(new CustomEvent("cart:build"));
  // });
  
}
function editEngraving(itemText, itemKey, itemLine, itemQuantity, $autoAdd) {
  Swal.fire({
    input: "text",
    inputValue: itemText,
    inputLabel: "Engraving Text",
    inputPlaceholder: "20 characters or less",
    inputAttributes: {
      maxlength: 20,
    },
    showCancelButton: true,
    confirmButtonText: "Save",
  }).then((result) => {
    if (result.isConfirmed) {
        $('.overlay').show();
      // const newEngravingText = result.value.toUpperCase();
      const newEngravingText = result.value;
      var new_lineItem = parseInt(itemLine - 1);
      // Get the current cart contents
      $.ajax({
        type: "GET",
        url: "/cart.js",
        dataType: "json",
        success: function (cartData) {
          // Find the line item by key
          var lineItemToUpdate = cartData.items.find(function (item) {
            return item.key === itemKey;
          });

          if (lineItemToUpdate) {
            // Preserve existing properties and update engraving
            var updatedProperties = Object.assign({}, 
              lineItemToUpdate.properties,
              {
                engraving: newEngravingText,
              }
            );

            var data = {
              id: itemKey,
              quantity: itemQuantity,
              properties: updatedProperties
            };

            // Update the cart using change.js
            $.ajax({
              type: "POST",
              url: "/cart/change.js",
              data: data,
              dataType: "json",
              success: function (response) {
                if ($autoAdd && newEngravingText == "") {
                  //document.dispatchEvent(new CustomEvent('cart:build'));
                } else if ($autoAdd && newEngravingText != "") {
                  AutoAddEngravingProduct(itemQuantity);
                } else {
                  // Handle the response data here
                  setTimeout(function(){
                    document.dispatchEvent(new CustomEvent("cart:build"));
                  }, 2000);
                  //document.dispatchEvent(new CustomEvent('cart:open'));
                }
                  $('.overlay').hide();
              },
              error: function (error) {
                // Handle error
              },
            });
          }
        },
        error: function (error) {
          // Handle error
        },
      });
    }
  });
}

// Handle Protection Plan

$(document).on("click", ".add-protection-inline-button", function (e) {
    e.preventDefault();
   var productId = $(this).attr("data-protection");
  var productTitle = $(this).attr("data-product-title");
  var key = $(this).attr("data-key");
  var line = $(this).attr("data-line");
  var itemQuantity = $(this).attr("data-quantity");
  addProtectionPlan(productId, key, line, itemQuantity, productTitle);
  });

// Handle click event on elements with class "delete-engraving-btn"
  $(document).on("click", ".delete-protection-btn", function (e) {
    e.preventDefault();
    var productId = $(this).attr("data-protection");
    var productTitle = $(this).attr("data-product-title");
    var key = $(this).attr("data-key");
    var line = $(this).attr("data-line");
    var itemQuantity = $(this).attr("data-quantity");
    deleteProtectionPlan(productId, key, line, itemQuantity); 
  });


// $(document).on("click", ".add-protection-plan", function (e) {
//   var productId = $(this).attr("data-protection");
//   var productTitle = $(this).attr("data-product-title");
//   var key = $(this).attr("data-key");
//   var line = $(this).attr("data-line");
//   var itemQuantity = $(this).attr("data-quantity");
  
//   console.log("in function");
//   if ($(this).is(":checked")) {
//     addProtectionPlan(productId, key, line, itemQuantity, productTitle);
//   } else {
//     deleteProtectionPlan(productId, key, line, itemQuantity);
//     removeProtectionProduct(productId, key, line, itemQuantity);
//   }
// });

function AutoAddProtectionProduct(productId, itemQuantity, itemKey) {
  $.ajax({
    type: "POST",
    url: "/cart/add.js",
    data: {
      quantity: 1*itemQuantity,
      id: productId,
    },
    dataType: "json",
    success: function (data) {
      
      // Handle success if needed
      setTimeout(function(){
        document.dispatchEvent(new CustomEvent("cart:build"));
      }, 1000);
      //document.dispatchEvent(new CustomEvent('cart:open'));
    },
    error: function (error) {
      // Handle error if needed
      //document.dispatchEvent(new CustomEvent('cart:close'));
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error!",
      });
    },
  });
}

function addProtectionPlan(productId, itemKey, itemLine, itemQuantity, productTitle) {
  // Get the current cart contents
  var now = new Date().getTime();
  var random = Math.floor(Math.random() * 100000);
  var new_random = now+random;

  $('.overlay').show();
  
  $.ajax({
    type: "GET",
    url: "/cart.js",
    dataType: "json",
    success: function (cartData) {
      // Find the line item by key
      var lineItemToUpdate = cartData.items.find(function (item) {
        return item.key === itemKey;
      });

      if (lineItemToUpdate) {
        // Preserve existing properties and update engraving
        var updatedProperties = Object.assign({}, lineItemToUpdate.properties, {
          'Protection Plan': "Yes",
          '_prot-product-title': productTitle
          // _prot_timestamp: new_random 
        });

        console.log(updatedProperties);
        var data = {
          id: itemKey,
          quantity: itemQuantity,
          properties: updatedProperties
        };

        // Update the cart using change.js
        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          data: data,
          dataType: "json",
          success: function (response) {
            
            AutoAddProtectionProduct(productId, itemQuantity, itemKey);
            $('.overlay').hide();
          },
          error: function (error) {
            // Handle error
          },
        });
      }
    },
    error: function (error) {
      // Handle error
    },
  });
}

function deleteProtectionPlan(productId, itemKey, itemLine, itemQuantity) {
  $('.overlay').show();
  $.ajax({
    type: "GET",
    url: "/cart.js",
    dataType: "json",
    success: function (cartData) {
      var lineItemToUpdate = cartData.items.find(function (item) {
        return item.key === itemKey;
      });

      if (lineItemToUpdate) {
        // Preserve existing properties and update engraving
        var updatedProperties = Object.assign({}, lineItemToUpdate.properties, {
          'Protection Plan': '',
          '_prot-product-title': ''
        });

        var data = {
          id: itemKey,
          quantity: itemQuantity,
          properties: updatedProperties
        };

        _updateCart({
          url: "/cart/change.js",
          data: data,
        }).then(function (response) {
          // Handle the response data here
           removeProtectionProduct(productId, itemKey, itemLine, itemQuantity);
         // document.dispatchEvent(new CustomEvent("cart:build"));
        
        });
      }
    },
    error: function (error) {
      // Handle error
    },
  });
}

function removeProtectionProduct(productId, itemKey, itemLine, itemQuantity) {
  // Get the current cart items
  $.ajax({
    type: "GET",
    url: "/cart.js",
    dataType: "json",
    success: function (cartData) {
      
      // Find the item with the engraving product ID in the cart
      var itemToUpdate = cartData.items.find(function (item) {
        return item.variant_id === parseInt(productId);
      });

      if (itemToUpdate) {
        // Decrease the quantity of the engraving product by 1
        var newQuantity = itemToUpdate.quantity - 1*itemQuantity;

        // Make an AJAX request to update the quantity of the engraving product
        $.ajax({
          type: "POST",
          url: "/cart/change.js",
          data: {
            quantity: newQuantity,
            id: itemToUpdate.id,
          },
          dataType: "json",
          success: function (data) {
            // Handle success if needed
            setTimeout(function(){
              document.dispatchEvent(new CustomEvent("cart:build"));
              $('.overlay').hide();
            }, 2000);
            //document.dispatchEvent(new CustomEvent('cart:open'));
          },
          error: function (error) {
            // Handle error if needed
            //document.dispatchEvent(new CustomEvent('cart:close'));
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Error!",
            });
          },
        });
      }
    },
    error: function (error) {
      // Handle error if needed
      console.error("Error fetching cart data:", error);
    },
  });
}
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('cart:quantity.cart-page', function (evt) {
    var key = evt.detail[0];
    var qty = evt.detail[1];
    var el = evt.detail[2];
    var quantityInput = el.querySelector('.js-qty__num');
    var prevQty = parseInt(quantityInput.getAttribute('value'));
    if(prevQty > qty) {
      var action = 'minus';
    }
    else {
      var action = 'plus';
    }
    var comp_qty = parseInt(qty - prevQty);
  
    var dataEngravingValue = quantityInput.getAttribute('data-engraving');
    var dataProtectionValue = quantityInput.getAttribute('data-protection');
  
    if (dataEngravingValue && dataProtectionValue) {
      updateOtherProductQuantity(qty, dataEngravingValue, dataProtectionValue, action, comp_qty);
    }
    else if (dataEngravingValue) {
      updateOtherProductQuantity(qty, dataEngravingValue, false, action, comp_qty);
    }
    else if (dataProtectionValue) {
      updateOtherProductQuantity(qty, false, dataProtectionValue, action, comp_qty);
    }
  });

  // Function to update the quantity of the other product
  function updateOtherProductQuantity(quantity, dataEngravingValue, dataProtectionValue, action, comp_qty) {
    var requestData = {
      updates: {}
    };
  
    $('.overlay').show();
  
    // Fetch current cart information
    $.ajax({
      type: 'GET',
      url: '/cart.js',
      dataType: 'json',
      success: function (cartData) {
        // Get current quantities of EngravingProductId and ProtectionProductId
        var engravingProduct = cartData.items.find(item => item.variant_id == dataEngravingValue);
        var protectionProduct = cartData.items.find(item => item.variant_id == dataProtectionValue);
  console.log(protectionProduct);
        if (engravingProduct) {
          if(action == 'minus'){
            requestData.updates[dataEngravingValue] = engravingProduct.quantity + comp_qty;
            requestData.updates[dataEngravingValue].properties = engravingProduct.properties;
          }
          else {
            requestData.updates[dataEngravingValue] = engravingProduct.quantity + comp_qty;
            requestData.updates[dataEngravingValue].properties = engravingProduct.properties;
          }
        }
        
        if (protectionProduct) {
          if(action == 'minus'){
            requestData.updates[dataProtectionValue] = protectionProduct.quantity + comp_qty;
            requestData.updates[dataProtectionValue].properties = protectionProduct.properties;
          }
          else {
            requestData.updates[dataProtectionValue] = protectionProduct.quantity + comp_qty;
            requestData.updates[dataProtectionValue].properties = protectionProduct.properties;
          }
        }
  
        // Update cart quantities
        setTimeout(function(){
          $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            data: requestData,
            dataType: 'json',
            success: function (data) {
              document.dispatchEvent(new CustomEvent("cart:build"));
              $('.overlay').hide();
            },
            error: function (error) {
              // Handle error
              console.error('Error updating other product quantity:', error);
            }
          });
        }, 1000);
      },
      error: function (error) {
        // Handle error
        console.error('Error fetching cart data:', error);
      }
    });
  }
});