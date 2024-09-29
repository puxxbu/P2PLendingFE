using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.DTO.Req
{
    public class ReqAddLoanDto 
    {
        public decimal Amount{ get; set; }
        public decimal InterestRate { get; set; }
    }
}
