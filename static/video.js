const submitBtn = document.querySelector("#submitBtn")
const result = document.querySelector("#result");
const videoInput = document.querySelector("#videoInput")
const inputVideo = document.querySelector("#inputVideo");
const resultVideo = document.querySelector("#resultVideo")

videoInput.addEventListener("change", () => {
    const video = videoInput.files[0];
    inputVideo.src = URL.createObjectURL(video)
    inputVideo.classList.remove("is-hidden")
    resultVideo.classList.add("is-hidden")
})

submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const video = videoInput.files[0];

    if (!video) {
        alert("Hãy chọn video.");
        return;
    }

    const formData = new FormData();
    formData.append("video", video);
    submitBtn.classList.add("is-loading");

    try {
        const response = await fetch("/detection-video", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Lỗi upload video");
        }

        const videoBlob = await response.blob();
        resultVideo.src = URL.createObjectURL(videoBlob);
        resultVideo.classList.remove("is-hidden");
    } catch (error) {
        console.error("Lỗi: ", error);
    } finally {
        submitBtn.classList.remove("is-loading")
    }
});
