using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace GrøntHandleren.Models
{
    public class DataContext : IdentityDbContext<IdentityUser>
    {
        public DataContext() : base("DefaultConnection")
        {


        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Order> Orders { get; set; }

    }
}