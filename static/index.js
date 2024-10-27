const submitBtn = document.querySelector("#submitBtn")
const result = document.querySelector("#result");
const imageInput = document.querySelector("#imageInput")
const inputImg = document.querySelector("#inputImg");
const resultImg = document.querySelector("#resultImg")

imageInput.addEventListener("change", () => {
    const img = imageInput.files[0];
    inputImg.src = URL.createObjectURL(img)
    resultImg.src = ""
})

submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const img = imageInput.files[0];

    if (!img) {
        alert("Hãy chọn hình.");
        return;
    }

    const formData = new FormData();
    formData.append("image", img);
    submitBtn.classList.add("is-loading");

    try {
        const response = await fetch("/detection", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Lỗi upload hình");
        }

        const imgBlob = await response.blob();
        resultImg.src = URL.createObjectURL(imgBlob)
    } catch (error) {
        console.error("Lỗi: ", error);
    } finally {
        submitBtn.classList.remove("is-loading")
    }
});
