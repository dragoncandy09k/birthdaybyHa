// balloons

for(let i=0;i<20;i++){

    let b=document.createElement("div");

    b.className="balloon";

    const hue=Math.random()*360;

    b.style.left=Math.random()*100+"vw";

    b.style.background=`hsl(${hue},80%,60%)`;

    b.style.color=`hsl(${hue},80%,60%)`;

    b.style.animationDuration=
        (8+Math.random()*8)+"s";

    b.style.animationDelay=
        (-Math.random()*10)+"s";

    document.body.appendChild(b);
}

// microphone and touch

function blowOutCandle(){

    const flame = document.getElementById("flame");

    if(!flame || flame.classList.contains("hidden")) return;

    flame.classList.add("hidden");

    document.getElementById("message").style.display = "block";

    document.getElementById("caution").classList.add("hidden");

    launchFireworks();
}


function launchFireworks(){

    const colors=[
        "#ff0000",
        "#ffff00",
        "#00ff00",
        "#00ffff",
        "#ff00ff",
        "#ffffff",
        "#ff8800"
    ];

    for(let boom=0; boom<8; boom++){

        setTimeout(()=>{

            // Vị trí gần lời chúc
            const centerX=
                window.innerWidth/2 +
                (Math.random()-0.5)*300;

            const centerY=
                window.innerHeight*0.72 +
                (Math.random()-0.5)*120;
            

            for(let i=0;i<40;i++){

                const particle=
                    document.createElement("div");

                particle.className="firework";

                particle.style.left=
                    centerX+"px";

                particle.style.top=
                    centerY+"px";

                particle.style.background=
                    colors[Math.floor(Math.random()*colors.length)];

                const angle=
                    Math.random()*Math.PI*2;

                const distance=
                    80+Math.random()*120;

                particle.style.setProperty(
                    "--x",
                    Math.cos(angle)*distance+"px"
                );

                particle.style.setProperty(
                    "--y",
                    Math.sin(angle)*distance+"px"
                );

                particle.style.animation=
                    "explode 1.2s ease-out forwards";

                document.body.appendChild(particle);

                setTimeout(()=>{
                    particle.remove();
                },1200);
            }

        },boom*400);

    }
}


navigator.mediaDevices.getUserMedia({ audio: true })
.then(async (stream) => {

    const audioContext =
        new (window.AudioContext || window.webkitAudioContext)();

    await audioContext.resume();

    const analyser =
        audioContext.createAnalyser();

    analyser.fftSize = 1024;

    const mic =
        audioContext.createMediaStreamSource(stream);

    mic.connect(analyser);

    const data =
        new Uint8Array(analyser.fftSize);

    function detect() {

        analyser.getByteTimeDomainData(data);

        let sum = 0;

        for (let i = 0; i < data.length; i++) {
            const x = (data[i] - 128) / 128;
            sum += x * x;
        }

        const volume =
            Math.sqrt(sum / data.length);

        if (
            volume > 0.15 &&
            !document.getElementById("flame")
                .classList.contains("hidden")
        ) {
            blowOutCandle();
            
        }

        requestAnimationFrame(detect);
    }

    detect();

})
.catch(() => {
    alert("Hãy cho phép microphone!");
});

window.addEventListener("DOMContentLoaded", () => {

    const flame = document.getElementById("flame");

    if(!flame) return;

    flame.addEventListener("click", blowOutCandle);

    flame.addEventListener("touchstart", (e) => {
        e.preventDefault();
        blowOutCandle();
    });

});