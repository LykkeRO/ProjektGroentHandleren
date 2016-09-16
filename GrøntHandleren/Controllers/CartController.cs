using GrøntHandleren.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GrøntHandleren.Controllers
{
    public class CartController : ApiController
    {
        private DataContext _db = new DataContext();

        [HttpPost]
        public IHttpActionResult CheckOutCart(CheckOutModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _db.Customers.Add(model.Customer);
            _db.SaveChanges();

            var LastOrder = _db.Orders.OrderByDescending(p => p.OrderId).FirstOrDefault();
            int OrderId = LastOrder == null ? 1 : LastOrder.OrderId + 1;

            foreach (var item in model.products)
            {
                _db.Orders.Add(new Order()
                {

                    CustomerId = model.Customer.Id,
                    OrderId = OrderId,
                    ProductId = item.Id,
                    Quantity = item.Quantity
                });

            }

            _db.SaveChanges();

            return Ok(model);
        }
    }

}