using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.DTO.Res
{
    public class ResMstUserDto { 
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role{ get; set; }
        public decimal Balance { get; set; }
    }
  
}
