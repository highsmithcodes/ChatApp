using System;
using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        // Concurrent dictionary to store WebSocket connections
        private static ConcurrentDictionary<string, WebSocket> _connections = new ConcurrentDictionary<string, WebSocket>();

        // WebSocket endpoint
        [HttpGet("ws")]
        public async Task<IActionResult> WebSocket()
        {
            if (HttpContext.WebSockets.IsWebSocketRequest)
            {
                WebSocket webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
                // Generate a unique connection ID (you may use other methods to identify users)
                string connectionId = Guid.NewGuid().ToString();

                // Store the WebSocket connection using the connectionId
                _connections.TryAdd(connectionId, webSocket);

                try
                {
                    await HandleWebSocket(connectionId, webSocket);
                }
                finally
                {
                    // Remove the WebSocket connection when the client disconnects
                    _connections.TryRemove(connectionId, out _);
                    webSocket.Dispose();
                }
            }
            else
            {
                HttpContext.Response.StatusCode = 400;
            }

            return new EmptyResult();
        }

        private async Task HandleWebSocket(string connectionId, WebSocket webSocket)
        {
            var buffer = new byte[1024 * 4];

            while (webSocket.State == WebSocketState.Open)
            {
                // Receive data from the WebSocket
                WebSocketReceiveResult result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Text)
                {
                    // Process and handle the received message
                    // For example, you can broadcast it to other connected users
                    string message = System.Text.Encoding.UTF8.GetString(buffer, 0, result.Count);
                    await BroadcastMessage(connectionId, message);
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "WebSocket connection closed", CancellationToken.None);
                }
            }
        }

        private async Task BroadcastMessage(string senderConnectionId, string message)
        {
            // Broadcast the message to all connected users except the sender
            foreach (var connection in _connections)
            {
                if (connection.Key != senderConnectionId && connection.Value.State == WebSocketState.Open)
                {
                    var messageBytes = System.Text.Encoding.UTF8.GetBytes(message);
                    await connection.Value.SendAsync(new ArraySegment<byte>(messageBytes), WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }
    }
}
