const NodeMediaServer = require("node-media-server");
const dotenv = require("dotenv");
const Stream = require("../models/Stream");

// Load environment variables
dotenv.config();

// Ports
const rtmp_PORT = 1935;
const http_PORT = 8000;

// Media server configuration
const nmsConfig = {
    rtmp: {
      port: process.env.RTMP_PORT || rtmp_PORT,
      host: "127.0.0.1", // Bind to localhost
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: process.env.HTTP_PORT || http_PORT,
      host: "127.0.0.1",
      mediaroot: './media',
      allow_origin: '*'
    },
    trans: {
      ffmpeg: process.env.FFMPEG_PATH || 'ffmpeg',
      tasks: [
        {
          app: 'live',
          hls: true,
          hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
          dash: true,
          dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
        }
      ]
    }
};

// Initialize NodeMediaServer with the config
const nms = new NodeMediaServer(nmsConfig);

// Override the event handlers
NodeMediaServer.prototype.onPrePublish = async function (id, StreamPath, args) {
    console.log("[NodeEvent on prePublish]", `id=${id} StreamPath=${StreamPath}`);

    try {
        const parts = StreamPath ? StreamPath.split("/") : [];
        if (parts.length < 3) {
            console.error("Invalid StreamPath format:", StreamPath);
            let session = nms.getSession(id);
            session.reject();
            return;
        }

        const streamKey = parts[2];
        const stream = await Stream.findOne({ streamKey });

        if (!stream || stream.status === "ended") {
            let session = nms.getSession(id);
            session.reject();
        }
    } catch (error) {
        console.error("PrePublish error:", error);
        try {
            let session = nms.getSession(id);
            session.reject();
        } catch (sessionError) {
            console.error("Session error:", sessionError);
        }
    }
};

NodeMediaServer.prototype.onPostPlay = async function (id, StreamPath, args) {
    console.log("[NodeEvent on postPlay]", `id=${id} StreamPath=${StreamPath}`);
};

NodeMediaServer.prototype.onDonePublish = async function (id, StreamPath, args) {
    console.log("[NodeEvent on donePublish]", `id=${id} StreamPath=${StreamPath}`);

    try {
        const parts = StreamPath.split("/");
        if (parts.length < 3) {
            console.error("Invalid StreamPath format:", StreamPath);
            return;
        }
        const streamKey = parts[2];
        const stream = await Stream.findOne({ streamKey });

        if (stream) {
            stream.isLive = false;
            stream.status = "ended";
            stream.endTime = new Date();
            await stream.save();
        }
    } catch (error) {
        console.error("DonePublish error:", error);
    }
};

// Start the server first
nms.run();
console.log("Node-Media-Server is running...");






  











        

