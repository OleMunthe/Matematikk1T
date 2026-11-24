(() => {

    const root = document.querySelector("#enhetssirkel");
    if (!root) return;

    const canvas = root.querySelector("#esCanvas");
    const ctx = canvas.getContext("2d");

    // Glidebryter
    const vinkelSlider = root.querySelector("#esVinkel");

    // Visning av verdier
    const vinkelVerdi = root.querySelector("#esVinkelVerdi");
    const cosVerdi = root.querySelector("#esCosVerdi");
    const sinVerdi = root.querySelector("#esSinVerdi");

    // Canvas med høy oppløsning
    const scale = 2;

    const W = canvas.width / scale;
    const H = canvas.height / scale;

    ctx.scale(scale, scale);

    // Origo
    const origoX = W / 2;
    const origoY = H / 2;

    // Samme målestokk langs begge aksene
    const enhet = 180;

    // Koordinatsystemets grenser
    const min = -1.25;
    const max = 1.25;

    // Farger
    const cosFarge = "#dc2626";
    const sinFarge = "#16a34a";
    const radiusFarge = "#2563eb";


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

        // Unngå negativ null
        if (Math.abs(tall) < 0.0005) {
            tall = 0;
        }

        return tall.toLocaleString("nb-NO", {
            minimumFractionDigits: 3,
            maximumFractionDigits: 3
        });
    }


    // ----------------------------------------
    // TEGN LINJESTYKKE
    // ----------------------------------------

    function tegnLinje(x1, y1, x2, y2, farge, bredde) {

        ctx.strokeStyle = farge;
        ctx.lineWidth = bredde;

        ctx.beginPath();

        ctx.moveTo(X(x1), Y(y1));
        ctx.lineTo(X(x2), Y(y2));

        ctx.stroke();
    }


    // ----------------------------------------
    // TEGN RUTENETT
    // ----------------------------------------

    function tegnRutenett() {

        for (let i = -5; i <= 5; i++) {

            const verdi = i * 0.25;

            // Vertikale linjer
            tegnLinje(
                verdi, min,
                verdi, max,
                "#e2e8f0", 1
            );

            // Horisontale linjer
            tegnLinje(
                min, verdi,
                max, verdi,
                "#e2e8f0", 1
            );
        }
    }


    // ----------------------------------------
    // TEGN AKSER
    // ----------------------------------------

    function tegnAkser() {

        // x-aksen
        tegnLinje(
            min, 0,
            max, 0,
            "#334155", 1.5
        );

        // y-aksen
        tegnLinje(
            0, min,
            0, max,
            "#334155", 1.5
        );

        ctx.fillStyle = "#334155";

        // Pil på x-aksen
        ctx.beginPath();

        ctx.moveTo(X(max), Y(0));
        ctx.lineTo(X(max) - 10, Y(0) - 4);
        ctx.lineTo(X(max) - 10, Y(0) + 4);

        ctx.closePath();
        ctx.fill();

        // Pil på y-aksen
        ctx.beginPath();

        ctx.moveTo(X(0), Y(max));
        ctx.lineTo(X(0) - 4, Y(max) + 10);
        ctx.lineTo(X(0) + 4, Y(max) + 10);

        ctx.closePath();
        ctx.fill();

        // Aksenavn
        ctx.font = "italic 17px Georgia";
        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";

        ctx.fillText("x", X(max) - 10, Y(0) - 12);
        ctx.fillText("y", X(0) + 12, Y(max) + 12);
    }


    // ----------------------------------------
    // TEGN TALL LANGS AKSENE
    // ----------------------------------------

    function tegnTall() {

        const tall = [-1, -0.5, 0.5, 1];

        ctx.fillStyle = "#475569";
        ctx.font = "13px Arial";

        // x-aksen
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        tall.forEach(x => {

            ctx.fillText(
                x.toLocaleString("nb-NO"),
                X(x),
                Y(0) + 9
            );
        });

        // y-aksen
        ctx.textAlign = "right";
        ctx.textBaseline = "middle";

        tall.forEach(y => {

            ctx.fillText(
                y.toLocaleString("nb-NO"),
                X(0) - 9,
                Y(y)
            );
        });

        // Origo
        ctx.fillText(
            "0",
            X(0) - 9,
            Y(0) + 13
        );

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }


    // ----------------------------------------
    // TEGN ENHETSSIRKELEN
    // ----------------------------------------

    function tegnSirkel() {

        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.arc(
            origoX,
            origoY,
            enhet,
            0,
            2 * Math.PI
        );

        ctx.stroke();
    }


    // ----------------------------------------
    // TEGN STIPLEDE PROJEKSJONER
    // ----------------------------------------

    function tegnProjeksjoner(cos, sin) {

        ctx.save();

        ctx.setLineDash([5, 5]);

        // Fra sirkelpunktet til x-aksen
        tegnLinje(
            cos, sin,
            cos, 0,
            "#94a3b8", 1.5
        );

        // Fra sirkelpunktet til y-aksen
        tegnLinje(
            cos, sin,
            0, sin,
            "#94a3b8", 1.5
        );

        ctx.restore();
    }


    // ----------------------------------------
    // TEGN SINUS OG COSINUS LANGS AKSENE
    // ----------------------------------------

    function tegnSinCos(cos, sin) {

        // Cosinus langs x-aksen
        tegnLinje(
            0, 0,
            cos, 0,
            cosFarge, 3.5
        );

        // Sinus langs y-aksen
        tegnLinje(
            0, 0,
            0, sin,
            sinFarge, 3.5
        );

        // Punkt på x-aksen
        ctx.fillStyle = cosFarge;

        ctx.beginPath();
        ctx.arc(X(cos), Y(0), 4, 0, 2 * Math.PI);
        ctx.fill();

        // Punkt på y-aksen
        ctx.fillStyle = sinFarge;

        ctx.beginPath();
        ctx.arc(X(0), Y(sin), 4, 0, 2 * Math.PI);
        ctx.fill();
    }


    // ----------------------------------------
    // TEGN RADIUS
    // ----------------------------------------

    function tegnRadius(cos, sin) {

        tegnLinje(
            0, 0,
            cos, sin,
            radiusFarge, 2.5
        );
    }


    // ----------------------------------------
    // TEGN VINKELBUE
    // ----------------------------------------

    function tegnVinkel(vinkel) {

        const bueRadius = 35;

        ctx.strokeStyle = radiusFarge;
        ctx.lineWidth = 1.5;

        // Vinkelbue mot klokka
        ctx.beginPath();

        ctx.arc(
            origoX,
            origoY,
            bueRadius,
            0,
            -vinkel,
            true
        );

        ctx.stroke();

        // Plasser vinkelen v midt på vinkelbuen
        const tekstRadius = bueRadius + 14;

        const tekstX =
            origoX +
            tekstRadius * Math.cos(vinkel / 2);

        const tekstY =
            origoY -
            tekstRadius * Math.sin(vinkel / 2);

        ctx.fillStyle = radiusFarge;
        ctx.font = "italic 18px Georgia";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("v", tekstX, tekstY);

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }


    // ----------------------------------------
    // TEGN PUNKTET PÅ SIRKELEN
    // ----------------------------------------

    function tegnPunkt(cos, sin) {

        ctx.fillStyle = radiusFarge;

        ctx.beginPath();

        ctx.arc(
            X(cos),
            Y(sin),
            5,
            0,
            2 * Math.PI
        );

        ctx.fill();
    }


    // ----------------------------------------
    // TEGN HELE SIMULERINGEN
    // ----------------------------------------

    function draw() {

        // Vinkel i grader
        const grader = Number(vinkelSlider.value);

        // Omregning til radianer
        const vinkel = grader * Math.PI / 180;

        // Beregn sinus og cosinus
        const cos = Math.cos(vinkel);
        const sin = Math.sin(vinkel);

        // Oppdater verdier
        vinkelVerdi.textContent = grader;

        cosVerdi.textContent = formatTall(cos);
        sinVerdi.textContent = formatTall(sin);

        // Tøm canvas
        ctx.clearRect(0, 0, W, H);

        // Tegn alle elementene
        tegnRutenett();
        tegnAkser();
        tegnSirkel();
        tegnProjeksjoner(cos, sin);
        tegnSinCos(cos, sin);
        tegnRadius(cos, sin);
        tegnVinkel(vinkel);
        tegnPunkt(cos, sin);
        tegnTall();
    }


    // ----------------------------------------
    // HENDELSER
    // ----------------------------------------

    vinkelSlider.addEventListener("input", draw);

    // Starttilstand
    draw();

})();