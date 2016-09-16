$(document).ready(function () {

    var prefix = "Grønthandler-";
    var cartName = prefix + "cart";
    var total = prefix + "total";
    var storage = localStorage; //sessionStorage og localStorage

    function createCart() {
        if (storage.getItem(cartName) == null) {

            var cart = {}
            cart.products = [];

            storage.setItem(cartName, JSON.stringify(cart));
            storage.setItem(total, "0");
        }
    }

    createCart();
    updateCart();

    function AddToCart(product) {
        var cart = storage.getItem(cartName);
        var cartObject = JSON.parse(cart);
        var products = cartObject.products;

        var duplicates = $.grep(products, function (ele) {
            return ele.id == product.id;
        });

        if (duplicates.length > 0) {
            //Eksistere allerede 
            var index = products.findIndex(function (obj) {

                return obj.id == product.id;

            });

            products[index].quantity = products[index].quantity + 1;

        }

        else {
            //Eksistere ikke 
            products.push(product);
        }

        storage.setItem(cartName, JSON.stringify(cartObject));
        updateCart();
    }

    function updateCart() {

        var cart = storage.getItem(cartName);
        var cartObject = JSON.parse(cart);
        var subTotal = 0;
        $('#cartList').empty();

        $.each(cartObject.products, function (key, item) {
            $('<li>', { class: "list-group-item", html: "<a href='#' class='btn btn-danger btn-xs deleteCartProduct' data-id='" + item.id + "'>x</a> " + item.name + "(" + item.quantity + ")<span class='pull-right'>" + (item.price * item.quantity) + "kr,-</span>" })
            .appendTo($('#cartList'));


            $('.deleteCartProduct').on("click", function () {

                var cart = storage.getItem(cartName);
                var cartObject = JSON.parse(cart);
                var products = cartObject.products;
                var deleteId = $(this).data('id');

                for (var i = 0; i < products.length; i++) {
                    var product = products[i];
                    if (product.id == deleteId) {
                        products.splice(i, 1);

                    }

                }

                var updatedCart = {};
                updatedCart.products = products;

                storage.setItem(cartName, JSON.stringify(updatedCart));
                $(this).parents("li").remove();
                updateCart();
            });

            subTotal += item.quantity * item.price;

        });

        $('<li>', { class: "list-group-item", html: "Total: <span class='pull-right'><b>" + subTotal + " " + "kr,-</span></b>" })
        .appendTo($("#cartList"));

    }

    $('#resetcart').on("click", function () {
        var result = confirm("er du sikker på du vil tømme din kurv?");
        if (result == true) {

            storage.clear();
            createCart();
            updateCart();
        }

    });

    $('#checkOut').on("click", function () {
        var cart = storage.getItem(cartName);
        var cartObject = JSON.parse(cart);

        cartObject["Customer"] = getFormData($('#customerInfo'));
        console.log(cartObject);
        $.ajax({
            url: 'api/Cart/',
            method: 'POST',
            data: JSON.stringify(cartObject),
            contentType: "application/json"
        }).done(function (data) {
            alert("Tak for din bestilling");
            storage.clear();
            createCart();
            updateCart();
        })
    });


    function getFormData($form) {
        var formArray = $form.serializeArray();
        var formObject = {};

        $.map(formArray, function (element, index) {

            formObject[element['name']] = element['value'];

        });

        return formObject;
    }

    function GetProducts() {
        $('#products').empty();

            $.ajax
            ({
                url: "api/products"
            })
            .done(function (data) {
            $.each(data, function (key, item) {
                $('<li>', { class: 'list-group-item', text: RenderText(item) })

                    .append($('<a>', { class: 'btn btn-danger btn-xs pull-right deleteProduct', "data-id": item.Id, text: "Slet", href: "#" }))
                    .append($('<a>', { class: 'btn btn-primary btn-xs pull-right updateProduct', "data-id": item.Id, text: "Rediger", href: "#" }))
                    .append($('<a>', { class: 'btn btn-success btn-xs pull-right buyProduct', "data-id": item.Id, "data-Name": item.Name, "data-price": item.Price, "data-quantity": 1, text: "Køb", href: "#" }))

                    .appendTo($('#products'));
            });


            $('.deleteProduct').on("click", function () {
                var logindata = JSON.parse(storage.getItem("authorizationData"));
                var id = $(this).data().id;
                $.ajax
                ({
                    url: "api/products/" + id,
                    method: "DELETE",
                    headers: {
                    "Authorization" : "Bearer " + logindata.token
                }
                }).done(function (data) {

                    GetProducts();
                });
            });



            $('.updateProduct').on("click", function () {
                var id = $(this).data().id;
                $.ajax({
                    url: "api/products/" + id,
                    method: "GET"
                }).done(function (data) {
                    $('#UpId').val(data.Id);
                    $('#UpName').val(data.Name);
                    $('#UpPrice').val(data.Price);
                });

            });



            $('.buyProduct').on("click", function () {
                var data = $(this).data();
                AddToCart(data);
            });
        });
    }

    GetProducts();


    $('#btnCreate').on("click", function () {
        var data = $('#createProduct').serialize();
        
        $.ajax({
            url: "api/products",
            method: "POST",
            data: data, data,
            headers: {
                "Authorization" : "Bearer " + logindata.token
            }

        })
        .done(function (data) {
            GetProducts();

        });
    });


    $('#btnUpdate').on("click", function () {
        var data = $('#updateProduct').serialize();
        var logindata = JSON.parse(storage.getItem("authorizationData"));
        $.ajax
        ({
            url: "api/products",
            method: "PUT",
            data: data,
            headers: {
                "Authorization": "Bearer " + logindata.token
            }

        })

        .done(function (data) {
            GetProducts();

        });


    });



    function GetFaktura() {

        $.ajax({
            url: "api/orders"
        })
       .done(function (data) {

           $.each(data, function (key, item) {
               $('<tr>', { html: RenderFaktura(item) })
               .appendTo($('#fakturaListe'));

           });

           $('.orders').on("click", function () {
               var id = $(this).data().id;
               $.ajax({
                   url: "api/orders/" + id,
                   method: "GET"
               }).done(function (data) {
                   console.log(data);
                   $('#OrderModal').modal();
                   $('#OrderModal .modal-body').empty();

                   $('#OrderModal .modal-title').html("Order #" + data.OrderId);

                   var information =
                   "<adress><b>" + data.Customer.FirstName + " " + data.Customer.LastName + "</b><br/>" +
                   data.Customer.Adress + "<br />" + data.Customer.ZipCode + " " + data.Customer.City + "<br/>" +
                   "<b>" + data.Customer.Email + "</b><br/></adress><br/>";

                   $('#OrderModal .modal-body').append(information);

                   var ordertable = $('<table>', { class: "table table-bordered" }).append('<tbody>')

                   ordertable.append('<thead>' + '<tr><th>' + "id" + '</th><th>' + "Navn" + '</th><th>' + "Antal " + '</th><th>' + "Pris" + '</th><th>' + "Total Pris" + '</th></tr></thead>');


                   $.each(data.products, function (key, product) {
                       console.log(product);
                       $('<tr>')
                       .append('<td>' + product.Id + '</td><td>' + product.Name + '</td><td>' + product.Quantity + '</td><td>' + product.Price + '</td><td><b>' + product.Quantity * product.Price + '</b></td>')
                       .appendTo(ordertable);
                   });

                   ordertable.append('<tfoot><td></td><td></td><td></td><td></td><td>' + data.TotalPrice + ' </td></tfoot>')

                   $('#OrderModal .modal-body').append(ordertable);
               });

           });
       });
    }

    GetFaktura();

    $('#btnRegister').on('click', function () {
        alert();
        var data = getFormData($('#registerForm'))
        $.ajax({
            url: "api/Account/Register",
            data: data,
            method: "POST"
        }).done(function (data) {

            console.log(data);
        });

    });

    $('#btnlogin').on("click", function () {

        var data = getFormData($('#loginForm'));
        data["grant_type"] = "password";

        $.ajax({
            url: "token",
            method: "POST",
            data: data,
            headers: {
                'content-Type': 'application/x-www-form-urlencoded'
            }
        }).done(function (data) {
            storage.setItem("authorizationData", JSON.stringify({ token: data.access_token, userName: data.UserName }));
            location.reload();
        });

    });
    $('#logud').on('click', function () {
        logout();
    });
    function logout() {

        storage.removeItem('authorizationData');
        location.reload();
    }

    function CheckAuthorizeFields() {

        var authorize = JSON.parse(storage.getItem("authorizationData"));

        if (authorize == null) {
            $('.authorize').remove();
        }

        if (authorize != null) {

            $('.removedOnLogedIn').remove();
        }
    }

    CheckAuthorizeFields();

    function RenderText(item) {
        return item.Name + " " + item.Price + " " + "kr,-";

    }

    function RenderFaktura(item) {
        console.log(item);
        return "<td>" + item.Customer.FirstName + " " + item.Customer.LastName + "</td>\
            <td>" + item.Customer.Adress + " " + item.Customer.ZipCode + " " + item.Customer.City + "</td>\
            <td>" + item.TotalPrice + "</td>\
           <td><a href='#' class='btn btn-primary btn-xs orders' data-id='" + item.OrderId + "'>Vis</a></td>";
    }

});