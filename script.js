/* ==========================================
   FINOS v2
   Module 1
========================================== */

const browseButton = document.getElementById("browseButton");
const fileInput = document.getElementById("fileInput");
const uploadArea = document.getElementById("drop-zone");
const container = document.querySelector(".container");
const analysisScreen = document.getElementById("analysisScreen");

const analysisItems = document.querySelectorAll(".analysis-item");

/* ---------------------------------------
   Browse Button
---------------------------------------- */

browseButton.addEventListener("click", () => {
    fileInput.click();
});

/* ---------------------------------------
   File Selected
---------------------------------------- */

fileInput.addEventListener("change", () => {

    if(fileInput.files.length > 0){

        beginAnalysis();

    }

});

/* ---------------------------------------
   Drag & Drop
---------------------------------------- */

uploadArea.addEventListener("dragover", e => {

    e.preventDefault();

    uploadArea.style.borderColor = "#FFFFFF";

});

uploadArea.addEventListener("dragleave", () => {

    uploadArea.style.borderColor = "";

});

uploadArea.addEventListener("drop", e => {

    e.preventDefault();

    uploadArea.style.borderColor = "";

    if(e.dataTransfer.files.length > 0){

        fileInput.files = e.dataTransfer.files;

        beginAnalysis();

    }

});

/* ---------------------------------------
   Analysis Animation
---------------------------------------- */

function beginAnalysis(){

    container.style.opacity = "0";

    container.style.pointerEvents = "none";

    setTimeout(()=>{

        container.style.display="none";

        analysisScreen.classList.remove("hidden");

        animateSteps();

    },500);

}

/* ---------------------------------------
   Animate Steps
---------------------------------------- */

function animateSteps(){

    let index = 0;

    const interval = setInterval(()=>{

        if(index>0){

            analysisItems[index-1].classList.remove("active");

        }

        if(index < analysisItems.length){

            analysisItems[index].classList.add("active");

            index++;

        }

        else{

            clearInterval(interval);

            finishAnalysis();

        }

    },900);

}

/* ---------------------------------------
   Finish
---------------------------------------- */

function finishAnalysis(){

    setTimeout(()=>{

        analysisScreen.classList.add("hidden");

        document
            .getElementById("reportScreen")
            .classList.remove("hidden");

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });

    },1000);

}

