namespace asd123.Helpers
{
    public class ResponseData
    {
        public string Status { get; set; }
        public object Result { get; set; }
        public ResponseData() { }
        public ResponseData(string status, object data)
        {
            Status = status;
            Result = data;
        }
    }
}
