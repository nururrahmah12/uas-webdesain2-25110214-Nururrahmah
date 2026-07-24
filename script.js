console.log("Script jalan");
function updateCartFabVisibility(namaHalaman){
    var fab = document.getElementById("cartFab");
    if(!fab) return;

    if(namaHalaman === "menu"){
        fab.classList.remove("cart-fab-hidden");
    } else {
        fab.classList.add("cart-fab-hidden");
    }
}

function pindahHalaman(namaHalaman){

    console.log("Pindah ke:", namaHalaman);

    document.querySelectorAll(".page-view").forEach(function(page){
        page.classList.remove("active");
    });

    document.getElementById("page-" + namaHalaman).classList.add("active");

    document.querySelectorAll(".nav-link-page").forEach(function(link){
        link.classList.remove("active");
    });

    document.querySelector('[data-page="' + namaHalaman + '"]').classList.add("active");

    updateCartFabVisibility(namaHalaman);
}

document.querySelectorAll("[data-page]").forEach(function(link){

    link.addEventListener("click", function(e){

        e.preventDefault();

        pindahHalaman(this.dataset.page);

    });

});

$(function(){

  $("#orderModal, #cartModal, #cartFab").appendTo("body");

  var halamanAwal = document.querySelector(".page-view.active");
  updateCartFabVisibility(halamanAwal ? halamanAwal.id.replace("page-", "") : "");

  var cart = [];
  var nextId = 1;

  function formatRp(num){
    return "Rp" + num.toLocaleString("id-ID");
  }

  function updateSubtotal(){
    var price = parseInt($("#orderItemPrice").val()) || 0;
    var qty = parseInt($("#custQty").val()) || 0;
    $("#orderSubtotal").text("Subtotal: " + formatRp(price * qty));
  }
  $("#custQty").on("input", updateSubtotal);

  $(".btn-pesan").on("click", function(){
    var name = $(this).data("name");
    var price = $(this).data("price");

    $("#orderItemId").val("");
    $("#orderItemName").val(name);
    $("#orderItemPrice").val(price);
    $("#custName").val("");
    $("#custQty").val(1);
    $("#custNote").val("");
    $("input[name='payMethod']").prop("checked", false);
    $("#payCash").prop("checked", true);

    $("#orderModalTitle").text("Pesan: " + name);
    $("#saveOrderBtn").text("Tambah ke Keranjang");
    updateSubtotal();

    $("#orderModal").modal("show");
  });

  $("#saveOrderBtn").on("click", function(){
    var custName = $("#custName").val().trim();
    var qty = parseInt($("#custQty").val());

    if(!custName){
      alert("Nama pelanggan wajib diisi.");
      return;
    }
    if(!qty || qty < 1){
      alert("Jumlah pesanan minimal 1.");
      return;
    }

    var id = $("#orderItemId").val();
    var item = {
      name: $("#orderItemName").val(),
      price: parseInt($("#orderItemPrice").val()),
      custName: custName,
      qty: qty,
      payment: $("input[name='payMethod']:checked").val(),
      note: $("#custNote").val().trim()
    };

    if(id){
    
      item.id = parseInt(id);
      var idx = cart.findIndex(function(c){ return c.id === item.id; });
      if(idx > -1) cart[idx] = item;
    } else {
    
      item.id = nextId++;
      cart.push(item);
    }

    renderCart();
    $("#orderModal").modal("hide");
  });


  function renderCart(){
    $("#cartCount").text(cart.length);

    if(cart.length === 0){
      $("#cartList").html('<p class="text-muted mb-0" id="cartEmptyMsg">Keranjang masih kosong.</p>');
      $("#cartTotal").text("Total: Rp0");
      return;
    }

    var html = "";
    var total = 0;
    cart.forEach(function(item){
      var subtotal = item.price * item.qty;
      total += subtotal;
      html += '<div class="cart-item" data-id="' + item.id + '">' +
        '<div class="d-flex justify-content-between">' +
          '<strong>' + item.name + '</strong>' +
          '<span class="text-danger font-weight-bold">' + formatRp(subtotal) + '</span>' +
        '</div>' +
        '<small>Pelanggan: ' + item.custName + ' &middot; Jumlah: ' + item.qty + ' &middot; Bayar: ' + item.payment + '</small><br>' +
        (item.note ? '<small>Catatan: ' + item.note + '</small><br>' : '') +
        '<div class="mt-2">' +
          '<button class="btn btn-sm btn-outline-primary btn-edit-item" data-id="' + item.id + '">Edit</button> ' +
          '<button class="btn btn-sm btn-outline-danger btn-remove-item" data-id="' + item.id + '">Hapus</button>' +
        '</div>' +
      '</div>';
    });

    $("#cartList").html(html);
    $("#cartTotal").text("Total: " + formatRp(total));
  }


  $(document).on("click", ".btn-edit-item", function(){
    var id = parseInt($(this).data("id"));
    var item = cart.find(function(c){ return c.id === id; });
    if(!item) return;

    $("#orderItemId").val(item.id);
    $("#orderItemName").val(item.name);
    $("#orderItemPrice").val(item.price);
    $("#custName").val(item.custName);
    $("#custQty").val(item.qty);
    $("#custNote").val(item.note);
    $("input[name='payMethod']").prop("checked", false);
    $("input[name='payMethod'][value='" + item.payment + "']").prop("checked", true);

    $("#orderModalTitle").text("Edit Pesanan: " + item.name);
    $("#saveOrderBtn").text("Simpan Perubahan");
    updateSubtotal();

    $("#cartModal").modal("hide");
    $("#orderModal").modal("show");
  });


  $(document).on("click", ".btn-remove-item", function(){
    var id = parseInt($(this).data("id"));
    cart = cart.filter(function(c){ return c.id !== id; });
    renderCart();
  });

  $(document).on("click", "#cartModal .modal-footer .btn-primary", function(){
    if(cart.length === 0){
      alert("Keranjang masih kosong. Silakan pesan menu terlebih dahulu.");
      return;
    }

    var ringkasan = "Rincian Pesanan:\n\n";
    var total = 0;
    cart.forEach(function(item){
      var subtotal = item.price * item.qty;
      total += subtotal;
      ringkasan += "- " + item.qty + "x " + item.name + " (" + formatRp(subtotal) + ")\n";
      ringkasan += "  Pelanggan: " + item.custName + " | Bayar: " + item.payment + "\n";
    });
    ringkasan += "\nTotal Bayar: " + formatRp(total);

    alert("Checkout Berhasil!\n\n" + ringkasan);

    cart = [];
    renderCart();
    $("#cartModal").modal("hide");
  });

  renderCart();
});
