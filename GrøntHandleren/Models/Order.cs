using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace GrøntHandleren.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }

        public int ProductId { get; set; }
        public virtual Product Product { get; set; }

        public int Quantity { get; set; }
    
    }
}