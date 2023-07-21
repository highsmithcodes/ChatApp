using System;

namespace backend
{
    public class Chat
    {
        public DateTime Timestamp { get; set; }

        public string Sender { get; set; }

        public string Message { get; set; }

        public Chat()
        {
            // Initialize the properties in the constructor
            Timestamp = DateTime.Now;
            Sender = string.Empty;
            Message = string.Empty;
        }
    }
}
