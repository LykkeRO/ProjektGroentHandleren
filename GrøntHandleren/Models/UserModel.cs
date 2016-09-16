using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GrøntHandleren.Models
{
    public class UserModel
    {
        [Required]
        public string UserName { get; set; }

        [Required]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "Password og Confirmpassword passer ikke")]
        public string ConfirmPassword { get; set; }



    }
}