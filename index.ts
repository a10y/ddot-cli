import mqtt from "mqtt";
import { spawnSync } from "child_process";
import * as readline from "readline";
import { stdin as input, stdout as output } from "process";

/**
 * Grabbed this from main.js on the ddot page
 */
const ENV = {
    production: true,
    websocketEndpoint: 'b-8c165eea-0974-40be-9e62-ad394d480541-1.mq.us-east-1.amazonaws.com',
    websocketUsername: 'dcdot',
    websocketPassword: 'cctvddotpublic',
    websocketPrefix: 'DDOT',
    s3Bucket: 'citizen-dcdot-uat',
    apiEndpoint: 'http://citizen.skylinecsg.com/',
    facebookAppId: '188584555117393',
    showAboutUs: true,
    introVideoLink: false,
    camerasToLoad: ['New York Ave. and Bladensburg Rd. NE', '7th St. & E St. & Frontage Rd. SW', 'Kenilworth and Eastern Ave. NE'],
    map: {
        layers: {
            Cameras: true,
            Incidents: true,
            Traffic: false,
            Weather: true,
            AVL: false,
            'Pavement Sensors': false,
            Bluetoad: false,
        },
    },
};

const client = mqtt.connect("wss://" + ENV.websocketEndpoint, {
    username: ENV.websocketUsername,
    password: ENV.websocketPassword,
    port: 61619,
});
client.on("connect", packet => {
    console.log("!!!connected!!!");
    console.log(packet);
})
client.subscribe(ENV.websocketPrefix + "/Camera");
client.on("message", (topic, payload, packet) => {
    const cameras = JSON.parse(payload.toString("utf-8"));
    for (let key of Object.keys(cameras)) {
        if (key == "action") {
            continue;
        }
        console.log(`${key} => ${cameras[key].title}`);
    }
    const rl = readline.createInterface({ input, output });
    rl.question("> ", (selection) => {
        const camera = cameras[selection];
        const proc = spawnSync("/usr/local/bin/ffplay", [`http://${camera.host}/rtplive/${camera.stream}/playlist.m3u8`], {
            encoding: "utf-8",
        });
        if (proc.error) {
            console.error(proc.error);
        }
        console.log(proc.stdout);
        console.error(proc.stderr);
    });
});
