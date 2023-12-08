

exports.handleJsonMessage = async function handleJsonMessage(jsonMessage) {
  try {
    const parsedMessage = JSON.parse(jsonMessage);
    if (parsedMessage && parsedMessage.type  ) {
      const type = parsedMessage.type;

      if(type == "monitoring" || type == "warning"){
        console.log("[Incoming] Monitoring / Warning Message ");
      }
      else if(type == "capture"){

      }
      
    } else {
      console.error(
        "Invalid JSON message format. Missing clientId or payload."
      );
    }
  } catch (error) {
    console.error("Error parsing JSON message:", error.message);
  }
};
