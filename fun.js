let alvo = { lat: -0.49554, lon: -0.85541 };
let sgn = atob("aHR0cDovLzE5Mi4xNjguMS4yMjIvaW5kZXguc2h0bWw/U2duPTIwNDA=");
const DEBUG = false;
if (DEBUG) {
    alvo.lat = -0.48095;
    alvo.lon = -0.84647;
    sgn = atob("aHR0cDovLzE5Mi4xNjguMC4xODAvaW5kZXguc2h0bWw/U2duPTIwNDA=");
}


const RAIO_ON = 100;
const RAIO_OFF = 120;
let dentro = false;
let cont = 0;
const status = document.getElementById("status");
const btn = document.getElementById("btn");
const extra = document.getElementById("extra");
const toRad = x => x * Math.PI / 180;
function distancia(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1);
    const dLon = (lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1)) * Math.cos((lat2)) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function verificar(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const acc = pos.coords.accuracy;
    const dist = distancia(toRad(lat), toRad(lon), alvo.lat, alvo.lon) / 1000;
    cont++;
    status.innerText = "Distância: " + dist.toFixed(3) + " km " +
        (acc > 50 ? " ⚠️ GPS impreciso" : "");;
    extra.innerText =
        "Lat: " + lat.toFixed(4) +
        " | Lon: " + lon.toFixed(4) +
        " | Prec: " + acc.toFixed(0) + "m" +
        " | #" + cont;
    if (acc > 50) {
        //  status.innerText += "GPS impreciso...";
        //   return;
    }
    if (!dentro && dist < RAIO_ON) {
        dentro = true;
        btn.disabled = false;
        btn.innerText = "Liberado ✅";
        btn.classList.add("enabled");
    }
    if (dentro && dist > RAIO_OFF) {
        dentro = false;
        btn.disabled = true;
        btn.innerText = "Bloqueado ❌";
        btn.classList.remove("enabled");
    }
}

function erro(e) {
    btn.disabled = true;
    btn.innerText = "Erro GPS ❌";
    status.innerText = "Erro: " + e.message;
}

function Pulse() {
    fetch(sgn)
        .then(() => console.log("Pulso enviado"))
        .catch(err => console.log("Erro:", err));
}

navigator.geolocation.watchPosition(verificar, erro, {
    enableHighAccuracy: true
});