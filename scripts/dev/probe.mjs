const pages = await (await fetch("http://127.0.0.1:9333/json")).json();
const ws = new WebSocket(pages.find((p) => p.type === "page" && p.url.startsWith("https://localhost")).webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r, { once: true }));
let id = 0;
const ev = (expression) =>
  new Promise((res) => {
    const my = ++id;
    ws.addEventListener("message", function h(e) {
      const m = JSON.parse(e.data);
      if (m.id === my) {
        ws.removeEventListener("message", h);
        res(m.result?.result?.value ?? m.result);
      }
    });
    ws.send(JSON.stringify({ id: my, method: "Runtime.evaluate", params: { expression, returnByValue: true, awaitPromise: true } }));
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
console.log(await ev(process.argv[2]));
if (process.argv[3]) {
  await sleep(1200);
  console.log(await ev(process.argv[3]));
}
ws.close();
