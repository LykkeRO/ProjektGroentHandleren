using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace GrøntHandleren.Models
{
    public class AuthRepository :IDisposable
    {

        private DataContext _ctx;
        private UserManager<IdentityUser> _userManager;

        public AuthRepository()
        {
            _ctx = new DataContext();
            _userManager = new UserManager<IdentityUser>(new UserStore<IdentityUser>(_ctx));
        }

        public async Task<IdentityResult> RegisterUser(UserModel userModel)
        {
            IdentityUser user = new IdentityUser
            {
                UserName = userModel.UserName
            };

            var result = await _userManager.CreateAsync(user, userModel.Password);

                return result;
        }

        public async Task<IdentityUser> FindUser(string UserName, string Password)
        {

            IdentityUser user = await _userManager.FindAsync(UserName, Password);
            return user;

        }

        public void Dispose()
        {

            _ctx.Dispose();
            _userManager.Dispose();


        }

    }
}