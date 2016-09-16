using GrøntHandleren.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GrøntHandleren.Controllers
{
    public class OrdersController : ApiController
    {
        private DataContext _db = new DataContext();

        public List<CheckOutModel> GetOrders()
        {

            List<CheckOutModel> model = new List<CheckOutModel>();

            var orders = _db.Orders.GroupBy(p => p.OrderId).Select(p => p).ToList();
            
            foreach(var order in orders)
            {
                CheckOutModel newOrder = new CheckOutModel();

                newOrder.Customer = order.FirstOrDefault().Customer;
                newOrder.OrderId = order.FirstOrDefault().OrderId;

                newOrder.products = new List<CartProduct>();
                newOrder.TotalPrice = 0;

                foreach(var product in order)
                {
                    newOrder.products.Add(new CartProduct()
                    {

                        Id = product.ProductId,
                        Name = product.Product.Name,
                        Price = product.Product.Price,
                        Quantity = product.Quantity
                    });
                    newOrder.TotalPrice += product.Product.Price * product.Quantity;
                }

                model.Add(newOrder);

            }

            return model;


        }

        public IHttpActionResult GetOrderById(int Id)
        {

            CheckOutModel model = new CheckOutModel();

            var orders = _db.Orders.Where(p => p.OrderId == Id).GroupBy(p => p.OrderId).Select(p => p).ToList();

            foreach (var order in orders)
            {
                model.Customer = order.FirstOrDefault().Customer;
                model.OrderId = order.FirstOrDefault().OrderId;

                model.products = new List<CartProduct>();
                model.TotalPrice = 0;

                foreach (var product in order)
                {
                    model.products.Add(new CartProduct()
                    {

                        Id = product.ProductId,
                        Name = product.Product.Name,
                        Price = product.Product.Price,
                        Quantity = product.Quantity
                    });
                    model.TotalPrice += product.Product.Price * product.Quantity;
                }
            }

            return Ok (model);


        }
    }

}