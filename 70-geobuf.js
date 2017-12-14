var Pbf = require("pbf");
var geobuf = require("geobuf");

module.exports = function(RED) {
  function Geobuf(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function(msg) {
      if (!msg.payload) {
        node.warn("No payload found");
        return; 
      }
      if (Buffer.isBuffer(msg.payload)) {
        try {
          msg.payload = geobuf.decode(new Pbf(msg.payload));
        } catch (e) {
          node.error("Error while decoding geobuf payload: " + e.message);
          return;
        }
      } else {
        try {
          //var pbf = new Pbf();
          msg.payload = Buffer.from(geobuf.encode(msg.payload, new Pbf()));
        } catch (e) {
          node.error("Error while encoding payload to geobuf: " + e.message);
          return;
        }
      }

      node.send(msg);
    });
  }

  RED.nodes.registerType("geobuf", Geobuf);
}