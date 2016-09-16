using GrøntHandleren.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace GrøntHandleren.Controllers
{
    [RoutePrefix("api/Account")]

    public class AccountController : ApiController
    {
        private AuthRepository _repo = null;

        public AccountController()
        {
            _repo = new AuthRepository();
        }

        [Route("Register")]

        public async Task<IHttpActionResult> Register(UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _repo.RegisterUser(userModel);

            return GetErrorResult(result);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }
            if (result.Errors != null && result.Errors.Count() > 0)
            {
                foreach (string error in result.Errors)
                {
                    ModelState.AddModelError("", error);
                }
                return BadRequest(ModelState);
            }

            if (result.Succeeded)
            {
                return Ok();
            }

            return null;
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing){
                _repo.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
