using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GrøntHandleren.Models
{
    public class CheckOutModel
    {
        public Customer Customer { get; set; }
        public List<CartProduct> products { get; set; }

        public int OrderId { get; set; }
        public decimal TotalPrice { get; set; }
    }

    public class CartProduct
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}