(() => {

    const root = document.querySelector("#andregradsfunksjon");
    if (!root) return;

    const canvas = root.querySelector("#agCanvas");
    const ctx = canvas.getContext("2d");

    // Glidebrytere
    const aSlider = root.querySelector("#agA");
    const bSlider = root.querySelector("#agB");
    const cSlider = root.querySelector("#agC");

    // Visning av verdier
    const aVerdi = root.querySelector("#agAVerdi");
    const bVerdi = root.querySelector("#agBVerdi");
    const cVerdi = root.querySelector("#agCVerdi");

    const funksjonsuttrykk = root.querySelector(
        "#agFunksjonsuttrykk"
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

    // Plassering av origo
    const origoX = W / 2;

    const origoY =
        H / 2 + (yMin + yMax) * enhet / 2;


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
    // FORMATER TALL
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

        ctx.fillText(
            "x",
            X(xMax) - 10,
            Y(0) - 12
        );

        ctx.fillText(
            "y",
            X(0) + 12,
            Y(yMax) + 12
        );
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

        for (let y = yMin; y <= yMax; y++) {

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
    // BEREGN FUNKSJONSVERDI
    // ----------------------------------------

    function f(x, a, b, c) {

        return a * x * x + b * x + c;
    }


    // ----------------------------------------
    // TEGN ANDREGRADSFUNKSJONEN
    // ----------------------------------------

    function tegnFunksjon(a, b, c) {

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

        // Grafens utseende
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 2.5;
        ctx.lineJoin = "round";

        ctx.beginPath();

        // Antall punkter langs grafen
        const antallPunkter = 1200;

        for (let i = 0; i <= antallPunkter; i++) {

            const x =
                xMin +
                (xMax - xMin) * i / antallPunkter;

            const y = f(x, a, b, c);

            if (i === 0) {

                ctx.moveTo(X(x), Y(y));

            } else {

                ctx.lineTo(X(x), Y(y));
            }
        }

        ctx.stroke();

        ctx.restore();
    }


    // ----------------------------------------
    // OPPDATER FUNKSJONSUTTRYKKET
    // ----------------------------------------

    function oppdaterUttrykk(a, b, c) {

        let uttrykk = "<i>y</i> = ";

        let harLedd = false;

        function leggTilLedd(koeffisient, variabel) {

            // Hopp over ledd med koeffisient 0
            if (koeffisient === 0) return;

            const absolutt = Math.abs(koeffisient);

            // Fortegn
            if (harLedd) {

                uttrykk += koeffisient < 0
                    ? " − "
                    : " + ";

            } else if (koeffisient < 0) {

                uttrykk += "−";
            }

            // Koeffisient
            // Ikke skriv 1 foran x eller x²
            if (absolutt !== 1 || variabel === "") {

                uttrykk += formatTall(absolutt);
            }

            uttrykk += variabel;

            harLedd = true;
        }

        // Andregradsledd
        leggTilLedd(a, "<i>x</i><sup>2</sup>");

        // Førstegradsledd
        leggTilLedd(b, "<i>x</i>");

        // Konstantledd
        leggTilLedd(c, "");

        // Dersom alle koeffisientene er 0
        if (!harLedd) {

            uttrykk += "0";
        }

        funksjonsuttrykk.innerHTML = uttrykk;
    }


    // ----------------------------------------
    // TEGN HELE KOORDINATSYSTEMET
    // ----------------------------------------

    function draw() {

        const a = Number(aSlider.value);
        const b = Number(bSlider.value);
        const c = Number(cSlider.value);

        // Oppdater verdier ved glidebryterne
        aVerdi.textContent = formatTall(a);
        bVerdi.textContent = formatTall(b);
        cVerdi.textContent = formatTall(c);

        // Oppdater funksjonsuttrykket
        oppdaterUttrykk(a, b, c);

        // Tøm canvas
        ctx.clearRect(0, 0, W, H);

        // Tegn koordinatsystem og graf
        tegnRutenett();
        tegnAkser();
        tegnTall();
        tegnFunksjon(a, b, c);
    }


    // ----------------------------------------
    // HENDELSER
    // ----------------------------------------

    aSlider.addEventListener("input", draw);
    bSlider.addEventListener("input", draw);
    cSlider.addEventListener("input", draw);

    // Starttilstand
    draw();

})();