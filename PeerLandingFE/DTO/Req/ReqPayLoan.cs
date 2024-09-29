namespace PeerLandingFE.DTO.Req
{
    public class ReqPayLoan
    {
        public string LoanId { get; set; }
        public IEnumerable<DateTime> RepaidAt { get; set; }
    }
}
