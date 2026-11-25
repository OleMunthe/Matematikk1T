(() => {

    const root = document.querySelector("#rettvinklet-trekant");
    if (!root) return;

    const canvas = root.querySelector("#rtCanvas");
    const ctx = canvas.getContext("2d");

    // Glidebryter
    const vinkelSlider = root.querySelector("#rtVinkel");
    const vinkelVerdi = root.querySelector("#rtVinkelVerdi");

    // Sinus
    const sinTeller = root.querySelector("#rtSinTeller");
    const sinVerdi = root.querySelector("#rtSinVerdi");

    // Cosinus
    const cosTeller = root.querySelector("#rtCosTeller");
    const cosVerdi = root.querySelector("#rtCosVerdi");

    // Tangens
    const tanTeller = root.querySelector("#rtTanTeller");
    const tanNevner = root.querySelector("#rtTanNevner");
    const tanVerdi = root.querySelector("#rtTanVerdi");
    const tanLikhet = root.querySelector("#rtTanLikhet");

    // Canvas med høy oppløsning
    const scale = 2;

    const W = canvas.width / scale;
    const H = canvas.height / scale;

    ctx.scale(scale, scale);

    // Konstant hypotenus
    const hypotenus = 2;

    // Samme målestokk i begge retninger
    const enhet = 170;

    // Fast plassering av venstre hjørne
    const Ax = 70;
    const Ay = 360;

    // Farger
    const grunnlinjeFarge = "#334155";
    const motstaaendeFarge = "#dc2626";
    const hypotenusFarge = "#2563eb";
    const vinkelFarge = "#334155";


    // ----------------------------------------
    // FORMATER TALL
    // ----------------------------------------

    function formatLengde(tall) {

        return tall.toLocaleString("nb-NO", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3
        });
    }

    function formatTrig(tall) {

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

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.stroke();
    }


    // ----------------------------------------
    // TEGN TREKANTEN
    // ----------------------------------------

    function tegnTrekant(Bx, By, Cx, Cy) {

        // Svak bakgrunnsfarge
        ctx.fillStyle = "rgba(37, 99, 235, 0.04)";

        ctx.beginPath();

        ctx.moveTo(Ax, Ay);
        ctx.lineTo(Bx, By);
        ctx.lineTo(Cx, Cy);

        ctx.closePath();
        ctx.fill();

        // Hosliggende katet
        tegnLinje(
            Ax, Ay,
            Bx, By,
            grunnlinjeFarge, 2.5
        );

        // Motstående katet
        tegnLinje(
            Bx, By,
            Cx, Cy,
            motstaaendeFarge, 2.5
        );

        // Hypotenus
        tegnLinje(
            Ax, Ay,
            Cx, Cy,
            hypotenusFarge, 2.5
        );
    }


    // ----------------------------------------
    // MARKER RETT VINKEL
    // ----------------------------------------

    function tegnRettVinkel(Bx, By, grunnlinjePx, hoydePx) {

        if (hoydePx <= 0 || grunnlinjePx <= 0) return;

        const storrelse = Math.min(
            16,
            hoydePx * 0.6,
            grunnlinjePx * 0.6
        );

        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1.5;

        ctx.beginPath();

        ctx.moveTo(
            Bx - storrelse,
            By
        );

        ctx.lineTo(
            Bx - storrelse,
            By - storrelse
        );

        ctx.lineTo(
            Bx,
            By - storrelse
        );

        ctx.stroke();
    }


    // ----------------------------------------
    // TEGN VINKELBUE
    // ----------------------------------------

    function tegnVinkel(vinkel) {

        const radius = 45;

        ctx.strokeStyle = vinkelFarge;
        ctx.lineWidth = 1.5;

        ctx.beginPath();

        ctx.arc(
            Ax,
            Ay,
            radius,
            0,
            -vinkel,
            true
        );

        ctx.stroke();

        // Plassering av vinkelsymbolet
        const tekstRadius = 65;

        const tekstX =
            Ax + tekstRadius * Math.cos(vinkel / 2);

        const tekstY =
            Ay - tekstRadius * Math.sin(vinkel / 2);

        ctx.fillStyle = vinkelFarge;
        ctx.font = "italic 19px Georgia";

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Flytt symbolet ved små vinkler
        if (vinkel < 15 * Math.PI / 180) {

            ctx.fillText(
                "v",
                tekstX,
                tekstY - 20
            );

        } else {

            ctx.fillText(
                "v",
                tekstX,
                tekstY
            );
        }
    }


    // ----------------------------------------
    // TEGN SIDELENGDENE
    // ----------------------------------------

    function tegnLengder(
        Bx, By, Cx, Cy,
        grunnlinje, hoyde, vinkel
    ) {

        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Hosliggende katet
        ctx.fillStyle = grunnlinjeFarge;

        ctx.fillText(
            formatLengde(grunnlinje),
            (Ax + Bx) / 2,
            Ay + 24
        );


        // Motstående katet
        ctx.fillStyle = motstaaendeFarge;
        ctx.textAlign = "left";

        ctx.fillText(
            formatLengde(hoyde),
            Bx + 15,
            (By + Cy) / 2
        );


        // Hypotenus
        // Finn midtpunktet på hypotenusen

        const midtX = (Ax + Cx) / 2;
        const midtY = (Ay + Cy) / 2;

        const avstand = 23;

        // Forskyv teksten vinkelrett på hypotenusen
        const tekstX =
            midtX - avstand * Math.sin(vinkel);

        const tekstY =
            midtY - avstand * Math.cos(vinkel);

        ctx.fillStyle = hypotenusFarge;
        ctx.textAlign = "center";

        ctx.fillText(
            "2",
            tekstX,
            tekstY
        );

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }


    // ----------------------------------------
    // OPPDATER TRIGONOMETRISKE UTTRYKK
    // ----------------------------------------

    function oppdaterFormler(grunnlinje, hoyde) {

        // Sinus
        sinTeller.textContent = formatLengde(hoyde);

        sinVerdi.textContent = formatTrig(
            hoyde / hypotenus
        );


        // Cosinus
        cosTeller.textContent = formatLengde(grunnlinje);

        cosVerdi.textContent = formatTrig(
            grunnlinje / hypotenus
        );


        // Tangens
        tanTeller.textContent = formatLengde(hoyde);
        tanNevner.textContent = formatLengde(grunnlinje);

        // Tangens er ikke definert ved 90 grader
        if (grunnlinje === 0) {

            tanLikhet.textContent = "";
            tanVerdi.textContent = "Ikke definert";

        } else {

            tanLikhet.textContent = "≈";

            tanVerdi.textContent = formatTrig(
                hoyde / grunnlinje
            );
        }
    }


    // ----------------------------------------
    // TEGN HELE SIMULERINGEN
    // ----------------------------------------

    function draw() {

        // Vinkel i grader
        const grader = Number(vinkelSlider.value);

        // Omregning til radianer
        const vinkel = grader * Math.PI / 180;

        // Beregn katetene
        let grunnlinje = hypotenus * Math.cos(vinkel);
        let hoyde = hypotenus * Math.sin(vinkel);

        // Fjern numeriske avrundingsfeil ved 0 og 90 grader
        if (grader === 90) grunnlinje = 0;
        if (grader === 0) hoyde = 0;

        // Plassering av nederste høyre hjørne
        const Bx = Ax + grunnlinje * enhet;
        const By = Ay;

        // Plassering av øverste hjørne
        const Cx = Bx;
        const Cy = By - hoyde * enhet;

        // Oppdater vinkelverdien
        vinkelVerdi.textContent = grader;

        // Oppdater trigonometriske uttrykk
        oppdaterFormler(grunnlinje, hoyde);

        // Tøm canvas
        ctx.clearRect(0, 0, W, H);

        // Tegn trekanten
        tegnTrekant(Bx, By, Cx, Cy);

        // Marker rett vinkel
        tegnRettVinkel(
            Bx,
            By,
            grunnlinje * enhet,
            hoyde * enhet
        );

        // Marker vinkelen til venstre
        tegnVinkel(vinkel);

        // Vis sidelengdene
        tegnLengder(
            Bx, By, Cx, Cy,
            grunnlinje, hoyde, vinkel
        );
    }


    // ----------------------------------------
    // HENDELSER
    // ----------------------------------------

    vinkelSlider.addEventListener("input", draw);

    // Starttilstand
    draw();

})();