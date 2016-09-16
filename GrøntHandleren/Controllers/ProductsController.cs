using GrøntHandleren.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GrøntHandleren.Controllers
{
    public class ProductsController : ApiController
    {
        private DataContext _db = new DataContext();


        [HttpGet]
        public List<Product> GetAll()
        {
            return _db.Products.OrderBy(p => p.Id).ToList();
        }

        [HttpGet]
        public IHttpActionResult GetById(int Id)
        {
            Product product = _db.Products.Where(p => p.Id == Id).FirstOrDefault();

            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
            }

        [HttpPost]
        [Authorize]
        public IHttpActionResult CreateProduct(Product model)
        {
            if (!ModelState.IsValid)
            {

                return BadRequest(ModelState);
            }

            _db.Products.Add(model);
            _db.SaveChanges();

            return Ok(model);


        }

        [HttpPut]
        [Authorize]
        public IHttpActionResult UpdateProduct(Product model)
        {


            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _db.Entry(model).State = System.Data.Entity.EntityState.Modified;
            _db.SaveChanges();
            
            return Ok(model);

        }


        [HttpDelete]
        [Authorize]
        public IHttpActionResult DeleteProduct(int Id)
        {

            Product product = _db.Products.Where(p => p.Id == Id).FirstOrDefault();
            if (product == null)
            {
                return NotFound();
            }

            _db.Products.Remove(product);
            _db.SaveChanges();

            return Ok(product);
        }

    }
}
