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
    const sinNevner = root.querySelector("#rtSinNevner");
    const sinVerdi = root.querySelector("#rtSinVerdi");

    // Cosinus
    const cosNevner = root.querySelector("#rtCosNevner");
    const cosVerdi = root.querySelector("#rtCosVerdi");

    // Tangens
    const tanTeller = root.querySelector("#rtTanTeller");
    const tanVerdi = root.querySelector("#rtTanVerdi");

    // Canvas med høy oppløsning
    const scale = 2;

    const W = canvas.width / scale;
    const H = canvas.height / scale;

    ctx.scale(scale, scale);

    // Konstant grunnlinje
    const grunnlinje = 4;

    // Samme målestokk i begge retninger
    const enhet = 60;

    // Plassering av trekanten
    const Ax = 90;
    const Ay = 450;

    const Bx = Ax + grunnlinje * enhet;
    const By = Ay;

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

    function tegnTrekant(Cx, Cy) {

        // Svak bakgrunnsfarge inni trekanten
        ctx.fillStyle = "rgba(37, 99, 235, 0.04)";

        ctx.beginPath();

        ctx.moveTo(Ax, Ay);
        ctx.lineTo(Bx, By);
        ctx.lineTo(Cx, Cy);

        ctx.closePath();
        ctx.fill();

        // Grunnlinje
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

    function tegnRettVinkel(hoydePx) {

        if (hoydePx <= 0) return;

        const storrelse = Math.min(16, hoydePx * 0.6);

        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1.5;

        ctx.beginPath();

        ctx.moveTo(Bx - storrelse, By);

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

        // Ved små vinkler plasseres v over trekanten
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

    function tegnLengder(Cx, Cy, hoyde, hypotenus, vinkel) {

        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Grunnlinjens lengde
        ctx.fillStyle = grunnlinjeFarge;

        ctx.fillText(
            "4",
            (Ax + Bx) / 2,
            Ay + 24
        );


        // Motstående katet
        // Plasser teksten midt på siden, til høyre

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

        // Avstand fra hypotenusen til teksten
        const avstand = 23;

        // Forskyv teksten vinkelrett på hypotenusen
        const tekstX =
            midtX - avstand * Math.sin(vinkel);

        const tekstY =
            midtY - avstand * Math.cos(vinkel);

        ctx.fillStyle = hypotenusFarge;
        ctx.textAlign = "center";

        ctx.fillText(
            formatLengde(hypotenus),
            tekstX,
            tekstY
        );

        ctx.textAlign = "left";
        ctx.textBaseline = "alphabetic";
    }


    // ----------------------------------------
    // OPPDATER TRIGONOMETRISKE UTTRYKK
    // ----------------------------------------

    function oppdaterFormler(hoyde, hypotenus) {

        // Sinus = motstående katet / hypotenus

        sinTeller.textContent = formatLengde(hoyde);
        sinNevner.textContent = formatLengde(hypotenus);

        sinVerdi.textContent = formatTrig(
            hoyde / hypotenus
        );


        // Cosinus = hosliggende katet / hypotenus

        cosNevner.textContent = formatLengde(hypotenus);

        cosVerdi.textContent = formatTrig(
            grunnlinje / hypotenus
        );


        // Tangens = motstående katet / hosliggende katet

        tanTeller.textContent = formatLengde(hoyde);

        tanVerdi.textContent = formatTrig(
            hoyde / grunnlinje
        );
    }


    // ----------------------------------------
    // TEGN HELE SIMULERINGEN
    // ----------------------------------------

    function draw() {

        // Vinkel i grader
        const grader = Number(vinkelSlider.value);

        // Omregning til radianer
        const vinkel = grader * Math.PI / 180;

        // Beregn sidelengdene
        const hoyde = grunnlinje * Math.tan(vinkel);

        const hypotenus = grunnlinje / Math.cos(vinkel);

        // Plassering av øverste hjørne
        const Cx = Bx;
        const Cy = By - hoyde * enhet;

        // Oppdater vinkelverdien
        vinkelVerdi.textContent = grader;

        // Oppdater trigonometriske uttrykk
        oppdaterFormler(hoyde, hypotenus);

        // Tøm canvas
        ctx.clearRect(0, 0, W, H);

        // Tegn trekanten
        tegnTrekant(Cx, Cy);

        // Marker rett vinkel
        tegnRettVinkel(hoyde * enhet);

        // Marker vinkelen til venstre
        tegnVinkel(vinkel);

        // Vis sidelengdene
        tegnLengder(
            Cx,
            Cy,
            hoyde,
            hypotenus,
            vinkel
        );
    }


    // ----------------------------------------
    // HENDELSER
    // ----------------------------------------

    vinkelSlider.addEventListener("input", draw);

    // Starttilstand
    draw();

})();