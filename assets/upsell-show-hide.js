<script>
  jQuery(document).ready(function($){
    $('.upsell_button_gtm').on('click', function(e){
    e.preventDefault();
   
    var id = $(this).attr('data-product-id');
    var q = 1;
    var ajax = {
        type: "POST",
        url: "/cart/add.js",
        data: "quantity=" + q + "&id=" + id,
        dataType: "json",
        success: function (n) {
          document.dispatchEvent(new CustomEvent('cart:build'));
          document.dispatchEvent(new CustomEvent('ajaxProduct:added'));
         
        },
        error: function (n, c) {
           console.log('fail');
        }
     };
    jQuery.ajax(ajax)  
     })
   })

  function upsell_item_added_to_cart(cart_obj){
    var item_exists = false;
    var item_added = 0;
    var response = cart_obj.forEach(function(cart_item){
      var hidden_product = '';
      $('.upsell-collection').find('.upsell-product-inner').each(function(){
           hidden_product = $(this).attr('product-id');
        if($(this).hasClass('hide')){
           hidden_product += $(this).attr('product-id')+', ';
        }
      });

      // console.log(hidden_product);
      if(hidden_product.indexOf(cart_item.id) != 1){
         item_exists = true;
         item_added = cart_item.id;
       }
      
       if(cart_item.id == hidden_product){
         item_exists = true;
         item_id = '.upsell_product-'+hidden_product;
         item_show_hide(item_exists, item_id);
       }
    });
  
  // if(item_exists == true){     
    //    const element = document.querySelector(".upsell_product-"+item_added);
    //     element.classList.add('hide').remove('show');
    //     // console.log(document.querySelector('.upsell_product-22085112528978'));
    //    }
    //   else{
    //   // console.log('no');
    //    document.querySelector('.upsell_product-'+item_added).classList.remove('hide').add('show');
    //   } 
  }

  function item_show_hide(item_exists, item_id){
    console.log(item_exists +' '+ item_id);
      if(item_exists == true){     
       const element = document.querySelector(item_id);
        element.classList.add('hide');
        element.classList.remove('show');
        // console.log(document.querySelector('.upsell_product-22085112528978'));
       }
      else{
      // console.log('no');
       document.querySelector(item_id).classList.remove('hide');
        document.querySelector(item_id).classList.add('show');
      } 
  }
  
document.addEventListener('cart:updated', function(evt) {
  var cart_obj = evt.detail.cart.items;  
   upsell_item_added_to_cart(cart_obj);
});

document.addEventListener('ajaxProduct:added', function(evt) { 
  jQuery.getJSON('/cart.js', function(cart) {
      var cart_obj = cart.items;  
      upsell_item_added_to_cart(cart_obj);
  }); 
});

  
</script>
  