(() => {

    const root = document.querySelector("#lineaer-funksjon");
    if (!root) return;

    const canvas = root.querySelector("#lfCanvas");
    const ctx = canvas.getContext("2d");

    // Glidebrytere
    const aSlider = root.querySelector("#lfA");
    const bSlider = root.querySelector("#lfB");

    // Visning av verdier
    const aVerdi = root.querySelector("#lfAVerdi");
    const bVerdi = root.querySelector("#lfBVerdi");

    const funksjonsuttrykk = root.querySelector(
        "#lfFunksjonsuttrykk"
    );

    // Canvas med høy oppløsning
    const scale = 2;

    const W = canvas.width / scale;
    const H = canvas.height / scale;

    ctx.scale(scale, scale);

// Samme målestokk langs begge aksene
const enhet = 40;

// Koordinatsystemets grenser
const xMin = -6;
const xMax = 6;

const yMin = -3;
const yMax = 4;

// Plasser origo slik at koordinatsystemet er sentrert
const origoX = W / 2;
const origoY = H / 2 + (yMin + yMax) * enhet / 2;


    // ----------------------------------------
    // OMREGNING TIL PIKSLER
    // ----------------------------------------

    function X(x) {
        return origoX + x * enhet;
    }

    function Y(y) {
        return origoY - y * enhet;
    }


    // ----------------------------------------
    // FORMATER TALL MED DESIMALKOMMA
    // ----------------------------------------

    function formatTall(tall) {

        return tall.toLocaleString("nb-NO", {
            maximumFractionDigits: 1
        });
    }


    // ----------------------------------------
    // TEGN RUTENETT
    // ----------------------------------------

    function tegnRutenett() {

        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 1;

        // Vertikale linjer
        for (let x = xMin; x <= xMax; x++) {

            ctx.beginPath();

            ctx.moveTo(X(x), Y(yMin));
            ctx.lineTo(X(x), Y(yMax));

            ctx.stroke();
        }

        // Horisontale linjer
        for (let y = yMin; y <= yMax; y++) {

            ctx.beginPath();

            ctx.moveTo(X(xMin), Y(y));
            ctx.lineTo(X(xMax), Y(y));

            ctx.stroke();
        }
    }


    // ----------------------------------------
    // TEGN AKSER
    // ----------------------------------------

    function tegnAkser() {

        ctx.strokeStyle = "#334155";
        ctx.fillStyle = "#334155";
        ctx.lineWidth = 1.5;

        // x-aksen
        ctx.beginPath();

        ctx.moveTo(X(xMin), Y(0));
        ctx.lineTo(X(xMax), Y(0));

        ctx.stroke();

        // y-aksen
        ctx.beginPath();

        ctx.moveTo(X(0), Y(yMin));
        ctx.lineTo(X(0), Y(yMax));

        ctx.stroke();

        // Pil på x-aksen
        ctx.beginPath();

        ctx.moveTo(X(xMax), Y(0));
        ctx.lineTo(X(xMax) - 9, Y(0) - 4);
        ctx.lineTo(X(xMax) - 9, Y(0) + 4);

        ctx.closePath();
        ctx.fill();

        // Pil på y-aksen
        ctx.beginPath();

        ctx.moveTo(X(0), Y(yMax));
        ctx.lineTo(X(0) - 4, Y(yMax) + 9);
        ctx.lineTo(X(0) + 4, Y(yMax) + 9);

        ctx.closePath();
        ctx.fill();

        // Aksenavn
        ctx.font = "italic 16px Georgia";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";

        ctx.fillText("x", X(xMax) - 10, Y(0) - 12);
        ctx.fillText("y", X(0) + 12, Y(yMax) + 12);
    }


    // ----------------------------------------
    // TEGN TALL LANGS AKSENE
    // ----------------------------------------

    function tegnTall() {

        ctx.fillStyle = "#475569";
        ctx.font = "12px Arial";

        // Tall langs x-aksen
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        for (let x = xMin + 1; x < xMax; x++) {

            if (x === 0) continue;

            ctx.fillText(
                x,
                X(x),
                Y(0) + 8
            );
        }

        // Tall langs y-aksen
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        for (let y = yMin + 1; y < yMax; y++) {

            if (y === 0) continue;

            ctx.fillText(
                y,
                X(0) - 8,
                Y(y)
            );
        }

        // Origo
        ctx.fillText(
            "0",
            X(0) - 8,
            Y(0) + 14
        );

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }


    // ----------------------------------------
    // TEGN DEN LINEÆRE FUNKSJONEN
    // ----------------------------------------

    function tegnFunksjon(a, b) {

        ctx.save();

        // Avgrens grafen til koordinatsystemet
        ctx.beginPath();

        ctx.rect(
            X(xMin),
            Y(yMax),
            (xMax - xMin) * enhet,
            (yMax - yMin) * enhet
        );

        ctx.clip();

        // Tegn linjen
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2.5;

        ctx.beginPath();

        ctx.moveTo(
            X(xMin),
            Y(a * xMin + b)
        );

        ctx.lineTo(
            X(xMax),
            Y(a * xMax + b)
        );

        ctx.stroke();

        ctx.restore();
    }


    // ----------------------------------------
    // OPPDATER FUNKSJONSUTTRYKKET
    // ----------------------------------------

 function oppdaterUttrykk(a, b) {

    let uttrykk = "<i>y</i> = ";

    if (a === 1) {

        uttrykk += "<i>x</i>";

    } else if (a === -1) {

        uttrykk += "−<i>x</i>";

    } else if (a !== 0) {

        uttrykk += formatTall(a) + "<i>x</i>";
    }

    if (a === 0) {

        uttrykk += formatTall(b);

    } else if (b > 0) {

        uttrykk += " + " + formatTall(b);

    } else if (b < 0) {

        uttrykk += " − " + formatTall(Math.abs(b));
    }

    funksjonsuttrykk.innerHTML = uttrykk;
}


    // ----------------------------------------
    // TEGN HELE KOORDINATSYSTEMET
    // ----------------------------------------

    function draw() {

        const a = Number(aSlider.value);
        const b = Number(bSlider.value);

        // Oppdater verdiene ved glidebryterne
        aVerdi.textContent = formatTall(a);
        bVerdi.textContent = formatTall(b);

        // Oppdater funksjonsuttrykket
        oppdaterUttrykk(a, b);

        // Tøm canvas
        ctx.clearRect(0, 0, W, H);

        // Tegn koordinatsystem og funksjon
        tegnRutenett();
        tegnAkser();
        tegnTall();
        tegnFunksjon(a, b);
    }


    // ----------------------------------------
    // HENDELSER
    // ----------------------------------------

    aSlider.addEventListener("input", draw);
    bSlider.addEventListener("input", draw);

    // Starttilstand
    draw();

})();